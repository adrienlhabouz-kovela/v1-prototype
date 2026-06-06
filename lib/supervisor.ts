// Vues dérivées pour l'inbox superviseur — strictement opérationnelles.
// Ne modifie pas les types métier (PatientStatus reste intact).
// Toute la logique est calculée à partir du store existant.

import type { Patient, ClinicalReport, Escalation, CabinetConfig, Surgeon } from "./types";

// ---------------------------------------------------------------------------
// Statuts opérationnels — 6 catégories ordonnées par priorité.
// La superviseuse pense en "que faut-il faire maintenant", pas en
// "messages non traités".
// ---------------------------------------------------------------------------

export type OperationalStatus =
  | "a_traiter"
  | "a_relancer"
  | "a_transmettre_cabinet"
  | "en_attente_cabinet"
  | "cloture_a_preparer"
  | "suivi_habituel";

export const operationalStatusLabels: Record<OperationalStatus, string> = {
  a_traiter: "À traiter maintenant",
  a_relancer: "Patients sans réponse",
  a_transmettre_cabinet: "CR & transmissions à traiter",
  en_attente_cabinet: "En attente cabinet",
  cloture_a_preparer: "Clôtures à finaliser",
  suivi_habituel: "Suivis du jour",
};

export const operationalStatusHints: Record<OperationalStatus, string> = {
  a_traiter: "Messages non lus, retards ou actions immédiates.",
  a_relancer: "Patient sans réponse selon référentiel — relance à prévoir.",
  a_transmettre_cabinet:
    "Brouillon IA à relire, CR à valider ou à rendre disponible chirurgien. Transmission cabinet à préparer.",
  en_attente_cabinet: "Transmission cabinet envoyée — retour cabinet attendu.",
  cloture_a_preparer: "Fin de suivi atteinte — finaliser le dossier et clôturer.",
  suivi_habituel: "Suivi actif, pas d'action immédiate aujourd'hui.",
};

// Ordre d'affichage dans l'inbox (priorité visuelle).
export const operationalStatusOrder: OperationalStatus[] = [
  "a_traiter",
  "a_relancer",
  "a_transmettre_cabinet",
  "en_attente_cabinet",
  "suivi_habituel",
  "cloture_a_preparer",
];

// ---------------------------------------------------------------------------
// Priorité opérationnelle — orthogonale au statut.
// ---------------------------------------------------------------------------

export type OperationalUrgence = "en_retard" | "aujourdhui" | "a_venir";

export const urgenceLabels: Record<OperationalUrgence, string> = {
  en_retard: "En retard",
  aujourdhui: "Aujourd'hui",
  a_venir: "À venir",
};

// Couleurs choisies pour évoquer une priorité opérationnelle, pas une alerte
// clinique. "En retard" reste plus marqué qu'"Aujourd'hui" mais sans rouge.
export const urgenceStyles: Record<OperationalUrgence, string> = {
  en_retard: "bg-amber-100/70 text-amber-900 ring-amber-400/40",
  aujourdhui: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  a_venir: "bg-navy-900/[0.04] text-charcoal/70 ring-navy-900/[0.06]",
};

// ---------------------------------------------------------------------------
// Contexte — données disponibles pour le calcul
// ---------------------------------------------------------------------------

export interface SupervisorCtx {
  reportFor: (patientId: string) => ClinicalReport | undefined;
  escalationFor: (patientId: string) => Escalation | undefined;
  surgeonConfig?: CabinetConfig;
  now?: number;
}

// ---------------------------------------------------------------------------
// Helpers de base
// ---------------------------------------------------------------------------

// Jour post-op — J+X (positif après intervention, J+0 le jour J, J-X avant).
export function getPostOpDay(patient: Patient, nowMs?: number): string {
  const now = nowMs ?? Date.now();
  const interv = new Date(patient.interventionDate).getTime();
  const days = Math.floor((now - interv) / 86_400_000);
  if (days === 0) return "J+0";
  if (days > 0) return `J+${days}`;
  return `J${days}`; // déjà signé négatif
}

// Compte les messages patient non traités.
export function unTreatedCount(patient: Patient): number {
  return patient.messages.filter((m) => m.author === "patient" && !m.treated).length;
}

// Heures depuis le dernier message patient non traité (le plus ancien).
function oldestUntreatedAgeHours(patient: Patient, nowMs: number): number | null {
  const untreated = patient.messages
    .filter((m) => m.author === "patient" && !m.treated)
    .map((m) => new Date(m.at).getTime())
    .sort((a, b) => a - b);
  if (untreated.length === 0) return null;
  return Math.max(0, (nowMs - untreated[0]) / 3_600_000);
}

