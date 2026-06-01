// KOVELA — couche IA assistive SIMULÉE.
// Aucun appel API réel. Les sorties IA restent limitées à l'organisation,
// la documentation, la synthèse et la reformulation. Elles ne qualifient pas
// l'état du patient et ne prennent aucune décision.
// L'IA est assistive, interne, loggée, human-in-the-loop.
// Doctrine : KOVELA ne décide pas médicalement. Elle structure, trace,
// priorise opérationnellement et escalade.

import type { Message, Patient } from "./types";

export const PROMPT_VERSION = "v1.2";

export const AI_DISCLAIMER = "Suggestion IA — à valider par un humain";

// Temps estimé gagné par fonction IA (estimation prototype).
// Sert à montrer la valeur opérationnelle de l'IA assistive, jamais à scorer.
export function aiEstimatedMinutes(fn: import("./types").AiFunction): number {
  if (fn === "resume_conversation") return 1.5;
  if (fn === "preparation_cr") return 7;
  if (fn === "reformulation") return 0.75;
  if (fn === "compilation_escalade") return 6;
  return 0;
}

export function formatMinutes(m: number): string {
  if (m < 1) return `~${Math.round(m * 60)} sec`;
  if (m < 60) return `~${m % 1 === 0 ? m : m.toFixed(1)} min`;
  const h = Math.floor(m / 60);
  const rem = Math.round(m % 60);
  return rem ? `~${h} h ${rem} min` : `~${h} h`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function authorLabel(a: Message["author"]): string {
  if (a === "patient") return "Patient";
  if (a === "superviseur") return "Superviseur";
  return "Système";
}

// 1. Résumé conversation — résumé opérationnel des échanges (non médical).
export function aiSummarize(patient: Patient): string {
  const total = patient.messages.length;
  const fromPatient = patient.messages.filter((m) => m.author === "patient").length;
  const relances = patient.messages.filter(
    (m) => m.author === "superviseur" || m.author === "systeme"
  ).length;
  const attachments = patient.messages.flatMap((m) => m.attachments ?? []);
  const photos = attachments.filter((a) => a.kind === "photo").length;
  const audios = attachments.filter((a) => a.kind === "audio").length;
  const recent = patient.messages.slice(-3);

  return [
    `Résumé opérationnel des échanges — ${patient.name}`,
    "",
    `• ${total} message(s) au total, dont ${fromPatient} émis par le patient.`,
    `• Protocole de suivi : ${patient.protocol}.`,
    "",
    "Derniers échanges :",
    ...(recent.length
      ? recent.map((m) => `— ${fmtDate(m.at)} [${authorLabel(m.author)}] : ${m.text}`)
      : ["— Aucun échange enregistré."]),
    "",
    "Actions déjà réalisées :",
    `— ${relances} message(s) de coordination / relance émis côté KOVELA.`,
    "— Échanges classés opérationnellement.",
    "",
    "Pièces jointes disponibles :",
    `— ${photos} photo(s) jointe(s), ${audios} audio(s) joint(s) (placeholders).`,
    "",
    "Note : résumé opérationnel factuel. KOVELA n'interprète pas les échanges et ne",
    "formule aucun avis médical. Transmission au chirurgien selon décision humaine.",
  ].join("\n");
}

// 2. Préparation CR — brouillon de CR factuel à valider.
export function aiPrepareReport(patient: Patient): string {
  const patientMsgs = patient.messages.filter((m) => m.author === "patient");
  const relances = patient.messages.filter(
    (m) => m.author === "superviseur" || m.author === "systeme"
  ).length;
  const hasEscalade = patient.status === "escalade_ouverte";
  return [
    "Brouillon IA — à relire, corriger si besoin, puis valider (KOVELA)",
    "",
    `Patient : ${patient.name}`,
    `Période : suivi structuré — protocole ${patient.protocol}`,
    `Intervention déclarée : ${patient.intervention}`,
    "",
    "Messages principaux :",
    ...(patientMsgs.length
      ? patientMsgs.slice(0, 3).map((m) => `— ${fmtDate(m.at)} : ${m.text}`)
      : ["— Aucun message patient sur la période."]),
    "",
    "Relances :",
    `— ${relances} relance(s) / message(s) de coordination effectué(s).`,
    "",
    "Actions KOVELA :",
    "— Réception et classement opérationnel des messages.",
    "— Continuité post-opératoire assurée.",
    "",
    `Escalade : ${hasEscalade ? "compilation factuelle en cours de préparation." : "aucune escalade ouverte sur la période."}`,
    "Statut final : à relire, corriger si besoin, puis valider par la superviseuse KOVELA.",
    "",
    "⚠ Brouillon IA à relire et valider avant mise à disposition chirurgien — synthèse opérationnelle non médicale.",
  ].join("\n");
}

// 3. Reformulation non médicale — clarté et professionnalisme uniquement.
export function aiReformulate(draft: string): string {
  const cleaned = draft.trim() || "Bonjour, nous revenons vers vous concernant votre suivi.";
  return [
    "Proposition de reformulation (forme, non médicale) :",
    "",
    `Bonjour,`,
    "",
    cleaned.replace(/\s+/g, " "),
    "",
    "Nous restons disponibles pour la coordination de votre suivi post-opératoire.",
    "Bien à vous, l'équipe de coordination KOVELA.",
  ].join("\n");
}

// 4. Compilation factuelle d'escalade — chronologie factuelle pour transmission.
export function aiCompileEscalation(patient: Patient): string {
  const recent = patient.messages.slice(-5);
  const attachments = patient.messages.flatMap((m) => m.attachments ?? []);
  return [
    "Compilation factuelle — éléments chronologiques pour transmission au chirurgien",
    "",
    `Patient : ${patient.name}`,
    `Intervention déclarée : ${patient.intervention} — Protocole ${patient.protocol}`,
    "",
    "Chronologie des échanges récents :",
    ...recent.map((m) => `— ${fmtDate(m.at)} [${authorLabel(m.author)}] : ${m.text}`),
    "",
    "Pièces jointes disponibles :",
    ...(attachments.length
      ? attachments.map((a) => `— ${a.kind === "photo" ? "Photo" : "Audio"} : ${a.label}`)
      : ["— Aucune pièce jointe."]),
    "",
    "Actions déjà réalisées par KOVELA :",
    "— Réception et classement opérationnel des messages.",
    "— Signal déclaré transmis pour préparation.",
    "",
    "Note : compilation strictement factuelle. Aucune interprétation médicale,",
    "aucune qualification de symptôme, aucune recommandation. Décision au chirurgien.",
  ].join("\n");
}
