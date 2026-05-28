// KOVELA — prototype. Toutes les données ci-dessous sont FICTIVES.
// Aucune donnée réelle de patient, de chirurgien ou de santé.

import type {
  Assistant,
  CabinetConfig,
  ClinicalReport,
  Escalation,
  LogEntry,
  MandateStatus,
  Patient,
  PatientStatus,
  Prospect,
  Supervisor,
  Surgeon,
} from "./types";

export const PRICING = {
  baseMonthly: 690, // € HT / mois
  perActivatedPatient: 50, // € HT / patient activé
};

function baseConfig(over: Partial<CabinetConfig>): CabinetConfig {
  return {
    specialization: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique",
    locations: ["Clinique du Parc"],
    defaultProtocol: "J+8 / J+15",
    followType: "standard",
    crFrequency: "CR fin de suivi",
    transmissionChannel: "Interface KOVELA",
    cabinetContact: {
      name: "Secrétariat du cabinet",
      role: "Contact de transmission cabinet",
      email: "cabinet@exemple.test",
      phone: "01 00 00 00 00",
    },
    workingHours: "Jours ouvrés — 9h à 18h (indicatif)",
    patientPrefs: { photo: true, audio: true, relancesOnboarding: true, rappelSilencieux: true },
    welcomeMessage:
      "Votre chirurgien a mis en place un suivi organisé avec KOVELA afin de centraliser vos échanges post-opératoires.",
    mandateStatus: "mandat_actif",
    configured: true,
    ...over,
  };
}

export const surgeons: Surgeon[] = [
  {
    id: "s1",
    name: "Dr. Camille Aragon",
    specialty: "Chirurgie plastique",
    clinic: "Clinique du Parc",
    config: baseConfig({
      specialization: "Chirurgie esthétique / plastique",
      vertical: "Esthétique & plastique",
      locations: ["Clinique du Parc", "Institut Lutèce"],
      followType: "premium",
      crFrequency: "CR fin de suivi + CR si escalade transmise",
      mandateStatus: "lien_envoye", // à finaliser — démontrable
    }),
  },
  {
    id: "s2",
    name: "Dr. Élodie Vasseur",
    specialty: "Chirurgie esthétique",
    clinic: "Institut Lutèce",
    config: baseConfig({ locations: ["Institut Lutèce"], followType: "renforce", mandateStatus: "mandat_actif" }),
  },
  {
    id: "s3",
    name: "Dr. Marc Toussaint",
    specialty: "Chirurgie maxillo-faciale",
    clinic: "Clinique Belvédère",
    config: baseConfig({
      specialization: "Chirurgie maxillo-faciale",
      vertical: "ORL / maxillo-facial",
      locations: ["Clinique Belvédère"],
      mandateStatus: "prelevement_pret",
    }),
  },
  {
    id: "s4",
    name: "Dr. Léa Sorbier",
    specialty: "Chirurgie orthopédique",
    clinic: "Centre Montaigne",
    config: baseConfig({
      specialization: "Chirurgie orthopédique",
      vertical: "Ambulatoire orthopédique",
      locations: ["Centre Montaigne"],
      mandateStatus: "mandat_actif",
    }),
  },
  {
    id: "s5",
    name: "Dr. Olivier Renaud",
    specialty: "Chirurgie esthétique",
    clinic: "Clinique du Parc",
    config: baseConfig({ locations: ["Clinique du Parc"], mandateStatus: "lien_envoye" }),
  },
];

export const assistants: Assistant[] = [
  { id: "a1", name: "Nadia Belkacem", surgeonId: "s1" },
  { id: "a2", name: "Hugo Lefranc", surgeonId: "s2" },
  { id: "a3", name: "Sophie Marchetti", surgeonId: "s3" },
];

export const supervisors: Supervisor[] = [
  { id: "sup1", name: "Inès Carvalho", initials: "IC", formationStatus: "pret", qualityStatus: "ok" },
  { id: "sup2", name: "Thomas Berger", initials: "TB", formationStatus: "pret", qualityStatus: "ok" },
  { id: "sup3", name: "Awa Diallo", initials: "AD", formationStatus: "en_cours", qualityStatus: "ok" },
  { id: "sup4", name: "Julien Mercier", initials: "JM", formationStatus: "pret", qualityStatus: "a_revoir" },
];

