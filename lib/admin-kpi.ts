// Calculs business agrégés pour le cockpit Admin.
// Centralise toutes les formules pour ne pas dissiper la logique dans l'UI.
// Aucune modification du store — tout est dérivé en vue pure.

import {
  ADMIN_CONSTANTS,
  BREAK_EVEN_SCENARIOS,
  CARE_TEAM_COSTS,
  PRODUCTIVITY_SCENARIOS,
  type BreakEvenScenario,
  type CareTeamMember,
  type CostType,
  type ProductivityScenario,
} from "./admin-constants";
import type {
  Patient,
  Surgeon,
  Supervisor,
  Prospect,
  ClinicalReport,
  Escalation,
} from "./types";

// ---------------------------------------------------------------------------
// Types de période & contexte
// ---------------------------------------------------------------------------

export type AdminPeriod = "today" | "7d" | "month" | "prev_month";

export const adminPeriodLabels: Record<AdminPeriod, string> = {
  today: "Aujourd'hui",
  "7d": "7 jours",
  month: "Mois en cours",
  prev_month: "Mois précédent",
};

export interface AdminState {
  patients: Patient[];
  surgeons: Surgeon[];
  supervisors: Supervisor[];
  prospects: Prospect[];
  reports: ClinicalReport[];
  escalations: Escalation[];
  reportFor: (patientId: string) => ClinicalReport | undefined;
  escalationFor: (patientId: string) => Escalation | undefined;
  pricing: { baseMonthly: number; perActivatedPatient: number };
}

// ---------------------------------------------------------------------------
// État général du cockpit
// ---------------------------------------------------------------------------

export type GeneralState = "ops_maitrisee" | "attention_charge" | "risque_capacite";

export const generalStateLabels: Record<GeneralState, string> = {
  ops_maitrisee: "Ops maîtrisée",
  attention_charge: "Attention charge",
  risque_capacite: "Risque capacité",
};

export const generalStateStyles: Record<GeneralState, string> = {
  ops_maitrisee: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  attention_charge: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  risque_capacite: "bg-amber-100/70 text-amber-900 ring-amber-400/40",
};

// ---------------------------------------------------------------------------
// Helpers de base
// ---------------------------------------------------------------------------

function isActive(p: Patient): boolean {
  return p.status !== "cloture";
}

function untreatedCount(p: Patient): number {
  return p.messages.filter((m) => m.author === "patient" && !m.treated).length;
}

// ---------------------------------------------------------------------------
// Capacité — actuelle et projetée
// ---------------------------------------------------------------------------

export interface SupervisorLoad {
  id: string;
  name: string;
  initials: string;
  patients: number;
  loadPercent: number; // ratio sur OPTIMAL
  status: "ok" | "attention" | "saturation" | "surcharge";
}

export interface CapacityActuelle {
  superviseusesActives: number;
  patientsActifs: number;
  patientsParSupMoyenne: number;
  capaciteTheoriqueTotal: number;
  capaciteUtiliseePercent: number;
  prochesSaturation: number;
  surcharge: number;
  perSupervisor: SupervisorLoad[];
}

function supervisorLoadStatus(loadPercent: number): SupervisorLoad["status"] {
  if (loadPercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_CRITIQUE) return "surcharge";
  if (loadPercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_RISQUE) return "saturation";
  if (loadPercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_ATTENTION) return "attention";
  return "ok";
}

export function getCapacityActuelle(state: AdminState): CapacityActuelle {
  const supervisors = state.supervisors;
  const activePatients = state.patients.filter(isActive);
  const opt = ADMIN_CONSTANTS.CAPACITE_SUPERVISEUR_PATIENTS_OPTIMAL;
  const capaciteTheoriqueTotal = supervisors.length * opt;

  const perSupervisor: SupervisorLoad[] = supervisors.map((s) => {
    const count = activePatients.filter((p) => p.supervisorId === s.id).length;
    const loadPercent = count / opt;
    return {
      id: s.id,
      name: s.name,
      initials: s.initials,
      patients: count,
      loadPercent,
      status: supervisorLoadStatus(loadPercent),
    };
  });

  const prochesSaturation = perSupervisor.filter(
    (s) => s.status === "saturation" || s.status === "surcharge"
  ).length;
  const surcharge = perSupervisor.filter((s) => s.status === "surcharge").length;

  return {
    superviseusesActives: supervisors.length,
    patientsActifs: activePatients.length,
    patientsParSupMoyenne:
      supervisors.length > 0
        ? Math.round((activePatients.length / supervisors.length) * 10) / 10
        : 0,
    capaciteTheoriqueTotal,
    capaciteUtiliseePercent:
      capaciteTheoriqueTotal > 0
        ? activePatients.length / capaciteTheoriqueTotal
        : 0,
    prochesSaturation,
    surcharge,
    perSupervisor,
  };
}

export interface CapacityProjection {
  jours: number;
  patientsProjetes: number;
  capaciteProjeteePercent: number;
}

export function getCapacityProjection(
  state: AdminState,
  jours: number
): CapacityProjection {
  const actuelle = getCapacityActuelle(state);
  const hebdo = ADMIN_CONSTANTS.NOUVEAUX_PATIENTS_HEBDO_HYPOTHESE;
  const nouveauxPatients = Math.round((hebdo * jours) / 7);
  const patientsProjetes = actuelle.patientsActifs + nouveauxPatients;
  const capaciteProjeteePercent =
    actuelle.capaciteTheoriqueTotal > 0
      ? patientsProjetes / actuelle.capaciteTheoriqueTotal
      : 0;
  return { jours, patientsProjetes, capaciteProjeteePercent };
}