// Heures depuis le dernier message patient (lu ou non).
function lastPatientMessageAgeHours(patient: Patient, nowMs: number): number | null {
  const patientMsgs = patient.messages
    .filter((m) => m.author === "patient")
    .map((m) => new Date(m.at).getTime())
    .sort((a, b) => b - a);
  if (patientMsgs.length === 0) return null;
  return Math.max(0, (nowMs - patientMsgs[0]) / 3_600_000);
}

// Fin de suivi approximative : on prend le dernier "J+N" du protocole patient.
// Si on ne sait pas extraire, on retourne null.
function endOfFollowUpDays(patient: Patient): number | null {
  // Protocoles fictifs type "J+8 / J+15" — on prend le max.
  const matches = patient.protocol.match(/J\+(\d+)/g);
  if (!matches) return null;
  return Math.max(...matches.map((m) => parseInt(m.replace("J+", ""), 10)));
}

// ---------------------------------------------------------------------------
// Fenêtre de suivi — début / fin prévue / jours restants / progression.
// Calculé à partir de la date d'intervention et du protocole.
// ---------------------------------------------------------------------------

export type FollowUpStatus =
  | "hors_fenetre"
  | "en_cours"
  | "proche_cloture"
  | "termine";

export interface FollowUpWindow {
  startDate: string; // ISO — date d'intervention
  endDate: string; // ISO — date prévue de fin de suivi
  currentDay: number; // J+X (peut être négatif avant intervention)
  plannedEndDay: number; // ex : 15 pour J+15
  daysRemaining: number; // peut être négatif si terminé
  progressPercent: number; // 0–100, plafonné
  status: FollowUpStatus;
  label: string; // ex : "Reste 2j", "Fin aujourd'hui", "Terminé depuis 4j"
}

// Fallback raisonnable si le protocole n'est pas parsable.
const DEFAULT_FOLLOWUP_END_DAY = 15;

export function getFollowUpWindow(
  patient: Patient,
  nowMs?: number
): FollowUpWindow {
  const now = nowMs ?? Date.now();
  const startMs = new Date(patient.interventionDate).getTime();
  const plannedEndDay = endOfFollowUpDays(patient) ?? DEFAULT_FOLLOWUP_END_DAY;
  const endMs = startMs + plannedEndDay * 86_400_000;
  const currentDay = Math.floor((now - startMs) / 86_400_000);
  // Jours restants — arrondi vers le haut pour qu'à J+14 sur un J+15 on lise
  // "reste 1j" et pas "reste 0j".
  const daysRemaining = Math.ceil((endMs - now) / 86_400_000);
  const progressPercent = Math.max(
    0,
    Math.min(100, Math.round((currentDay / Math.max(1, plannedEndDay)) * 100))
  );

  let status: FollowUpStatus;
  let label: string;

  if (currentDay < 0) {
    status = "hors_fenetre";
    label = `Suivi non commencé · J${currentDay}`;
  } else if (daysRemaining > 3) {
    status = "en_cours";
    label = `Reste ${daysRemaining}j`;
  } else if (daysRemaining > 0) {
    status = "proche_cloture";
    label = `Reste ${daysRemaining}j`;
  } else if (daysRemaining === 0) {
    status = "proche_cloture";
    label = "Fin aujourd'hui";
  } else {
    status = "termine";
    label = `Terminé depuis ${Math.abs(daysRemaining)}j`;
  }

  return {
    startDate: new Date(startMs).toISOString(),
    endDate: new Date(endMs).toISOString(),
    currentDay,
    plannedEndDay,
    daysRemaining,
    progressPercent,
    status,
    label,
  };
}

// Style du badge fenêtre de suivi — cohérent avec l'urgence (sobre).
export const followUpStatusStyles: Record<FollowUpStatus, string> = {
  hors_fenetre: "bg-navy-900/[0.04] text-charcoal/65 ring-navy-900/[0.06]",
  en_cours: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  proche_cloture: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  termine: "bg-amber-100/70 text-amber-900 ring-amber-400/40",
};

// ---------------------------------------------------------------------------
// Statut opérationnel — calcul à partir des données du store.
// ---------------------------------------------------------------------------

