import type {
  CRStatus,
  FollowType,
  InterestLevel,
  MandateStatus,
  OnboardingStatus,
  PatientStatus,
  PlanningStatus,
  Priority,
  ProspectStatus,
} from "./types";

export const prospectStatusLabels: Record<ProspectStatus, string> = {
  a_contacter: "À contacter",
  contacte: "Contacté",
  call_prevu: "Call prévu",
  demo_faite: "Démo faite",
  en_reflexion: "En réflexion",
  accord_verbal: "Accord verbal",
  onboarding_cabinet: "Onboarding cabinet",
  actif: "Actif",
  perdu: "Perdu / dormant",
};

export const prospectStatusStyles: Record<ProspectStatus, string> = {
  a_contacter: "bg-navy-50 text-charcoal/60 ring-navy-100",
  contacte: "bg-navy-50 text-navy-700 ring-navy-100",
  call_prevu: "bg-teal-50/60 text-navy-700 ring-teal-100",
  demo_faite: "bg-teal-50 text-teal-700 ring-teal-100",
  en_reflexion: "bg-amber-50/70 text-amber-700 ring-amber-100",
  accord_verbal: "bg-teal-50 text-teal-700 ring-teal-100",
  onboarding_cabinet: "bg-teal-100/70 text-teal-700 ring-teal-100",
  actif: "bg-navy-900 text-teal-100 ring-navy-900",
  perdu: "bg-navy-50/60 text-charcoal/45 ring-navy-100",
};

export const interestLabels: Record<InterestLevel, string> = {
  froid: "Froid",
  tiede: "Tiède",
  chaud: "Chaud",
};

export const interestStyles: Record<InterestLevel, string> = {
  froid: "bg-navy-50 text-charcoal/60 ring-navy-100",
  tiede: "bg-teal-50/60 text-navy-700 ring-teal-100",
  chaud: "bg-teal-50 text-teal-700 ring-teal-100",
};

export const priorityLabels: Record<Priority, string> = {
  basse: "Basse",
  moyenne: "Moyenne",
  haute: "Haute",
};

export const formationLabels: Record<import("./types").FormationStatus, string> = {
  a_former: "À former",
  en_cours: "Formation en cours",
  pret: "Prêt à suivre des patients",
};

export const formationStyles: Record<import("./types").FormationStatus, string> = {
  a_former: "bg-amber-50/70 text-amber-700 ring-amber-100",
  en_cours: "bg-teal-50/60 text-navy-700 ring-teal-100",
  pret: "bg-teal-50 text-teal-700 ring-teal-100",
};

export const qualityLabels: Record<import("./types").QualityStatus, string> = {
  ok: "OK",
  a_revoir: "À revoir",
};

export const qualityStyles: Record<import("./types").QualityStatus, string> = {
  ok: "bg-teal-50 text-teal-700 ring-teal-100",
  a_revoir: "bg-amber-50/70 text-amber-700 ring-amber-100",
};

export const mandateLabels: Record<MandateStatus, string> = {
  a_creer: "À créer",
  lien_envoye: "Lien envoyé",
  mandat_actif: "Mandat actif",
  prelevement_pret: "Prélèvement prêt",
};

export const mandateStyles: Record<MandateStatus, string> = {
  a_creer: "bg-navy-50 text-charcoal/60 ring-navy-100",
  lien_envoye: "bg-amber-50/70 text-amber-700 ring-amber-100",
  mandat_actif: "bg-teal-50 text-teal-700 ring-teal-100",
  prelevement_pret: "bg-teal-50 text-teal-700 ring-teal-100",
};

export const followTypeLabels: Record<FollowType, string> = {
  standard: "Standard",
  renforce: "Renforcé",
  premium: "Premium cabinet",
};

export const crStatusLabels: Record<CRStatus, string> = {
  brouillon: "Brouillon de CR à valider",
  valide: "CR validé en interne",
  disponible: "CR disponible pour le chirurgien",
};

export const crStatusStyles: Record<CRStatus, string> = {
  brouillon: "bg-amber-50/70 text-amber-700 ring-amber-100",
  valide: "bg-navy-50 text-navy-700 ring-navy-100",
  disponible: "bg-teal-50 text-teal-700 ring-teal-100",
};

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeDays(iso: string | null): string {
  if (!iso) return "—";
  const now = new Date("2026-05-27T09:00:00Z").getTime();
  const then = new Date(iso).getTime();
  const days = Math.round((now - then) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days} j`;
}

export const statusLabels: Record<PatientStatus, string> = {
  onboarding_incomplet: "Onboarding incomplet",
  actif: "Actif",
  silencieux: "Patient silencieux",
  escalade_ouverte: "Escalade ouverte",
  cr_en_attente: "CR en attente",
  cloture: "Clôturé",
};

// Couleurs opérationnelles sobres, fondées uniquement sur l'état des tâches.
export const statusStyles: Record<PatientStatus, string> = {
  onboarding_incomplet: "bg-amber-50/70 text-amber-700 ring-amber-100",
  actif: "bg-teal-50 text-teal-700 ring-teal-100",
  silencieux: "bg-navy-50 text-charcoal/60 ring-navy-100",
  escalade_ouverte: "bg-navy-900 text-teal-100 ring-navy-900",
  cr_en_attente: "bg-teal-50/60 text-navy-700 ring-teal-100",
  cloture: "bg-navy-50/60 text-charcoal/45 ring-navy-100",
};

export const onboardingLabels: Record<OnboardingStatus, string> = {
  a_envoyer: "À envoyer",
  envoye: "Lien envoyé",
  complete: "Complété",
  relance: "Relance nécessaire",
};

export const onboardingStyles: Record<OnboardingStatus, string> = {
  a_envoyer: "bg-navy-50 text-charcoal/60 ring-navy-100",
  envoye: "bg-teal-50/60 text-navy-700 ring-teal-100",
  complete: "bg-teal-50 text-teal-700 ring-teal-100",
  relance: "bg-amber-50/70 text-amber-700 ring-amber-100",
};

export const planningLabels: Record<PlanningStatus, string> = {
  importe: "Importé",
  onboarding_envoye: "Onboarding envoyé",
  actif: "Actif",
  reporte: "Reporté",
  annule: "Annulé",
};

export const planningStyles: Record<PlanningStatus, string> = {
  importe: "bg-navy-50 text-charcoal/60 ring-navy-100",
  onboarding_envoye: "bg-teal-50/60 text-navy-700 ring-teal-100",
  actif: "bg-teal-50 text-teal-700 ring-teal-100",
  reporte: "bg-amber-50/70 text-amber-700 ring-amber-100",
  annule: "bg-navy-50/60 text-charcoal/45 ring-navy-100",
};