// Listes seedées pour la vue « Supervision & qualité » (démonstratif).
// Aucune donnée patient sensible : juste des références à des items existants
// avec un libellé opérationnel.
export const seedConversationsToReview: {
  id: string; patientId: string; supervisorId: string; reason: string; comment: string; status: "a_relire" | "ok" | "a_revoir";
}[] = [
  { id: "qrv1", patientId: "p11", supervisorId: "sup1", reason: "Compilation factuelle préparée — à valider avant transmission", comment: "Bonne structure. Vérifier la chronologie avec le superviseur.", status: "a_relire" },
  { id: "qrv2", patientId: "p10", supervisorId: "sup2", reason: "Délai de traitement long sur dernier message patient", comment: "Relance proposée — penser à logger le motif.", status: "a_relire" },
  { id: "qrv3", patientId: "p13", supervisorId: "sup3", reason: "Suggestion IA modifiée puis envoyée", comment: "Modification cohérente, conserve la forme non médicale.", status: "ok" },
  { id: "qrv4", patientId: "p9", supervisorId: "sup4", reason: "Patient silencieux — pas de relance enregistrée", comment: "À revoir : programmer une relance.", status: "a_revoir" },
];

export const seedCRsToControl: {
  id: string; patientId: string; supervisorId: string; lastAction: string; status: "a_controler" | "ok" | "a_revoir";
}[] = [
  { id: "qcr1", patientId: "p21", supervisorId: "sup1", lastAction: "CR validé en interne — à contrôler avant mise à disposition", status: "a_controler" },
  { id: "qcr2", patientId: "p24", supervisorId: "sup2", lastAction: "CR validé en interne — à contrôler", status: "a_controler" },
  { id: "qcr3", patientId: "p18", supervisorId: "sup1", lastAction: "CR rendu disponible pour le chirurgien", status: "ok" },
  { id: "qcr4", patientId: "p27", supervisorId: "sup4", lastAction: "CR validé en interne — wording à vérifier", status: "a_revoir" },
];

const interventions = [
  "Abdominoplastie",
  "Augmentation mammaire",
  "Rhinoplastie",
  "Lipoaspiration",
  "Lifting cervico-facial",
  "Blépharoplastie",
  "Réduction mammaire",
  "Otoplastie",
];

const firstNames = [
  "Camille", "Léna", "Sarah", "Manon", "Julie", "Inès", "Clara", "Emma",
  "Louise", "Anaïs", "Chloé", "Margaux", "Nora", "Maya", "Eva", "Lina",
  "Romain", "Lucas", "Hugo", "Nathan", "Théo", "Antoine", "Maxime", "Yanis",
  "Adam", "Gabriel", "Paul", "Noah", "Sacha", "Ethan",
];

const lastNames = [
  "Moreau", "Lambert", "Girard", "Fontaine", "Roux", "Vincent", "Muller",
  "Lefebvre", "Faure", "Garnier", "Chevalier", "Robin", "Masson", "Dumas",
  "Brun", "Perrin", "Morel", "Gauthier", "Roussel", "Blanc", "Henry",
  "Renard", "Bertrand", "Leroy", "Marchand", "Da Silva", "Caron", "Picard",
  "Noël", "Lemoine",
];

function daysAgoISO(days: number, hour = 10): string {
  const d = new Date("2026-05-27T09:00:00Z");
  d.setDate(d.getDate() - days);
  d.setHours(hour, (days * 7) % 60, 0, 0);
  return d.toISOString();
}

function daysFromNowISO(days: number, hour = 9): string {
  const d = new Date("2026-05-27T09:00:00Z");
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const times = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"];

// Coordonnées fictives (jamais de vraies données).
function fakePhone(i: number): string {
  const last2 = String(10 + (i % 89)).padStart(2, "0");
  return `06 00 00 00 ${last2}`;
}
function fakeEmail(first: string, last: string): string {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "");
  return `${norm(first)}.${norm(last)}@exemple.test`;
}

