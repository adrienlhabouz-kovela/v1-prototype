import type { PatientStatus } from "./types";

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

// Couleurs opérationnelles sobres (jamais de codage de gravité médicale).
export const statusStyles: Record<PatientStatus, string> = {
  onboarding_incomplet: "bg-amber-50/70 text-amber-700 ring-amber-100",
  actif: "bg-teal-50 text-teal-700 ring-teal-100",
  silencieux: "bg-navy-50 text-charcoal/60 ring-navy-100",
  escalade_ouverte: "bg-navy-900 text-teal-100 ring-navy-900",
  cr_en_attente: "bg-teal-50/60 text-navy-700 ring-teal-100",
  cloture: "bg-navy-50/60 text-charcoal/45 ring-navy-100",
};
