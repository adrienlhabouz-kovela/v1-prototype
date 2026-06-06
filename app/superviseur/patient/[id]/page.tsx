"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Shell } from "@/components/Shell";
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
  getOperationalStatus,
  getPostOpDay,
  getRecommendedAction,
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
  compilation_escalade: "Compilation factuelle d'escalade",
};

type RightTab = "actions" | "transmissions" | "cr" | "notes" | "journal";

const rightTabLabels: Record<RightTab, string> = {
  actions: "Actions",
  transmissions: "Transmissions",
  cr: "CR",
  notes: "Notes",
  journal: "Journal",
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
  const patient = k.patients.find((p) => p.id === params.id);

  const [reply, setReply] = useState("");
  const [noteText, setNoteText] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [aiKind, setAiKind] = useState<AiKind | null>(null);
  const [aiOutput, setAiOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [scheduledPreview, setScheduledPreview] = useState<ScheduledMessage | null>(null);
  const [sentScheduledIds, setSentScheduledIds] = useState<Set<string>>(() => new Set());
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("all");
  const [contactCabinetOpen, setContactCabinetOpen] = useState(false);
  const [contactCabinetCopied, setContactCabinetCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<RightTab>("actions");

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
  else if (patient.status === "silencieux") primaryKey = "relance_patient";
  else if (followUp.status === "termine" && !report) primaryKey = "prepare_cloture";
  else if (followUp.status === "termine" && report?.status === "disponible")
    primaryKey = "cloturer_suivi";

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
      label: "Rendre disponible chirurgien",
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
      handler: () => k.clotureSuivi(patient.id),
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

  // Compteurs sur tabs — alertent visuellement quand action requise.
  const transmissionsCount =
    (patient.compilationDraft ? 1 : 0) + (escalation?.status === "transmise" ? 1 : 0);
  const crBadge = report ? crStatusLabels[report.status] : null;
  const notesCount = patient.notes.length;
  const journalCount = patientLogs.length;
  const scheduledTodayCount = scheduledMessages.filter(
    (m) => m.status === "a_valider" || m.status === "en_retard"
  ).length;

  const initials = getInitials(patient.name);

  return (
    <Shell>
      {/* ============================================================
          BANDEAU PATIENT — compact, dense, action immédiatement visible.
          ============================================================ */}
      <Link
        href="/superviseur"
        className="mb-3 inline-block text-[12px] tracking-tight text-teal-700 hover:text-teal-800"
      >
        ← Cockpit
      </Link>

      <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
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
                </div>
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
                        handler: () => k.clotureSuivi(patient.id),
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
        {/* ===== COLONNE GAUCHE — Contexte patient compact ===== */}
        <aside className="space-y-3 lg:col-span-3">
          <div className="rounded-2xl bg-teal-50/40 px-4 py-3 ring-1 ring-teal-100/60">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700">
              Référentiel actif
            </p>
            <p className="mt-1.5 text-[12.5px] font-medium tracking-tight text-navy-900">
              {refl.intervention}
            </p>
            <p className="mt-0.5 text-[11px] text-charcoal/65">
              {k.surgeonName(patient.surgeonId)} · {refl.version}
            </p>
          </div>

          <Card>
            <CardHeader title="Contexte patient" />
            <dl className="space-y-2 px-4 py-3 text-[12px]">
              {[
                ["Intervention", patient.intervention],
                ["Date", formatDate(patient.interventionDate)],
                ["Jour post-op", day],
                ["Suivi prévu", patient.protocol],
                ["Cabinet", refl.cabinet],
                ["Canal patient", "Interface KOVELA"],
                [
                  "Dernier contact",
                  last.ageLabel ? `${last.label} — ${last.ageLabel}` : "—",
                ],
                ["Contact prioritaire", refl.contact_prioritaire],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 border-b border-navy-900/[0.04] pb-1.5 last:border-0"
                >
                  <dt className="shrink-0 text-charcoal/55">{label}</dt>
                  <dd className="text-right font-medium tracking-tight text-navy-900">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card>
            <CardHeader
              title="Fenêtre de suivi"
              action={
                <Badge className={followUpStatusStyles[followUp.status]}>
                  {followUp.status === "en_cours"
                    ? "En cours"
                    : followUp.status === "proche_cloture"
                    ? "Proche clôture"
                    : followUp.status === "termine"
                    ? "Terminé"
                    : "Hors fenêtre"}
                </Badge>
              }
            />
            <div className="px-4 py-3">
              <dl className="space-y-2 text-[12px]">
                {[
                  ["Début", formatDate(followUp.startDate)],
                  ["Fin prévue", formatDate(followUp.endDate)],
                  [
                    "Restant",
                    followUp.daysRemaining === 0
                      ? "Fin aujourd'hui"
                      : followUp.daysRemaining > 0
                      ? `${followUp.daysRemaining}j`
                      : `Terminé depuis ${Math.abs(followUp.daysRemaining)}j`,
                  ],
                  ["Progression", `${followUp.progressPercent} %`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-3 border-b border-navy-900/[0.04] pb-1.5 last:border-0"
                  >
                    <dt className="shrink-0 text-charcoal/55">{label}</dt>
                    <dd className="text-right font-medium tracking-tight text-navy-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-navy-900/[0.06]">
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
          </Card>
        </aside>

        {/* ===== COLONNE CENTRE — Conversation patient (zone dominante) ===== */}
        <section className="lg:col-span-6">
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

            {/* Timeline — défile, occupe l'espace disponible. */}
            <div className="max-h-[calc(100vh-22rem)] min-h-[420px] overflow-y-auto bg-bone/20 px-5 py-4">
              {filteredTimeline.length === 0 ? (
                <p className="py-12 text-center text-[12px] tracking-tight text-charcoal/45">
                  Aucun événement pour ce filtre.
                </p>
              ) : (
                <ol className="relative space-y-3">
                  <span className="absolute left-[6.5px] top-2 bottom-2 w-px bg-navy-900/[0.06]" />
                  {filteredTimeline.map((e) => (
                    <li key={e.id} className="relative flex gap-3.5">
                      <span
                        className={`mt-1.5 h-[13px] w-[13px] shrink-0 rounded-full ring-2 ring-white ${timelineDot(
                          e.kind
                        )}`}
                      />
                      <div className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 ring-1 ring-navy-900/[0.05]">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
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
                          <p className="mt-1.5 whitespace-pre-wrap text-[12.5px] leading-relaxed text-charcoal/75">
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
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Composer — collé en bas, dominé visuellement par la conversation. */}
            <div className="border-t border-navy-900/[0.05] bg-white px-5 py-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Écrire une réponse de coordination — pas d'avis médical."
                className="w-full resize-none rounded-xl border border-navy-900/[0.08] p-3 text-[13px] outline-none transition-colors focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10"
              />
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Button variant="subtle" onClick={() => setTemplatesOpen(true)}>
                  Templates
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => runAi("reformulation")}
                  disabled={!reply.trim()}
                >
                  Reformuler (IA)
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => runAi("resume_conversation")}
                >
                  Résumer la conversation
                </Button>
                <div className="ml-auto">
                  <Button
                    variant="primary"
                    disabled={!reply.trim()}
                    onClick={() => {
                      k.sendMessage(patient.id, reply.trim(), "superviseur");
                      setReply("");
                    }}
                  >
                    Envoyer
                  </Button>
                </div>
              </div>
              {/* Rappel doctrine discret — sous le composer, visible mais non invasif. */}
              <p className="mt-2.5 text-[10.5px] leading-relaxed tracking-tight text-charcoal/55">
                <span className="font-medium text-amber-900">15 / 112 / urgences clinique</span>
                {" · "}KOVELA ne prend pas en charge les urgences. Si le patient décrit une
                situation urgente, l'orienter vers le 15 / 112 ou les consignes du chirurgien,
                puis transmettre au cabinet.
              </p>
            </div>
          </div>
        </section>

        {/* ===== COLONNE DROITE — Onglets opérationnels ===== */}
        <aside className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
            {/* Barre d'onglets — séparation visuelle forte avec la conversation. */}
            <div className="flex border-b border-navy-900/[0.06] bg-bone/40">
              {(Object.keys(rightTabLabels) as RightTab[]).map((t) => {
                const isActive = activeTab === t;
                let badge: string | null = null;
                if (t === "transmissions" && transmissionsCount > 0)
                  badge = String(transmissionsCount);
                if (t === "cr" && crBadge) badge = crBadge.slice(0, 3).toUpperCase();
                if (t === "notes" && notesCount > 0) badge = String(notesCount);
                if (t === "journal" && journalCount > 0) badge = String(journalCount);
                if (t === "actions" && scheduledTodayCount > 0)
                  badge = String(scheduledTodayCount);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setActiveTab(t)}
                    className={`relative flex-1 px-2 py-2.5 text-[11.5px] font-medium tracking-tight transition-colors ${
                      isActive
                        ? "bg-white text-navy-900"
                        : "text-charcoal/55 hover:bg-white/60 hover:text-navy-900"
                    }`}
                  >
                    <span>{rightTabLabels[t]}</span>
                    {badge && (
                      <span
                        className={`ml-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold ${
                          isActive
                            ? "bg-teal-50 text-teal-700 ring-1 ring-teal-100"
                            : "bg-navy-900/[0.06] text-charcoal/70"
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-teal-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Contenu d'onglet — défile indépendamment de la conversation. */}
            <div className="max-h-[calc(100vh-18rem)] overflow-y-auto px-4 py-4">
              {activeTab === "actions" && (
                <div className="space-y-4">
                  {/* Action recommandée — résumé. */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Action recommandée
                    </p>
                    <p className="mt-1.5 text-[13px] font-medium tracking-tight text-navy-900">
                      {recommended.label}
                    </p>
                    {recommended.delay && (
                      <p className="mt-0.5 text-[11.5px] tracking-tight text-charcoal/60">
                        {recommended.delay}
                      </p>
                    )}
                    <div className="mt-2.5">
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={primary.handler}
                        disabled={primary.disabled}
                      >
                        {primary.label}
                      </Button>
                    </div>
                  </div>

                  {/* Messages programmés — selon référentiel. */}
                  <div className="border-t border-navy-900/[0.05] pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Messages programmés
                    </p>
                    <p className="mt-1 text-[11px] tracking-tight text-charcoal/55">
                      {nextScheduled
                        ? `Prochain : ${nextScheduled.label} · ${new Date(
                            nextScheduled.targetDate
                          ).toLocaleDateString("fr-FR")}`
                        : "Aucun message prévu"}
                    </p>
                    <div className="mt-2 space-y-2">
                      {scheduledMessages.map((m) => {
                        const dt = new Date(m.targetDate);
                        const dateLabel = dt.toLocaleDateString("fr-FR");
                        const sent = m.status === "envoye";
                        const late = m.status === "en_retard";
                        return (
                          <div
                            key={m.id}
                            className="rounded-lg bg-bone/50 px-3 py-2 ring-1 ring-navy-900/[0.04]"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <p className="text-[12px] font-medium tracking-tight text-navy-900">
                                {m.label}
                              </p>
                              <Badge className={scheduledMessageStatusStyles[m.status]}>
                                {scheduledMessageStatusLabels[m.status]}
                              </Badge>
                            </div>
                            <p className="mt-1 text-[10.5px] tracking-tight text-charcoal/55">
                              {late ? "Échéance " : "Prévu "}
                              {dateLabel}
                            </p>
                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() => setScheduledPreview(m)}
                                className="rounded-md bg-white px-2 py-1 text-[10.5px] font-medium tracking-tight text-navy-900 ring-1 ring-navy-900/10 transition-colors hover:bg-bone"
                              >
                                Prévisualiser
                              </button>
                              {!sent && (
                                <button
                                  type="button"
                                  onClick={() => sendScheduledNow(m)}
                                  className="rounded-md bg-teal-600 px-2 py-1 text-[10.5px] font-medium tracking-tight text-white transition-colors hover:bg-teal-700"
                                >
                                  Simuler l'envoi
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Référentiel applicable — quatre catégories opérables. */}
                  <div className="border-t border-navy-900/[0.05] pt-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Référentiel applicable
                    </p>
                    <p className="mt-1 text-[11px] tracking-tight text-charcoal/55">
                      {refl.intervention} — {refl.version}
                    </p>
                    <div className="mt-2 space-y-2">
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
                            className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${bloc.eyebrowCls}`}
                          >
                            {bloc.label}
                          </p>
                          <ul className="mt-1 space-y-0.5">
                            {bloc.items.map((it) => (
                              <li
                                key={it}
                                className="flex items-start gap-1.5 text-[11px] leading-relaxed tracking-tight text-charcoal/75"
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
                  </div>
                </div>
              )}

              {activeTab === "transmissions" && (
                <div className="space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                    Transmissions cabinet
                  </p>
                  {escalation?.status === "transmise" ? (
                    <>
                      <Badge className="bg-navy-900 text-teal-100 ring-navy-900">
                        Transmission cabinet en cours
                      </Badge>
                      {escalation.compilation && (
                        <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-3 font-sans text-[11.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                          {escalation.compilation}
                        </pre>
                      )}
                      <p className="text-[11px] tracking-tight text-charcoal/55">
                        En attente de retour cabinet — consigner la réponse dans le journal
                        d'action une fois reçue.
                      </p>
                    </>
                  ) : patient.compilationDraft ? (
                    <>
                      <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                        Brouillon préparé (interne)
                      </Badge>
                      <p className="text-[11px] tracking-tight text-charcoal/55">
                        Préparée en interne — n'ouvre pas de transmission tant qu'elle n'est
                        pas envoyée.
                      </p>
                      <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-3 font-sans text-[11.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                        {patient.compilationDraft}
                      </pre>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="primary"
                          onClick={() => k.transmitCompilation(patient.id)}
                        >
                          Transmettre au cabinet
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setContactCabinetOpen(true);
                            setContactCabinetCopied(false);
                          }}
                        >
                          Préparer message cabinet
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[11.5px] leading-relaxed tracking-tight text-charcoal/65">
                        Aucune compilation préparée. Utilisez « Préparer compilation factuelle »
                        pour réunir les éléments selon le référentiel. La transmission cabinet
                        reste une action explicite.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="primary"
                          onClick={() => runAi("compilation_escalade")}
                        >
                          Préparer compilation factuelle
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
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "cr" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Compte-rendu factuel
                    </p>
                    {report && (
                      <Badge className={crStatusStyles[report.status]}>
                        {crStatusLabels[report.status]}
                      </Badge>
                    )}
                  </div>
                  {report ? (
                    <>
                      {report.status === "valide" && (
                        <p className="text-[11px] tracking-tight text-charcoal/55">
                          Validé KOVELA — à rendre disponible chirurgien.
                        </p>
                      )}
                      {report.status === "brouillon" && (
                        <p className="text-[11px] tracking-tight text-charcoal/55">
                          Brouillon préparé par l&apos;IA — à relire, corriger si besoin, puis
                          valider.
                        </p>
                      )}
                      <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-3 font-sans text-[11.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                        {report.content}
                      </pre>
                      <div className="flex flex-wrap gap-2">
                        {report.status === "brouillon" && (
                          <Button
                            variant="primary"
                            onClick={() => k.validateReport(patient.id)}
                          >
                            Relire et valider
                          </Button>
                        )}
                        {report.status !== "disponible" && (
                          <Button
                            variant="secondary"
                            onClick={() => k.publishReport(patient.id)}
                          >
                            Rendre disponible chirurgien
                          </Button>
                        )}
                        <Button
                          variant="subtle"
                          onClick={() => navigator.clipboard?.writeText(report.content)}
                        >
                          Copier
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <dl className="space-y-1.5 rounded-lg bg-bone/60 p-3 text-[11.5px] leading-relaxed ring-1 ring-navy-900/[0.04]">
                        {[
                          ["Intervention", patient.intervention],
                          ["Jour post-op", day],
                          [
                            "Dernier contact",
                            last.ageLabel ? `${last.label} — ${last.ageLabel}` : "—",
                          ],
                          [
                            "Photos reçues",
                            patient.messages.some((m) =>
                              m.attachments?.some((a) => a.kind === "photo")
                            )
                              ? "Oui"
                              : "Non",
                          ],
                          ["Statut", opStatus ? operationalStatusLabels[opStatus] : "—"],
                          ["Prochaine étape", recommended.label],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="flex items-baseline justify-between gap-3"
                          >
                            <dt className="shrink-0 text-charcoal/55">{label}</dt>
                            <dd className="text-right tracking-tight text-navy-900">
                              {value || "—"}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => runAi("preparation_cr")}
                      >
                        Préparer brouillon IA
                      </Button>
                    </>
                  )}
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Notes internes
                    </p>
                    <span className="text-[10.5px] tracking-tight text-charcoal/55">
                      Visibles équipe uniquement
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Ajouter une note interne…"
                      className="flex-1 rounded-lg border border-navy-900/[0.08] px-3 py-2 text-[12px] outline-none focus:border-teal-500/60"
                    />
                    <Button
                      variant="subtle"
                      disabled={!noteText.trim()}
                      onClick={() => {
                        k.addNote(patient.id, noteText.trim());
                        setNoteText("");
                      }}
                    >
                      +
                    </Button>
                  </div>
                  {patient.notes.length === 0 ? (
                    <p className="rounded-lg bg-bone/50 p-3 text-[11.5px] tracking-tight text-charcoal/55">
                      Aucune note pour le moment.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {patient.notes.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-lg bg-bone/60 p-3 ring-1 ring-navy-900/[0.04]"
                        >
                          <p className="whitespace-pre-wrap text-[12px] text-navy-900">
                            {n.text}
                          </p>
                          <p className="mt-1 text-[10px] tracking-tight text-charcoal/45">
                            {n.author} · {formatDateTime(n.at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "journal" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Journal d'action
                    </p>
                    <span className="text-[10.5px] tracking-tight text-charcoal/55">
                      {patientLogs.length} entrée{patientLogs.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  {patientLogs.length === 0 ? (
                    <p className="rounded-lg bg-bone/50 p-3 text-[11.5px] tracking-tight text-charcoal/55">
                      Aucun log.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {patientLogs.map((l) => (
                        <div key={l.id} className="border-l-2 border-teal-200 pl-3">
                          <p className="text-[11.5px] leading-relaxed text-navy-900">
                            {l.detail}
                          </p>
                          <p className="text-[10px] tracking-tight text-charcoal/45">
                            {l.user} · {formatDateTime(l.at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

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

          function copy() {
            navigator.clipboard?.writeText(message).catch(() => undefined);
            setContactCabinetCopied(true);
            setTimeout(() => setContactCabinetCopied(false), 2500);
          }

          const waLink = `https://wa.me/?text=${encodeURIComponent(message)}`;

          return (
            <div className="space-y-4">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  Destinataire
                </p>
                <p className="mt-1.5 text-[13.5px] font-medium tracking-tight text-navy-900">
                  {k.surgeonName(patient.surgeonId)} · {refl.cabinet}
                </p>
                <p className="mt-0.5 text-[11.5px] text-charcoal/60">
                  Contact prioritaire : {refl.contact_prioritaire}
                </p>
              </div>

              <div className="rounded-xl bg-bone/60 px-4 py-3 ring-1 ring-navy-900/[0.05]">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                  Message factuel pré-rempli
                </p>
                <pre className="mt-2 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-sans text-[12.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.06]">
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
              </div>

              <div className="rounded-xl border border-amber-200/40 bg-amber-50/30 px-4 py-3 text-[11px] leading-relaxed text-amber-900">
                <p className="font-semibold">Prototype</p>
                <p className="mt-1">
                  Aucun envoi réel. Le canal de transmission cabinet (WhatsApp, SMS, email,
                  intégration métier) reste à valider en V1 selon le cadre RGPD / HDS et le
                  contrat de service avec le cabinet.
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
