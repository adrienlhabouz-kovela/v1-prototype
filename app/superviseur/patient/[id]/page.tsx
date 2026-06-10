"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Shell } from "@/components/Shell";
import { QueueRail } from "@/components/SupervisorQueueRail";
import { SupervisorCommandPalette } from "@/components/SupervisorCommandPalette";
import { AiSuggestion, Badge, Button, Card, CardHeader, Modal } from "@/components/ui";
import { useKovela } from "@/lib/store";
import {
  aiCompileEscalation,
  aiEstimatedMinutes,
  aiPrepareReport,
  aiReformulate,
  aiSummarize,
  formatMinutes,
} from "@/lib/ai";
import { templates } from "@/lib/templates";
import { crStatusLabels, crStatusStyles, formatDate, formatDateTime } from "@/lib/format";
import type { AiFunction } from "@/lib/types";
import {
  filterTimelineEvents,
  getApplicableReferentiel,
  getLastEvent,
  getNextPatientToTreat,
  getOperationalStatus,
  getPostOpDay,
  getRecommendedAction,
  getSLA,
  getStructuredTimeline,
  followUpStatusStyles,
  getFollowUpWindow,
  getNextScheduledMessage,
  getScheduledMessages,
  getUrgence,
  getUrgenceLabelDetailed,
  operationalStatusLabels,
  scheduledMessageStatusLabels,
  scheduledMessageStatusStyles,
  slaStyles,
  timelineFilterLabels,
  urgenceStyles,
  type ScheduledMessage,
  type ApplicableReferentiel,
  type TimelineEvent,
  type TimelineFilter,
} from "@/lib/supervisor";

type AiKind = AiFunction;

const aiTitles: Record<AiKind, string> = {
  resume_conversation: "Résumé de conversation",
  preparation_cr: "Préparation du brouillon de CR",
  reformulation: "Reformulation du message",
  compilation_escalade: "Compilation factuelle pour transmission cabinet",
};

// ---------------------------------------------------------------------------
// Helpers visuels timeline.
// ---------------------------------------------------------------------------

function timelineDot(kind: TimelineEvent["kind"]): string {
  switch (kind) {
    case "message_patient":
      return "bg-amber-400/80";
    case "reponse_kovela":
      return "bg-teal-500";
    case "message_systeme":
      return "bg-navy-900/30";
    case "note_interne":
      return "bg-navy-900/40";
    case "compilation_preparee":
      return "bg-amber-500/70";
    case "transmission_cabinet":
      return "bg-navy-900";
    case "cr_brouillon":
      return "bg-amber-500/70";
    case "cr_valide":
      return "bg-teal-600";
    case "cr_disponible":
      return "bg-teal-700";
    default:
      return "bg-navy-900/30";
  }
}

