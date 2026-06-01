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

// ---------------------------------------------------------------------------
// Icône d'événement timeline — point coloré selon le type.
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

// ---------------------------------------------------------------------------
// Composant principal
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
  const [showAI, setShowAI] = useState(false);
  const [showTransmission, setShowTransmission] = useState(false);
  const [showScheduled, setShowScheduled] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [scheduledPreview, setScheduledPreview] = useState<ScheduledMessage | null>(null);
  const [sentScheduledIds, setSentScheduledIds] = useState<Set<string>>(() => new Set());
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>("all");

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
          ← Retour à l'inbox
        </Link>
      </Shell>
    );
  }

  const opStatus = getOperationalStatus(patient, ctx);
  const urgence = getUrgence(patient, ctx);
  const urgenceLabel = getUrgenceLabelDetailed(patient, ctx);
  const followUp = getFollowUpWindow(patient);

  // Messages programmés — dérivés du référentiel chirurgien + fenêtre de suivi.
  // Le statut "envoye" peut être augmenté par le set local (envois prototype).
  const scheduledMessages = getScheduledMessages(patient, ctx, surgeon).map((m) =>
    sentScheduledIds.has(m.id) ? { ...m, status: "envoye" as const } : m
  );
  const nextScheduled = getNextScheduledMessage(patient, ctx, surgeon);
  // Ouvre le bloc messages programmés automatiquement si action requise :
  // un message à valider aujourd'hui OU un message en retard non envoyé.
  const hasTodayScheduled = scheduledMessages.some(
    (m) =>
      (m.status === "a_valider" || m.status === "en_retard") &&
      !sentScheduledIds.has(m.id)
  );

  function sendScheduledNow(m: ScheduledMessage) {
    if (!patient) return;
    // Prototype : on envoie le template directement dans la timeline existante.
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

  // Actions rapides — handlers connectés aux actions store existantes ---------
  const canPrepareCR = !report || report.status === "brouillon";
  const canValidateCR = report?.status === "brouillon";
  const canPublishCR = report?.status === "valide";
  const canTransmitCompilation =
    !!patient.compilationDraft && escalation?.status !== "transmise";
  const hasUntreated =
    patient.messages.filter((m) => m.author === "patient" && !m.treated).length > 0;

  // Bouton primary = exactement l'action recommandée. Tous les autres tombent
  // en variant subtle ou secondary. Cohérence "prochaine action ↔ premier bouton".
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

  // Ordre : message > CR/transmission > silencieux > suivi terminé > habituel.
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

  return (
    <Shell>
      <Link
        href="/superviseur"
        className="mb-4 inline-block text-[12.5px] tracking-tight text-teal-700 hover:text-teal-800"
      >
        ← Inbox opérationnelle
      </Link>

      {/* BANNER ACTION — résumé action très visible */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
        <div className="border-l-[3px] border-teal-500/80 px-6 py-5">
          {/* Ligne 1 : patient · J+X · fenêtre · intervention · chirurgien */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-[1.7rem] font-medium leading-tight tracking-tight text-navy-900">
              {patient.name}
            </h1>
            <span className="font-mono text-[15px] font-medium tracking-tight text-teal-700">
              {day}
            </span>
            <span
              className={`text-[12.5px] tracking-tight ${
                followUp.status === "termine"
                  ? "text-amber-900"
                  : followUp.status === "proche_cloture"
                  ? "text-amber-800"
                  : "text-charcoal/60"
              }`}
            >
              · {followUp.label}
            </span>
            <span className="text-[13.5px] text-charcoal/65">·</span>
            <span className="text-[13.5px] tracking-tight text-charcoal/80">
              {patient.intervention}
            </span>
            <span className="text-[13.5px] text-charcoal/65">·</span>
            <span className="text-[13.5px] tracking-tight text-charcoal/65">
              {k.surgeonName(patient.surgeonId)}
            </span>
          </div>

          {/* Ligne 2 : statut + urgence + référentiel */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {opStatus && (
              <Badge className="bg-navy-900 text-white ring-navy-900">
                {operationalStatusLabels[opStatus]}
              </Badge>
            )}
            <Badge className={urgenceStyles[urgence]}>{urgenceLabel}</Badge>
            <Badge className="bg-bone/80 text-charcoal/75 ring-navy-900/[0.06]">
              Référentiel : {refl.version}
            </Badge>
          </div>

          {/* Ligne 3 : prochaine action */}
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-[13.5px] tracking-tight">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Prochaine action
            </span>
            <span className="font-medium text-navy-900">{recommended.label}</span>
            {recommended.delay && (
              <span className="text-charcoal/60">· {recommended.delay}</span>
            )}
          </p>

          {/* Actions rapides — 1 primary + 2 secondary visibles + overflow. */}
          {(() => {
            const secondaryCandidates: {
              label: string;
              handler: () => void;
              available: boolean;
            }[] = [
              {
                label: "Préparer brouillon IA",
                handler: () => runAi("preparation_cr"),
                available: primaryKey !== "prepare_cr" && canPrepareCR,
              },
              {
                label: "Transmettre au cabinet",
                handler: () => k.transmitCompilation(patient.id),
                available:
                  primaryKey !== "transmit_compilation" && canTransmitCompilation,
              },
              {
                label: "Relancer le patient",
                handler: () => k.relancePatient(patient.id),
                available:
                  primaryKey !== "relance_patient" && patient.status === "silencieux",
              },
              {
                label: "Marquer suivi habituel",
                handler: () => k.markTreated(patient.id),
                available:
                  primaryKey !== "mark_treated" && primaryKey !== "documenter_habituel",
              },
              {
                label: "Clôturer le suivi",
                handler: () => k.clotureSuivi(patient.id),
                available: true,
              },
            ];
            const available = secondaryCandidates.filter((a) => a.available);
            const visible = available.slice(0, 2);
            const overflow = available.slice(2);

            return (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  onClick={primary.handler}
                  disabled={primary.disabled}
                >
                  {primary.label}
                </Button>
                {visible.map((a) => (
                  <Button key={a.label} variant="subtle" onClick={a.handler}>
                    {a.label}
                  </Button>
                ))}
                {overflow.length > 0 && (
                  <details className="relative">
                    <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-[12px] font-medium tracking-tight text-charcoal/65 transition-colors hover:bg-navy-900/[0.04] hover:text-navy-900">
                      Autres actions ▾
                    </summary>
                    <div className="absolute right-0 z-10 mt-1.5 min-w-[200px] overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-navy-900/[0.08]">
                      {overflow.map((a) => (
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
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* LAYOUT 3 COLONNES */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* ===== COLONNE GAUCHE — Contexte patient ===== */}
        <aside className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader title="Contexte patient" subtitle="Comprendre en 10 secondes" />
            <dl className="space-y-2.5 px-5 py-4 text-[12.5px]">
              {[
                ["Patient", patient.name],
                ["Chirurgien", k.surgeonName(patient.surgeonId)],
                ["Cabinet", refl.cabinet],
                ["Intervention", patient.intervention],
                ["Date intervention", formatDate(patient.interventionDate)],
                ["Jour post-op", day],
                ["Suivi prévu", patient.protocol],
                ["Canal patient", "Interface KOVELA"],
                [
                  "Dernier contact",
                  last.ageLabel ? `${last.label} — ${last.ageLabel}` : "—",
                ],
                ["Contact cabinet prioritaire", refl.contact_prioritaire],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 border-b border-navy-900/[0.04] pb-2 last:border-0"
                >
                  <dt className="shrink-0 text-charcoal/55">{label}</dt>
                  <dd className="text-right font-medium tracking-tight text-navy-900">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          {/* Fenêtre de suivi — début / fin / restants / progression. */}
          <Card>
            <CardHeader
              title="Fenêtre de suivi"
              subtitle="Début, fin prévue, progression."
              action={
                <Badge className={followUpStatusStyles[followUp.status]}>
                  {followUp.status === "en_cours"
                    ? "Suivi en cours"
                    : followUp.status === "proche_cloture"
                    ? "Proche clôture"
                    : followUp.status === "termine"
                    ? "Terminé"
                    : "Hors fenêtre"}
                </Badge>
              }
            />
            <div className="px-5 py-4">
              <dl className="space-y-2.5 text-[12.5px]">
                {[
                  ["Début suivi", formatDate(followUp.startDate)],
                  ["Fin prévue", formatDate(followUp.endDate)],
                  [
                    "Jours restants",
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
                    className="flex justify-between gap-3 border-b border-navy-900/[0.04] pb-2 last:border-0"
                  >
                    <dt className="shrink-0 text-charcoal/55">{label}</dt>
                    <dd className="text-right font-medium tracking-tight text-navy-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              {/* Barre de progression discrète. */}
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

        {/* ===== COLONNE CENTRE — Timeline structurée + zone de réponse ===== */}
        <section className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader
              title="Timeline du suivi"
              subtitle="Plus récent en haut — messages, actions KOVELA, transmissions, CR."
            />
            {/* Filtres */}
            <div className="flex flex-wrap gap-1.5 border-b border-navy-900/[0.05] px-5 py-3">
              {(Object.keys(timelineFilterLabels) as TimelineFilter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTimelineFilter(f)}
                  className={`rounded-md px-3 py-1.5 text-[11.5px] font-medium tracking-tight transition-colors ${
                    timelineFilter === f
                      ? "bg-navy-900 text-white shadow-soft"
                      : "bg-white text-charcoal/65 ring-1 ring-navy-900/[0.06] hover:text-navy-900"
                  }`}
                >
                  {timelineFilterLabels[f]}
                </button>
              ))}
            </div>

            <div className="px-5 py-4">
              {filteredTimeline.length === 0 && (
                <p className="py-6 text-center text-[12px] tracking-tight text-charcoal/45">
                  Aucun événement pour ce filtre.
                </p>
              )}
              <ol className="relative space-y-4">
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
            </div>

            {/* Zone de réponse */}
            <div className="border-t border-navy-900/[0.05] px-5 py-4">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Écrire une réponse de coordination — pas d'avis médical."
                className="w-full resize-none rounded-xl border border-navy-900/[0.08] p-3 text-[13px] outline-none transition-colors focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/10"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="subtle" onClick={() => setTemplatesOpen(true)}>
                  Insérer un template
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => runAi("reformulation")}
                  disabled={!reply.trim()}
                >
                  Reformuler (IA)
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
            </div>
          </Card>
        </section>

        {/* ===== COLONNE DROITE — Référentiel + actions ===== */}
        <aside className="space-y-4 lg:col-span-1">
          {/* 1. Action recommandée */}
          <Card>
            <CardHeader
              title="Action recommandée"
              subtitle="Selon le référentiel chirurgien et l'état du suivi."
            />
            <div className="space-y-3 px-5 py-4">
              {opStatus && (
                <Badge className="bg-navy-900 text-white ring-navy-900">
                  {operationalStatusLabels[opStatus]}
                </Badge>
              )}
              <p className="text-[13px] font-medium tracking-tight text-navy-900">
                {recommended.label}
              </p>
              {recommended.delay && (
                <p className="text-[11.5px] tracking-tight text-charcoal/60">
                  {recommended.delay}
                </p>
              )}
              {urgence === "en_retard" && (
                <Badge className={urgenceStyles.en_retard}>{urgenceLabel}</Badge>
              )}
            </div>
          </Card>

          {/* 2. Référentiel applicable */}
          <Card>
            <CardHeader
              title="Référentiel applicable"
              subtitle={`${refl.intervention} — ${refl.version}`}
            />
            <div className="space-y-3 px-5 py-4 text-[12px] leading-relaxed">
              <p className="rounded-lg bg-bone/60 px-3 py-2 text-[10.5px] tracking-tight text-charcoal/60 ring-1 ring-navy-900/[0.04]">
                Données de démonstration — synthèse issue du référentiel chirurgien.
              </p>

              {/* 4 catégories opérables — aide à l'action (en premier). */}
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
                <div
                  key={bloc.label}
                  className="border-b border-navy-900/[0.04] pb-2 last:border-0"
                >
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${bloc.eyebrowCls}`}
                  >
                    {bloc.label}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {bloc.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2 text-[11.5px] leading-relaxed tracking-tight text-charcoal/75"
                      >
                        <span
                          className={`mt-1.5 h-[4px] w-[4px] shrink-0 rounded-full ${bloc.dotCls}`}
                        />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Infos descriptives — en second, plus discrètes. */}
              <div className="pt-2">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                  Infos descriptives
                </p>
                <dl className="grid gap-y-1.5 text-[11.5px]">
                  {[
                    ["Jalons attendus", refl.jalons_attendus.join(" · ")],
                    ["Jours de contact", refl.jours_contact.join(" · ")],
                    ["Photos attendues", refl.photos_attendues],
                    ["Format CR attendu", refl.format_cr_attendu],
                    [
                      "Prochain message prévu",
                      nextScheduled
                        ? `${nextScheduled.label} · ${new Date(
                            nextScheduled.targetDate
                          ).toLocaleDateString("fr-FR")}`
                        : "—",
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <dt className="shrink-0 text-charcoal/55">{label}</dt>
                      <dd className="text-right tracking-tight text-charcoal/75">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Card>

          {/* 3. Compte-rendu factuel */}
          <Card>
            <CardHeader
              title="Compte-rendu factuel"
              subtitle={report ? crStatusLabels[report.status] : "Aucun CR préparé"}
            />
            <div className="space-y-3 px-5 py-4">
              {report ? (
                <>
                  <Badge className={crStatusStyles[report.status]}>
                    {crStatusLabels[report.status]}
                  </Badge>
                  {report.status === "valide" && (
                    <p className="text-[11px] tracking-tight text-charcoal/55">
                      Validé KOVELA — à rendre disponible chirurgien.
                    </p>
                  )}
                  {report.status === "brouillon" && (
                    <p className="text-[11px] tracking-tight text-charcoal/55">
                      Brouillon préparé par l&apos;IA — à relire, corriger si besoin, puis valider.
                    </p>
                  )}
                  <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-3 font-sans text-[11.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                    {report.content}
                  </pre>
                  <div className="flex flex-wrap gap-2">
                    {report.status === "brouillon" && (
                      <Button variant="primary" onClick={() => k.validateReport(patient.id)}>
                        Relire et valider
                      </Button>
                    )}
                    {report.status !== "disponible" && (
                      <Button variant="secondary" onClick={() => k.publishReport(patient.id)}>
                        Rendre disponible chirurgien
                      </Button>
                    )}
                    <Button
                      variant="subtle"
                      onClick={() => navigator.clipboard?.writeText(report.content)}
                    >
                      Copier CR
                    </Button>
                    {report.status === "disponible" && (
                      <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                        CR disponible chirurgien
                      </Badge>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Mini-structure pré-remplie — guide visuel pour la
                      superviseuse, valeurs auto pour les champs connus. */}
                  <dl className="space-y-1.5 rounded-lg bg-bone/60 p-3 text-[11.5px] leading-relaxed ring-1 ring-navy-900/[0.04]">
                    {[
                      ["Intervention", patient.intervention],
                      ["Jour post-op", day],
                      [
                        "Dernier contact",
                        last.ageLabel ? `${last.label} — ${last.ageLabel}` : "—",
                      ],
                      ["Éléments déclarés par le patient", "—"],
                      [
                        "Photos reçues",
                        patient.messages.some((m) =>
                          m.attachments?.some((a) => a.kind === "photo")
                        )
                          ? "Oui"
                          : "Non",
                      ],
                      ["Action KOVELA", "—"],
                      ["À transmettre au cabinet", "—"],
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
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary" onClick={() => runAi("preparation_cr")}>
                      Préparer brouillon IA
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* 4. Messages programmés — accordéon, ouvert si message à valider aujourd'hui */}
          <details
            open={showScheduled || hasTodayScheduled}
            onToggle={(e) =>
              setShowScheduled((e.target as HTMLDetailsElement).open)
            }
            className="rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 list-none px-5 py-4">
              <div>
                <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                  Messages programmés
                </p>
                <p className="mt-0.5 text-[11px] tracking-tight text-charcoal/55">
                  {nextScheduled
                    ? `Prochain : ${nextScheduled.label} · ${new Date(
                        nextScheduled.targetDate
                      ).toLocaleDateString("fr-FR")}`
                    : "Aucun message prévu"}
                </p>
              </div>
              <span className="text-[12px] text-charcoal/45 transition-transform [details[open]>summary>&]:rotate-90">
                ›
              </span>
            </summary>
            <div className="space-y-2 border-t border-navy-900/[0.05] px-5 py-4">
              <p className="rounded-lg bg-bone/60 px-3 py-2 text-[11px] leading-relaxed text-charcoal/65 ring-1 ring-navy-900/[0.04]">
                Messages programmés selon le référentiel du chirurgien (jalons,
                jours de contact, pré-clôture, clôture). Prototype : aucun envoi
                automatique. Chaque envoi est simulé et ajouté à la timeline locale.
              </p>
              {scheduledMessages.map((m) => {
                const dt = new Date(m.targetDate);
                const dateLabel = dt.toLocaleDateString("fr-FR");
                const sent = m.status === "envoye";
                const late = m.status === "en_retard";
                return (
                  <div
                    key={m.id}
                    className="rounded-xl bg-white px-4 py-3 ring-1 ring-navy-900/[0.06] transition-colors hover:ring-navy-900/[0.1]"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-display text-[13px] font-semibold tracking-tight text-navy-900">
                        {m.label}
                      </p>
                      <Badge className={scheduledMessageStatusStyles[m.status]}>
                        {scheduledMessageStatusLabels[m.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] tracking-tight text-charcoal/55">
                      {late ? "Échéance dépassée le " : "Prévu le "}
                      {dateLabel} · template {m.templateKey}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <Button variant="subtle" onClick={() => setScheduledPreview(m)}>
                        Prévisualiser
                      </Button>
                      {!sent && (
                        <Button variant="primary" onClick={() => sendScheduledNow(m)}>
                          Simuler l'envoi
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>

          {/* 5. Transmission cabinet — accordéon, ouvert si action en cours */}
          <details
            open={
              showTransmission ||
              escalation?.status === "transmise" ||
              !!patient.compilationDraft
            }
            onToggle={(e) =>
              setShowTransmission((e.target as HTMLDetailsElement).open)
            }
            className="rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 list-none px-5 py-4">
              <div>
                <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                  Transmission cabinet
                </p>
                <p className="mt-0.5 text-[11px] tracking-tight text-charcoal/55">
                  {escalation?.status === "transmise"
                    ? "Transmission cabinet en cours"
                    : patient.compilationDraft
                    ? "Brouillon préparé — non transmis"
                    : "Aucune compilation préparée"}
                </p>
              </div>
              <span className="text-[12px] text-charcoal/45 transition-transform [details[open]>summary>&]:rotate-90">
                ›
              </span>
            </summary>
            <div className="space-y-3 border-t border-navy-900/[0.05] px-5 py-4">
              {escalation?.status === "transmise" ? (
                <>
                  <Badge className="bg-navy-900 text-teal-100 ring-navy-900">
                    Transmission cabinet en cours
                  </Badge>
                  {escalation.compilation && (
                    <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-3 font-sans text-[11.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                      {escalation.compilation}
                    </pre>
                  )}
                </>
              ) : patient.compilationDraft ? (
                <>
                  <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                    Brouillon préparé (interne)
                  </Badge>
                  <p className="text-[11px] tracking-tight text-charcoal/55">
                    Préparée en interne — n'ouvre pas de transmission tant qu'elle n'est pas
                    envoyée.
                  </p>
                  <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-3 font-sans text-[11.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                    {patient.compilationDraft}
                  </pre>
                  <Button variant="primary" onClick={() => k.transmitCompilation(patient.id)}>
                    Transmettre au cabinet
                  </Button>
                </>
              ) : (
                <p className="text-[11.5px] tracking-tight text-charcoal/55">
                  Utilisez « Préparer compilation factuelle » (IA assistive) pour réunir les
                  éléments. La transmission au cabinet reste une action explicite.
                </p>
              )}
            </div>
          </details>

          {/* 6. IA assistive — repliée par défaut */}
          <details
            open={showAI}
            onToggle={(e) => setShowAI((e.target as HTMLDetailsElement).open)}
            className="rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 list-none px-5 py-4">
              <div>
                <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                  IA assistive — optionnel
                </p>
                <p className="mt-0.5 text-[11px] tracking-tight text-charcoal/55">
                  L'IA aide à structurer les brouillons. Toute sortie reste relue et validée
                  par l'équipe KOVELA.
                </p>
              </div>
              <span
                className={`text-[12px] text-charcoal/45 transition-transform ${
                  showAI ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </summary>
            <div className="space-y-2 border-t border-navy-900/[0.05] px-5 py-4">
              <Button
                variant="subtle"
                className="w-full"
                onClick={() => runAi("resume_conversation")}
              >
                Résumer la conversation
              </Button>
              <Button
                variant="subtle"
                className="w-full"
                onClick={() => runAi("preparation_cr")}
              >
                Préparer brouillon IA
              </Button>
              <Button
                variant="subtle"
                className="w-full"
                onClick={() => runAi("reformulation")}
                disabled={!reply.trim()}
              >
                Reformuler {reply.trim() ? "le message" : "(écrivez d'abord)"}
              </Button>
              <Button
                variant="subtle"
                className="w-full"
                onClick={() => runAi("compilation_escalade")}
              >
                Préparer compilation factuelle
              </Button>
            </div>
          </details>

          {/* 7. Notes internes — repliées */}
          <details
            open={showNotes}
            onToggle={(e) => setShowNotes((e.target as HTMLDetailsElement).open)}
            className="rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 list-none px-5 py-4">
              <div>
                <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                  Notes internes
                </p>
                <p className="mt-0.5 text-[11px] tracking-tight text-charcoal/55">
                  {patient.notes.length} note{patient.notes.length > 1 ? "s" : ""} — visibles
                  uniquement par l'équipe.
                </p>
              </div>
              <span
                className={`text-[12px] text-charcoal/45 transition-transform ${
                  showNotes ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </summary>
            <div className="space-y-3 border-t border-navy-900/[0.05] px-5 py-4">
              <div className="flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ajouter une note interne…"
                  className="flex-1 rounded-lg border border-navy-900/[0.08] px-3 py-2 text-[12.5px] outline-none focus:border-teal-500/60"
                />
                <Button
                  variant="subtle"
                  disabled={!noteText.trim()}
                  onClick={() => {
                    k.addNote(patient.id, noteText.trim());
                    setNoteText("");
                  }}
                >
                  Ajouter
                </Button>
              </div>
              {patient.notes.length === 0 ? (
                <p className="text-[11.5px] tracking-tight text-charcoal/45">
                  Aucune note pour le moment.
                </p>
              ) : (
                <div className="space-y-2">
                  {patient.notes.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-lg bg-bone/60 p-3 ring-1 ring-navy-900/[0.04]"
                    >
                      <p className="whitespace-pre-wrap text-[12.5px] text-navy-900">{n.text}</p>
                      <p className="mt-1 text-[10.5px] tracking-tight text-charcoal/45">
                        {n.author} · {formatDateTime(n.at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>

          {/* 8. Logs — repliés */}
          <details
            open={showLogs}
            onToggle={(e) => setShowLogs((e.target as HTMLDetailsElement).open)}
            className="rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-2 list-none px-5 py-4">
              <div>
                <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
                  Logs liés au patient
                </p>
                <p className="mt-0.5 text-[11px] tracking-tight text-charcoal/55">
                  {patientLogs.length} entrée{patientLogs.length > 1 ? "s" : ""} — traçabilité.
                </p>
              </div>
              <span
                className={`text-[12px] text-charcoal/45 transition-transform ${
                  showLogs ? "rotate-90" : ""
                }`}
              >
                ›
              </span>
            </summary>
            <div className="border-t border-navy-900/[0.05] px-5 py-4">
              {patientLogs.length === 0 ? (
                <p className="text-[11.5px] tracking-tight text-charcoal/45">Aucun log.</p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {patientLogs.map((l) => (
                    <div key={l.id} className="border-l-2 border-teal-200 pl-3">
                      <p className="text-[11.5px] text-navy-900">{l.detail}</p>
                      <p className="text-[10px] tracking-tight text-charcoal/45">
                        {l.user} · {formatDateTime(l.at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>
        </aside>
      </div>

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
              <Badge
                className={scheduledMessageStatusStyles[scheduledPreview.status]}
              >
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
              <span className="font-semibold">Prototype :</span> ce message est
              ajouté à la timeline locale. Aucun envoi réel n'est effectué.
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

// Vue structurée de la préparation de brouillon de CR — rendue dans la modale
// pour offrir une relecture en sections, une checklist et un rappel doctrine.
// Le texte stocké reste celui d'aiPrepareReport (aiOutput) : la vue lit ce
// texte, en extrait les sections connues, et le reste demeure la source de
// vérité pour le stockage du brouillon.
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
      {/* En-tête IA — disclaimer + estimation, conservés. */}
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

      {/* A. Résumé patient */}
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

      {/* B. Brouillon CR factuel — sections */}
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

      {/* C. Checklist avant validation */}
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

      {/* D. Rappel doctrine */}
      <p className="mb-5 rounded-xl bg-amber-50/60 px-3 py-2 text-[11.5px] leading-relaxed tracking-tight text-amber-900 ring-1 ring-amber-100">
        Brouillon IA à relire et valider avant disponibilité chirurgien — synthèse opérationnelle non médicale.
      </p>

      {/* Boutons alignés sur le workflow CR : IA prépare, humain valide. */}
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
