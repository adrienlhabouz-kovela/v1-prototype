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

// Couleurs opérationnelles (jamais de codage de gravité médicale).
export const statusStyles: Record<PatientStatus, string> = {
  onboarding_incomplet: "bg-amber-50 text-amber-700 ring-amber-200",
  actif: "bg-teal-50 text-teal-700 ring-teal-200",
  silencieux: "bg-slate-100 text-slate-600 ring-slate-200",
  escalade_ouverte: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  cr_en_attente: "bg-sky-50 text-sky-700 ring-sky-200",
  cloture: "bg-slate-50 text-slate-500 ring-slate-200",
};