export function getOperationalStatus(
  patient: Patient,
  ctx: SupervisorCtx
): OperationalStatus | null {
  // Clôturé → pas dans l'inbox de travail.
  if (patient.status === "cloture") return null;

  // Règle de cohérence : tout dossier en retard remonte dans "À traiter
  // maintenant", quel que soit son sous-état (CR à publier, compilation à
  // transmettre, etc.). Le bandeau "0 à traiter avec N en retard" ne peut
  // plus exister.
  if (getUrgence(patient, ctx) === "en_retard") return "a_traiter";

  const now = ctx.now ?? Date.now();
  const report = ctx.reportFor(patient.id);
  const escalation = ctx.escalationFor(patient.id);
  const untreated = unTreatedCount(patient);

  // 1. À traiter maintenant — messages non lus = priorité absolue.
  if (untreated > 0) return "a_traiter";

  // 2. À transmettre au cabinet — actions KOVELA → cabinet.
  if (report?.status === "brouillon") return "a_transmettre_cabinet";
  if (report?.status === "valide") return "a_transmettre_cabinet"; // à publier
  if (patient.compilationDraft && escalation?.status !== "transmise") {
    return "a_transmettre_cabinet";
  }
  if (patient.status === "cr_en_attente") return "a_transmettre_cabinet";

  // 3. En attente cabinet — transmission cabinet en cours.
  if (escalation?.status === "transmise") return "en_attente_cabinet";
  if (report?.status === "disponible" && patient.status === "escalade_ouverte") {
    return "en_attente_cabinet";
  }

  // 4. À relancer — patient silencieux.
  if (patient.status === "silencieux") return "a_relancer";

  // 5. Clôture à préparer — fin de suivi atteinte sans CR final.
  const endDay = endOfFollowUpDays(patient);
  const interv = new Date(patient.interventionDate).getTime();
  const dayNb = Math.floor((now - interv) / 86_400_000);
  if (endDay !== null && dayNb >= endDay && !report) {
    return "cloture_a_preparer";
  }

  // 6. Suivi habituel — actif, pas d'action immédiate.
  if (patient.status === "actif" || patient.status === "onboarding_incomplet") {
    return "suivi_habituel";
  }

  // Cas escalade_ouverte sans transmission active (déjà traitée) → habituel.
  return "suivi_habituel";
}

// ---------------------------------------------------------------------------
// Urgence opérationnelle — orthogonale au statut.
// ---------------------------------------------------------------------------

// Format "Retard Xh" / "Retard Xj" — durée la plus parlante selon l'ordre
// de grandeur. Retourne null si pas de durée mesurable.
function formatRetardDuration(hours: number): string | null {
  if (hours <= 0) return null;
  if (hours < 24) return `Retard ${Math.round(hours)}h`;
  return `Retard ${Math.round(hours / 24)}j`;
}

// Label enrichi : "Retard Xj" si en retard avec durée mesurable, sinon
// fallback sur le label standard "En retard / Aujourd'hui / À venir".
export function getUrgenceLabelDetailed(
  patient: Patient,
  ctx: SupervisorCtx
): string {
  const u = getUrgence(patient, ctx);
  if (u !== "en_retard") return urgenceLabels[u];

  const now = ctx.now ?? Date.now();
  const report = ctx.reportFor(patient.id);
  const escalation = ctx.escalationFor(patient.id);

  // On choisit la durée la plus pertinente selon ce qui déclenche le retard.
  const untreatedAge = oldestUntreatedAgeHours(patient, now);
  if (untreatedAge !== null && untreatedAge > 24) {
    return formatRetardDuration(untreatedAge) ?? "En retard";
  }
  if (report?.status === "valide") {
    const age = (now - new Date(report.updatedAt).getTime()) / 3_600_000;
    if (age > 48) return formatRetardDuration(age) ?? "En retard";
  }
  if (escalation?.status === "transmise" && escalation.transmittedAt) {
    const age = (now - new Date(escalation.transmittedAt).getTime()) / 3_600_000;
    if (age > 48) return formatRetardDuration(age) ?? "En retard";
  }
  if (patient.status === "silencieux") {
    const lastAge = lastPatientMessageAgeHours(patient, now);
    if (lastAge !== null && lastAge > 24 * 5) {
      return formatRetardDuration(lastAge) ?? "En retard";
    }
  }
  return "En retard";
}

export function getUrgence(patient: Patient, ctx: SupervisorCtx): OperationalUrgence {
  const now = ctx.now ?? Date.now();
  const untreatedAge = oldestUntreatedAgeHours(patient, now);
  const report = ctx.reportFor(patient.id);
  const escalation = ctx.escalationFor(patient.id);

  // Message non lu depuis > 24h → en retard.
  if (untreatedAge !== null && untreatedAge > 24) return "en_retard";

  // CR à publier depuis > 48h → en retard.
  if (report?.status === "valide") {
    const age = (now - new Date(report.updatedAt).getTime()) / 3_600_000;
    if (age > 48) return "en_retard";
    return "aujourdhui";
  }

  // Compilation transmise sans retour depuis > 48h → en retard.
  if (escalation?.status === "transmise" && escalation.transmittedAt) {
    const age = (now - new Date(escalation.transmittedAt).getTime()) / 3_600_000;
    if (age > 48) return "en_retard";
  }

  // Silencieux depuis > 5j → en retard.
  if (patient.status === "silencieux") {
    const lastAge = lastPatientMessageAgeHours(patient, now);
    if (lastAge !== null && lastAge > 24 * 5) return "en_retard";
  }

  // Actions du jour (messages non lus < 24h, CR brouillon récent, etc.).
  if (untreatedAge !== null) return "aujourdhui";
  if (report?.status === "brouillon") return "aujourdhui";
  if (patient.compilationDraft && escalation?.status !== "transmise") {
    return "aujourdhui";
  }
  if (patient.status === "cr_en_attente") return "aujourdhui";

  return "a_venir";
}