// Date approximative de saturation — si la croissance est linéaire.
export function getSaturationEstimate(state: AdminState): {
  joursAvantSaturation: number | null;
  dateSaturation: string | null;
} {
  const actuelle = getCapacityActuelle(state);
  if (actuelle.capaciteTheoriqueTotal === 0)
    return { joursAvantSaturation: null, dateSaturation: null };
  const restePatients =
    actuelle.capaciteTheoriqueTotal * ADMIN_CONSTANTS.SEUIL_CAPACITE_RISQUE -
    actuelle.patientsActifs;
  if (restePatients <= 0) return { joursAvantSaturation: 0, dateSaturation: null };
  const hebdo = ADMIN_CONSTANTS.NOUVEAUX_PATIENTS_HEBDO_HYPOTHESE;
  if (hebdo <= 0) return { joursAvantSaturation: null, dateSaturation: null };
  const jours = Math.round((restePatients / hebdo) * 7);
  const date = new Date(Date.now() + jours * 86_400_000);
  return { joursAvantSaturation: jours, dateSaturation: date.toISOString() };
}

// ---------------------------------------------------------------------------
// Finance — MRR, ARR, marge brute estimée
// ---------------------------------------------------------------------------

export interface FinanceMetrics {
  mrrEstimated: number;
  arrEstimated: number;
  revenuAbonnement: number;
  revenuVariablePatients: number;
  revenuMoyenParChirurgien: number;
  revenuMoyenParPatient: number;
  coutSuperviseurMensuel: number;
  coutDirectPatientsMensuel: number;
  margeBruteEur: number;
  margeBrutePercent: number; // marge prototype — non représentative à faible volume
}

// Lecture normalisée à volume cible — hypothèse prototype, non donnée réelle.
// Objectif : éviter d'afficher une marge prototype trompeuse (-200% à faible
// volume) en haut de page, tout en gardant l'honnêteté du calcul prototype.
export interface NormalizedFinanceMetrics {
  chirurgiensCible: number;
  patientsParChirurgienCible: number;
  patientsTotalCible: number;
  patientsParSuperviseurCible: number;
  superviseusesCible: number;
  mrrNormalise: number;
  arrNormalise: number;
  revenuAbonnementNormalise: number;
  revenuVariableNormalise: number;
  coutSuperviseurNormalise: number;
  coutDirectNormalise: number;
  margeBruteNormaliseeEur: number;
  margeBruteNormaliseePercent: number;
}

export function getNormalizedFinanceMetrics(state: AdminState): NormalizedFinanceMetrics {
  const chirurgiensCible = ADMIN_CONSTANTS.CHIRURGIENS_NORMALIZED_TARGET;
  const patientsParChirurgienCible =
    ADMIN_CONSTANTS.PATIENTS_MOIS_PAR_CHIRURGIEN_TARGET;
  const patientsTotalCible = chirurgiensCible * patientsParChirurgienCible;
  const patientsParSuperviseurCible =
    ADMIN_CONSTANTS.PATIENTS_PAR_SUPERVISEUR_CIBLE;
  const superviseusesCible = Math.ceil(
    patientsTotalCible / patientsParSuperviseurCible
  );

  const revenuAbonnementNormalise = chirurgiensCible * state.pricing.baseMonthly;
  const revenuVariableNormalise =
    patientsTotalCible * state.pricing.perActivatedPatient;
  const mrrNormalise = revenuAbonnementNormalise + revenuVariableNormalise;
  const arrNormalise = mrrNormalise * 12;

  const coutSuperviseurNormalise =
    superviseusesCible * ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR;
  const coutDirectNormalise =
    patientsTotalCible * ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR;
  const margeBruteNormaliseeEur =
    mrrNormalise - coutSuperviseurNormalise - coutDirectNormalise;
  const margeBruteNormaliseePercent =
    mrrNormalise > 0 ? margeBruteNormaliseeEur / mrrNormalise : 0;

  return {
    chirurgiensCible,
    patientsParChirurgienCible,
    patientsTotalCible,
    patientsParSuperviseurCible,
    superviseusesCible,
    mrrNormalise,
    arrNormalise,
    revenuAbonnementNormalise,
    revenuVariableNormalise,
    coutSuperviseurNormalise,
    coutDirectNormalise,
    margeBruteNormaliseeEur,
    margeBruteNormaliseePercent,
  };
}

export function getFinanceMetrics(state: AdminState): FinanceMetrics {
  const activeSurgeons = state.surgeons.filter((s) => s.config.configured);
  const activeSurgeonsCount = activeSurgeons.length;
  const activatedThisMonth = state.patients.filter((p) => p.activatedThisMonth)
    .length;

  const revenuAbonnement = activeSurgeonsCount * state.pricing.baseMonthly;
  const revenuVariablePatients =
    activatedThisMonth * state.pricing.perActivatedPatient;
  const mrrEstimated = revenuAbonnement + revenuVariablePatients;
  const arrEstimated = mrrEstimated * 12;

  const coutSuperviseurMensuel =
    state.supervisors.length * ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR;
  const coutDirectPatientsMensuel =
    state.patients.filter(isActive).length *
    ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR;
  const margeBruteEur =
    mrrEstimated - coutSuperviseurMensuel - coutDirectPatientsMensuel;
  const margeBrutePercent = mrrEstimated > 0 ? margeBruteEur / mrrEstimated : 0;

  return {
    mrrEstimated,
    arrEstimated,
    revenuAbonnement,
    revenuVariablePatients,
    revenuMoyenParChirurgien:
      activeSurgeonsCount > 0 ? Math.round(mrrEstimated / activeSurgeonsCount) : 0,
    revenuMoyenParPatient: state.pricing.perActivatedPatient,
    coutSuperviseurMensuel,
    coutDirectPatientsMensuel,
    margeBruteEur,
    margeBrutePercent,
  };
}

// ---------------------------------------------------------------------------
// Risk & quality
// ---------------------------------------------------------------------------

export interface RiskMetrics {
  pctReferentielApplicable: number;
  patientsSansReferentiel: number;
  interventionsNonMappees: number;
  referentielsArRelire: number;
  crEnRetard: number;
  transmissionsEnAttente: number;
  patientsSansSuperviseur: number;
  scoreQualiteOpsPercent: number;
  risquesOuverts: number;
}

