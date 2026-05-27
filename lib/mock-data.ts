// KOVELA — prototype. Toutes les données ci-dessous sont FICTIVES.
// Aucune donnée réelle de patient, de chirurgien ou de santé.

import type {
  Assistant,
  ClinicalReport,
  Escalation,
  LogEntry,
  Patient,
  PatientStatus,
  Supervisor,
  Surgeon,
} from "./types";

export const PRICING = {
  baseMonthly: 690, // € HT / mois
  perActivatedPatient: 50, // € HT / patient activé
};

export const surgeons: Surgeon[] = [
  { id: "s1", name: "Dr. Camille Aragon", specialty: "Chirurgie plastique", clinic: "Clinique du Parc" },
  { id: "s2", name: "Dr. Élodie Vasseur", specialty: "Chirurgie esthétique", clinic: "Institut Lutèce" },
  { id: "s3", name: "Dr. Marc Toussaint", specialty: "Chirurgie plastique", clinic: "Clinique Belvédère" },
  { id: "s4", name: "Dr. Léa Sorbier", specialty: "Chirurgie reconstructrice", clinic: "Centre Montaigne" },
  { id: "s5", name: "Dr. Olivier Renaud", specialty: "Chirurgie esthétique", clinic: "Clinique du Parc" },
];

export const assistants: Assistant[] = [
  { id: "a1", name: "Nadia Belkacem", surgeonId: "s1" },
  { id: "a2", name: "Hugo Lefranc", surgeonId: "s2" },
  { id: "a3", name: "Sophie Marchetti", surgeonId: "s3" },
];

export const supervisors: Supervisor[] = [
  { id: "sup1", name: "Inès Carvalho", initials: "IC" },
  { id: "sup2", name: "Thomas Berger", initials: "TB" },
  { id: "sup3", name: "Awa Diallo", initials: "AD" },
  { id: "sup4", name: "Julien Mercier", initials: "JM" },
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

  return [...upcoming, ...base];
}

export function buildEscalations(patients: Patient[]): Escalation[] {
  return patients
    .filter((p) => p.status === "escalade_ouverte")
    .map((p, i) => ({
      id: `e${i + 1}`,
      patientId: p.id,
      status: "ouverte" as const,
      openedAt: daysAgoISO(1, 15),
    }));
}

export function buildReports(patients: Patient[]): ClinicalReport[] {
  const reports: ClinicalReport[] = [];
  patients.forEach((p, i) => {
    if (p.status === "cloture") {
      reports.push({
        id: `cr-${p.id}`,
        patientId: p.id,
        status: "disponible",
        period: `${p.protocol} — suivi structuré`,
        content: defaultReportContent(p.name),
        updatedAt: daysAgoISO(10, 12),
      });
    } else if (p.status === "actif" && i % 4 === 0) {
      reports.push({
        id: `cr-${p.id}`,
        patientId: p.id,
        status: "valide",
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