// ---------------------------------------------------------------------------
// Prochaine action recommandée
// ---------------------------------------------------------------------------

export interface RecommendedAction {
  label: string;
  delay?: string; // ex : "délai 16h", "depuis 2j"
}

export function getRecommendedAction(
  patient: Patient,
  ctx: SupervisorCtx
): RecommendedAction {
  const now = ctx.now ?? Date.now();
  const untreated = unTreatedCount(patient);
  const report = ctx.reportFor(patient.id);
  const escalation = ctx.escalationFor(patient.id);

  if (untreated > 0) {
    const ageH = oldestUntreatedAgeHours(patient, now) ?? 0;
    return {
      label: `Lire et documenter ${untreated} message${untreated > 1 ? "s" : ""}`,
      delay: ageH > 24 ? `en retard ${Math.round(ageH)}h` : "aujourd'hui",
    };
  }

  if (report?.status === "brouillon") {
    return { label: "Valider le CR en interne", delay: "aujourd'hui" };
  }

  if (report?.status === "valide") {
    return { label: "Publier pour le chirurgien", delay: "aujourd'hui" };
  }

  if (patient.compilationDraft && escalation?.status !== "transmise") {
    return { label: "Transmettre au cabinet", delay: "aujourd'hui" };
  }

  if (patient.status === "cr_en_attente") {
    return { label: "Préparer le compte-rendu factuel", delay: "aujourd'hui" };
  }

  if (escalation?.status === "transmise" && escalation.transmittedAt) {
    const ageH = (now - new Date(escalation.transmittedAt).getTime()) / 3_600_000;
    if (ageH > 48) {
      return {
        label: "Relancer le cabinet — canal prioritaire",
        delay: `transmis depuis ${Math.round(ageH / 24)}j`,
      };
    }
    return {
      label: "Attendre le retour cabinet",
      delay: `transmis il y a ${Math.round(ageH)}h`,
    };
  }

  // Suivi terminé sans CR final / clôture → préparer la clôture.
  // Cette branche prend priorité sur la relance pour éviter d'afficher
  // « Relancer le patient » sur un suivi déjà terminé (incohérence de démo).
  const window = getFollowUpWindow(patient, now);
  if (window.status === "termine" && !report) {
    return {
      label: "Préparer la clôture du suivi",
      delay: `terminé depuis ${Math.abs(window.daysRemaining)}j`,
    };
  }
  if (window.status === "termine" && report?.status === "disponible") {
    return { label: "Clôturer le suivi", delay: "à venir" };
  }

  if (patient.status === "silencieux") {
    return { label: "Relancer le patient", delay: "aujourd'hui" };
  }

  if (patient.status === "onboarding_incomplet") {
    return { label: "Finaliser l'onboarding patient", delay: "à venir" };
  }

  // Proche clôture — anticiper le CR final.
  if (window.status === "proche_cloture" && !report) {
    return {
      label: "Préparer le CR final",
      delay: window.label.toLowerCase(),
    };
  }

  return { label: "Documenter — suivi habituel", delay: "à venir" };
}

// ---------------------------------------------------------------------------
// Dernier événement notable — pour l'affichage carte patient.
// ---------------------------------------------------------------------------

export interface LastEvent {
  label: string;
  ageLabel: string; // ex : "il y a 6h", "il y a 2j"
}