export function getRiskMetrics(state: AdminState): RiskMetrics {
  const activePatients = state.patients.filter(isActive);
  const totalActive = activePatients.length;

  // Référentiel applicable = surgeon.config.referentielComplete
  const patientsAvecRef = activePatients.filter((p) => {
    const surg = state.surgeons.find((s) => s.id === p.surgeonId);
    return surg?.config.referentielComplete === true;
  }).length;
  const patientsSansReferentiel = totalActive - patientsAvecRef;
  const pctReferentielApplicable =
    totalActive > 0 ? patientsAvecRef / totalActive : 0;

  const referentielsArRelire = state.surgeons.filter(
    (s) => s.config.configured && !s.config.referentielComplete
  ).length;

  // Interventions non mappées : approximation prototype — pour chaque patient
  // actif, on vérifie si son intervention est connue du référentiel chirurgien.
  const interventionsNonMappees = activePatients.filter((p) => {
    const surg = state.surgeons.find((s) => s.id === p.surgeonId);
    if (!surg) return true;
    const known = Object.keys(surg.config.interventionDurations || {});
    return !known.includes(p.intervention);
  }).length;

  const crEnRetard = state.patients.filter((p) => {
    if (p.status !== "cr_en_attente") return false;
    return true;
  }).length;

  const transmissionsEnAttente = state.escalations.filter(
    (e) => e.status === "transmise"
  ).length;

  const patientsSansSuperviseur = state.patients.filter(
    (p) => p.supervisorId === null && p.status !== "cloture"
  ).length;

  // Score qualité ops estimé — moyenne simple de 3 ratios.
  const ratios = [
    pctReferentielApplicable,
    totalActive > 0 ? 1 - crEnRetard / Math.max(1, totalActive) : 1,
    totalActive > 0
      ? 1 - patientsSansSuperviseur / Math.max(1, totalActive)
      : 1,
  ];
  const scoreQualiteOpsPercent =
    ratios.reduce((a, b) => a + b, 0) / ratios.length;

  const risquesOuverts =
    (patientsSansReferentiel > 0 ? 1 : 0) +
    (referentielsArRelire > 0 ? 1 : 0) +
    (interventionsNonMappees > 0 ? 1 : 0) +
    (crEnRetard > 0 ? 1 : 0) +
    (patientsSansSuperviseur > 0 ? 1 : 0) +
    (transmissionsEnAttente > 5 ? 1 : 0);

  return {
    pctReferentielApplicable,
    patientsSansReferentiel,
    interventionsNonMappees,
    referentielsArRelire,
    crEnRetard,
    transmissionsEnAttente,
    patientsSansSuperviseur,
    scoreQualiteOpsPercent,
    risquesOuverts,
  };
}

// ---------------------------------------------------------------------------
// Growth
// ---------------------------------------------------------------------------

export interface GrowthMetrics {
  chirurgiensContactes: number;
  callsTenus: number;
  demosFaites: number;
  chirurgiensSignes: number;
  chirurgiensActives: number;
  cabinetSigneNonActiveCount: number;
  fungelStages: { label: string; count: number }[];
  tauxDemoOnboarding: number;
}

export function getGrowthMetrics(state: AdminState): GrowthMetrics {
  const p = state.prospects;
  const chirurgiensContactes = p.filter(
    (x) => x.status !== "a_contacter"
  ).length;
  const callsTenus = p.filter((x) =>
    ["call_prevu", "demo_faite", "en_reflexion", "accord_verbal", "onboarding_cabinet", "actif"].includes(x.status)
  ).length;
  const demosFaites = p.filter((x) => x.demoDone).length;
  const chirurgiensSignes = p.filter((x) =>
    ["accord_verbal", "onboarding_cabinet", "actif"].includes(x.status)
  ).length;
  const chirurgiensActives = p.filter((x) => x.isActive).length;
  const cabinetSigneNonActiveCount = p.filter(
    (x) => x.onboardingLaunched && !x.cabinetConfigured
  ).length;

  const fungelStages = [
    { label: "Contactés", count: chirurgiensContactes },
    { label: "Calls / démos", count: demosFaites },
    { label: "Signés", count: chirurgiensSignes },
    { label: "Activés", count: chirurgiensActives },
  ];

  const tauxDemoOnboarding =
    demosFaites > 0 ? chirurgiensSignes / demosFaites : 0;

  return {
    chirurgiensContactes,
    callsTenus,
    demosFaites,
    chirurgiensSignes,
    chirurgiensActives,
    cabinetSigneNonActiveCount,
    fungelStages,
    tauxDemoOnboarding,
  };
}

// ---------------------------------------------------------------------------
// Care ops — agrège supervisor.ts via reportFor / escalationFor
// ---------------------------------------------------------------------------

export interface CareOpsMetrics {
  patientsActifs: number;
  patientsSuivisMois: number;
  dossiersATraiter: number;
  retardsOperationnels: number;
  crAPreparer: number;
  transmissionsCabinet: number;
  enAttenteCabinet: number;
  patientsSilencieux: number;
  cloturesAPreparer: number;
}

export function getCareOpsMetrics(state: AdminState): CareOpsMetrics {
  const active = state.patients.filter(isActive);
  const patientsSuivisMois = state.patients.filter((p) => p.activatedThisMonth).length;

  const dossiersATraiter = active.filter((p) => untreatedCount(p) > 0).length;
  const retardsOperationnels = active.filter(
    (p) => untreatedCount(p) > 0 || p.status === "cr_en_attente"
  ).length;

  const crAPreparer = state.patients.filter((p) => {
    const r = state.reportFor(p.id);
    return (
      p.status === "cr_en_attente" ||
      r?.status === "brouillon" ||
      r?.status === "valide"
    );
  }).length;

  const transmissionsCabinet = state.patients.filter(
    (p) => p.compilationDraft && state.escalationFor(p.id)?.status !== "transmise"
  ).length;
  const enAttenteCabinet = state.escalations.filter(
    (e) => e.status === "transmise"
  ).length;
  const patientsSilencieux = active.filter((p) => p.status === "silencieux").length;

  // Clôtures à préparer : patient sans CR final dont la date d'intervention est
  // ancienne (proxy : status !== cloture mais lastMessage > 20j).
  const cloturesAPreparer = active.filter((p) => {
    const days = p.lastMessageAt
      ? (Date.now() - new Date(p.lastMessageAt).getTime()) / 86_400_000
      : 0;
    return days > 20 && !state.reportFor(p.id);
  }).length;

  return {
    patientsActifs: active.length,
    patientsSuivisMois,
    dossiersATraiter,
    retardsOperationnels,
    crAPreparer,
    transmissionsCabinet,
    enAttenteCabinet,
    patientsSilencieux,
    cloturesAPreparer,
  };
}

