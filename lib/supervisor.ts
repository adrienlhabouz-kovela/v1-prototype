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
  a_relancer: "À relancer",
  a_transmettre_cabinet: "À transmettre au cabinet",
  en_attente_cabinet: "En attente cabinet",
  cloture_a_preparer: "Clôture à préparer",
  suivi_habituel: "Suivi habituel",
};

export const operationalStatusHints: Record<OperationalStatus, string> = {
  a_traiter: "Messages non lus, retards ou actions immédiates.",
  a_relancer: "Patient silencieux ou éléments manquants.",
  a_transmettre_cabinet:
    "CR à valider / rendre disponible, compilation à transmettre.",
  en_attente_cabinet: "Transmission cabinet en cours — retour attendu.",
  cloture_a_preparer: "Fin de suivi atteinte — finaliser le dossier.",
  suivi_habituel: "Suivi actif, pas d'action immédiate.",
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

export const urgenceStyles: Record<OperationalUrgence, string> = {
  en_retard: "bg-rose-50/60 text-rose-700 ring-rose-200/60",
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
// Statut opérationnel — calcul à partir des données du store.
// ---------------------------------------------------------------------------

export function getOperationalStatus(
  patient: Patient,
  ctx: SupervisorCtx
): OperationalStatus | null {
  // Clôturé → pas dans l'inbox de travail.
  if (patient.status === "cloture") return null;

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
    return { label: "Rendre disponible au chirurgien", delay: "aujourd'hui" };
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

  if (patient.status === "silencieux") {
    return { label: "Relancer le patient", delay: "aujourd'hui" };
  }

  const endDay = endOfFollowUpDays(patient);
  const interv = new Date(patient.interventionDate).getTime();
  const dayNb = Math.floor((now - interv) / 86_400_000);
  if (endDay !== null && dayNb >= endDay) {
    return { label: "Clôturer le suivi", delay: "à venir" };
  }

  if (patient.status === "onboarding_incomplet") {
    return { label: "Finaliser l'onboarding patient", delay: "à venir" };
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
  peut_rappeler: string;
  ne_pas_traiter: string;
  a_transmettre_cabinet: string;
  transmission_prioritaire: string;
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
    peut_rappeler:
      "Rappels logistiques (repos, hydratation), jalons à venir, consignes générales déjà transmises par le cabinet.",
    ne_pas_traiter:
      "Modification de prescription, interprétation d'évolution, avis médical, reformulation des consignes existantes.",
    a_transmettre_cabinet:
      "Photo reçue, élément déclaré par le patient hors cadre habituel, demande d'avis médical, question médicament / ordonnance.",
    transmission_prioritaire:
      "Si le patient décrit une situation urgente, KOVELA rappelle le 15 / 112 et transmet au cabinet selon le canal défini.",
    photos_attendues:
      jalons.length > 0
        ? `Photos attendues aux jalons ${jalons.join(", ")} selon référentiel.`
        : "Photos selon référentiel.",
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