export function getLastEvent(patient: Patient, ctx: SupervisorCtx): LastEvent {
  const now = ctx.now ?? Date.now();
  const report = ctx.reportFor(patient.id);
  const escalation = ctx.escalationFor(patient.id);

  const candidates: { ts: number; label: string }[] = [];

  // Dernier message
  const lastMsg = patient.messages[patient.messages.length - 1];
  if (lastMsg) {
    const ts = new Date(lastMsg.at).getTime();
    const author =
      lastMsg.author === "patient"
        ? "Message patient reçu"
        : lastMsg.author === "superviseur"
        ? "Réponse envoyée"
        : "Message système";
    candidates.push({ ts, label: author });
  }

  // CR
  if (report) {
    const ts = new Date(report.updatedAt).getTime();
    const label =
      report.status === "brouillon"
        ? "CR brouillon préparé"
        : report.status === "valide"
        ? "CR validé en interne"
        : "CR rendu disponible";
    candidates.push({ ts, label });
  }

  // Escalade
  if (escalation?.status === "transmise" && escalation.transmittedAt) {
    const ts = new Date(escalation.transmittedAt).getTime();
    candidates.push({ ts, label: "Transmission cabinet envoyée" });
  } else if (patient.compilationDraft && patient.lastMessageAt) {
    // Approximation : on prend lastMessageAt comme repère.
    const ts = new Date(patient.lastMessageAt).getTime();
    candidates.push({ ts, label: "Compilation factuelle préparée" });
  }

  if (candidates.length === 0) {
    return { label: "—", ageLabel: "" };
  }

  candidates.sort((a, b) => b.ts - a.ts);
  const top = candidates[0];
  const ageH = (now - top.ts) / 3_600_000;
  let ageLabel: string;
  if (ageH < 1) ageLabel = "à l'instant";
  else if (ageH < 24) ageLabel = `il y a ${Math.round(ageH)}h`;
  else ageLabel = `il y a ${Math.round(ageH / 24)}j`;

  return { label: top.label, ageLabel };
}

// ---------------------------------------------------------------------------
// Helper de comptage groupé — utile pour les KPI compacts.
// ---------------------------------------------------------------------------

export function countByOperationalStatus(
  patients: Patient[],
  ctx: SupervisorCtx
): Record<OperationalStatus, number> {
  const counts: Record<OperationalStatus, number> = {
    a_traiter: 0,
    a_relancer: 0,
    a_transmettre_cabinet: 0,
    en_attente_cabinet: 0,
    cloture_a_preparer: 0,
    suivi_habituel: 0,
  };
  patients.forEach((p) => {
    const s = getOperationalStatus(p, ctx);
    if (s) counts[s] += 1;
  });
  return counts;
}

// ---------------------------------------------------------------------------
// Référentiel applicable — synthèse dérivée pour la fiche patient.
// Données déclaratives plausibles pour la démo (pas de connexion store réelle
// à un référentiel chirurgien). À remplacer par la vraie lecture en V1.
// ---------------------------------------------------------------------------

export interface ApplicableReferentiel {
  chirurgien: string;
  cabinet: string;
  intervention: string;
  version: string;
  jalons_attendus: string[];
  jours_contact: string[];
  peut_rappeler: string[];
  ne_pas_traiter: string[];
  a_transmettre_cabinet: string[];
  transmission_prioritaire: string[];
  photos_attendues: string;
  format_cr_attendu: string;
  contact_prioritaire: string;
  is_simulated: boolean;
}

export function getApplicableReferentiel(
  patient: Patient,
  surgeon: Surgeon | undefined
): ApplicableReferentiel {
  const config = surgeon?.config;
  const durations = config?.interventionDurations ?? {};
  const protocol =
    durations[patient.intervention] ||
    patient.protocol ||
    config?.defaultProtocol ||
    "J+8 / J+15";
  const jalons = protocol.match(/J\+\d+/g) ?? ["J+1", "J+5", "J+15"];

  return {
    chirurgien: surgeon?.name ?? "—",
    cabinet: config?.locations?.[0] ?? "—",
    intervention: patient.intervention,
    version: "v0.1 prototype",
    jalons_attendus: jalons,
    jours_contact: jalons,
    peut_rappeler: [
      "Rappels logistiques (repos, hydratation)",
      "Jalons à venir",
      "Consignes générales déjà transmises par le cabinet",
    ],
    ne_pas_traiter: [
      "Modification de prescription",
      "Interprétation d'évolution",
      "Avis médical",
      "Reformulation des consignes existantes",
    ],
    a_transmettre_cabinet: [
      "Photo reçue",
      "Élément déclaré hors cadre habituel",
      "Demande d'avis médical",
      "Question médicament / ordonnance",
    ],
    transmission_prioritaire: [
      "Si le patient décrit une situation urgente : rappel du 15 / 112",
      "Transmission au cabinet selon le canal défini",
    ],
    photos_attendues:
      jalons.length > 0
        ? `Aux jalons ${jalons.join(", ")} selon référentiel`
        : "Selon référentiel",
    format_cr_attendu: config?.crFrequency ?? "CR fin de suivi",
    contact_prioritaire: config?.cabinetContact?.name ?? "—",
    is_simulated: true,
  };
}

// ---------------------------------------------------------------------------
// Timeline structurée — événements typés pour la fiche patient.
// ---------------------------------------------------------------------------