// ---------------------------------------------------------------------------
// Décisions à prendre — vue dérivée des autres KPI
// ---------------------------------------------------------------------------

export type DecisionSeverity = "high" | "medium" | "info";

export interface Decision {
  key: string;
  label: string;
  consequence: string;
  action: string;
  severity: DecisionSeverity;
  link?: string;
  linkLabel?: string;
}

export const decisionSeverityStyles: Record<DecisionSeverity, string> = {
  high: "bg-amber-100/70 text-amber-900 ring-amber-400/40",
  medium: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  info: "bg-navy-900/[0.04] text-charcoal/70 ring-navy-900/[0.06]",
};

export const decisionSeverityLabels: Record<DecisionSeverity, string> = {
  high: "Prioritaire",
  medium: "À surveiller",
  info: "Info",
};

export function getDecisions(state: AdminState): Decision[] {
  const decisions: Decision[] = [];
  const cap = getCapacityActuelle(state);
  const proj14 = getCapacityProjection(state, 14);
  const risk = getRiskMetrics(state);
  const care = getCareOpsMetrics(state);
  const growth = getGrowthMetrics(state);
  const hoc = getHeadOfCareStatus(state);

  // 1. Capacité actuelle critique
  if (cap.surcharge > 0) {
    decisions.push({
      key: "supervisor_surcharge",
      label: `${cap.surcharge} superviseuse(s) en surcharge (> 90%)`,
      consequence: "Risque de qualité de suivi et de saturation immédiate.",
      action: "Activer back-up et recruter une superviseuse.",
      severity: "high",
      link: "/admin/supervision",
      linkLabel: "Voir supervision",
    });
  } else if (cap.prochesSaturation > 0) {
    decisions.push({
      key: "supervisor_saturation",
      label: `${cap.prochesSaturation} superviseuse(s) proche(s) de saturation (> 85%)`,
      consequence: "Risque de surcharge à court terme.",
      action: "Surveiller la charge et pré-sourcer une superviseuse.",
      severity: "medium",
      link: "/admin/supervision",
      linkLabel: "Voir supervision",
    });
  }

  // 2. Capacité projetée 14j
  if (proj14.capaciteProjeteePercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_RISQUE) {
    decisions.push({
      key: "projected_capacity_14d",
      label: `Capacité projetée à 14j : ${Math.round(
        proj14.capaciteProjeteePercent * 100
      )}%`,
      consequence: "Saturation probable dans les 2 semaines.",
      action: "Pré-sourcer une superviseuse maintenant.",
      severity: "high",
    });
  }

  // 3. Head of Care
  if (hoc.recommendation === "oui" || hoc.recommendation === "a_anticiper") {
    decisions.push({
      key: "head_of_care",
      label:
        hoc.recommendation === "oui"
          ? "Head of Care recommandé"
          : "Head of Care à anticiper",
      consequence: hoc.reasons.join(" · "),
      action:
        hoc.recommendation === "oui"
          ? "Ouvrir un poste Head of Care."
          : "Anticiper recrutement Lead / Head of Care dans les 60 jours.",
      severity: hoc.recommendation === "oui" ? "high" : "medium",
    });
  }

  // 4. CR à préparer / finaliser
  if (care.crAPreparer >= 3) {
    decisions.push({
      key: "cr_to_prepare",
      label: `${care.crAPreparer} CR à préparer ou finaliser`,
      consequence: "Risque de retard côté chirurgien.",
      action: "Réorienter superviseuses sur les CR en cours.",
      severity: "medium",
      link: "/admin/supervision",
      linkLabel: "Voir supervision",
    });
  }

  // 5. Référentiels à relire
  if (risk.referentielsArRelire > 0) {
    decisions.push({
      key: "referentiels_to_review",
      label: `${risk.referentielsArRelire} référentiel(s) chirurgien à relire`,
      consequence: "Suivis sans cadre complet — qualité opérationnelle dégradée.",
      action: "Planifier sessions de relecture avec les chirurgiens.",
      severity: "medium",
    });
  }

  // 6. Patients sans référentiel
  if (risk.patientsSansReferentiel > 0) {
    decisions.push({
      key: "patients_no_referentiel",
      label: `${risk.patientsSansReferentiel} patient(s) sans référentiel applicable`,
      consequence: "Suivis opérés sans cadre formalisé du chirurgien.",
      action: "Compléter les référentiels manquants.",
      severity: "medium",
    });
  }

  // 7. Cabinet signé non activé
  if (growth.cabinetSigneNonActiveCount > 0) {
    decisions.push({
      key: "signed_not_activated",
      label: `${growth.cabinetSigneNonActiveCount} cabinet(s) signé(s) non activé(s)`,
      consequence: "Revenu différé — risque de désengagement chirurgien.",
      action: "Relancer activation cabinet (onboarding + référentiel).",
      severity: "medium",
      link: "/admin/crm",
      linkLabel: "Voir CRM",
    });
  }

  // 8. Patients sans superviseur
  if (risk.patientsSansSuperviseur > 0) {
    decisions.push({
      key: "patients_no_supervisor",
      label: `${risk.patientsSansSuperviseur} patient(s) sans superviseuse`,
      consequence: "Suivi sans coordinateur identifié.",
      action: "Attribuer une superviseuse.",
      severity: "high",
      link: "/admin/supervision",
      linkLabel: "Attribuer",
    });
  }

  // Tri par sévérité
  const rank: Record<DecisionSeverity, number> = { high: 0, medium: 1, info: 2 };
  decisions.sort((a, b) => rank[a.severity] - rank[b.severity]);
  return decisions;
}

// ---------------------------------------------------------------------------
// Head of Care recommendation
// ---------------------------------------------------------------------------

export type HeadOfCareRecommendation = "non" | "lead_part_time" | "a_anticiper" | "oui";