// Distribution déterministe des statuts sur 30 patients.
const statusPlan: PatientStatus[] = [
  // onboarding incomplet (4)
  "onboarding_incomplet", "onboarding_incomplet", "onboarding_incomplet", "onboarding_incomplet",
  // silencieux (5)
  "silencieux", "silencieux", "silencieux", "silencieux", "silencieux",
  // escalade ouverte (3)
  "escalade_ouverte", "escalade_ouverte", "escalade_ouverte",
  // cr en attente (5)
  "cr_en_attente", "cr_en_attente", "cr_en_attente", "cr_en_attente", "cr_en_attente",
  // cloture (3)
  "cloture", "cloture", "cloture",
  // actif (10)
  "actif", "actif", "actif", "actif", "actif", "actif", "actif", "actif", "actif", "actif",
];

function buildMessages(status: PatientStatus, idx: number): Patient["messages"] {
  const base = 6 + (idx % 4);
  if (status === "onboarding_incomplet") {
    return [
      {
        id: `m-${idx}-1`,
        author: "systeme",
        text: "Invitation à l'onboarding envoyée. En attente de finalisation par le patient.",
        at: daysAgoISO(base, 9),
        treated: true,
      },
    ];
  }
  if (status === "silencieux") {
    return [
      {
        id: `m-${idx}-1`,
        author: "superviseur",
        text: "Bonjour, comment se passe votre suivi post-opératoire ? N'hésitez pas à nous écrire.",
        at: daysAgoISO(base, 9),
        treated: true,
      },
      {
        id: `m-${idx}-2`,
        author: "systeme",
        text: "Aucune réponse du patient depuis l'envoi. Patient silencieux.",
        at: daysAgoISO(base - 1, 11),
        treated: true,
      },
    ];
  }
  if (status === "escalade_ouverte") {
    return [
      {
        id: `m-${idx}-1`,
        author: "patient",
        text: "Bonjour, j'ai une question concernant ma cicatrice et un point qui me gêne depuis hier.",
        at: daysAgoISO(2, 8),
        attachments: [{ id: `att-${idx}-1`, kind: "photo", label: "Photo zone opérée (placeholder)" }],
        treated: true,
      },
      {
        id: `m-${idx}-2`,
        author: "superviseur",
        text: "Merci pour votre message et la photo. Je transmets ces éléments à votre chirurgien pour suite.",
        at: daysAgoISO(2, 9),
        treated: true,
      },
      {
        id: `m-${idx}-3`,
        author: "patient",
        text: "D'accord, merci. Voici aussi un message audio pour décrire ce que je ressens.",
        at: daysAgoISO(1, 14),
        attachments: [{ id: `att-${idx}-2`, kind: "audio", label: "Mémo vocal patient (placeholder)" }],
        treated: false,
      },
    ];
  }
  if (status === "cr_en_attente") {
    return [
      {
        id: `m-${idx}-1`,
        author: "patient",
        text: "Bonjour, tout se passe bien de mon côté, je voulais vous tenir au courant.",
        at: daysAgoISO(5, 10),
        treated: true,
      },
      {
        id: `m-${idx}-2`,
        author: "superviseur",
        text: "Parfait, merci pour le retour. Nous restons disponibles si besoin.",
        at: daysAgoISO(5, 11),
        treated: true,
      },
      {
        id: `m-${idx}-3`,
        author: "patient",
        text: "Petite question sur les pansements, je vous envoie une photo.",
        at: daysAgoISO(3, 16),
        attachments: [{ id: `att-${idx}-1`, kind: "photo", label: "Photo pansement (placeholder)" }],
        treated: true,
      },
    ];
  }
  if (status === "cloture") {
    return [
      {
        id: `m-${idx}-1`,
        author: "patient",
        text: "Merci pour le suivi, tout est rentré dans l'ordre.",
        at: daysAgoISO(12, 10),
        treated: true,
      },
      {
        id: `m-${idx}-2`,
        author: "superviseur",
        text: "Avec plaisir. Nous clôturons le suivi structuré. Prenez soin de vous.",
        at: daysAgoISO(11, 9),
        treated: true,
      },
    ];
  }
  // actif
  const msgs: Patient["messages"] = [];
  for (let i = 0; i < base; i++) {
    const isPatient = i % 2 === 0;
    msgs.push({
      id: `m-${idx}-${i + 1}`,
      author: isPatient ? "patient" : "superviseur",
      text: isPatient
        ? "Bonjour, je voulais partager un point sur mon suivi post-opératoire."
        : "Merci pour votre message, bien noté. Nous restons à votre écoute.",
      at: daysAgoISO(base - i, 9 + i),
      treated: i < base - 1,
      attachments: i === 2 ? [{ id: `att-${idx}-${i}`, kind: "photo", label: "Photo de suivi (placeholder)" }] : undefined,
    });
  }
  return msgs;
}