export type TimelineEventKind =
  | "message_patient"
  | "reponse_kovela"
  | "message_systeme"
  | "note_interne"
  | "compilation_preparee"
  | "transmission_cabinet"
  | "cr_brouillon"
  | "cr_valide"
  | "cr_disponible";

export interface TimelineAttachment {
  kind: "photo" | "audio";
  label: string;
}

export interface TimelineEvent {
  id: string;
  kind: TimelineEventKind;
  at: string; // ISO
  actor: string; // "Patient" / "KOVELA" / "Système" / "Équipe"
  label: string; // type d'événement lisible
  content?: string; // texte court
  attachments?: TimelineAttachment[];
  meta?: string; // métadonnée optionnelle (ex : statut CR)
}

export type TimelineFilter = "all" | "messages" | "actions" | "transmissions" | "cr";

export const timelineFilterLabels: Record<TimelineFilter, string> = {
  all: "Tout",
  messages: "Messages",
  actions: "Actions KOVELA",
  transmissions: "Transmissions",
  cr: "CR",
};

const timelineKindByFilter: Record<TimelineFilter, TimelineEventKind[] | "all"> = {
  all: "all",
  messages: ["message_patient", "reponse_kovela", "message_systeme"],
  actions: ["note_interne", "compilation_preparee"],
  transmissions: ["transmission_cabinet"],
  cr: ["cr_brouillon", "cr_valide", "cr_disponible"],
};

export function filterTimelineEvents(
  events: TimelineEvent[],
  filter: TimelineFilter
): TimelineEvent[] {
  const kinds = timelineKindByFilter[filter];
  if (kinds === "all") return events;
  return events.filter((e) => kinds.includes(e.kind));
}

export function getStructuredTimeline(
  patient: Patient,
  ctx: SupervisorCtx
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Messages
  patient.messages.forEach((m) => {
    const kind: TimelineEventKind =
      m.author === "patient"
        ? "message_patient"
        : m.author === "superviseur"
        ? "reponse_kovela"
        : "message_systeme";
    const actor =
      m.author === "patient"
        ? "Patient"
        : m.author === "superviseur"
        ? "KOVELA"
        : "Système";
    const label =
      kind === "message_patient"
        ? "Message patient"
        : kind === "reponse_kovela"
        ? "Réponse KOVELA"
        : "Message système";
    events.push({
      id: `msg-${m.id}`,
      kind,
      at: m.at,
      actor,
      label,
      content: m.text,
      attachments: m.attachments?.map((a) => ({
        kind: a.kind === "photo" ? "photo" : "audio",
        label: a.label,
      })),
      meta: m.author === "patient" && !m.treated ? "non traité" : undefined,
    });
  });

  // Notes internes
  patient.notes.forEach((n) => {
    events.push({
      id: `note-${n.id}`,
      kind: "note_interne",
      at: n.at,
      actor: n.author || "KOVELA",
      label: "Note interne",
      content: n.text,
    });
  });

  // Compilation factuelle préparée (brouillon)
  const escalation = ctx.escalationFor(patient.id);
  if (patient.compilationDraft && escalation?.status !== "transmise") {
    // On ne connaît pas la date exacte — on prend lastMessageAt comme repère.
    events.push({
      id: `compil-${patient.id}`,
      kind: "compilation_preparee",
      at: patient.lastMessageAt ?? new Date().toISOString(),
      actor: "KOVELA",
      label: "Compilation factuelle préparée",
      content: patient.compilationDraft.split("\n").slice(0, 3).join("\n"),
      meta: "brouillon interne — non transmis",
    });
  }

  // Transmission cabinet
  if (escalation?.status === "transmise" && escalation.transmittedAt) {
    events.push({
      id: `trans-${patient.id}`,
      kind: "transmission_cabinet",
      at: escalation.transmittedAt,
      actor: "KOVELA",
      label: "Transmission cabinet envoyée",
      content: escalation.compilation?.split("\n").slice(0, 3).join("\n"),
    });
  }

  // CR
  const report = ctx.reportFor(patient.id);
  if (report) {
    const crKind: TimelineEventKind =
      report.status === "brouillon"
        ? "cr_brouillon"
        : report.status === "valide"
        ? "cr_valide"
        : "cr_disponible";
    const crLabel =
      report.status === "brouillon"
        ? "CR brouillon préparé"
        : report.status === "valide"
        ? "CR validé en interne"
        : "CR rendu disponible";
    events.push({
      id: `cr-${report.id}`,
      kind: crKind,
      at: report.updatedAt,
      actor: "KOVELA",
      label: crLabel,
      content: report.content.split("\n").slice(0, 3).join("\n"),
    });
  }

  // Tri chronologique inverse (plus récent en haut).
  events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return events;
}