export const headOfCareLabels: Record<HeadOfCareRecommendation, string> = {
  non: "Non requis",
  lead_part_time: "Lead superviseuse part-time suffisante",
  a_anticiper: "Head of Care à anticiper",
  oui: "Head of Care recommandé",
};

export const headOfCareStyles: Record<HeadOfCareRecommendation, string> = {
  non: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  lead_part_time: "bg-teal-50/60 text-teal-700 ring-teal-100/70",
  a_anticiper: "bg-amber-50/50 text-amber-800 ring-amber-200/50",
  oui: "bg-amber-100/70 text-amber-900 ring-amber-400/40",
};

export interface HeadOfCareAssessment {
  recommendation: HeadOfCareRecommendation;
  reasons: string[];
}

export function getHeadOfCareStatus(state: AdminState): HeadOfCareAssessment {
  const cap = getCapacityActuelle(state);
  const risk = getRiskMetrics(state);
  const reasons: string[] = [];
  let score = 0;

  const nbSup = state.supervisors.length;

  if (nbSup >= ADMIN_CONSTANTS.SEUIL_HEAD_OF_CARE_NB) {
    score += 2;
    reasons.push(`${nbSup} superviseuses actives`);
  } else if (nbSup >= ADMIN_CONSTANTS.SEUIL_LEAD_SUPERVISEUSE_NB) {
    score += 1;
    reasons.push(`${nbSup} superviseuses actives`);
  }

  if (cap.capaciteUtiliseePercent >= ADMIN_CONSTANTS.SEUIL_HEAD_OF_CARE_CAPACITE) {
    score += 2;
    reasons.push(`capacité ${Math.round(cap.capaciteUtiliseePercent * 100)}%`);
  } else if (cap.capaciteUtiliseePercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_ATTENTION) {
    score += 1;
    reasons.push(`capacité ${Math.round(cap.capaciteUtiliseePercent * 100)}%`);
  }

  if (risk.referentielsArRelire >= 3) {
    score += 1;
    reasons.push(`${risk.referentielsArRelire} référentiels à relire`);
  }
  if (risk.crEnRetard >= 3) {
    score += 1;
    reasons.push(`${risk.crEnRetard} CR en retard`);
  }
  if (risk.scoreQualiteOpsPercent < ADMIN_CONSTANTS.SEUIL_QUALITE_OPS_MIN) {
    score += 1;
    reasons.push(
      `qualité ops ${Math.round(risk.scoreQualiteOpsPercent * 100)}%`
    );
  }

  let recommendation: HeadOfCareRecommendation;
  if (score >= 4) recommendation = "oui";
  else if (score >= 2) recommendation = "a_anticiper";
  else if (nbSup >= ADMIN_CONSTANTS.SEUIL_LEAD_SUPERVISEUSE_NB)
    recommendation = "lead_part_time";
  else recommendation = "non";

  return { recommendation, reasons };
}

// ---------------------------------------------------------------------------
// Executive KPIs (8 max) — agrège tout
// ---------------------------------------------------------------------------

export interface ExecutiveKPIs {
  chirurgiensActifs: number;
  patientsSuivisMois: number;
  patientsActifsAujourdhui: number;
  mrrEstimated: number;
  arrEstimated: number;
  // Marge prototype actuelle — non représentative à faible volume.
  margeBrutePrototypePercent: number;
  // Marge normalisée à volume cible — affichée dans les KPI executive
  // pour éviter qu'un investisseur lise un -200% trompeur en haut de page.
  margeBruteNormaliseePercent: number;
  capaciteUtiliseePercent: number;
  decisionsCount: number;
}

export function getExecutiveKPIs(state: AdminState): ExecutiveKPIs {
  const cap = getCapacityActuelle(state);
  const fin = getFinanceMetrics(state);
  const norm = getNormalizedFinanceMetrics(state);
  const care = getCareOpsMetrics(state);
  const decisions = getDecisions(state);
  const chirurgiensActifs = state.surgeons.filter((s) => s.config.configured).length;

  return {
    chirurgiensActifs,
    patientsSuivisMois: care.patientsSuivisMois,
    patientsActifsAujourdhui: cap.patientsActifs,
    mrrEstimated: fin.mrrEstimated,
    arrEstimated: fin.arrEstimated,
    margeBrutePrototypePercent: fin.margeBrutePercent,
    margeBruteNormaliseePercent: norm.margeBruteNormaliseePercent,
    capaciteUtiliseePercent: cap.capaciteUtiliseePercent,
    decisionsCount: decisions.filter(
      (d) => d.severity === "high" || d.severity === "medium"
    ).length,
  };
}

// ---------------------------------------------------------------------------
// État général dérivé
// ---------------------------------------------------------------------------

export function getGeneralState(state: AdminState): GeneralState {
  const cap = getCapacityActuelle(state);
  const risk = getRiskMetrics(state);
  const proj14 = getCapacityProjection(state, 14);

  if (
    cap.capaciteUtiliseePercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_RISQUE ||
    proj14.capaciteProjeteePercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_RISQUE ||
    cap.surcharge > 0
  ) {
    return "risque_capacite";
  }
  if (
    cap.capaciteUtiliseePercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_ATTENTION ||
    risk.risquesOuverts >= 3 ||
    risk.crEnRetard >= 3
  ) {
    return "attention_charge";
  }
  return "ops_maitrisee";
}

// ---------------------------------------------------------------------------
// Executive summary phrase
// ---------------------------------------------------------------------------

export function getExecutiveSummary(state: AdminState): string {
  const kpi = getExecutiveKPIs(state);
  const proj14 = getCapacityProjection(state, 14);
  const capPct = Math.round(kpi.capaciteUtiliseePercent * 100);
  const margeNormPct = Math.round(kpi.margeBruteNormaliseePercent * 100);
  const projPct = Math.round(proj14.capaciteProjeteePercent * 100);

  return (
    `Mois en cours : ${kpi.chirurgiensActifs} chirurgiens actifs, ` +
    `${kpi.patientsSuivisMois} patients suivis, ` +
    `${kpi.mrrEstimated} € MRR estimé, ` +
    `marge normalisée à volume cible ${margeNormPct}%, ` +
    `capacité superviseurs utilisée à ${capPct}%, ` +
    `capacité projetée à 14 jours ${projPct}%, ` +
    `${kpi.decisionsCount} décisions à prendre.`
  );
}