function onboardingStatusFor(status: PatientStatus, i: number): Patient["onboardingStatus"] {
  if (status !== "onboarding_incomplet") return "complete";
  if (i % 3 === 0) return "a_envoyer";
  if (i % 3 === 1) return "envoye";
  return "relance";
}

function planningStatusFor(status: PatientStatus, onboardingStatus: Patient["onboardingStatus"]): Patient["planningStatus"] {
  if (status === "onboarding_incomplet") {
    return onboardingStatus === "a_envoyer" ? "importe" : "onboarding_envoye";
  }
  return "actif";
}

export function buildPatients(): Patient[] {
  const base: Patient[] = Array.from({ length: 30 }).map((_, i) => {
    const status = statusPlan[i];
    const surgeon = surgeons[i % surgeons.length];
    // ~4 patients sans superviseur (parmi onboarding/actifs)
    const noSupervisor = i === 0 || i === 6 || i === 20 || i === 25;
    const supervisorId = noSupervisor ? null : supervisors[i % supervisors.length].id;
    const onboardingComplete = status !== "onboarding_incomplet";
    const messages = buildMessages(status, i);
    const lastMessageAt = messages.length ? messages[messages.length - 1].at : null;
    const activatedThisMonth = onboardingComplete && i % 3 === 0;
    const onboardingStatus = onboardingStatusFor(status, i);
    return {
      id: `p${i + 1}`,
      name: `${firstNames[i]} ${lastNames[i]}`,
      surgeonId: surgeon.id,
      supervisorId,
      intervention: interventions[i % interventions.length],
      interventionDate: daysAgoISO(10 + (i % 18), 8),
      interventionTime: times[i % times.length],
      clinic: surgeon.clinic,
      phone: fakePhone(i),
      email: fakeEmail(firstNames[i], lastNames[i]),
      cabinetNote: i % 5 === 0 ? "Patient à recontacter en priorité par le cabinet." : "",
      protocol: i % 2 === 0 ? "J+12 / J+15" : "J+8 / J+15",
      status,
      onboardingStatus,
      planningStatus: planningStatusFor(status, onboardingStatus),
      planningUpdatedAt: daysAgoISO(2 + (i % 6), 12),
      onboardingComplete,
      activatedThisMonth,
      consentGiven: onboardingComplete,
      messages,
      notes:
        status === "escalade_ouverte"
          ? [
              {
                id: `n-${i}-1`,
                author: "Inès Carvalho",
                text: "Compilation factuelle en préparation pour transmission au chirurgien.",
                at: daysAgoISO(1, 15),
              },
            ]
          : [],
      lastMessageAt,
    };
  });

  // Interventions À VENIR pour le chirurgien de démo (s1) — point d'entrée planning.
  const upcoming: Patient[] = [
    { name: "Hélène Vasseur", days: 3, intv: "Rhinoplastie", time: "09:30", ob: "a_envoyer" as const, pl: "importe" as const },
    { name: "Karim Benali", days: 7, intv: "Lipoaspiration", time: "11:00", ob: "envoye" as const, pl: "onboarding_envoye" as const },
    { name: "Sofia Pereira", days: 12, intv: "Augmentation mammaire", time: "14:00", ob: "a_envoyer" as const, pl: "importe" as const },
  ].map((u, j) => {
    const [first, last] = u.name.split(" ");
    return {
      id: `pu${j + 1}`,
      name: u.name,
      surgeonId: "s1",
      supervisorId: null,
      intervention: u.intv,
      interventionDate: daysFromNowISO(u.days, 8),
      interventionTime: u.time,
      clinic: "Clinique du Parc",
      phone: fakePhone(40 + j),
      email: fakeEmail(first, last),
      cabinetNote: j === 0 ? "Première intervention — prévoir onboarding rapidement." : "",
      protocol: "J+8 / J+15",
      status: "onboarding_incomplet" as PatientStatus,
      onboardingStatus: u.ob,
      planningStatus: u.pl,
      planningUpdatedAt: daysAgoISO(1, 10),
      onboardingComplete: false,
      activatedThisMonth: false,
      consentGiven: false,
      messages: [],
      notes: [],
      lastMessageAt: null,
    };
  });

  // Les patients en escalade ont une compilation factuelle déjà préparée
  // (brouillon interne), mais NON transmise au chirurgien.
  const withDrafts = base.map((p) =>
    p.status === "escalade_ouverte" ? { ...p, compilationDraft: compilationDraftFor(p) } : p
  );

  return [...upcoming, ...withDrafts];
}