// ---------------------------------------------------------------------------
// Messages programmés — dérivés du référentiel chirurgien + fenêtre de suivi.
// Prototype uniquement : aucun envoi automatique, aucun backend, aucune
// automatisation. Permet à la superviseuse de visualiser, prévisualiser et
// déclencher manuellement les contacts patient programmés.
// ---------------------------------------------------------------------------

export type ScheduledMessageKind =
  | "debut_suivi"
  | "point_suivi"
  | "photo_attendue"
  | "relance_silencieux"
  | "pre_cloture"
  | "cloture";

export type ScheduledMessageStatus =
  | "prevu"
  | "a_valider"
  | "en_retard"
  | "envoye"
  | "annule";

export interface ScheduledMessage {
  id: string;
  kind: ScheduledMessageKind;
  label: string; // ex : "Point de suivi · J+5"
  targetDay: number; // jour post-op cible
  targetDate: string; // ISO
  status: ScheduledMessageStatus;
  templateKey: string;
  template: string; // texte interpolé prêt à envoyer
}

export const scheduledMessageKindLabels: Record<ScheduledMessageKind, string> = {
  debut_suivi: "Début de suivi",
  point_suivi: "Point de suivi",
  photo_attendue: "Demande de photo",
  relance_silencieux: "Relance patient",
  pre_cloture: "Pré-clôture",
  cloture: "Clôture",
};

export const scheduledMessageStatusLabels: Record<ScheduledMessageStatus, string> = {
  prevu: "Prévu",
  a_valider: "À valider",
  en_retard: "En retard",
  envoye: "Envoyé (simulation)",
  annule: "Annulé",
};

export const scheduledMessageStatusStyles: Record<ScheduledMessageStatus, string> = {
  prevu: "bg-navy-900/[0.04] text-charcoal/70 ring-navy-900/[0.06]",
  a_valider: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  en_retard: "bg-amber-100/70 text-amber-900 ring-amber-400/40",
  envoye: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  annule: "bg-navy-900/[0.04] text-charcoal/45 ring-navy-900/[0.06]",
};

// Templates — sobres, humains, non médicaux. Pas de qualification d'état
// patient, pas de diagnostic, pas d'instructions médicales. Rappel 15/112
// dans le message de début uniquement.
const SCHEDULED_TEMPLATES: Record<ScheduledMessageKind, string> = {
  debut_suivi: `Bonjour [Prénom],
Nous sommes l'équipe KOVELA, en lien avec le cabinet du Dr [Nom] pour votre suivi post-opératoire.
Nous reviendrons vers vous aux moments prévus afin de prendre de vos nouvelles et transmettre au cabinet les éléments utiles si nécessaire.
En cas de situation urgente ou inquiétante, contactez directement les services d'urgence au 15 / 112.`,
  point_suivi: `Bonjour [Prénom],
Comment vous sentez-vous aujourd'hui ?
Pouvez-vous nous indiquer si tout se passe comme prévu depuis votre intervention ?`,
  photo_attendue: `Bonjour [Prénom],
Dans le cadre du suivi prévu par le cabinet, pouvez-vous nous transmettre la photo attendue aujourd'hui, si cela vous a bien été demandé ?
KOVELA la transmettra selon les règles définies par le cabinet.`,
  relance_silencieux: `Bonjour [Prénom],
Nous revenons vers vous dans le cadre de votre suivi post-opératoire.
Pouvez-vous simplement nous confirmer que vous avez bien reçu notre message ?`,
  pre_cloture: `Bonjour [Prénom],
Votre période de suivi KOVELA arrive à son terme.
Si vous souhaitez nous signaler un dernier élément utile pour le cabinet, vous pouvez le faire ici.`,
  cloture: `Merci pour vos retours.
Votre suivi KOVELA est désormais clôturé.
Pour toute question ultérieure, vous pouvez vous rapprocher directement du cabinet du Dr [Nom].`,
};

function interpolateTemplate(
  tpl: string,
  patient: Patient,
  surgeon: Surgeon | undefined
): string {
  const firstName = patient.name.split(" ")[0] ?? patient.name;
  const surgeonLastName = (surgeon?.name ?? "").replace(/^Dr\.?\s*/i, "");
  return tpl
    .replaceAll("[Prénom]", firstName)
    .replaceAll("[Nom]", surgeonLastName || "—");
}