// ---------------------------------------------------------------------------
// Équipe care — coûts par poste
// ---------------------------------------------------------------------------

export interface CareStaffCosts {
  members: CareTeamMember[];
  membersActive: CareTeamMember[];
  totalActiveMonthlyCost: number;
  countByCostType: Record<CostType, number>;
  byRoleActive: {
    supervisor: number;
    lead_supervisor: number;
    head_of_care: number;
    qa_care: number;
    care_coordinator: number;
    ops_manager: number;
    custom: number;
  };
  averageSupervisorCost: number;
}

export function getCareStaffCosts(): CareStaffCosts {
  const members = CARE_TEAM_COSTS;
  const membersActive = members.filter((m) => m.active);

  const totalActiveMonthlyCost = membersActive.reduce(
    (acc, m) => acc + m.monthlyCompanyCost,
    0
  );

  const countByCostType: Record<CostType, number> = {
    renseigne: 0,
    hypothese: 0,
    a_valider: 0,
  };
  members.forEach((m) => {
    countByCostType[m.costType] += 1;
  });

  const supervisorsActive = membersActive.filter(
    (m) => m.role === "supervisor"
  );
  const averageSupervisorCost =
    supervisorsActive.length > 0
      ? supervisorsActive.reduce((acc, m) => acc + m.monthlyCompanyCost, 0) /
        supervisorsActive.length
      : 0;

  const byRoleActive = {
    supervisor: membersActive.filter((m) => m.role === "supervisor").length,
    lead_supervisor: membersActive.filter((m) => m.role === "lead_supervisor")
      .length,
    head_of_care: membersActive.filter((m) => m.role === "head_of_care")
      .length,
    qa_care: membersActive.filter((m) => m.role === "qa_care").length,
    care_coordinator: membersActive.filter(
      (m) => m.role === "care_coordinator"
    ).length,
    ops_manager: membersActive.filter((m) => m.role === "ops_manager").length,
    custom: membersActive.filter((m) => m.role === "custom").length,
  };

  return {
    members,
    membersActive,
    totalActiveMonthlyCost,
    countByCostType,
    byRoleActive,
    averageSupervisorCost,
  };
}

// ---------------------------------------------------------------------------
// Coûts care totaux & marge care simulée
// ---------------------------------------------------------------------------

export interface CareCosts {
  staffCost: number;
  directPatientCost: number;
  toolsCost: number;
  messagingCost: number;
  totalCost: number;
  // Détail
  patientCount: number;
}

export function getCareCostsActuels(state: AdminState): CareCosts {
  const staff = getCareStaffCosts();
  const activePatients = state.patients.filter((p) => p.status !== "cloture")
    .length;
  return {
    staffCost: staff.totalActiveMonthlyCost,
    directPatientCost: activePatients * ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR,
    toolsCost: activePatients * ADMIN_CONSTANTS.COUT_OUTILS_CARE_PAR_PATIENT_EUR,
    messagingCost:
      activePatients * ADMIN_CONSTANTS.COUT_MESSAGERIE_PATIENT_EUR,
    totalCost:
      staff.totalActiveMonthlyCost +
      activePatients *
        (ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR +
          ADMIN_CONSTANTS.COUT_OUTILS_CARE_PAR_PATIENT_EUR +
          ADMIN_CONSTANTS.COUT_MESSAGERIE_PATIENT_EUR),
    patientCount: activePatients,
  };
}

export interface CareMargin {
  revenuCare: number;
  coutCareTotal: number;
  margeCareEur: number;
  margeCarePercent: number;
  margePatientEur: number; // marge care par patient
}

export function getCareMarginActuelle(state: AdminState): CareMargin {
  const fin = getFinanceMetrics(state);
  const costs = getCareCostsActuels(state);
  const revenuCare = fin.mrrEstimated;
  const margeCareEur = revenuCare - costs.totalCost;
  return {
    revenuCare,
    coutCareTotal: costs.totalCost,
    margeCareEur,
    margeCarePercent: revenuCare > 0 ? margeCareEur / revenuCare : 0,
    margePatientEur:
      costs.patientCount > 0 ? margeCareEur / costs.patientCount : 0,
  };
}

// ---------------------------------------------------------------------------
// Point d'équilibre care — sensibilité productivité superviseur
// ---------------------------------------------------------------------------

export interface BreakEvenResult {
  scenario: BreakEvenScenario;
  patientsTotal: number;
  superviseursRequis: number;
  coutSuperviseurs: number;
  coutDirectPatients: number;
  coutOutils: number;
  coutMessagerie: number;
  coutCareTotal: number;
  revenuTotal: number;
  margeCareEur: number;
  margeCarePercent: number;
}