// Aucune escalade transmise au démarrage : la transmission au chirurgien
// est une action humaine explicite (dissociée de la préparation de compilation).
export function buildEscalations(): Escalation[] {
  return [];
}

// Compilation factuelle préparée (brouillon interne) pour les patients dont
// le suivi présente une escalade en cours de préparation — non transmise.
export function compilationDraftFor(p: Patient): string {
  return [
    "Compilation factuelle (brouillon) — éléments chronologiques pour transmission au chirurgien",
    "",
    `Patient : ${p.name}`,
    `Intervention déclarée : ${p.intervention} — Protocole ${p.protocol}`,
    "",
    "Chronologie des échanges récents :",
    ...p.messages.slice(-4).map((m) => {
      const who = m.author === "patient" ? "Patient" : m.author === "superviseur" ? "Superviseur" : "Système";
      return `— ${who} : ${m.text}`;
    }),
    "",
    "Actions déjà réalisées par KOVELA :",
    "— Réception et classement opérationnel des messages.",
    "— Compilation factuelle préparée, en attente de transmission humaine.",
    "",
    "Note : compilation strictement factuelle. Aucune interprétation. Décision au chirurgien.",
  ].join("\n");
}

export function buildReports(patients: Patient[]): ClinicalReport[] {
  const reports: ClinicalReport[] = [];
  let s1DisponibleSeen = 0;
  patients.forEach((p) => {
    if (p.status === "cloture") {
      // Suivi terminé → CR disponible pour le chirurgien.
      reports.push({
        id: `cr-${p.id}`,
        patientId: p.id,
        status: "disponible",
        period: `${p.protocol} — suivi structuré`,
        content: defaultReportContent(p.name),
        updatedAt: daysAgoISO(10, 12),
      });
    } else if (p.status === "actif") {
      // Un CR déjà disponible pour le chirurgien de démo (s1), les autres
      // restent validés en interne (non visibles côté chirurgien).
      const disponible = p.surgeonId === "s1" && s1DisponibleSeen === 0;
      if (disponible) s1DisponibleSeen += 1;
      reports.push({
        id: `cr-${p.id}`,
        patientId: p.id,
        status: disponible ? "disponible" : "valide",
        period: `${p.protocol} — suivi en cours`,
        content: defaultReportContent(p.name),
        updatedAt: daysAgoISO(4, 12),
      });
    }
  });
  return reports;
}

function defaultReportContent(name: string): string {
  return [
    `Patient : ${name}`,
    "Période : suivi post-opératoire structuré (synthèse opérationnelle).",
    "",
    "Messages principaux :",
    "— Échanges réguliers, patient réactif.",
    "— Photos de suivi reçues (placeholders).",
    "",
    "Actions KOVELA :",
    "— Relances de continuité post-opératoire effectuées.",
    "— Messages classés opérationnellement et traités.",
    "",
    "Escalades : aucune escalade ouverte sur la période.",
    "Statut final : suivi conforme au protocole déclaré.",
    "",
    "Note : synthèse opérationnelle non médicale. À valider par un humain.",
  ].join("\n");
}