// Dérive la liste de messages programmés pour un patient, à partir de la
// fenêtre de suivi et du protocole. Le statut est dérivé approximativement :
// - targetDate dans > 24h → prevu
// - targetDate dans les ±24h → a_valider
// - targetDate dépassée → envoye (approximation prototype)
export function getScheduledMessages(
  patient: Patient,
  ctx: SupervisorCtx,
  surgeon?: Surgeon
): ScheduledMessage[] {
  const now = ctx.now ?? Date.now();
  const startMs = new Date(patient.interventionDate).getTime();
  const window = getFollowUpWindow(patient, now);
  const jalons = (patient.protocol.match(/J\+(\d+)/g) ?? [])
    .map((s) => parseInt(s.replace("J+", ""), 10))
    .filter((n) => Number.isFinite(n));

  // Statut dérivé — un message dépassé non envoyé reste visible :
  // future > 24h → prevu, fenêtre ±24h → a_valider, dépassé → en_retard.
  // Le statut "envoye" n'est jamais inféré : il est appliqué uniquement
  // lorsque la superviseuse simule l'envoi (set local côté composant).
  const computeStatus = (targetMs: number): ScheduledMessageStatus => {
    const diffH = (targetMs - now) / 3_600_000;
    if (diffH > 24) return "prevu";
    if (diffH >= -24) return "a_valider";
    return "en_retard";
  };

  const make = (
    suffix: string,
    kind: ScheduledMessageKind,
    label: string,
    targetDay: number,
    targetMs: number,
    overrideStatus?: ScheduledMessageStatus
  ): ScheduledMessage => ({
    id: `${patient.id}-${suffix}`,
    kind,
    label,
    targetDay,
    targetDate: new Date(targetMs).toISOString(),
    status: overrideStatus ?? computeStatus(targetMs),
    templateKey: kind,
    template: interpolateTemplate(SCHEDULED_TEMPLATES[kind], patient, surgeon),
  });

  const messages: ScheduledMessage[] = [];

  // 1. Début de suivi — à J+0.
  messages.push(make("debut", "debut_suivi", "Début de suivi · J+0", 0, startMs));

  // 2. Points de suivi aux jalons protocole.
  jalons.forEach((j) => {
    messages.push(
      make(
        `jalon-${j}`,
        "point_suivi",
        `Point de suivi · J+${j}`,
        j,
        startMs + j * 86_400_000
      )
    );
  });

  // 3. Photo attendue — sur le 1er jalon si présent.
  if (jalons.length > 0) {
    const j = jalons[0];
    messages.push(
      make(
        `photo-${j}`,
        "photo_attendue",
        `Demande de photo · J+${j}`,
        j,
        startMs + j * 86_400_000
      )
    );
  }

  // 4. Relance patient silencieux — uniquement si statut actuel le justifie.
  if (patient.status === "silencieux") {
    messages.push(
      make("relance", "relance_silencieux", "Relance patient", window.currentDay, now, "a_valider")
    );
  }

  // 5. Pré-clôture — à J+(endDay - 1).
  const preDay = Math.max(0, window.plannedEndDay - 1);
  messages.push(
    make(
      "pre-cloture",
      "pre_cloture",
      `Pré-clôture · J+${preDay}`,
      preDay,
      startMs + preDay * 86_400_000
    )
  );

  // 6. Clôture — à J+endDay.
  messages.push(
    make(
      "cloture",
      "cloture",
      `Clôture · J+${window.plannedEndDay}`,
      window.plannedEndDay,
      startMs + window.plannedEndDay * 86_400_000
    )
  );

  // Tri chronologique.
  messages.sort(
    (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );
  return messages;
}

// Prochain message à actionner — priorité : en retard > à valider > prévu.
export function getNextScheduledMessage(
  patient: Patient,
  ctx: SupervisorCtx,
  surgeon?: Surgeon
): ScheduledMessage | null {
  const all = getScheduledMessages(patient, ctx, surgeon);
  return (
    all.find((m) => m.status === "en_retard") ??
    all.find((m) => m.status === "a_valider") ??
    all.find((m) => m.status === "prevu") ??
    null
  );
}

// Étiquette courte pour l'inbox — affichée si un message est à valider
// aujourd'hui OU si un message est en retard. Retourne null sinon.
export function getTodayScheduledLabel(
  patient: Patient,
  ctx: SupervisorCtx
): string | null {
  const messages = getScheduledMessages(patient, ctx);
  const late = messages.find((m) => m.status === "en_retard");
  if (late) {
    if (late.kind === "relance_silencieux") return "Relance en retard";
    if (late.kind === "cloture" || late.kind === "pre_cloture")
      return "Clôture en retard";
    return "Message en retard";
  }
  const today = messages.find((m) => m.status === "a_valider");
  if (!today) return null;
  if (today.kind === "relance_silencieux") return "Relance prévue";
  if (today.kind === "cloture" || today.kind === "pre_cloture") return "Clôture prévue";
  return "Message prévu aujourd'hui";
}
