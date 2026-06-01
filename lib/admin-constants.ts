// Hypothèses prototype — configurables pour la passe Admin / Cockpit.
// L'investisseur doit voir ces valeurs comme des hypothèses pilotables, pas
// comme des mesures. Toutes les valeurs sont déclarées ici pour ne pas
// disséminer la logique business dans les composants UI.

export const ADMIN_CONSTANTS = {
  // Capacité care — un superviseur premium suit ~22 patients en optimal.
  // Au-delà, fatigue et baisse de qualité.
  CAPACITE_SUPERVISEUR_PATIENTS_OPTIMAL: 22,
  CAPACITE_SUPERVISEUR_PATIENTS_MAX: 30,

  // Seuils alerte capacité — déclenchent l'état général et les décisions.
  SEUIL_CAPACITE_ATTENTION: 0.75, // 75% — surveiller
  SEUIL_CAPACITE_RISQUE: 0.85, // 85% — pré-sourcer
  SEUIL_CAPACITE_CRITIQUE: 0.9, // 90% — recruter / activer back-up

  // Hypothèses de coûts — pour le calcul de marge brute estimée.
  COUT_SUPERVISEUR_MENSUEL_EUR: 3500,
  COUT_DIRECT_PATIENT_EUR: 12,
  COUT_OUTILS_CARE_PAR_PATIENT_EUR: 3, // hypothèse — outils internes + messagerie pro
  COUT_MESSAGERIE_PATIENT_EUR: 1, // hypothèse — WhatsApp / SMS / canal externe

  // Hypothèses de volume cible — pour la marge brute normalisée.
  // L'idée : la marge prototype est non représentative (faible volume
  // vs coûts de supervision fixes). On affiche une lecture normalisée à
  // volume cible pour montrer que le modèle peut devenir cohérent.
  CHIRURGIENS_NORMALIZED_TARGET: 5,
  PATIENTS_MOIS_PAR_CHIRURGIEN_TARGET: 20,
  PATIENTS_PAR_SUPERVISEUR_CIBLE: 30,

  // Croissance patients — hypothèse linéaire prototype.
  // En V1, à remplacer par une projection issue du CRM + activations réelles.
  NOUVEAUX_PATIENTS_HEBDO_HYPOTHESE: 8,

  // Patients moyens par chirurgien actif — hypothèse expansion.
  PATIENTS_MOYENS_PAR_CHIRURGIEN_HYPOTHESE: 4,

  // Seuils retard opérationnel (en heures) — pour qualifier les délais.
  SEUIL_RETARD_HEURES: 24,

  // Seuils RH care — déclenchent les recommandations Lead / Head of Care.
  SEUIL_LEAD_SUPERVISEUSE_NB: 4, // 4+ superviseuses → Lead part-time
  SEUIL_HEAD_OF_CARE_NB: 6, // 6+ superviseuses → Head of Care recommandé
  SEUIL_HEAD_OF_CARE_CAPACITE: 0.8, // ou capacité moyenne > 80%

  // Score qualité minimum acceptable (pour l'état général).
  SEUIL_QUALITE_OPS_MIN: 0.7,

  // -------------------------------------------------------------------------
  // Baseline terrain V0 — donnée historique opérationnelle.
  // Mode manuel WhatsApp/audio, sans interface KOVELA, sans IA, sans
  // automatisation. 17 ans d'expérience bloc + patient (Mélanie, ex partenaire
  // KOVELA). Sert de point d'ancrage honnête pour modéliser la productivité.
  // -------------------------------------------------------------------------
  MANUAL_BASELINE_MINUTES_PER_PATIENT_LOW: 60,
  MANUAL_BASELINE_MINUTES_PER_PATIENT_HIGH: 90,
  FOLLOW_UP_DURATION_DAYS_MIN: 3,
  FOLLOW_UP_DURATION_DAYS_MAX: 15,

  // Heures productives par superviseuse / mois — hypothèse plateau opérationnel
  // raisonnable (≈ 30 h/sem nettes × 4 sem). À mesurer en pilote.
  SUPERVISOR_PRODUCTIVE_HOURS_PER_MONTH: 120,

  // Date / version du cockpit — pour le footer data integrity.
  COCKPIT_VERSION: "Passe A+ (0.2 prototype — baseline terrain V0)",
};

