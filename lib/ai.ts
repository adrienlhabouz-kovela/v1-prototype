// KOVELA — couche IA assistive SIMULÉE.
// Aucun appel API réel. Aucune analyse médicale, aucune analyse photo,
// aucun diagnostic. L'IA est assistive, interne, loggée, human-in-the-loop.
// Doctrine : KOVELA ne décide pas médicalement. Elle structure, trace,
// priorise opérationnellement et escalade.

import type { Message, Patient } from "./types";

export const PROMPT_VERSION = "v1.2";

export const AI_DISCLAIMER = "Suggestion IA — à valider par un humain";

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

// 1. Résumé conversation — synthèse factuelle, non médicale.
export function aiSummarize(patient: Patient): string {
  const total = patient.messages.length;
  const fromPatient = patient.messages.filter((m) => m.author === "patient").length;
  const attachments = patient.messages.flatMap((m) => m.attachments ?? []);
  const photos = attachments.filter((a) => a.kind === "photo").length;
  const audios = attachments.filter((a) => a.kind === "audio").length;
  const last = patient.messages[patient.messages.length - 1];

  return [
    `Synthèse opérationnelle — ${patient.name}`,
    "",
    `• ${total} message(s) échangé(s), dont ${fromPatient} émis par le patient.`,
    `• Pièces jointes déclarées : ${photos} photo(s), ${audios} audio(s) (placeholders).`,
    last
      ? `• Dernier échange le ${fmtDate(last.at)} (${authorLabel(last.author)}).`
      : "• Aucun échange enregistré.",
    `• Protocole de suivi : ${patient.protocol}.`,
    "",
    "Résumé factuel : échanges classés opérationnellement. Aucun élément",
    "n'est interprété médicalement par KOVELA. Transmission au chirurgien",
    "si nécessaire selon décision humaine.",
  ].join("\n");
}

// 2. Préparation CR — brouillon factuel à valider.
export function aiPrepareReport(patient: Patient): string {
  const patientMsgs = patient.messages.filter((m) => m.author === "patient");
  return [
    "Brouillon de CR à valider",
    "",
    `Patient : ${patient.name}`,
    `Intervention déclarée : ${patient.intervention}`,
    `Protocole : ${patient.protocol}`,
    "",
    "Messages principaux (factuels) :",
    ...(patientMsgs.length
      ? patientMsgs.slice(0, 3).map((m) => `— ${fmtDate(m.at)} : ${m.text}`)
      : ["— Aucun message patient sur la période."]),
    "",
    "Actions KOVELA :",
    "— Classement opérationnel des messages.",
    "— Relances de continuité post-opératoire.",
    "",
    "Escalades : voir section dédiée.",
    "Statut final : à compléter par le superviseur.",
    "",
    "⚠ Brouillon — synthèse opérationnelle non médicale. À valider par un humain.",
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