export function buildInitialLogs(patients: Patient[]): LogEntry[] {
  const logs: LogEntry[] = [];
  let n = 1;
  const push = (e: Omit<LogEntry, "id">) => logs.push({ id: `log-${n++}`, ...e });

  push({
    kind: "onboarding_complete",
    at: daysAgoISO(9, 9),
    user: "Système KOVELA",
    patientId: patients[4].id,
    detail: `Onboarding complété pour ${patients[4].name}.`,
  });
  push({
    kind: "patient_attribue",
    at: daysAgoISO(8, 10),
    user: "Admin KOVELA",
    patientId: patients[4].id,
    detail: `${patients[4].name} attribué à un superviseur.`,
  });
  push({
    kind: "ia_utilisee",
    at: daysAgoISO(6, 11),
    user: "Inès Carvalho",
    patientId: patients[9].id,
    detail: "Fonction IA assistive « Résumé conversation » utilisée (prompt v1.2).",
  });
  push({
    kind: "ia_suggestion",
    at: daysAgoISO(6, 11),
    user: "Inès Carvalho",
    patientId: patients[9].id,
    detail: "Suggestion IA acceptée par un humain.",
  });
  push({
    kind: "cr_prepare",
    at: daysAgoISO(5, 14),
    user: "Thomas Berger",
    patientId: patients[12].id,
    detail: `Brouillon de CR préparé pour ${patients[12].name}.`,
  });
  push({
    kind: "escalade_transmise",
    at: daysAgoISO(4, 16),
    user: "Awa Diallo",
    patientId: patients[9].id,
    detail: "Compilation factuelle transmise au chirurgien.",
  });
  push({
    kind: "cr_disponible",
    at: daysAgoISO(10, 12),
    user: "Julien Mercier",
    patientId: patients[17].id,
    detail: `CR rendu disponible au chirurgien pour ${patients[17].name}.`,
  });
  return logs.reverse();
}