export function getBreakEvenScenarios(state: AdminState): BreakEvenResult[] {
  const norm = getNormalizedFinanceMetrics(state);
  const patientsTotal = norm.patientsTotalCible;
  const revenuTotal = norm.mrrNormalise;

  return BREAK_EVEN_SCENARIOS.map((s) => {
    const supRequis = Math.ceil(patientsTotal / s.patientsPerSupervisor);
    const coutSup = supRequis * ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR;
    const coutDirect =
      patientsTotal * ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR;
    const coutOutils =
      patientsTotal * ADMIN_CONSTANTS.COUT_OUTILS_CARE_PAR_PATIENT_EUR;
    const coutMessagerie =
      patientsTotal * ADMIN_CONSTANTS.COUT_MESSAGERIE_PATIENT_EUR;
    const coutCareTotal = coutSup + coutDirect + coutOutils + coutMessagerie;
    const margeCareEur = revenuTotal - coutCareTotal;
    return {
      scenario: s,
      patientsTotal,
      superviseursRequis: supRequis,
      coutSuperviseurs: coutSup,
      coutDirectPatients: coutDirect,
      coutOutils,
      coutMessagerie,
      coutCareTotal,
      revenuTotal,
      margeCareEur,
      margeCarePercent: revenuTotal > 0 ? margeCareEur / revenuTotal : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Productivité superviseur — dérivée des données existantes
// ---------------------------------------------------------------------------

export interface ProductivityMetrics {
  // Par superviseuse
  patientsParSuperviseuseMoyenne: number;
  patientsSuivisParSupMoisMoyenne: number;
  messagesTraitesParSupMoyenne: number;
  crPreparesParSupMoyenne: number;
  transmissionsParSupMoyenne: number;
  // Capacités
  capaciteActuellePatients: number; // patients actifs / sup
  capaciteCiblePatients: number; // hypothèse cible V1
  // Métriques temps — à mesurer en pilote
  tempsMoyenParPatient: null;
  tempsMoyenParCR: null;
  tempsMoyenParTransmission: null;
  patientsSimples: null;
  patientsLourds: null;
}

export function getProductivityMetrics(state: AdminState): ProductivityMetrics {
  const supCount = state.supervisors.length;
  const activePatients = state.patients.filter(
    (p) => p.status !== "cloture"
  );
  const patientsParSup =
    supCount > 0 ? activePatients.length / supCount : 0;

  const patientsSuivisMois = state.patients.filter(
    (p) => p.activatedThisMonth
  ).length;
  const patientsSuivisParSupMois =
    supCount > 0 ? patientsSuivisMois / supCount : 0;

  const messagesTraitesTotal = activePatients.reduce(
    (acc, p) => acc + p.messages.filter((m) => m.treated).length,
    0
  );
  const messagesTraitesParSup =
    supCount > 0 ? messagesTraitesTotal / supCount : 0;

  const crPrepares = state.reports.length;
  const crPreparesParSup = supCount > 0 ? crPrepares / supCount : 0;

  const transmissions = state.escalations.filter(
    (e) => e.status === "transmise"
  ).length;
  const transmissionsParSup = supCount > 0 ? transmissions / supCount : 0;

  return {
    patientsParSuperviseuseMoyenne: Math.round(patientsParSup * 10) / 10,
    patientsSuivisParSupMoisMoyenne: Math.round(patientsSuivisParSupMois * 10) / 10,
    messagesTraitesParSupMoyenne: Math.round(messagesTraitesParSup * 10) / 10,
    crPreparesParSupMoyenne: Math.round(crPreparesParSup * 10) / 10,
    transmissionsParSupMoyenne: Math.round(transmissionsParSup * 10) / 10,
    capaciteActuellePatients: ADMIN_CONSTANTS.CAPACITE_SUPERVISEUR_PATIENTS_OPTIMAL,
    capaciteCiblePatients: ADMIN_CONSTANTS.PATIENTS_PAR_SUPERVISEUR_CIBLE,
    tempsMoyenParPatient: null,
    tempsMoyenParCR: null,
    tempsMoyenParTransmission: null,
    patientsSimples: null,
    patientsLourds: null,
  };
}

// ---------------------------------------------------------------------------
// Gains IA & automation — dérivés des aiLogs si disponibles
// ---------------------------------------------------------------------------

export interface AIGainsMetrics {
  // Mesuré sur aiLogs prototype
  propositionsTotal: number;
  acceptees: number;
  modifiees: number;
  refusees: number;
  tauxValidationHumaine: number; // (accepted + modified) / total
  // À mesurer en pilote
  tempsMoyenCRsansIA: null;
  tempsMoyenCRavecIA: null;
  minutesEconomiseesParCR: null;
  minutesEconomiseesParPatient: null;
  // Compteurs prototype
  messagesProgrammes: number; // hypothèse — pas de store dédié
  templatesUtilises: number; // hypothèse
}

export interface AILogLike {
  decision: "propose" | "accepte" | "modifie" | "refuse";
  patientId?: string;
}

export function getAIGainsMetrics(aiLogs: AILogLike[]): AIGainsMetrics {
  const propositionsTotal = aiLogs.filter((l) => l.decision === "propose").length;
  const acceptees = aiLogs.filter((l) => l.decision === "accepte").length;
  const modifiees = aiLogs.filter((l) => l.decision === "modifie").length;
  const refusees = aiLogs.filter((l) => l.decision === "refuse").length;
  const totalDecisions = acceptees + modifiees + refusees;
  const tauxValidationHumaine =
    totalDecisions > 0 ? (acceptees + modifiees) / totalDecisions : 0;

  return {
    propositionsTotal,
    acceptees,
    modifiees,
    refusees,
    tauxValidationHumaine,
    tempsMoyenCRsansIA: null,
    tempsMoyenCRavecIA: null,
    minutesEconomiseesParCR: null,
    minutesEconomiseesParPatient: null,
    messagesProgrammes: 0,
    templatesUtilises: 0,
  };
}

// ---------------------------------------------------------------------------
// Capacité dérivée du temps humain par patient
// Baseline terrain : 60–90 min/patient (mode manuel WhatsApp/audio).
// Capacité ≈ (heures productives × 60) / minutes par patient.
// ---------------------------------------------------------------------------

export function patientsParSupParMois(minutesPerPatient: number): number {
  if (minutesPerPatient <= 0) return 0;
  return Math.round(
    (ADMIN_CONSTANTS.SUPERVISOR_PRODUCTIVE_HOURS_PER_MONTH * 60) /
      minutesPerPatient
  );
}

export interface TimeScenarioMetrics {
  scenario: ProductivityScenario;
  // Capacité dérivée — range haut/bas selon min/max minutes par patient.
  // Note : MIN minutes → MAX patients, et vice versa.
  capaciteMin: number; // au temps haut (le plus lent)
  capaciteMax: number; // au temps bas (le plus rapide)
  // Calcul break-even à volume cible normalisé.
  patientsTotal: number;
  superviseursRequisMin: number; // au temps bas (peu de sup)
  superviseursRequisMax: number; // au temps haut (beaucoup de sup)
  coutSuperviseursMin: number;
  coutSuperviseursMax: number;
  coutCareTotalMin: number;
  coutCareTotalMax: number;
  revenuTotal: number;
  margeCareMinEur: number; // marge la plus basse (au plus lent)
  margeCareMaxEur: number; // marge la plus haute (au plus rapide)
  margeCareMinPercent: number;
  margeCareMaxPercent: number;
}

export function getTimeScenarioMetrics(state: AdminState): TimeScenarioMetrics[] {
  const norm = getNormalizedFinanceMetrics(state);
  const patientsTotal = norm.patientsTotalCible;
  const revenuTotal = norm.mrrNormalise;

  return PRODUCTIVITY_SCENARIOS.map((s) => {
    const capaciteMin = patientsParSupParMois(s.maxMinutesPerPatient);
    const capaciteMax = patientsParSupParMois(s.minMinutesPerPatient);

    const superviseursRequisMax = Math.ceil(patientsTotal / Math.max(1, capaciteMin));
    const superviseursRequisMin = Math.ceil(patientsTotal / Math.max(1, capaciteMax));

    const coutSuperviseursMax =
      superviseursRequisMax * ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR;
    const coutSuperviseursMin =
      superviseursRequisMin * ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR;

    const coutPatientFixes =
      patientsTotal *
      (ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR +
        ADMIN_CONSTANTS.COUT_OUTILS_CARE_PAR_PATIENT_EUR +
        ADMIN_CONSTANTS.COUT_MESSAGERIE_PATIENT_EUR);

    const coutCareTotalMax = coutSuperviseursMax + coutPatientFixes;
    const coutCareTotalMin = coutSuperviseursMin + coutPatientFixes;

    const margeCareMinEur = revenuTotal - coutCareTotalMax;
    const margeCareMaxEur = revenuTotal - coutCareTotalMin;

    return {
      scenario: s,
      capaciteMin,
      capaciteMax,
      patientsTotal,
      superviseursRequisMin,
      superviseursRequisMax,
      coutSuperviseursMin,
      coutSuperviseursMax,
      coutCareTotalMin,
      coutCareTotalMax,
      revenuTotal,
      margeCareMinEur,
      margeCareMaxEur,
      margeCareMinPercent: revenuTotal > 0 ? margeCareMinEur / revenuTotal : 0,
      margeCareMaxPercent: revenuTotal > 0 ? margeCareMaxEur / revenuTotal : 0,
    };
  });
}

// ---------------------------------------------------------------------------
// Simulation scale — vue séparée à volume mature (45 chirurgiens × 25
// patients/mois). Permet de visualiser le potentiel économique à grande
// échelle SANS modifier les KPI executive ni faire croire que ce volume
// est déjà atteint. Réutilise les scénarios de productivité (temps humain
// par patient) comme lecture canonique.
// ---------------------------------------------------------------------------

export interface ScaleScenarioResult {
  scenario: ProductivityScenario;
  capaciteMin: number;
  capaciteMax: number;
  superviseursRequisMin: number;
  superviseursRequisMax: number;
  coutSuperviseursMin: number;
  coutSuperviseursMax: number;
  coutCareTotalMin: number;
  coutCareTotalMax: number;
  margeCareMinEur: number;
  margeCareMaxEur: number;
  margeCareMinPercent: number;
  margeCareMaxPercent: number;
}

export interface ScaleSimulation {
  chirurgiens: number;
  patientsParChirurgien: number;
  patientsTotal: number;
  revenuAbonnement: number;
  revenuVariable: number;
  mrr: number;
  arr: number;
  coutPatientFixes: number;
  scenarios: ScaleScenarioResult[];
}

export function getScaleSimulation(state: AdminState): ScaleSimulation {
  const chirurgiens = ADMIN_CONSTANTS.CHIRURGIENS_SCALE_TARGET;
  const patientsParChirurgien = ADMIN_CONSTANTS.PATIENTS_MOIS_PAR_CHIRURGIEN_SCALE;
  const patientsTotal = chirurgiens * patientsParChirurgien;

  const revenuAbonnement = chirurgiens * state.pricing.baseMonthly;
  const revenuVariable = patientsTotal * state.pricing.perActivatedPatient;
  const mrr = revenuAbonnement + revenuVariable;
  const arr = mrr * 12;

  const coutPatientFixes =
    patientsTotal *
    (ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR +
      ADMIN_CONSTANTS.COUT_OUTILS_CARE_PAR_PATIENT_EUR +
      ADMIN_CONSTANTS.COUT_MESSAGERIE_PATIENT_EUR);

  const scenarios: ScaleScenarioResult[] = PRODUCTIVITY_SCENARIOS.map((s) => {
    const capaciteMin = patientsParSupParMois(s.maxMinutesPerPatient);
    const capaciteMax = patientsParSupParMois(s.minMinutesPerPatient);

    const superviseursRequisMax = Math.ceil(
      patientsTotal / Math.max(1, capaciteMin)
    );
    const superviseursRequisMin = Math.ceil(
      patientsTotal / Math.max(1, capaciteMax)
    );

    const coutSuperviseursMax =
      superviseursRequisMax * ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR;
    const coutSuperviseursMin =
      superviseursRequisMin * ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR;

    const coutCareTotalMax = coutSuperviseursMax + coutPatientFixes;
    const coutCareTotalMin = coutSuperviseursMin + coutPatientFixes;

    const margeCareMinEur = mrr - coutCareTotalMax;
    const margeCareMaxEur = mrr - coutCareTotalMin;

    return {
      scenario: s,
      capaciteMin,
      capaciteMax,
      superviseursRequisMin,
      superviseursRequisMax,
      coutSuperviseursMin,
      coutSuperviseursMax,
      coutCareTotalMin,
      coutCareTotalMax,
      margeCareMinEur,
      margeCareMaxEur,
      margeCareMinPercent: mrr > 0 ? margeCareMinEur / mrr : 0,
      margeCareMaxPercent: mrr > 0 ? margeCareMaxEur / mrr : 0,
    };
  });

  return {
    chirurgiens,
    patientsParChirurgien,
    patientsTotal,
    revenuAbonnement,
    revenuVariable,
    mrr,
    arr,
    coutPatientFixes,
    scenarios,
  };
}