// Catégories de classification des données — affichées dans le footer.
export type DataCategory = "mesure" | "estime" | "hypothese" | "v1";

export const DATA_CATEGORY_LABELS: Record<DataCategory, string> = {
  mesure: "Mesuré prototype",
  estime: "Estimé prototype",
  hypothese: "Hypothèse prototype",
  v1: "À créer en V1",
};

export const DATA_CATEGORY_STYLES: Record<DataCategory, string> = {
  mesure: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  estime: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  hypothese: "bg-navy-900/[0.04] text-charcoal/65 ring-navy-900/[0.06]",
  v1: "bg-bone/60 text-charcoal/55 ring-navy-900/[0.04]",
};

// ---------------------------------------------------------------------------
// Équipe care — coûts par poste / personne, structure configurable.
// Chaque ligne peut être renseignée (coût réel), hypothèse (estimation V1)
// ou à valider (à figer avec la personne / le rôle plus tard).
// ---------------------------------------------------------------------------

export type CareRole =
  | "supervisor"
  | "lead_supervisor"
  | "head_of_care"
  | "qa_care"
  | "care_coordinator"
  | "ops_manager"
  | "custom";

export type CostType = "renseigne" | "hypothese" | "a_valider";

export const careRoleLabels: Record<CareRole, string> = {
  supervisor: "Superviseuse",
  lead_supervisor: "Lead superviseuse",
  head_of_care: "Head of Care",
  qa_care: "QA care",
  care_coordinator: "Care coordinator",
  ops_manager: "Ops manager",
  custom: "Poste custom",
};

export const costTypeLabels: Record<CostType, string> = {
  renseigne: "Renseigné",
  hypothese: "Hypothèse",
  a_valider: "À valider",
};

export const costTypeStyles: Record<CostType, string> = {
  renseigne: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  hypothese: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  a_valider: "bg-navy-900/[0.04] text-charcoal/65 ring-navy-900/[0.06]",
};

export interface CareTeamMember {
  id: string;
  label: string;
  role: CareRole;
  customRoleLabel?: string;
  monthlyCompanyCost: number;
  costType: CostType;
  active: boolean;
  capacityContribution: boolean; // compte dans la capacité care opérationnelle
  managementContribution: boolean; // compte dans le management care
  qualityContribution: boolean; // compte dans la QA care
  note?: string;
}

// Seed prototype — à enrichir / remplacer lors du pilote.
// Mélange volontaire de "renseigné" (faux mais déclaré) et "hypothèse" /
// "à valider" pour montrer la discipline data dès le prototype.
export const CARE_TEAM_COSTS: CareTeamMember[] = [
  {
    id: "supervisor_1",
    label: "Superviseuse 1",
    role: "supervisor",
    monthlyCompanyCost: 3400,
    costType: "renseigne",
    active: true,
    capacityContribution: true,
    managementContribution: false,
    qualityContribution: false,
    note: "Coût société mensuel renseigné",
  },
  {
    id: "supervisor_2",
    label: "Superviseuse 2",
    role: "supervisor",
    monthlyCompanyCost: 3200,
    costType: "renseigne",
    active: true,
    capacityContribution: true,
    managementContribution: false,
    qualityContribution: false,
  },
  {
    id: "supervisor_3",
    label: "Superviseuse 3",
    role: "supervisor",
    monthlyCompanyCost: 3500,
    costType: "hypothese",
    active: true,
    capacityContribution: true,
    managementContribution: false,
    qualityContribution: false,
  },
  {
    id: "supervisor_4",
    label: "Superviseuse 4",
    role: "supervisor",
    monthlyCompanyCost: 3500,
    costType: "hypothese",
    active: false,
    capacityContribution: true,
    managementContribution: false,
    qualityContribution: false,
    note: "Recrutement à anticiper si capacité > 85%",
  },
  {
    id: "head_of_care",
    label: "Head of Care",
    role: "head_of_care",
    monthlyCompanyCost: 5540,
    costType: "a_valider",
    active: false,
    capacityContribution: false,
    managementContribution: true,
    qualityContribution: true,
    note: "À activer selon seuils (capacité, # superviseuses, qualité)",
  },
  {
    id: "lead_supervisor",
    label: "Lead superviseuse",
    role: "lead_supervisor",
    monthlyCompanyCost: 4200,
    costType: "a_valider",
    active: false,
    capacityContribution: true,
    managementContribution: true,
    qualityContribution: true,
  },
  {
    id: "qa_care",
    label: "QA care",
    role: "qa_care",
    monthlyCompanyCost: 3000,
    costType: "a_valider",
    active: false,
    capacityContribution: false,
    managementContribution: false,
    qualityContribution: true,
  },
];

