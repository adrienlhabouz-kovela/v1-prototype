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

  // Date / version du cockpit — pour le footer data integrity.
  COCKPIT_VERSION: "Passe A+ (0.1 prototype)",
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