function relativeAge(iso: string, nowMs?: number): string {
  const now = nowMs ?? Date.now();
  const t = new Date(iso).getTime();
  const ageH = (now - t) / 3_600_000;
  if (ageH < 0.5) return "à l'instant";
  if (ageH < 24) return `il y a ${Math.round(ageH)}h`;
  return `il y a ${Math.round(ageH / 24)}j`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Composant principal — poste de travail conversationnel.
// ---------------------------------------------------------------------------

export default function PatientFiche() {
  const k = useKovela();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const patient = k.patients.find((p) => p.id === params.id);

  const [reply, setReply] = useState("");
  const [noteText, setNoteText] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  // Dropdown templates inline — accessible directement depuis le composer
  // sans ouvrir une modale.
  const [templatesInlineOpen, setTemplatesInlineOpen] = useState(false);
  const [aiKind, setAiKind] = useState<AiKind | null>(null);
  const [aiOutput, setAiOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [scheduledPreview, setScheduledPreview] = useState<ScheduledMessage | null>(null);
  const [sentScheduledIds, setSentScheduledIds] = useState<Set<string>>(() => new Set());
  // Refs pour les raccourcis clavier.
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("all");
  const [contactCabinetOpen, setContactCabinetOpen] = useState(false);
  const [contactCabinetCopied, setContactCabinetCopied] = useState(false);
  const [showAllScheduled, setShowAllScheduled] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  // Journal et Notes sont désormais 2 cards autonomes au pied du panneau
  // d'action — visuellement secondaires mais toujours visibles, plus en
  // mini-tabs.
  // Pipeline transmission cabinet — copié reste localement (le store ne le
  // persiste pas), envoyé est lu depuis escalation.status.
  const [hasCopiedTransmission, setHasCopiedTransmission] = useState(false);
  const [transmissionMarkedSent, setTransmissionMarkedSent] = useState(false);

  const ctx = useMemo(
    () => ({ reportFor: k.reportFor, escalationFor: k.escalationFor }),
    [k.reportFor, k.escalationFor]
  );

  const surgeon = patient ? k.surgeon(patient.surgeonId) : undefined;
  const report = patient ? k.reportFor(patient.id) : undefined;
  const escalation = patient ? k.escalationFor(patient.id) : undefined;

  const refl: ApplicableReferentiel | null = useMemo(
    () => (patient ? getApplicableReferentiel(patient, surgeon) : null),
    [patient, surgeon]
  );

  const patientLogs = useMemo(
    () => (patient ? k.logs.filter((l) => l.patientId === patient.id) : []),
    [k.logs, patient]
  );

  const timeline = useMemo(
    () => (patient ? getStructuredTimeline(patient, ctx) : []),
    [patient, ctx]
  );
  const filteredTimeline = useMemo(
    () => filterTimelineEvents(timeline, timelineFilter),
    [timeline, timelineFilter]
  );

  if (!patient || !refl) {
    return (
      <Shell>
        <p className="text-sm text-charcoal/55">Patient introuvable.</p>
        <Link href="/superviseur" className="text-sm text-teal-700">
          ← Retour au cockpit
        </Link>
      </Shell>
    );
  }

  const opStatus = getOperationalStatus(patient, ctx);
  const urgence = getUrgence(patient, ctx);
  const urgenceLabel = getUrgenceLabelDetailed(patient, ctx);
  const followUp = getFollowUpWindow(patient);

  const scheduledMessages = getScheduledMessages(patient, ctx, surgeon).map((m) =>
    sentScheduledIds.has(m.id) ? { ...m, status: "envoye" as const } : m
  );
  const nextScheduled = getNextScheduledMessage(patient, ctx, surgeon);

  function sendScheduledNow(m: ScheduledMessage) {
    if (!patient) return;
    k.sendMessage(patient.id, m.template, "superviseur");
    setSentScheduledIds((prev) => {
      const next = new Set(prev);
      next.add(m.id);
      return next;
    });
    setScheduledPreview(null);
  }

  const recommended = getRecommendedAction(patient, ctx);
  const day = getPostOpDay(patient);
  const last = getLastEvent(patient, ctx);
  const sla = getSLA(patient, ctx);

  // Patient suivant — calcul mémorisé pour éviter le re-render à chaque
  // frappe. Utilisé par le bouton « Suivant → » et le raccourci `n`.
  const nextPatient = useMemo(
    () =>
      patient ? getNextPatientToTreat(patient.id, k.patients, ctx) : null,
    [patient, k.patients, ctx]
  );

  // Marquer le patient comme lu au montage de la fiche — la pastille
  // bleue du rail disparaît dès qu'on ouvre la conversation.
  useEffect(() => {
    if (patient) k.markPatientRead(patient.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient?.id]);

  // IA -----------------------------------------------------------------------
  function runAi(kind: AiKind) {
    if (!patient) return;
    let out = "";
    if (kind === "resume_conversation") out = aiSummarize(patient);
    if (kind === "preparation_cr") out = aiPrepareReport(patient);
    if (kind === "reformulation") out = aiReformulate(reply);
    if (kind === "compilation_escalade") out = aiCompileEscalation(patient);
    setAiKind(kind);
    setAiOutput(out);
    setEditing(false);
    k.logAi(kind, "propose", patient.id);
  }

  function acceptAi() {
    if (!patient || !aiKind) return;
    k.logAi(aiKind, editing ? "modifie" : "accepte", patient.id);
    if (aiKind === "reformulation") setReply(aiOutput);
    if (aiKind === "preparation_cr") k.upsertReport(patient.id, aiOutput, "brouillon");
    if (aiKind === "compilation_escalade") k.prepareCompilation(patient.id, aiOutput);
    if (aiKind === "resume_conversation")
      k.addNote(patient.id, "Synthèse opérationnelle (IA, validée) :\n" + aiOutput);
    closeAi();
  }

  function refuseAi() {
    if (!patient || !aiKind) return;
    k.logAi(aiKind, "refuse", patient.id);
    closeAi();
  }

  function closeAi() {
    setAiKind(null);
    setAiOutput("");
    setEditing(false);
  }

  // Action recommandée ↔ bouton primary -------------------------------------
  const canPrepareCR = !report || report.status === "brouillon";
  const canValidateCR = report?.status === "brouillon";
  const canPublishCR = report?.status === "valide";
  const canTransmitCompilation =
    !!patient.compilationDraft && escalation?.status !== "transmise";
  const hasUntreated =
    patient.messages.filter((m) => m.author === "patient" && !m.treated).length > 0;

  type PrimaryKey =
    | "mark_treated"
    | "validate_cr"
    | "publish_cr"
    | "transmit_compilation"
    | "prepare_cr"
    | "relance_patient"
    | "prepare_cloture"
    | "cloturer_suivi"
    | "documenter_habituel"
    | "wait_cabinet";

  let primaryKey: PrimaryKey = "documenter_habituel";
  if (hasUntreated) primaryKey = "mark_treated";
  else if (canValidateCR) primaryKey = "validate_cr";
  else if (canPublishCR) primaryKey = "publish_cr";
  else if (canTransmitCompilation) primaryKey = "transmit_compilation";
  else if (patient.status === "cr_en_attente") primaryKey = "prepare_cr";
  else if (escalation?.status === "transmise") primaryKey = "wait_cabinet";
  // Termine prend priorité sur silencieux : on ne relance pas un suivi terminé.
  else if (followUp.status === "termine" && !report) primaryKey = "prepare_cloture";
  else if (followUp.status === "termine" && report?.status === "disponible")
    primaryKey = "cloturer_suivi";
  else if (patient.status === "silencieux") primaryKey = "relance_patient";

  const primaryConfig: Record<
    PrimaryKey,
    { label: string; handler: () => void; disabled?: boolean }
  > = {
    mark_treated: {
      label: "Lire et documenter",
      handler: () => k.markTreated(patient.id),
    },
    validate_cr: {
      label: "Relire et valider le CR",
      handler: () => k.validateReport(patient.id),
    },
    publish_cr: {
      label: "Transmettre au chirurgien",
      handler: () => k.publishReport(patient.id),
    },
    transmit_compilation: {
      label: "Transmettre au cabinet",
      handler: () => k.transmitCompilation(patient.id),
    },
    prepare_cr: {
      label: "Préparer brouillon IA",
      handler: () => runAi("preparation_cr"),
    },
    relance_patient: {
      label: "Relancer le patient",
      handler: () => k.relancePatient(patient.id),
    },
    prepare_cloture: {
      label: "Préparer la clôture du suivi",
      handler: () => runAi("preparation_cr"),
    },
    cloturer_suivi: {
      label: "Clôturer le suivi",
      handler: () => setCloseConfirmOpen(true),
    },
    wait_cabinet: {
      label: "En attente retour cabinet",
      handler: () => undefined,
      disabled: true,
    },
    documenter_habituel: {
      label: "Documenter — suivi habituel",
      handler: () => k.markTreated(patient.id),
    },
  };
  const primary = primaryConfig[primaryKey];

  // Compteurs sur mini-tabs Notes / Journal.
  const notesCount = patient.notes.length;
  const journalCount = patientLogs.length;

  const initials = getInitials(patient.name);

  // -------------------------------------------------------------------------
  // Raccourcis clavier — productivité superviseur sur usage intensif.
  //   e        focus textarea réponse patient
  //   t        ouvrir modale transmission cabinet
  //   c        focus champ note interne
  //   n        ouvrir patient suivant
  //   /        focus recherche du rail (best effort)
  //   Esc      ferme modale active
  //   ?        ouvre / ferme la modale d'aide raccourcis
  //   Cmd+Enter (depuis le textarea) → envoyer le message
  //
  // Les touches simples sont ignorées si un input/textarea est focusé.
  // -------------------------------------------------------------------------
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);

  useEffect(() => {
    function isTyping(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || target.isContentEditable;
    }

    function onKey(e: KeyboardEvent) {
      // Escape ferme toute modale active.
      if (e.key === "Escape") {
        if (templatesOpen) setTemplatesOpen(false);
        if (templatesInlineOpen) setTemplatesInlineOpen(false);
        if (contactCabinetOpen) setContactCabinetOpen(false);
        if (closeConfirmOpen) setCloseConfirmOpen(false);
        if (aiKind) closeAi();
        if (scheduledPreview) setScheduledPreview(null);
        if (shortcutsHelpOpen) setShortcutsHelpOpen(false);
        return;
      }

      // Cmd/Ctrl+Enter depuis le textarea = envoyer.
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === "Enter" &&
        document.activeElement === replyTextareaRef.current
      ) {
        e.preventDefault();
        if (reply.trim() && patient) {
          k.sendMessage(patient.id, reply.trim(), "superviseur");
          setReply("");
        }
        return;
      }

      // Raccourcis simples — ignorés en cours de saisie.
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "e":
          e.preventDefault();
          replyTextareaRef.current?.focus();
          break;
        case "t":
          e.preventDefault();
          setContactCabinetOpen(true);
          setContactCabinetCopied(false);
          break;
        case "c":
          e.preventDefault();
          noteInputRef.current?.focus();
          break;
        case "n":
          e.preventDefault();
          if (nextPatient) router.push(`/superviseur/patient/${nextPatient.id}`);
          break;
        case "/": {
          e.preventDefault();
          const railSearch = document.querySelector<HTMLInputElement>(
            'input[type="search"]'
          );
          railSearch?.focus();
          break;
        }
        case "?":
          e.preventDefault();
          setShortcutsHelpOpen((v) => !v);
          break;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reply,
    nextPatient?.id,
    templatesOpen,
    templatesInlineOpen,
    contactCabinetOpen,
    closeConfirmOpen,
    aiKind,
    scheduledPreview,
    shortcutsHelpOpen,
  ]);

  return (
    <Shell>
      {/* Command palette globale Cmd+K — always-on, contrôle interne. */}
      <SupervisorCommandPalette />
      {/* ============================================================
          WORKSPACE SUPERVISEUR — 2 panneaux principaux :
            · Rail patient (gauche, permanent) — change de patient sans
              jamais quitter le workspace.
            · Pane patient (centre + droite) — header sticky + grid 3/6/3.
          Pattern Front / Intercom / Help Scout adapté au métier
          superviseur post-opératoire.
          ============================================================ */}
      <div className="flex gap-4">
        {/* Rail gauche — permanent, scrollable indépendamment */}
        <div className="hidden w-[264px] shrink-0 lg:block">
          <div className="sticky top-2 h-[calc(100vh-6rem)]">
            <QueueRail selectedPatientId={patient.id} />
          </div>
        </div>

        {/* Pane droit — contient le header sticky + le contenu fiche */}
        <div className="min-w-0 flex-1">
          {/* Bandeau alerte SLA critique — signal production fort,
              au-dessus du header sticky. Disparaît dès que la pression
              SLA est résorbée (action prise → SLA recalculé). */}
          {sla.state === "critical" && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-4 py-2.5 ring-1 ring-amber-200/70">
              <p className="text-[11.5px] tracking-tight text-amber-900">
                <span className="font-semibold">SLA critique — {sla.label}.</span>{" "}
                <span className="text-amber-800/85">{sla.detail}.</span>
              </p>
              <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold tracking-tight text-amber-800 ring-1 ring-amber-300/60">
                Action recommandée : {recommended.label}
              </span>
            </div>
          )}
          {/* Header patient — sticky pour rester visible pendant la conversation. */}
      <div className="sticky top-2 z-30 mb-4 overflow-hidden rounded-2xl bg-white/95 shadow-card ring-1 ring-navy-900/[0.045] backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="border-l-[3px] border-teal-500/80 px-5 py-4">
          <div className="flex flex-wrap items-start gap-x-5 gap-y-3">
            {/* Identité — avatar + nom + métadonnées en ligne */}
            <div className="flex items-center gap-3.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-depth text-[14px] font-semibold tracking-tight text-white ring-1 ring-navy-900/10">
                {initials}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <h1 className="font-display text-[1.4rem] font-medium leading-tight tracking-tight text-navy-900">
                    {patient.name}
                  </h1>
                  <span className="font-mono text-[13px] font-medium tracking-tight text-teal-700">
                    {day}
                  </span>
                  <span
                    className={`text-[11.5px] tracking-tight ${
                      followUp.status === "termine"
                        ? "text-amber-900"
                        : followUp.status === "proche_cloture"
                        ? "text-amber-800"
                        : "text-charcoal/60"
                    }`}
                  >
                    · {followUp.label}
                  </span>
                </div>
                <p className="mt-0.5 text-[12.5px] tracking-tight text-charcoal/70">
                  {patient.intervention}
                  <span className="text-charcoal/50"> · </span>
                  {k.surgeonName(patient.surgeonId)}
                  <span className="text-charcoal/50"> · </span>
                  <span className="text-charcoal/55">{refl.cabinet}</span>
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {opStatus && (
                    <Badge className="bg-navy-900 text-white ring-navy-900">
                      {operationalStatusLabels[opStatus]}
                    </Badge>
                  )}
                  <Badge className={urgenceStyles[urgence]}>{urgenceLabel}</Badge>
                  <Badge className="bg-bone/80 text-charcoal/70 ring-navy-900/[0.06]">
                    Réf. {refl.version}
                  </Badge>
                  {/* Chip SLA — affiche le temps restant ou « dépassé » sur
                      la dimension la plus serrée du dossier. Permet de
                      lire la pression du dossier en un coup d'œil. */}
                  {sla.state !== "none" && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-medium tracking-tight ring-1 ${slaStyles[sla.state]}`}
                      title={sla.detail}
                    >
                      {sla.state === "critical" && (
                        <span aria-hidden>⚠</span>
                      )}
                      <span>SLA · {sla.label}</span>
                      <span className="opacity-60">·</span>
                      <span>{sla.detail.split(" ").slice(-1)[0]}</span>
                    </span>
                  )}
                </div>
                {/* Fenêtre prévue + temps humain — compact, repère métier. */}
                <p className="mt-1.5 text-[10px] tracking-tight text-charcoal/55">
                  J0 → J+{Math.max(
                    1,
                    Math.round(
                      (new Date(followUp.endDate).getTime() -
                        new Date(followUp.startDate).getTime()) /
                        86_400_000
                    )
                  )}
                  <span className="text-charcoal/35"> · </span>
                  cible humaine ~1h
                  <span className="text-charcoal/35"> · </span>
                  consommé ~
                  {Math.min(
                    60,
                    Math.round(patientLogs.length * 2 + patient.messages.length * 1.5)
                  )}
                  min
                </p>
              </div>
            </div>

            {/* Spacer puis action recommandée + boutons — alignés à droite sur desktop */}
            <div className="flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2">
              <div className="min-w-0 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  Prochaine action
                </p>
                <p className="mt-0.5 text-[12.5px] font-medium tracking-tight text-navy-900">
                  {recommended.label}
                </p>
                {recommended.delay && (
                  <p className="text-[11px] tracking-tight text-charcoal/55">
                    {recommended.delay}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  onClick={primary.handler}
                  disabled={primary.disabled}
                >
                  {primary.label}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setContactCabinetOpen(true);
                    setContactCabinetCopied(false);
                  }}
                >
                  Contacter le cabinet
                </Button>
                {/* Patient suivant — fluidifie le traitement en série. */}
                {nextPatient && (
                  <button
                    type="button"
                    onClick={() => router.push(`/superviseur/patient/${nextPatient.id}`)}
                    className="rounded-lg bg-white px-3 py-2 text-[12px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/[0.1] transition-colors hover:bg-bone"
                    title={`Patient suivant : ${nextPatient.name} (n)`}
                  >
                    Suivant →
                  </button>
                )}
                {/* Raccourcis clavier — accès rapide à la modale d'aide. */}
                <button
                  type="button"
                  onClick={() => setShortcutsHelpOpen(true)}
                  className="rounded-lg px-2 py-2 text-[12px] font-medium tracking-tight text-charcoal/55 transition-colors hover:bg-navy-900/[0.04] hover:text-navy-900"
                  title="Raccourcis clavier ( ? )"
                  aria-label="Raccourcis clavier"
                >
                  ⌘
                </button>
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-[12px] font-medium tracking-tight text-charcoal/65 ring-1 ring-navy-900/[0.06] transition-colors hover:bg-navy-900/[0.04] hover:text-navy-900">
                    Autres ▾
                  </summary>
                  <div className="absolute right-0 z-10 mt-1.5 min-w-[220px] overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-navy-900/[0.08]">
                    {[
                      {
                        label: "Préparer brouillon CR (IA)",
                        handler: () => runAi("preparation_cr"),
                        show: primaryKey !== "prepare_cr" && canPrepareCR,
                      },
                      {
                        label: "Préparer compilation factuelle",
                        handler: () => runAi("compilation_escalade"),
                        show: !patient.compilationDraft,
                      },
                      {
                        label: "Transmettre au cabinet",
                        handler: () => k.transmitCompilation(patient.id),
                        show:
                          primaryKey !== "transmit_compilation" && canTransmitCompilation,
                      },
                      {
                        label: "Relancer le patient",
                        handler: () => k.relancePatient(patient.id),
                        show:
                          primaryKey !== "relance_patient" &&
                          patient.status === "silencieux",
                      },
                      {
                        label: "Marquer suivi habituel",
                        handler: () => k.markTreated(patient.id),
                        show:
                          primaryKey !== "mark_treated" &&
                          primaryKey !== "documenter_habituel",
                      },
                      {
                        label: "Clôturer le suivi",
                        handler: () => setCloseConfirmOpen(true),
                        show: true,
                      },
                    ]
                      .filter((a) => a.show)
                      .map((a) => (
                        <button
                          key={a.label}
                          type="button"
                          onClick={a.handler}
                          className="block w-full px-4 py-2.5 text-left text-[12.5px] tracking-tight text-charcoal/80 transition-colors hover:bg-bone/60 hover:text-navy-900"
                        >
                          {a.label}
                        </button>
                      ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          LAYOUT 3 COLONNES — 3 / 6 / 3 = conversation dominante.
          ============================================================ */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* ===== COLONNE GAUCHE — Contexte stable, scannable, NON redondant
            avec le header sticky. On enlève intervention / J+ / chirurgien /
            cabinet / fenêtre J0→J+N qui sont déjà dans le bandeau.
            Responsive : 3 cols par défaut sur lg (laptop 1366), 2 cols
            seulement sur 2xl+ pour donner plus de place à la conversation
            sur grand écran sans casser la lisibilité sur laptop. ===== */}
        <aside className="space-y-3 lg:col-span-3 2xl:col-span-2">
          {/* Bloc référentiel — version + cabinet contact, suffisant. */}
          <div className="rounded-xl bg-teal-50/40 px-3 py-2.5 ring-1 ring-teal-100/60">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-700">
              Référentiel
            </p>
            <p className="mt-1 text-[11.5px] font-semibold tracking-tight text-navy-900">
              {refl.version}
            </p>
            <p className="mt-0.5 text-[10px] tracking-tight text-charcoal/60">
              Contact prioritaire : {refl.contact_prioritaire}
            </p>
          </div>

          {/* Bloc dates / canal — informations non répétées dans le header. */}
          <div className="rounded-xl bg-white px-3 py-2.5 shadow-card ring-1 ring-navy-900/[0.045]">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Dossier
            </p>
            <dl className="mt-1.5 space-y-1.5 text-[11px]">
              {[
                ["Intervention", formatDate(patient.interventionDate)],
                ["Protocole", patient.protocol],
                ["Canal patient", "Interface KOVELA"],
                [
                  "Dernier contact",
                  last.ageLabel ? last.ageLabel : "—",
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-2 border-b border-navy-900/[0.04] pb-1 last:border-0"
                >
                  <dt className="shrink-0 text-[10px] text-charcoal/55">{label}</dt>
                  <dd className="truncate text-right font-medium tracking-tight text-navy-900">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Fenêtre suivi — compact : 2 dates + barre de progression. */}
          <div className="rounded-xl bg-white px-3 py-2.5 shadow-card ring-1 ring-navy-900/[0.045]">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                Fenêtre de suivi
              </p>
              <span
                className={`text-[9.5px] font-medium tracking-tight ${
                  followUp.status === "termine"
                    ? "text-amber-800"
                    : followUp.status === "proche_cloture"
                    ? "text-amber-700"
                    : "text-teal-700"
                }`}
              >
                {followUp.progressPercent}%
              </span>
            </div>
            <p className="mt-1 text-[10.5px] tracking-tight text-charcoal/65">
              {formatDate(followUp.startDate)} → {formatDate(followUp.endDate)}
            </p>
            <p className="mt-0.5 text-[10px] tracking-tight text-charcoal/55">
              {followUp.daysRemaining === 0
                ? "Fin aujourd'hui"
                : followUp.daysRemaining > 0
                ? `Reste ${followUp.daysRemaining}j`
                : `Terminé depuis ${Math.abs(followUp.daysRemaining)}j`}
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-navy-900/[0.06]">
              <div
                className={`h-full rounded-full transition-all ${
                  followUp.status === "termine"
                    ? "bg-amber-500/80"
                    : followUp.status === "proche_cloture"
                    ? "bg-amber-400/80"
                    : "bg-teal-500"
                }`}
                style={{ width: `${followUp.progressPercent}%` }}
              />
            </div>
          </div>
        </aside>

        {/* ===== COLONNE CENTRE — Conversation patient (zone dominante) ===== */}
        <section className="lg:col-span-6 2xl:col-span-7">
          <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
            {/* En-tête conversation — discret pour ne pas voler la vedette à la conversation. */}
            <div className="flex items-center justify-between gap-3 border-b border-navy-900/[0.05] px-5 py-3">
              <div>
                <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                  Conversation patient
                </p>
                <p className="text-[11px] tracking-tight text-charcoal/55">
                  Messages, photos, audio, actions KOVELA — plus récent en bas.
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(timelineFilterLabels) as TimelineFilter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setTimelineFilter(f)}
                    className={`rounded-md px-2.5 py-1 text-[10.5px] font-medium tracking-tight transition-colors ${
                      timelineFilter === f
                        ? "bg-navy-900 text-white shadow-soft"
                        : "bg-white text-charcoal/65 ring-1 ring-navy-900/[0.06] hover:text-navy-900"
                    }`}
                  >
                    {timelineFilterLabels[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline — défile, occupe l'espace disponible. Le fond et la
                bordure de chaque carte distinguent visuellement les types :
                message patient (ambre), réponse KOVELA (teal), note interne
                (navy), transmission cabinet (navy fort), CR (teal fort). */}
            <div className="max-h-[calc(100vh-22rem)] min-h-[420px] overflow-y-auto bg-bone/20 px-5 py-4">
              {filteredTimeline.length === 0 ? (
                <p className="py-12 text-center text-[12px] tracking-tight text-charcoal/45">
                  Aucun événement pour ce filtre.
                </p>
              ) : (
                <ol className="relative space-y-3">
                  <span className="absolute left-[6.5px] top-2 bottom-2 w-px bg-navy-900/[0.06]" />
                  {filteredTimeline.map((e) => {
                    const cardStyles = (() => {
                      switch (e.kind) {
                        case "message_patient":
                          return "bg-amber-50/40 ring-amber-200/40";
                        case "reponse_kovela":
                          return "bg-teal-50/30 ring-teal-100/60";
                        case "note_interne":
                          return "bg-navy-50/40 ring-navy-100";
                        case "transmission_cabinet":
                          return "bg-navy-900/[0.05] ring-navy-900/[0.12]";
                        case "compilation_preparee":
                          return "bg-amber-50/40 ring-amber-200/40";
                        case "cr_brouillon":
                        case "cr_valide":
                        case "cr_disponible":
                          return "bg-teal-50/40 ring-teal-100/70";
                        default:
                          return "bg-white ring-navy-900/[0.05]";
                      }
                    })();
                    const eyebrow = (() => {
                      switch (e.kind) {
                        case "message_patient":
                          return { label: "Message patient", cls: "text-amber-800" };
                        case "reponse_kovela":
                          return { label: "Réponse KOVELA", cls: "text-teal-700" };
                        case "note_interne":
                          return { label: "Note interne", cls: "text-navy-700" };
                        case "transmission_cabinet":
                          return { label: "→ Cabinet", cls: "text-navy-900" };
                        case "compilation_preparee":
                          return {
                            label: "Compilation préparée",
                            cls: "text-amber-800",
                          };
                        case "cr_brouillon":
                          return { label: "CR brouillon", cls: "text-teal-700" };
                        case "cr_valide":
                          return { label: "CR validé", cls: "text-teal-700" };
                        case "cr_disponible":
                          return { label: "CR publié", cls: "text-teal-700" };
                        default:
                          return { label: "", cls: "" };
                      }
                    })();
                    return (
                      <li key={e.id} className="relative flex gap-3.5">
                        <span
                          className={`mt-1.5 h-[13px] w-[13px] shrink-0 rounded-full ring-2 ring-white ${timelineDot(
                            e.kind
                          )}`}
                        />
                        <div
                          className={`min-w-0 flex-1 rounded-xl px-4 py-3 ring-1 ${cardStyles}`}
                        >
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            {eyebrow.label && (
                              <span
                                className={`text-[9.5px] font-semibold uppercase tracking-[0.12em] ${eyebrow.cls}`}
                              >
                                {eyebrow.label}
                              </span>
                            )}
                            <span className="font-display text-[12.5px] font-semibold tracking-tight text-navy-900">
                              {e.label}
                            </span>
                            <span className="text-[10.5px] text-charcoal/55">
                              {e.actor} · {relativeAge(e.at)}
                            </span>
                            {e.meta && (
                              <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                                {e.meta}
                              </Badge>
                            )}
                          </div>
                          {e.content && (
                            <p className="mt-1.5 whitespace-pre-wrap text-[12.5px] leading-relaxed text-charcoal/80">
                              {e.content}
                            </p>
                          )}
                          {e.attachments && e.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {e.attachments.map((a, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-bone/70 px-2 py-1 text-[10.5px] tracking-tight text-charcoal/70 ring-1 ring-navy-900/[0.04]"
                                >
                                  <span className="h-[5px] w-[5px] rounded-full bg-teal-600/70" />
                                  {a.kind === "photo" ? "Photo" : "Audio"} · {a.label}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Quick-actions sur message patient — flux complet
                              sans quitter la conversation : marquer documenté,
                              préparer transmission cabinet, capturer en note
                              interne, ajouter comme élément du CR factuel. */}
                          {e.kind === "message_patient" && e.content && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  k.markTreated(patient.id);
                                }}
                                className="rounded-md bg-white px-2 py-1 text-[10.5px] font-medium tracking-tight text-charcoal/70 ring-1 ring-navy-900/10 transition-colors hover:bg-bone hover:text-navy-900"
                              >
                                Marquer documenté
                              </button>
                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  setContactCabinetOpen(true);
                                  setContactCabinetCopied(false);
                                }}
                                className="rounded-md bg-white px-2 py-1 text-[10.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-navy-900 hover:text-white"
                              >
                                → Transmission cabinet
                              </button>
                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  k.addNote(
                                    patient.id,
                                    `Capturé depuis message patient : « ${e.content} »`
                                  );
                                }}
                                className="rounded-md bg-white px-2 py-1 text-[10.5px] font-medium tracking-tight text-charcoal/70 ring-1 ring-navy-900/10 transition-colors hover:bg-navy-50 hover:text-navy-900"
                              >
                                + Note interne
                              </button>
                              <button
                                type="button"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  const existing = report?.content ?? "";
                                  const addition = `\n- Élément déclaré par le patient : ${e.content}`;
                                  k.upsertReport(
                                    patient.id,
                                    (existing ? existing : aiPrepareReport(patient)) + addition,
                                    "brouillon"
                                  );
                                }}
                                className="rounded-md bg-white px-2 py-1 text-[10.5px] font-medium tracking-tight text-teal-700 ring-1 ring-teal-200/60 transition-colors hover:bg-teal-50 hover:text-teal-800"
                              >
                                + CR factuel
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            {/* Composer — zone de réponse premium, plus de respiration
                + label visible + 2 modes de bouton primary (Envoyer prototype
                / Copier message). */}
            <div className="border-t border-navy-900/[0.06] bg-bone/30 px-5 py-4">
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                  Réponse patient
                </p>
                <span className="text-[9.5px] tracking-tight text-charcoal/40">
                  Prototype — pas d&apos;envoi réel au patient
                </span>
              </div>
              <textarea
                ref={replyTextareaRef}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="Écrire une réponse de coordination, sans avis médical…  ⌘+Entrée pour envoyer"
                className="w-full resize-none rounded-xl border border-navy-900/[0.08] bg-white p-3 text-[13px] leading-relaxed outline-none transition-colors focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10"
              />
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {/* Modèles de réponse — dropdown inline (pas de modale,
                    pas de perte de contexte). Clic = insertion immédiate
                    au composer. */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTemplatesInlineOpen((v) => !v)}
                    aria-expanded={templatesInlineOpen}
                    className="rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium tracking-tight text-charcoal/75 ring-1 ring-navy-900/[0.08] transition-colors hover:bg-bone hover:text-navy-900"
                  >
                    Modèles {templatesInlineOpen ? "▴" : "▾"}
                  </button>
                  {templatesInlineOpen && (
                    <div className="absolute bottom-full left-0 z-20 mb-1.5 max-h-[320px] w-[340px] overflow-y-auto rounded-xl bg-white shadow-lift ring-1 ring-navy-900/[0.08]">
                      <p className="border-b border-navy-900/[0.05] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                        Modèles de réponse · coordination uniquement
                      </p>
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setReply((prev) => (prev ? prev + "\n\n" : "") + t.body);
                            setTemplatesInlineOpen(false);
                            replyTextareaRef.current?.focus();
                          }}
                          className="block w-full border-b border-navy-900/[0.04] px-3 py-2.5 text-left last:border-0 hover:bg-bone/60"
                        >
                          <p className="text-[12px] font-medium tracking-tight text-navy-900">
                            {t.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-charcoal/55">
                            {t.body}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => runAi("reformulation")}
                  disabled={!reply.trim()}
                  className="rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium tracking-tight text-charcoal/75 ring-1 ring-navy-900/[0.08] transition-colors hover:bg-bone hover:text-navy-900 disabled:cursor-not-allowed disabled:text-charcoal/30"
                >
                  Reformuler · IA interne
                </button>
                <button
                  type="button"
                  onClick={() => runAi("resume_conversation")}
                  className="rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium tracking-tight text-charcoal/75 ring-1 ring-navy-900/[0.08] transition-colors hover:bg-bone hover:text-navy-900"
                >
                  Résumer la conversation
                </button>
                <div className="ml-auto flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!reply.trim()}
                    onClick={() => {
                      navigator.clipboard?.writeText(reply.trim());
                    }}
                    className="rounded-md bg-white px-2.5 py-1.5 text-[11px] font-medium tracking-tight text-charcoal/75 ring-1 ring-navy-900/[0.08] transition-colors hover:bg-bone hover:text-navy-900 disabled:cursor-not-allowed disabled:text-charcoal/30"
                  >
                    Copier
                  </button>
                  <Button
                    variant="primary"
                    disabled={!reply.trim()}
                    onClick={() => {
                      k.sendMessage(patient.id, reply.trim(), "superviseur");
                      setReply("");
                    }}
                  >
                    Envoyer · prototype
                  </Button>
                </div>
              </div>
              {/* Doctrine + 15/112 — deux lignes très courtes, sobres,
                  collées au composer pour ne jamais être perdues de vue. */}
              <div className="mt-2.5 space-y-1">
                <p className="text-[10.5px] leading-relaxed tracking-tight text-charcoal/60">
                  <span className="font-medium text-navy-900">Cadre référentiel</span>
                  {" · "}Le message patient reste dans le cadre du référentiel. KOVELA ne
                  diagnostique pas, ne prescrit pas et ne décide pas médicalement.
                </p>
                <p className="text-[10.5px] leading-relaxed tracking-tight text-charcoal/55">
                  <span className="font-medium text-amber-900">15 / 112 / urgences clinique</span>
                  {" · "}KOVELA ne prend pas en charge les urgences. Si le patient décrit une
                  situation urgente, l'orienter vers le 15 / 112, les urgences de la clinique ou
                  les consignes remises par son chirurgien, puis transmettre au cabinet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COLONNE DROITE — Panneau d'action vertical hiérarchisé =====
            5 blocs empilés par priorité opérationnelle :
              1. Action principale (CTA dominant)
              2. Cabinet (Contacter + pipeline transmission + Marquer transmis)
              3. CR factuel (statut + Préparer / Valider / Transmettre)
              4. Suivi (fenêtre + clôture)
              5. Notes / Journal (mini-tabs, visuellement secondaires)
            Plus de tabs égaux = la hiérarchie d'action est immédiatement
            visible côté UI. */}
        <aside className="space-y-3 lg:col-span-3">
          {/* ─── 1. ACTION PRINCIPALE ─────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-teal-200/40">
            <div className="border-l-[3px] border-teal-500/80 px-4 py-3.5">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                Action principale
              </p>
              <p className="mt-1.5 text-[14px] font-semibold tracking-tight text-navy-900">
                {recommended.label}
              </p>
              {recommended.delay && (
                <p className="mt-0.5 text-[11.5px] tracking-tight text-charcoal/60">
                  {recommended.delay}
                </p>
              )}
              <Button
                variant="primary"
                className="mt-3 w-full"
                onClick={primary.handler}
                disabled={primary.disabled}
              >
                {primary.label}
              </Button>
              {/* Messages programmés — sous l'action principale car ce
                  sont les prochaines actions à effectuer. Limité à 2 +
                  Voir tout pour ne pas saturer. */}
              {scheduledMessages.length > 0 && (
                <div className="mt-3 border-t border-navy-900/[0.05] pt-3">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                    Messages programmés
                  </p>
                  <p className="mt-1 text-[10.5px] tracking-tight text-charcoal/55">
                    {nextScheduled
                      ? `Prochain : ${nextScheduled.label} · ${new Date(
                          nextScheduled.targetDate
                        ).toLocaleDateString("fr-FR")}`
                      : "Aucun message prévu"}
                  </p>
                  <div className="mt-1.5 space-y-1.5">
                    {(showAllScheduled
                      ? scheduledMessages
                      : scheduledMessages.slice(0, 2)
                    ).map((m) => {
                      const dt = new Date(m.targetDate);
                      const dateLabel = dt.toLocaleDateString("fr-FR");
                      const sent = m.status === "envoye";
                      const late = m.status === "en_retard";
                      return (
                        <div
                          key={m.id}
                          className="rounded-md bg-bone/50 px-2.5 py-1.5 ring-1 ring-navy-900/[0.04]"
                        >
                          <div className="flex flex-wrap items-baseline justify-between gap-1.5">
                            <p className="text-[11px] font-medium tracking-tight text-navy-900">
                              {m.label}
                            </p>
                            <Badge className={scheduledMessageStatusStyles[m.status]}>
                              {scheduledMessageStatusLabels[m.status]}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-[10px] tracking-tight text-charcoal/55">
                            {late ? "Échéance " : "Prévu "}
                            {dateLabel}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            <button
                              type="button"
                              onClick={() => setScheduledPreview(m)}
                              className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-bone"
                            >
                              Prévisualiser
                            </button>
                            {!sent && (
                              <button
                                type="button"
                                onClick={() => sendScheduledNow(m)}
                                className="rounded-md bg-teal-600 px-1.5 py-0.5 text-[10px] font-medium tracking-tight text-white transition-colors hover:bg-teal-700"
                              >
                                Simuler l\'envoi
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {scheduledMessages.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setShowAllScheduled((v) => !v)}
                        className="w-full rounded-md px-1.5 py-1 text-[10.5px] font-medium tracking-tight text-teal-700 transition-colors hover:bg-teal-50/40"
                      >
                        {showAllScheduled
                          ? "Replier"
                          : `Voir tout (${scheduledMessages.length - 2} de plus)`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── 2. CABINET — transmission opérationnelle ───────────────────── */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
            <div className="border-b border-navy-900/[0.05] px-4 py-2.5">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-900/70">
                Cabinet
              </p>
              <p className="mt-0.5 text-[10.5px] tracking-tight text-charcoal/55">
                Transmission factuelle selon référentiel
              </p>
            </div>
            <div className="space-y-2.5 px-4 py-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  setContactCabinetOpen(true);
                  setContactCabinetCopied(false);
                }}
              >
                Contacter le cabinet
              </Button>

              {/* Pipeline 3 étapes — toujours visible, donne le statut courant
                  sans cliquer dans un onglet. */}
              {(() => {
                const isSent =
                  escalation?.status === "transmise" || transmissionMarkedSent;
                const isPrepared = !!patient.compilationDraft || isSent;
                const isCopied = hasCopiedTransmission || isSent;
                const steps = [
                  { key: "prep", label: "Préparée", active: isPrepared },
                  { key: "copy", label: "Copiée", active: isCopied },
                  { key: "sent", label: "Envoyée (proto)", active: isSent },
                ];
                return (
                  <div className="rounded-lg bg-bone/50 px-2.5 py-2 ring-1 ring-navy-900/[0.04]">
                    <div className="flex items-center gap-1">
                      {steps.map((s, i) => (
                        <div key={s.key} className="flex flex-1 items-center gap-1">
                          <span
                            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                              s.active
                                ? "bg-navy-900 text-white"
                                : "bg-white text-charcoal/40 ring-1 ring-navy-900/[0.08]"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span
                            className={`whitespace-nowrap text-[9.5px] font-medium tracking-tight ${
                              s.active ? "text-navy-900" : "text-charcoal/45"
                            }`}
                          >
                            {s.label}
                          </span>
                          {i < steps.length - 1 && (
                            <span
                              className={`h-px flex-1 ${
                                s.active && steps[i + 1].active
                                  ? "bg-navy-900/30"
                                  : "bg-navy-900/[0.08]"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {isSent && escalation?.transmittedAt && (
                      <p className="mt-1.5 text-[10px] tracking-tight text-charcoal/55">
                        Dernier envoi : {formatDateTime(escalation.transmittedAt)}
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Boutons compilation — si non transmise, on propose de préparer
                  puis transmettre directement. */}
              {!patient.compilationDraft && escalation?.status !== "transmise" && (
                <button
                  type="button"
                  onClick={() => runAi("compilation_escalade")}
                  className="w-full rounded-lg bg-white px-3 py-2 text-[11.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-bone"
                >
                  Préparer compilation factuelle
                </button>
              )}
              {patient.compilationDraft && escalation?.status !== "transmise" && (
                <button
                  type="button"
                  onClick={() => k.transmitCompilation(patient.id)}
                  className="w-full rounded-lg bg-navy-900 px-3 py-2 text-[11.5px] font-medium tracking-tight text-white transition-colors hover:bg-navy-800"
                >
                  Transmettre au cabinet
                </button>
              )}
            </div>

            {/* Référentiel applicable — directement dans le bloc Cabinet
                car c'est ce qui pilote les décisions de transmission. */}
            <details open className="border-t border-navy-900/[0.05]">
              <summary className="cursor-pointer list-none px-4 py-2 text-[10.5px] font-medium tracking-tight text-charcoal/65 hover:bg-bone/40">
                Référentiel applicable
              </summary>
              <div className="space-y-2 border-t border-navy-900/[0.04] bg-bone/20 px-4 py-3">
                <p className="text-[10.5px] tracking-tight text-charcoal/55">
                  {refl.intervention} — {refl.version}
                </p>
                {(
                  [
                    {
                      label: "KOVELA peut rappeler",
                      items: refl.peut_rappeler,
                      eyebrowCls: "text-teal-700/80",
                      dotCls: "bg-teal-600/70",
                    },
                    {
                      label: "Ne pas traiter",
                      items: refl.ne_pas_traiter,
                      eyebrowCls: "text-charcoal/55",
                      dotCls: "bg-charcoal/40",
                    },
                    {
                      label: "À transmettre au cabinet",
                      items: refl.a_transmettre_cabinet,
                      eyebrowCls: "text-amber-800/80",
                      dotCls: "bg-amber-500/70",
                    },
                    {
                      label: "Transmission prioritaire",
                      items: refl.transmission_prioritaire,
                      eyebrowCls: "text-navy-900/70",
                      dotCls: "bg-navy-900/70",
                    },
                  ] as const
                ).map((bloc) => (
                  <div key={bloc.label}>
                    <p
                      className={`text-[9.5px] font-semibold uppercase tracking-[0.12em] ${bloc.eyebrowCls}`}
                    >
                      {bloc.label}
                    </p>
                    <ul className="mt-0.5 space-y-0.5">
                      {bloc.items.map((it) => (
                        <li
                          key={it}
                          className="flex items-start gap-1.5 text-[10.5px] leading-relaxed tracking-tight text-charcoal/75"
                        >
                          <span
                            className={`mt-1.5 h-[3px] w-[3px] shrink-0 rounded-full ${bloc.dotCls}`}
                          />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* ─── 3. CR FACTUEL ───────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
            <div className="flex items-center justify-between border-b border-navy-900/[0.05] px-4 py-2.5">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-900/70">
                  CR factuel
                </p>
                <p className="mt-0.5 text-[10.5px] tracking-tight text-charcoal/55">
                  Synthèse opérationnelle non médicale
                </p>
              </div>
              {report && (
                <Badge className={crStatusStyles[report.status]}>
                  {crStatusLabels[report.status]}
                </Badge>
              )}
            </div>
            <div className="space-y-2.5 px-4 py-3">
              {report ? (
                <>
                  {report.status === "valide" && (
                    <p className="text-[10.5px] tracking-tight text-charcoal/55">
                      CR factuel validé — à transmettre au chirurgien.
                    </p>
                  )}
                  {report.status === "brouillon" && (
                    <p className="text-[10.5px] tracking-tight text-charcoal/55">
                      Brouillon IA — à relire, corriger si besoin, puis valider.
                    </p>
                  )}
                  <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-2.5 font-sans text-[11px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                    {report.content}
                  </pre>
                  <div className="flex flex-wrap gap-1.5">
                    {report.status === "brouillon" && (
                      <button
                        type="button"
                        onClick={() => k.validateReport(patient.id)}
                        className="rounded-md bg-teal-600 px-2.5 py-1 text-[11px] font-medium tracking-tight text-white transition-colors hover:bg-teal-700"
                      >
                        Relire et valider
                      </button>
                    )}
                    {report.status !== "disponible" && (
                      <button
                        type="button"
                        onClick={() => k.publishReport(patient.id)}
                        className="rounded-md bg-white px-2.5 py-1 text-[11px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-bone"
                      >
                        Marquer prêt pour chirurgien
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(report.content)}
                      className="rounded-md bg-white px-2.5 py-1 text-[11px] font-medium tracking-tight text-charcoal/70 ring-1 ring-navy-900/10 transition-colors hover:bg-bone"
                    >
                      Copier
                    </button>
                    <button
                      type="button"
                      disabled
                      title="Export PDF prévu en V1"
                      className="cursor-not-allowed rounded-md bg-white px-2.5 py-1 text-[11px] font-medium tracking-tight text-charcoal/40 ring-1 ring-navy-900/[0.08]"
                    >
                      Export PDF prévu en V1
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11px] leading-relaxed tracking-tight text-charcoal/60">
                    Aucun CR préparé. Le CR factuel est une synthèse opérationnelle
                    non médicale, validée par KOVELA avant publication chirurgien.
                  </p>
                  <button
                    type="button"
                    onClick={() => runAi("preparation_cr")}
                    className="w-full rounded-lg bg-navy-900 px-3 py-2 text-[11.5px] font-medium tracking-tight text-white transition-colors hover:bg-navy-800"
                  >
                    Préparer brouillon IA
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Export PDF prévu en V1"
                    className="w-full cursor-not-allowed rounded-lg bg-white px-3 py-2 text-[11px] font-medium tracking-tight text-charcoal/40 ring-1 ring-navy-900/[0.08]"
                  >
                    Export PDF prévu en V1
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ─── 4. SUIVI — fenêtre + clôture ──────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
            <div className="flex items-center justify-between border-b border-navy-900/[0.05] px-4 py-2.5">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-900/70">
                  Suivi
                </p>
                <p className="mt-0.5 text-[10.5px] tracking-tight text-charcoal/55">
                  {followUp.label}
                </p>
              </div>
              <Badge className={followUpStatusStyles[followUp.status]}>
                {followUp.status === "en_cours"
                  ? "En cours"
                  : followUp.status === "proche_cloture"
                  ? "Proche clôture"
                  : followUp.status === "termine"
                  ? "Terminé"
                  : "Hors fenêtre"}
              </Badge>
            </div>
            <div className="space-y-2.5 px-4 py-3">
              <div className="h-1 w-full overflow-hidden rounded-full bg-navy-900/[0.06]">
                <div
                  className={`h-full rounded-full transition-all ${
                    followUp.status === "termine"
                      ? "bg-amber-500/80"
                      : followUp.status === "proche_cloture"
                      ? "bg-amber-400/80"
                      : "bg-teal-500"
                  }`}
                  style={{ width: `${followUp.progressPercent}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setCloseConfirmOpen(true)}
                className="w-full rounded-lg bg-white px-3 py-2 text-[11.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-bone"
              >
                Clôturer le suivi
              </button>
            </div>
          </div>

          {/* ─── 5. JOURNAL D'ACTION — bloc autonome (plus en mini-tab) ─────── */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
            <div className="flex items-center justify-between border-b border-navy-900/[0.05] px-4 py-2.5">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-900/70">
                  Journal d&apos;action
                </p>
                <p className="mt-0.5 text-[10.5px] tracking-tight text-charcoal/55">
                  Traçabilité opérationnelle horodatée
                </p>
              </div>
              <span className="flex h-5 min-w-[22px] items-center justify-center rounded-md bg-navy-900 px-1.5 text-[10.5px] font-semibold text-white">
                {journalCount}
              </span>
            </div>
            <div className="max-h-[260px] space-y-2 overflow-y-auto px-3 py-3">
              <p className="rounded-md bg-bone/60 px-2.5 py-1.5 text-[9.5px] leading-relaxed tracking-tight text-charcoal/60 ring-1 ring-navy-900/[0.04]">
                Journal d&apos;action prototype — audit trail réel prévu en V1.
              </p>
              {patientLogs.length === 0 ? (
                <p className="rounded-lg bg-bone/50 p-2.5 text-[10.5px] tracking-tight text-charcoal/55">
                  Aucun log.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {patientLogs.map((l) => (
                    <div key={l.id} className="border-l-2 border-teal-200 pl-2.5">
                      <p className="text-[10.5px] leading-relaxed text-navy-900">
                        {l.detail}
                      </p>
                      <p className="text-[9.5px] tracking-tight text-charcoal/45">
                        {l.user} · {formatDateTime(l.at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── 6. NOTES INTERNES — bloc dernier (visuellement secondaire) ───
              Style délibérément distinct : fond navy léger + bord pointillé +
              tag uppercase ✦ Note interne. Impossible de confondre avec une
              réponse envoyée au patient. */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
            <div className="flex items-center justify-between border-b border-navy-900/[0.05] px-4 py-2.5">
              <div>
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-navy-900/70">
                  Notes internes
                </p>
                <p className="mt-0.5 text-[10.5px] tracking-tight text-charcoal/55">
                  Visibles équipe uniquement · jamais envoyées au patient
                </p>
              </div>
              <span className="flex h-5 min-w-[22px] items-center justify-center rounded-md bg-navy-900 px-1.5 text-[10.5px] font-semibold text-white">
                {notesCount}
              </span>
            </div>
            <div className="max-h-[260px] space-y-2.5 overflow-y-auto px-3 py-3">
              <div className="flex gap-1.5">
                <input
                  ref={noteInputRef}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ajouter une note interne…"
                  className="flex-1 rounded-lg border border-navy-900/[0.08] px-2.5 py-1.5 text-[11.5px] outline-none focus:border-teal-500/60"
                />
                <button
                  type="button"
                  disabled={!noteText.trim()}
                  onClick={() => {
                    k.addNote(patient.id, noteText.trim());
                    setNoteText("");
                  }}
                  className="rounded-md bg-navy-900 px-2.5 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-charcoal/20"
                >
                  +
                </button>
              </div>
              {patient.notes.length === 0 ? (
                <p className="rounded-lg bg-bone/50 p-2.5 text-[10.5px] tracking-tight text-charcoal/55">
                  Aucune note pour le moment. Les notes internes ne sont jamais
                  envoyées au patient.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {patient.notes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg border border-dashed border-navy-900/15 bg-navy-50/40 p-2.5"
                    >
                      <p className="mb-1 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-navy-700">
                        ✦ Note interne
                      </p>
                      <p className="whitespace-pre-wrap text-[11.5px] text-navy-900">
                        {n.text}
                      </p>
                      <p className="mt-1 text-[9.5px] tracking-tight text-charcoal/45">
                        {n.author} · {formatDateTime(n.at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
        </div>
        {/* /Pane droit */}
      </div>
      {/* /Workspace flex */}

      {/* ============================================================
          MODALES — préservées intégralement.
          ============================================================ */}

      {/* Modal Contacter le cabinet — transmission factuelle prérelevée. */}
      <Modal
        open={contactCabinetOpen}
        onClose={() => setContactCabinetOpen(false)}
        title="Transmission cabinet"
        wide
      >
        {(() => {
          const lastPatientMsgs = patient.messages
            .filter((m) => m.author === "patient")
            .slice(-3)
            .map((m) => `- ${m.text}`)
            .join("\n");
          const elementsDeclares =
            lastPatientMsgs || "- Aucun élément déclaré sur la période.";
          const message = `Bonjour Dr ${k
            .surgeonName(patient.surgeonId)
            .replace(/^Dr\.?\s*/i, "")},

Transmission KOVELA selon référentiel cabinet.

Patient : ${initials} · ${patient.id}
Intervention : ${patient.intervention}
J+ : ${day}

Éléments déclarés par le patient :
${elementsDeclares}

Action demandée :
Merci de nous indiquer si vous souhaitez une action spécifique du cabinet.

KOVELA — transmission factuelle, sans interprétation médicale.`;

          // Capture locale pour stabiliser le narrowing TypeScript dans les
          // closures (function declarations perdent le narrowing du parent).
          const p = patient;
          const lastPatientMsgText =
            [...p.messages].reverse().find((m) => m.author === "patient")?.text ?? "—";

          function copy() {
            navigator.clipboard?.writeText(message).catch(() => undefined);
            setContactCabinetCopied(true);
            setHasCopiedTransmission(true);
            // Persiste compilationDraft si pas déjà présent → reflète l'avancée
            // dans le pipeline (Préparée + Copiée) côté onglet Transmissions.
            if (!p.compilationDraft) {
              k.prepareCompilation(p.id, message);
            }
            setTimeout(() => setContactCabinetCopied(false), 2500);
          }

          function markAsSent() {
            if (!p.compilationDraft) {
              k.prepareCompilation(p.id, message);
            }
            k.transmitCompilation(p.id);
            setTransmissionMarkedSent(true);
            setContactCabinetOpen(false);
          }

          const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
          const alreadySent =
            escalation?.status === "transmise" || transmissionMarkedSent;

          return (
            <div className="space-y-4">
              {/* Récap factuel structuré — destinataire, contexte patient,
                  référentiel actif, dernier message patient, action demandée. */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-navy-900/[0.05]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                    Destinataire
                  </p>
                  <p className="mt-1 text-[12.5px] font-medium tracking-tight text-navy-900">
                    {k.surgeonName(patient.surgeonId)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-charcoal/60">{refl.cabinet}</p>
                  <p className="mt-0.5 text-[10.5px] text-charcoal/55">
                    Contact prioritaire : {refl.contact_prioritaire}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-navy-900/[0.05]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                    Patient
                  </p>
                  <p className="mt-1 text-[12.5px] font-medium tracking-tight text-navy-900">
                    {initials} · {patient.id}
                  </p>
                  <p className="mt-0.5 text-[11px] text-charcoal/65">
                    {patient.intervention} · {day}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-charcoal/55">
                    Référentiel actif : {refl.version}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50/40 px-3.5 py-2.5 ring-1 ring-amber-200/40">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                  Dernier message patient
                </p>
                <p className="mt-1 line-clamp-3 text-[11.5px] leading-relaxed tracking-tight text-amber-900">
                  « {lastPatientMsgText} »
                </p>
              </div>

              <div className="rounded-xl bg-bone/60 px-4 py-3 ring-1 ring-navy-900/[0.05]">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                    Message factuel pré-rempli
                  </p>
                  <p className="text-[10px] tracking-tight text-charcoal/45">
                    Action demandée : retour cabinet
                  </p>
                </div>
                <pre className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-sans text-[12px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.06]">
                  {message}
                </pre>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={copy}>
                  {contactCabinetCopied ? "Copié ✓" : "Copier le message"}
                </Button>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-white px-4 py-2 text-[12.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/15 transition-colors hover:bg-bone"
                >
                  Ouvrir WhatsApp ↗ (prototype)
                </a>
                <Button
                  variant="secondary"
                  onClick={markAsSent}
                  disabled={alreadySent}
                >
                  {alreadySent
                    ? "Transmis ✓ (prototype)"
                    : "Marquer comme transmis — prototype"}
                </Button>
              </div>
              <p className="text-[10.5px] tracking-tight text-charcoal/55">
                Marquer comme transmis : ajoute automatiquement l&apos;événement au journal
                d&apos;action et passe le pipeline en « Envoyée (prototype) ».
              </p>

              <div className="rounded-xl border border-amber-200/40 bg-amber-50/30 px-4 py-3 text-[11px] leading-relaxed text-amber-900">
                <p className="font-semibold">Prototype — canal réel à valider en V1</p>
                <p className="mt-1">
                  Aucun envoi réel. Le canal de transmission cabinet (WhatsApp Business, SMS,
                  email sécurisé, intégration métier) reste à valider en V1 selon le cadre RGPD
                  / HDS et le contrat de service avec le cabinet. WhatsApp est présenté ici à
                  titre de prototype d&apos;ergonomie uniquement.
                </p>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" onClick={() => setContactCabinetOpen(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Modal confirmation clôture suivi — workflow réel à finaliser en V1. */}
      <Modal
        open={closeConfirmOpen}
        onClose={() => setCloseConfirmOpen(false)}
        title="Clôturer le suivi"
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed tracking-tight text-navy-900">
            Confirmez-vous la clôture du suivi de{" "}
            <span className="font-semibold">{patient.name}</span> ?
          </p>
          <div className="rounded-xl bg-bone/60 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-charcoal/70 ring-1 ring-navy-900/[0.05]">
            <p>
              <span className="font-medium text-navy-900">Avant clôture</span> · vérifier que
              le CR factuel est validé et publié pour le chirurgien, et que toutes les
              transmissions cabinet ont reçu un retour.
            </p>
            <p className="mt-1.5">
              <span className="font-medium text-navy-900">Statut courant</span> ·{" "}
              {opStatus ? operationalStatusLabels[opStatus] : "Suivi habituel"} · {followUp.label}
            </p>
            <p className="mt-1.5">
              <span className="font-medium text-navy-900">Dernier CR factuel</span> ·{" "}
              {report ? crStatusLabels[report.status] : "Aucun CR préparé"}
            </p>
          </div>
          <p className="rounded-lg bg-amber-50/40 px-3 py-2 text-[11px] leading-relaxed text-amber-900 ring-1 ring-amber-200/50">
            Le suivi sera marqué comme clôturé dans le prototype. Workflow réel à finaliser en
            V1 (signature électronique, archivage, dossier transmis cabinet).
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={() => setCloseConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                k.clotureSuivi(patient.id);
                setCloseConfirmOpen(false);
              }}
            >
              Confirmer la clôture
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal prévisualisation message programmé */}
      <Modal
        open={scheduledPreview !== null}
        onClose={() => setScheduledPreview(null)}
        title={scheduledPreview ? `Prévisualisation — ${scheduledPreview.label}` : ""}
        wide
      >
        {scheduledPreview && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={scheduledMessageStatusStyles[scheduledPreview.status]}>
                {scheduledMessageStatusLabels[scheduledPreview.status]}
              </Badge>
              <span className="text-[11.5px] tracking-tight text-charcoal/55">
                {scheduledPreview.status === "en_retard"
                  ? "Échéance dépassée le "
                  : "Prévu le "}
                {new Date(scheduledPreview.targetDate).toLocaleDateString("fr-FR")} · template{" "}
                {scheduledPreview.templateKey}
              </span>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl bg-bone/60 p-4 font-sans text-[13px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
              {scheduledPreview.template}
            </pre>
            <p className="rounded-lg bg-amber-50/40 px-3 py-2 text-[11.5px] leading-relaxed text-amber-900 ring-1 ring-amber-200/50">
              <span className="font-semibold">Prototype :</span> ce message est ajouté à la
              timeline locale. Aucun envoi réel n'est effectué.
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => setScheduledPreview(null)}>
                Fermer
              </Button>
              {scheduledPreview.status !== "envoye" && (
                <Button
                  variant="primary"
                  onClick={() => sendScheduledNow(scheduledPreview)}
                >
                  Simuler l'envoi
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal raccourcis clavier — aide productivité superviseur. */}
      <Modal
        open={shortcutsHelpOpen}
        onClose={() => setShortcutsHelpOpen(false)}
        title="Raccourcis clavier"
      >
        <p className="mb-4 text-[12.5px] leading-relaxed tracking-tight text-charcoal/65">
          Les raccourcis simples s&apos;activent quand aucun champ de saisie
          n&apos;est focusé. Pendant la saisie, seuls les modificateurs
          (Cmd/Ctrl) et Échap restent actifs.
        </p>
        <dl className="divide-y divide-navy-900/[0.05] rounded-xl bg-bone/40 px-4 py-2 ring-1 ring-navy-900/[0.05]">
          {[
            ["e", "Focus la zone de réponse patient"],
            ["t", "Ouvrir la modale Transmission cabinet"],
            ["c", "Focus le champ Note interne"],
            ["n", "Ouvrir le patient suivant à traiter"],
            ["/", "Focus la recherche de la file patient"],
            ["?", "Ouvrir / fermer cette aide"],
            ["⌘+Entrée", "Envoyer le message depuis la zone de réponse"],
            ["Échap", "Fermer la modale ou le dropdown actif"],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-2">
              <dt className="font-mono text-[11.5px] font-semibold tracking-tight text-navy-900">
                <kbd className="rounded-md bg-white px-2 py-0.5 ring-1 ring-navy-900/[0.08]">
                  {key}
                </kbd>
              </dt>
              <dd className="flex-1 text-right text-[12px] tracking-tight text-charcoal/70">
                {desc}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[10.5px] tracking-tight text-charcoal/50">
          Les raccourcis sont valables sur la fiche patient. Une command palette
          globale arrive en V1.
        </p>
      </Modal>

      {/* Modal templates */}
      <Modal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        title="Bibliothèque de templates"
        wide
      >
        <p className="mb-4 text-[12px] tracking-tight text-charcoal/55">
          Aucun template ne donne de conseil médical. Coordination uniquement.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setReply((prev) => (prev ? prev + "\n\n" : "") + t.body);
                setTemplatesOpen(false);
              }}
              className="rounded-xl border border-navy-900/[0.08] p-3 text-left transition-colors hover:border-teal-500/40 hover:bg-teal-50/40"
            >
              <p className="text-[13px] font-medium tracking-tight text-navy-900">{t.title}</p>
              <p className="mt-1 line-clamp-2 text-[11.5px] tracking-tight text-charcoal/55">
                {t.body}
              </p>
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal sortie IA */}
      <Modal open={aiKind !== null} onClose={closeAi} title={aiKind ? aiTitles[aiKind] : ""} wide>
        {editing ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11.5px] font-semibold tracking-tight text-teal-700">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-teal-600 text-[10px] font-bold text-white">
                IA
              </span>
              Brouillon IA — modification par la superviseuse
            </div>
            <textarea
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              rows={14}
              className="w-full rounded-xl border border-navy-900/[0.08] p-3 font-sans text-[13px] leading-relaxed outline-none focus:border-teal-500/60"
            />
            <div className="mt-3 flex gap-2">
              <Button variant="primary" onClick={acceptAi}>
                Valider la version modifiée
              </Button>
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Annuler
              </Button>
            </div>
          </div>
        ) : aiKind === "preparation_cr" ? (
          <CrPreparationView
            output={aiOutput}
            patientName={patient.name}
            intervention={patient.intervention}
            day={day}
            surgeonName={k.surgeonName(patient.surgeonId)}
            crStatusLabel={report ? crStatusLabels[report.status] : "Aucun CR préparé"}
            estimatedMinutesLabel={formatMinutes(aiEstimatedMinutes("preparation_cr"))}
            onAccept={acceptAi}
            onModify={() => setEditing(true)}
            onRefuse={refuseAi}
          />
        ) : (
          <AiSuggestion
            output={aiOutput}
            estimatedMinutesLabel={
              aiKind ? formatMinutes(aiEstimatedMinutes(aiKind)) : undefined
            }
            onAccept={acceptAi}
            onModify={() => setEditing(true)}
            onRefuse={refuseAi}
          />
        )}
      </Modal>
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Vue structurée de la préparation de brouillon de CR — rendue dans la modale.
// ---------------------------------------------------------------------------
const BROUILLON_SECTIONS: { key: string; title: string }[] = [
  { key: "Messages principaux", title: "Messages principaux" },
  { key: "Relances", title: "Relances effectuées" },
  { key: "Actions KOVELA", title: "Actions KOVELA" },
  { key: "Transmission cabinet", title: "Transmission cabinet" },
  { key: "Statut final", title: "Statut final" },
];

function parseBrouillonSections(output: string): { title: string; lines: string[] }[] {
  const lines = output.split("\n");
  const headerIndexes: { idx: number; title: string }[] = [];
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    const match = BROUILLON_SECTIONS.find((s) =>
      trimmed.startsWith(`${s.key} :`) || trimmed === `${s.key} :`
    );
    if (match) headerIndexes.push({ idx, title: match.title });
  });
  return headerIndexes.map((h, i) => {
    const start = h.idx;
    const end = headerIndexes[i + 1]?.idx ?? lines.length;
    const block = lines.slice(start, end);
    const first = block[0]?.trim() ?? "";
    const headerLabel = BROUILLON_SECTIONS.find((s) => s.title === h.title)!.key;
    const inlineRest = first.startsWith(`${headerLabel} :`)
      ? first.slice(headerLabel.length + 1).trim()
      : "";
    const rest = block
      .slice(1)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("⚠"));
    const content = [inlineRest, ...rest].filter((l) => l.length > 0);
    return { title: h.title, lines: content };
  });
}

function CrPreparationView({
  output,
  patientName,
  intervention,
  day,
  surgeonName,
  crStatusLabel,
  estimatedMinutesLabel,
  onAccept,
  onModify,
  onRefuse,
}: {
  output: string;
  patientName: string;
  intervention: string;
  day: string;
  surgeonName: string;
  crStatusLabel: string;
  estimatedMinutesLabel: string;
  onAccept: () => void;
  onModify: () => void;
  onRefuse: () => void;
}) {
  const sections = parseBrouillonSections(output);
  const checklist = [
    "Identité patient vérifiée",
    "Période de suivi cohérente",
    "Messages clés présents",
    "Transmission cabinet cohérente",
    "Aucune formulation médicale ajoutée",
  ];
  const resume: { label: string; value: string }[] = [
    { label: "Patient", value: patientName },
    { label: "Intervention", value: intervention },
    { label: "Période", value: day },
    { label: "Chirurgien", value: surgeonName },
    { label: "Statut CR", value: crStatusLabel },
  ];

  return (
    <div className="rounded-2xl border border-teal-100/80 bg-white p-5 shadow-card ring-1 ring-teal-100/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-teal-100/60 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-md bg-teal-600 text-[9.5px] font-bold tracking-tight text-white">
            IA
          </span>
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-teal-700">
            Suggestion IA — à valider par un humain
          </span>
        </div>
        <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10.5px] text-teal-700 ring-1 ring-teal-100">
          Estimation prototype — {estimatedMinutesLabel}
        </span>
      </div>

      <section className="mb-5">
        <h4 className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
          Résumé patient
        </h4>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 rounded-xl bg-bone/60 p-3 text-[12px] leading-relaxed ring-1 ring-navy-900/[0.04] sm:grid-cols-2">
          {resume.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-charcoal/55">{r.label}</dt>
              <dd className="text-right tracking-tight text-navy-900">{r.value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-5">
        <h4 className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
          Brouillon CR factuel
        </h4>
        <div className="space-y-2.5">
          {sections.length === 0 ? (
            <pre className="whitespace-pre-wrap rounded-xl bg-bone/60 p-3 font-sans text-[12.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
              {output}
            </pre>
          ) : (
            sections.map((s) => (
              <div
                key={s.title}
                className="rounded-xl bg-bone/60 p-3 ring-1 ring-navy-900/[0.04]"
              >
                <div className="mb-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-navy-700">
                  {s.title}
                </div>
                <ul className="space-y-0.5 text-[12.5px] leading-relaxed text-navy-900">
                  {s.lines.length === 0 ? (
                    <li className="text-charcoal/55">—</li>
                  ) : (
                    s.lines.map((line, i) => (
                      <li key={i} className="tracking-tight">
                        {line.startsWith("—") ? line : `— ${line}`}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mb-5">
        <h4 className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
          Checklist avant validation
        </h4>
        <ul className="space-y-1 rounded-xl bg-teal-50/40 p-3 text-[12px] leading-relaxed ring-1 ring-teal-100/60">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-2 text-navy-900">
              <span
                aria-hidden
                className="mt-[3px] flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded border border-teal-600/50 bg-white text-[9px] text-teal-700"
              >
                ✓
              </span>
              <span className="tracking-tight">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mb-5 rounded-xl bg-amber-50/60 px-3 py-2 text-[11.5px] leading-relaxed tracking-tight text-amber-900 ring-1 ring-amber-100">
        Brouillon IA à relire et valider avant disponibilité chirurgien — synthèse opérationnelle non médicale.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={onAccept}>
          Relire et valider
        </Button>
        <Button variant="secondary" onClick={onModify}>
          Modifier le brouillon
        </Button>
        <Button variant="ghost" onClick={onRefuse}>
          Rejeter
        </Button>
      </div>
    </div>
  );
}
