"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Shell } from "@/components/Shell";
import {
  AiSuggestion,
  Badge,
  Button,
  Card,
  CardHeader,
  Modal,
} from "@/components/ui";
import { useKovela } from "@/lib/store";
import { aiCompileEscalation, aiEstimatedMinutes, aiPrepareReport, aiReformulate, aiSummarize, formatMinutes } from "@/lib/ai";
import { templates } from "@/lib/templates";
import {
  crStatusLabels,
  crStatusStyles,
  formatDate,
  formatDateTime,
  statusLabels,
  statusStyles,
} from "@/lib/format";
import type { AiFunction } from "@/lib/types";

type AiKind = AiFunction;

const aiTitles: Record<AiKind, string> = {
  resume_conversation: "Résumé de conversation",
  preparation_cr: "Préparation du brouillon de CR",
  reformulation: "Reformulation du message",
  compilation_escalade: "Compilation factuelle d'escalade",
};

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

  const report = patient ? k.reportFor(patient.id) : undefined;
  const escalation = patient ? k.escalationFor(patient.id) : undefined;
  const patientLogs = useMemo(
    () => (patient ? k.logs.filter((l) => l.patientId === patient.id) : []),
    [k.logs, patient]
  );

  if (!patient) {
    return (
      <Shell>
        <p className="text-sm text-charcoal/55">Patient introuvable.</p>
        <Link href="/superviseur" className="text-sm text-teal-600">← Retour à l'inbox</Link>
      </Shell>
    );
  }

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
    if (aiKind === "resume_conversation") k.addNote(patient.id, "Synthèse opérationnelle (IA, validée) :\n" + aiOutput);
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

  return (
    <Shell>
      <Link href="/superviseur" className="mb-4 inline-block text-sm text-teal-600 hover:text-teal-700">
        ← Inbox opérationnelle
      </Link>

      {/* En-tête patient */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl tracking-tight text-navy-900">{patient.name}</h1>
            <Badge className={statusStyles[patient.status]}>{statusLabels[patient.status]}</Badge>
          </div>
          <p className="mt-1 text-sm text-charcoal/55">
            {patient.intervention} · {k.surgeonName(patient.surgeonId)} · Intervention le{" "}
            {formatDate(patient.interventionDate)} · Protocole {patient.protocol}
          </p>
          <p className="text-xs text-charcoal/45">
            Superviseur : {k.supervisorName(patient.supervisorId)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="subtle" onClick={() => k.markTreated(patient.id)}>
            Marquer comme traité
          </Button>
          {patient.status === "silencieux" && (
            <Button variant="subtle" onClick={() => k.relancePatient(patient.id)}>
              Relancer le patient
            </Button>
          )}
          <Button variant="secondary" onClick={() => k.clotureSuivi(patient.id)}>
            Clôturer le suivi
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche : timeline + réponse */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader title="Timeline des échanges" subtitle="Messages classés opérationnellement" />
            <div className="space-y-4 p-5">
              {patient.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.author === "superviseur" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.author === "superviseur"
                        ? "bg-teal-600 text-white"
                        : m.author === "systeme"
                        ? "bg-navy-50 text-charcoal/70"
                        : "bg-navy-50 text-navy-900"
                    }`}
                  >
                    <div className="mb-0.5 flex items-center gap-2 text-[11px] opacity-70">
                      <span className="font-medium capitalize">{m.author}</span>
                      <span>·</span>
                      <span>{formatDateTime(m.at)}</span>
                      {m.author === "patient" && !m.treated && (
                        <span className="rounded bg-amber-400 px-1.5 text-navy-900">non traité</span>
                      )}
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                    {m.attachments?.map((a) => (
                      <div
                        key={a.id}
                        className={`mt-2 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                          m.author === "superviseur" ? "bg-white/15" : "bg-white"
                        }`}
                      >
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                        <span className="font-medium">{a.kind === "photo" ? "Photo" : "Audio"}</span>
                        <span>· {a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de réponse */}
            <div className="border-t border-navy-900/[0.06] p-5">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={3}
                placeholder="Écrire une réponse de coordination…"
                className="w-full resize-none rounded-xl border border-navy-100 p-3 text-sm outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="subtle" onClick={() => setTemplatesOpen(true)}>
                  Insérer un template
                </Button>
                <Button variant="subtle" onClick={() => runAi("reformulation")} disabled={!reply.trim()}>
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

          {/* Notes internes */}
          <Card>
            <CardHeader title="Notes internes" subtitle="Visibles uniquement par l'équipe de coordination" />
            <div className="p-5">
              <div className="flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ajouter une note interne…"
                  className="flex-1 rounded-xl border border-navy-100 px-3 py-2 text-sm outline-none focus:border-teal-400"
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
              <div className="mt-4 space-y-3">
                {patient.notes.length === 0 && (
                  <p className="text-xs text-charcoal/45">Aucune note interne.</p>
                )}
                {patient.notes.map((n) => (
                  <div key={n.id} className="rounded-xl bg-navy-50/50 p-3">
                    <p className="whitespace-pre-wrap text-sm text-navy-900">{n.text}</p>
                    <p className="mt-1 text-[11px] text-charcoal/45">
                      {n.author} · {formatDateTime(n.at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Colonne droite : IA + CR + escalade + logs */}
        <div className="space-y-6">
          <Card className="ring-1 ring-teal-100">
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-500 text-[10px] font-bold text-white">
                    IA
                  </span>
                  IA assistive
                </span>
              }
              subtitle="Assiste la documentation · human-in-the-loop · loggée"
            />
            <div className="space-y-2 p-5">
              <Button variant="primary" className="w-full" onClick={() => runAi("resume_conversation")}>
                Résumer
              </Button>
              <Button variant="subtle" className="w-full" onClick={() => runAi("preparation_cr")}>
                Préparer le CR
              </Button>
              <Button
                variant="subtle"
                className="w-full"
                onClick={() => runAi("reformulation")}
                disabled={!reply.trim()}
              >
                Reformuler {reply.trim() ? "le message" : "(écrivez une réponse)"}
              </Button>
              <Button variant="subtle" className="w-full" onClick={() => runAi("compilation_escalade")}>
                Préparer compilation factuelle
              </Button>
              <p className="pt-1 text-[11px] leading-tight text-charcoal/45">
                L'IA assiste la documentation. Elle ne formule aucun avis médical. Chaque sortie
                est à valider par un humain.
              </p>
            </div>
          </Card>

          {/* Compte-rendu */}
          <Card>
            <CardHeader
              title="Compte-rendu factuel du suivi"
              subtitle={report ? crStatusLabels[report.status] : "Aucun CR"}
            />
            <div className="p-5">
              {report ? (
                <>
                  <Badge className={crStatusStyles[report.status]}>
                    {crStatusLabels[report.status]}
                  </Badge>
                  {report.status === "valide" && (
                    <p className="mt-2 text-[11px] text-charcoal/55">
                      Validé en interne — pas encore visible côté chirurgien.
                    </p>
                  )}
                  <pre className="mt-3 max-h-48 overflow-y-auto whitespace-pre-wrap rounded-xl bg-navy-50/50 p-3 font-sans text-xs leading-relaxed text-navy-900">
                    {report.content}
                  </pre>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.status === "brouillon" && (
                      <Button variant="primary" onClick={() => k.validateReport(patient.id)}>
                        Valider en interne
                      </Button>
                    )}
                    {report.status !== "disponible" && (
                      <Button variant="secondary" onClick={() => k.publishReport(patient.id)}>
                        Rendre disponible pour le chirurgien
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-xs text-charcoal/45">
                  Aucun CR. Utilisez « Préparer le CR » pour générer un brouillon à valider.
                </p>
              )}
            </div>
          </Card>

          {/* Escalade — compilation factuelle puis transmission explicite */}
          <Card>
            <CardHeader
              title="Compilation factuelle d'escalade"
              subtitle={
                escalation?.status === "transmise"
                  ? "Transmise au chirurgien"
                  : patient.compilationDraft
                  ? "Brouillon préparé — non transmis"
                  : "Aucune compilation"
              }
            />
            <div className="p-5">
              {escalation?.status === "transmise" ? (
                <>
                  <Badge className="bg-navy-900 text-teal-100 ring-navy-900">
                    Escalade transmise au chirurgien
                  </Badge>
                  {escalation.compilation && (
                    <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl bg-navy-50/50 p-3 font-sans text-xs leading-relaxed text-navy-900">
                      {escalation.compilation}
                    </pre>
                  )}
                </>
              ) : patient.compilationDraft ? (
                <>
                  <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                    Compilation factuelle préparée (brouillon)
                  </Badge>
                  <p className="mt-2 text-[11px] text-charcoal/55">
                    Préparée en interne — n'ouvre pas d'escalade tant qu'elle n'est pas transmise.
                  </p>
                  <pre className="mt-3 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl bg-navy-50/50 p-3 font-sans text-xs leading-relaxed text-navy-900">
                    {patient.compilationDraft}
                  </pre>
                  <Button
                    variant="secondary"
                    className="mt-3"
                    onClick={() => k.transmitCompilation(patient.id)}
                  >
                    Transmettre au chirurgien
                  </Button>
                </>
              ) : (
                <p className="text-xs text-charcoal/45">
                  Utilisez « Préparer compilation factuelle » pour réunir les éléments. La
                  transmission au chirurgien reste une action explicite.
                </p>
              )}
            </div>
          </Card>

          {/* Logs patient */}
          <Card>
            <CardHeader title="Logs liés au patient" subtitle="Traçabilité opérationnelle" />
            <div className="max-h-64 space-y-2 overflow-y-auto p-5">
              {patientLogs.length === 0 && <p className="text-xs text-charcoal/45">Aucun log.</p>}
              {patientLogs.map((l) => (
                <div key={l.id} className="border-l-2 border-teal-200 pl-3">
                  <p className="text-xs text-navy-900">{l.detail}</p>
                  <p className="text-[10px] text-charcoal/45">
                    {l.user} · {formatDateTime(l.at)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal templates */}
      <Modal open={templatesOpen} onClose={() => setTemplatesOpen(false)} title="Bibliothèque de templates" wide>
        <p className="mb-4 text-xs text-charcoal/55">
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
              className="rounded-xl border border-navy-100 p-3 text-left hover:border-teal-300 hover:bg-teal-50/40"
            >
              <p className="text-sm font-medium text-navy-900">{t.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-charcoal/55">{t.body}</p>
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal sortie IA */}
      <Modal open={aiKind !== null} onClose={closeAi} title={aiKind ? aiTitles[aiKind] : ""} wide>
        {editing ? (
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal-700">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-teal-600 text-[10px] font-bold text-white">
                IA
              </span>
              Suggestion IA — modification par un humain
            </div>
            <textarea
              value={aiOutput}
              onChange={(e) => setAiOutput(e.target.value)}
              rows={14}
              className="w-full rounded-xl border border-navy-100 p-3 font-sans text-sm leading-relaxed outline-none focus:border-teal-400"
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
            estimatedMinutesLabel={aiKind ? formatMinutes(aiEstimatedMinutes(aiKind)) : undefined}
            onAccept={acceptAi}
            onModify={() => setEditing(true)}
            onRefuse={refuseAi}
          />
        )}
      </Modal>
    </Shell>
  );
}
