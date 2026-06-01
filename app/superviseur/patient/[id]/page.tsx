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
  getUrgence,
  operationalStatusLabels,
  timelineFilterLabels,
  urgenceLabels,
  urgenceStyles,
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
  const [showNotes, setShowNotes] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
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
          {/* Ligne 1 : patient · J+X · intervention · chirurgien */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-[1.7rem] font-medium leading-tight tracking-tight text-navy-900">
              {patient.name}
            </h1>
            <span className="font-mono text-[15px] font-medium tracking-tight text-teal-700">
              {day}
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
            <Badge className={urgenceStyles[urgence]}>{urgenceLabels[urgence]}</Badge>
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

          {/* Actions rapides */}
          <div className="mt-5 flex flex-wrap gap-2">
            {canPrepareCR && (
              <Button variant="primary" onClick={() => runAi("preparation_cr")}>
                Préparer CR factuel
              </Button>
            )}
            {canValidateCR && (
              <Button variant="primary" onClick={() => k.validateReport(patient.id)}>
                Valider le CR en interne
              </Button>
            )}
            {canPublishCR && (
              <Button variant="primary" onClick={() => k.publishReport(patient.id)}>
                Rendre disponible au chirurgien
              </Button>
            )}
            {canTransmitCompilation && (
              <Button
                variant="primary"
                onClick={() => k.transmitCompilation(patient.id)}
              >
                Transmettre au cabinet
              </Button>
            )}
            {patient.status === "silencieux" && (
              <Button variant="secondary" onClick={() => k.relancePatient(patient.id)}>
                Relancer le patient
              </Button>
            )}
            <Button variant="subtle" onClick={() => k.markTreated(patient.id)}>
              Marquer suivi habituel
            </Button>
            <Button variant="ghost" onClick={() => k.clotureSuivi(patient.id)}>
              Clôturer le suivi
            </Button>
          </div>
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
        </aside>

        {/* ===== COLONNE CENTRE — Timeline structurée + zone de réponse ===== */}
        <section className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader
              title="Timeline du suivi"
              subtitle="Événements structurés : messages, actions KOVELA, transmissions, CR."
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
                <Badge className={urgenceStyles.en_retard}>En retard</Badge>
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

              {[
                ["Jalons attendus", refl.jalons_attendus.join(" · ")],
                ["Jours de contact", refl.jours_contact.join(" · ")],
                ["Photos attendues", refl.photos_attendues],
                ["Format CR attendu", refl.format_cr_attendu],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-navy-900/[0.04] pb-2 last:border-0"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
                    {label}
                  </p>
                  <p className="mt-1 tracking-tight text-charcoal/75">{value}</p>
                </div>
              ))}

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-700/80">
                  KOVELA peut rappeler
                </p>
                <p className="mt-1 tracking-tight text-charcoal/75">{refl.peut_rappeler}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-700/80">
                  Ne pas traiter
                </p>
                <p className="mt-1 tracking-tight text-charcoal/75">{refl.ne_pas_traiter}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800/80">
                  À transmettre au cabinet
                </p>
                <p className="mt-1 tracking-tight text-charcoal/75">
                  {refl.a_transmettre_cabinet}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-900/70">
                  Transmission prioritaire
                </p>
                <p className="mt-1 tracking-tight text-charcoal/75">
                  {refl.transmission_prioritaire}
                </p>
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
                      Validé en interne — pas encore visible côté chirurgien.
                    </p>
                  )}
                  <pre className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-bone/60 p-3 font-sans text-[11.5px] leading-relaxed text-navy-900 ring-1 ring-navy-900/[0.04]">
                    {report.content}
                  </pre>
                  <div className="flex flex-wrap gap-2">
                    {report.status === "brouillon" && (
                      <Button variant="primary" onClick={() => k.validateReport(patient.id)}>
                        Valider en interne
                      </Button>
                    )}
                    {report.status !== "disponible" && (
                      <Button variant="secondary" onClick={() => k.publishReport(patient.id)}>
                        Rendre disponible
                      </Button>
                    )}
                    <Button
                      variant="subtle"
                      onClick={() => navigator.clipboard?.writeText(report.content)}
                    >
                      Copier CR
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[11.5px] tracking-tight text-charcoal/55">
                    Structure attendue : intervention · J+ · dernier contact · éléments
                    déclarés · photos reçues · action KOVELA · à transmettre · statut ·
                    prochaine étape.
                  </p>
                  <Button variant="primary" onClick={() => runAi("preparation_cr")}>
                    Préparer brouillon
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* 4. Compilation factuelle → transmission cabinet */}
          <Card>
            <CardHeader
              title="Transmission cabinet"
              subtitle={
                escalation?.status === "transmise"
                  ? "Transmission cabinet envoyée"
                  : patient.compilationDraft
                  ? "Brouillon préparé — non transmis"
                  : "Aucune compilation"
              }
            />
            <div className="space-y-3 px-5 py-4">
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
          </Card>

          {/* 5. IA assistive — repliée par défaut */}
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
                Préparer le CR
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

          {/* 6. Notes internes — repliées */}
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

          {/* 7. Logs — repliés */}
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
              Suggestion IA — modification par un humain
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