// ---------------------------------------------------------------------------
// Scénarios point d'équilibre care — sensibilité productivité superviseur.
// ---------------------------------------------------------------------------

export interface BreakEvenScenario {
  key: string;
  label: string;
  hint: string;
  patientsPerSupervisor: number;
}

export const BREAK_EVEN_SCENARIOS: BreakEvenScenario[] = [
  {
    key: "prudent",
    label: "Prudent manuel",
    hint: "Charge soutenable sans outillage avancé.",
    patientsPerSupervisor: 30,
  },
  {
    key: "cible_v1",
    label: "Cible V1 à valider",
    hint: "Productivité avec outils, templates, messages programmés.",
    patientsPerSupervisor: 60,
  },
  {
    key: "upside_v2",
    label: "Upside V2 à mesurer",
    hint: "Avec IA assistive et automation matures.",
    patientsPerSupervisor: 90,
  },
];

// ---------------------------------------------------------------------------
// Scénarios productivité care — temps humain par patient sur toute la durée
// de suivi. Modélisation à partir de la baseline terrain V0 (mode manuel
// WhatsApp/audio) puis hypothèses de gains avec interface, IA, automation.
// ---------------------------------------------------------------------------

export type ProductivitySourceType =
  | "baseline_terrain" // donnée historique (Mélanie)
  | "hypothese" // estimation prototype à mesurer
  | "a_valider"; // upside non démontré

export const productivitySourceLabels: Record<ProductivitySourceType, string> = {
  baseline_terrain: "Baseline terrain",
  hypothese: "Hypothèse pilote",
  a_valider: "À valider",
};

export const productivitySourceStyles: Record<ProductivitySourceType, string> = {
  baseline_terrain: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  hypothese: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  a_valider: "bg-navy-900/[0.04] text-charcoal/65 ring-navy-900/[0.06]",
};

export interface ProductivityScenario {
  key: string;
  label: string;
  hint: string;
  minMinutesPerPatient: number;
  maxMinutesPerPatient: number;
  sourceType: ProductivitySourceType;
}

export const PRODUCTIVITY_SCENARIOS: ProductivityScenario[] = [
  {
    key: "manuel_historique",
    label: "Manuel historique V0",
    hint: "WhatsApp/audio, sans interface KOVELA, sans IA. Donnée terrain — 17 ans d'expérience opérationnelle (Mélanie).",
    minMinutesPerPatient: 60,
    maxMinutesPerPatient: 90,
    sourceType: "baseline_terrain",
  },
  {
    key: "v1_interface",
    label: "V1 interface outillée",
    hint: "Avec interface KOVELA, templates, messages programmés. Gain à mesurer en pilote.",
    minMinutesPerPatient: 40,
    maxMinutesPerPatient: 60,
    sourceType: "hypothese",
  },
  {
    key: "v1_ia_assistive",
    label: "V1 IA assistive",
    hint: "Interface + IA assistive sur résumés, CR, compilation. Gain à mesurer en pilote.",
    minMinutesPerPatient: 30,
    maxMinutesPerPatient: 45,
    sourceType: "hypothese",
  },
  {
    key: "v2_optimisee",
    label: "V2 optimisée",
    hint: "Automation matures et workflows optimisés. Upside à valider.",
    minMinutesPerPatient: 20,
    maxMinutesPerPatient: 30,
    sourceType: "a_valider",
  },
];