// CRM Chirurgiens — prospects fictifs (AUCUNE donnée patient).
// Pipeline commercial : prospection → démo → onboarding cabinet → actif.
export const seedProspects: Prospect[] = [
  {
    id: "pr1", firstName: "Alexandre", lastName: "Bonnet", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Cabinet Bonnet", city: "Paris",
    email: "a.bonnet@exemple.test", phone: "06 00 00 02 10", linkedin: "linkedin.com/in/exemple-bonnet",
    source: "LinkedIn", cabinetType: "solo", monthlyVolume: 28, interest: "tiede", priority: "moyenne",
    status: "a_contacter", lastContactAt: null, nextAction: "Premier contact LinkedIn",
    nextRelanceAt: daysFromNowISO(3, 10).slice(0, 10), demoDone: false, objections: "",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr2", firstName: "Hélène", lastName: "Lemaire", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Institut Lemaire", city: "Neuilly-sur-Seine",
    email: "h.lemaire@exemple.test", phone: "06 00 00 02 11", linkedin: "linkedin.com/in/exemple-lemaire",
    source: "Recommandation", cabinetType: "solo", monthlyVolume: 42, interest: "chaud", priority: "haute",
    status: "a_contacter", lastContactAt: null, nextAction: "Appel cabinet",
    nextRelanceAt: daysFromNowISO(2, 14).slice(0, 10), demoDone: false, objections: "",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr3", firstName: "Pierre", lastName: "Garcia", specialty: "Chirurgie ORL",
    vertical: "ORL / maxillo-facial", cabinet: "Cabinet Garcia", city: "Lyon",
    email: "p.garcia@exemple.test", phone: "06 00 00 02 12", linkedin: "linkedin.com/in/exemple-garcia",
    source: "Salon", cabinetType: "groupe", monthlyVolume: 35, interest: "tiede", priority: "moyenne",
    status: "contacte", lastContactAt: daysAgoISO(4, 11), nextAction: "Envoyer présentation",
    nextRelanceAt: daysFromNowISO(2, 10).slice(0, 10), demoDone: false, objections: "",
    notes: [{ id: "n-pr3-1", text: "Intérêt pour la verticale ORL.", author: "Admin KOVELA", at: daysAgoISO(4, 11) }],
    onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr4", firstName: "Sophie", lastName: "Marchand", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Cabinet Marchand", city: "Bordeaux",
    email: "s.marchand@exemple.test", phone: "06 00 00 02 13", linkedin: "linkedin.com/in/exemple-marchand",
    source: "Inbound site", cabinetType: "solo", monthlyVolume: 22, interest: "chaud", priority: "haute",
    status: "contacte", lastContactAt: daysAgoISO(2, 9), nextAction: "Caler le call de découverte",
    nextRelanceAt: daysFromNowISO(1, 10).slice(0, 10), demoDone: false, objections: "",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr5", firstName: "Thomas", lastName: "Dupuis", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Clinique Dupuis", city: "Marseille",
    email: "t.dupuis@exemple.test", phone: "06 00 00 02 14", linkedin: "linkedin.com/in/exemple-dupuis",
    source: "Réseau", cabinetType: "clinique", monthlyVolume: 60, interest: "chaud", priority: "haute",
    status: "call_prevu", lastContactAt: daysAgoISO(3, 15), nextAction: "Call de découverte (45 min)",
    nextRelanceAt: daysFromNowISO(1, 16).slice(0, 10), demoDone: false, objections: "",
    notes: [{ id: "n-pr5-1", text: "Volume élevé, intéressé par l'aspect supervision.", author: "Admin KOVELA", at: daysAgoISO(3, 15) }],
    onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr6", firstName: "Léa", lastName: "Robert", specialty: "Chirurgie orthopédique",
    vertical: "Ambulatoire orthopédique", cabinet: "Centre Robert", city: "Toulouse",
    email: "l.robert@exemple.test", phone: "06 00 00 02 15", linkedin: "linkedin.com/in/exemple-robert",
    source: "Recommandation", cabinetType: "groupe", monthlyVolume: 30, interest: "tiede", priority: "moyenne",
    status: "call_prevu", lastContactAt: daysAgoISO(5, 11), nextAction: "Confirmer créneau",
    nextRelanceAt: daysFromNowISO(2, 11).slice(0, 10), demoDone: false, objections: "",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr7", firstName: "Antoine", lastName: "Petit", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Cabinet Petit", city: "Paris",
    email: "a.petit@exemple.test", phone: "06 00 00 02 16", linkedin: "linkedin.com/in/exemple-petit",
    source: "Inbound site", cabinetType: "solo", monthlyVolume: 18, interest: "chaud", priority: "haute",
    status: "demo_faite", lastContactAt: daysAgoISO(1, 14), nextAction: "Envoyer simulation devis",
    nextRelanceAt: daysFromNowISO(2, 10).slice(0, 10), demoDone: true, objections: "Veut comprendre la part de variable.",
    notes: [{ id: "n-pr7-1", text: "Démo très positive, focus sur la compilation factuelle.", author: "Admin KOVELA", at: daysAgoISO(1, 14) }],
    onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr8", firstName: "Marie", lastName: "Fournier", specialty: "Chirurgie ophtalmologique",
    vertical: "Ophtalmologie", cabinet: "Centre Fournier", city: "Nantes",
    email: "m.fournier@exemple.test", phone: "06 00 00 02 17", linkedin: "linkedin.com/in/exemple-fournier",
    source: "Salon", cabinetType: "groupe", monthlyVolume: 50, interest: "tiede", priority: "moyenne",
    status: "demo_faite", lastContactAt: daysAgoISO(6, 10), nextAction: "Relancer après réflexion équipe",
    nextRelanceAt: daysFromNowISO(4, 10).slice(0, 10), demoDone: true, objections: "Doit valider avec son associé.",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr9", firstName: "Julien", lastName: "Caron", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Cabinet Caron", city: "Lille",
    email: "j.caron@exemple.test", phone: "06 00 00 02 18", linkedin: "linkedin.com/in/exemple-caron",
    source: "LinkedIn", cabinetType: "solo", monthlyVolume: 25, interest: "tiede", priority: "moyenne",
    status: "en_reflexion", lastContactAt: daysAgoISO(8, 10), nextAction: "Relance douce",
    nextRelanceAt: daysFromNowISO(5, 10).slice(0, 10), demoDone: true, objections: "Prix.",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr10", firstName: "Camille", lastName: "Bernard", specialty: "Chirurgie gynécologique",
    vertical: "Gynécologie", cabinet: "Cabinet Bernard", city: "Strasbourg",
    email: "c.bernard@exemple.test", phone: "06 00 00 02 19", linkedin: "linkedin.com/in/exemple-bernard",
    source: "Recommandation", cabinetType: "solo", monthlyVolume: 20, interest: "tiede", priority: "moyenne",
    status: "en_reflexion", lastContactAt: daysAgoISO(10, 10), nextAction: "Relance et bénéfices",
    nextRelanceAt: daysFromNowISO(3, 10).slice(0, 10), demoDone: true, objections: "Pas sûre du timing.",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr11", firstName: "Élise", lastName: "Roy", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Institut Roy", city: "Paris",
    email: "e.roy@exemple.test", phone: "06 00 00 02 20", linkedin: "linkedin.com/in/exemple-roy",
    source: "Réseau", cabinetType: "solo", monthlyVolume: 38, interest: "chaud", priority: "haute",
    status: "accord_verbal", lastContactAt: daysAgoISO(2, 16), nextAction: "Préparer lancement onboarding",
    nextRelanceAt: daysFromNowISO(2, 10).slice(0, 10), demoDone: true, objections: "",
    notes: [{ id: "n-pr11-1", text: "Accord verbal — confirmation par email à venir.", author: "Admin KOVELA", at: daysAgoISO(2, 16) }],
    onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
  {
    id: "pr12", firstName: "Romain", lastName: "Lopez", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Cabinet Lopez", city: "Nice",
    email: "r.lopez@exemple.test", phone: "06 00 00 02 21", linkedin: "linkedin.com/in/exemple-lopez",
    source: "Inbound site", cabinetType: "solo", monthlyVolume: 32, interest: "chaud", priority: "haute",
    status: "onboarding_cabinet", lastContactAt: daysAgoISO(1, 10), nextAction: "Suivre la mise en place cabinet",
    nextRelanceAt: daysFromNowISO(1, 10).slice(0, 10), demoDone: true, objections: "",
    notes: [], onboardingLaunched: true, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "lien_envoye", isActive: false,
  },
  {
    id: "pr13", firstName: "Camille", lastName: "Aragon", specialty: "Chirurgie esthétique / plastique",
    vertical: "Esthétique & plastique", cabinet: "Clinique du Parc", city: "Paris",
    email: "c.aragon@exemple.test", phone: "06 00 00 02 22", linkedin: "linkedin.com/in/exemple-aragon",
    source: "Inbound site", cabinetType: "solo", monthlyVolume: 40, interest: "chaud", priority: "haute",
    status: "actif", lastContactAt: daysAgoISO(15, 10), nextAction: "Suivi compte trimestriel",
    nextRelanceAt: daysFromNowISO(45, 10).slice(0, 10), demoDone: true, objections: "",
    notes: [{ id: "n-pr13-1", text: "Référence client — premier chirurgien actif KOVELA.", author: "Admin KOVELA", at: daysAgoISO(15, 10) }],
    onboardingLaunched: true, cabinetConfigured: true, assistantAdded: true,
    mandateStatus: "mandat_actif", isActive: true,
  },
  {
    id: "pr14", firstName: "Pauline", lastName: "Henry", specialty: "Chirurgie urologique",
    vertical: "Urologie", cabinet: "Centre Henry", city: "Rennes",
    email: "p.henry@exemple.test", phone: "06 00 00 02 23", linkedin: "linkedin.com/in/exemple-henry",
    source: "LinkedIn", cabinetType: "groupe", monthlyVolume: 24, interest: "froid", priority: "basse",
    status: "perdu", lastContactAt: daysAgoISO(30, 10), nextAction: "Re-prospecter dans 6 mois",
    nextRelanceAt: daysFromNowISO(180, 10).slice(0, 10), demoDone: true, objections: "Pas le bon timing — projet interne en cours.",
    notes: [], onboardingLaunched: false, cabinetConfigured: false, assistantAdded: false,
    mandateStatus: "a_creer", isActive: false,
  },
];
