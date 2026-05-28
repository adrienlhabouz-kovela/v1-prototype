"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, DoctrineNote, Modal, PageHeader } from "@/components/ui";
import { useKovela, type SuggestionInput } from "@/lib/store";
import { aiEstimatedMinutes, formatMinutes } from "@/lib/ai";
import {
  formationLabels,
  formationStyles,
  relativeDays,
  statusLabels,
  statusStyles,
  suggestionImpactLabels,
  suggestionTypeLabels,
} from "@/lib/format";
import type {
  Patient,
  SuggestionImpact,
  SuggestionPriority,
  SuggestionType,
} from "@/lib/types";

const MY_SUPERVISOR_ID = "sup1";

function SuggestionsBlock() {
  const k = useKovela();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState<SuggestionInput>(() => ({
    type: "template",
    screen: "",
    description: "",
    impact: "gain_temps",
    priority: "moyenne",
  }));
  const mine = k.suggestions.filter((s) => s.supervisorId === MY_SUPERVISOR_ID);

  function reset() {
    setForm({ type: "template", screen: "", description: "", impact: "gain_temps", priority: "moyenne" });
  }
  function submit() {
    k.addSuggestion(MY_SUPERVISOR_ID, form);
    setOpen(false);
    reset();
    setConfirm(true);
    window.setTimeout(() => setConfirm(false), 2500);
  }
  const inputCls =
    "w-full rounded-xl border border-navy-100 px-3 py-2 text-sm outline-none focus:border-teal-400";

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-navy-900/[0.06] px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Améliorations terrain</h3>
          <p className="text-[11px] text-charcoal/55">
            Les superviseurs utilisent KOVELA au quotidien. Leurs retours permettent d'améliorer les
            templates, l'IA assistive, la formation et l'organisation du service opéré.
          </p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Proposer une amélioration
        </Button>
      </div>
      {confirm && (
        <div className="border-b border-teal-100 bg-teal-50/60 px-5 py-2 text-xs text-teal-700">
          ✓ Suggestion enregistrée. Merci — elle sera relue par l'équipe KOVELA.
        </div>
      )}
      <div className="px-5 py-3 text-xs text-charcoal/55">
        {mine.length === 0
          ? "Aucune suggestion de votre part pour l'instant."
          : `${mine.length} suggestion${mine.length > 1 ? "s" : ""} de votre part.`}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Proposer une amélioration terrain" wide>
        <p className="mb-3 text-xs text-charcoal/55">
          Retour superviseur — utilisé pour l'amélioration continue du service opéré. Données fictives.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-charcoal/60">Type de suggestion</span>
            <select
              className={inputCls}
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as SuggestionType }))}
            >
              {(Object.keys(suggestionTypeLabels) as SuggestionType[]).map((t) => (
                <option key={t} value={t}>
                  {suggestionTypeLabels[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-charcoal/60">Écran concerné</span>
            <input
              className={inputCls}
              value={form.screen}
              onChange={(e) => setForm((f) => ({ ...f, screen: e.target.value }))}
              placeholder="ex : Fiche patient — panneau IA"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-[11px] font-medium text-charcoal/60">Description courte</span>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Décrivez la friction ou l'idée d'amélioration…"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-charcoal/60">Impact estimé</span>
            <select
              className={inputCls}
              value={form.impact}
              onChange={(e) => setForm((f) => ({ ...f, impact: e.target.value as SuggestionImpact }))}
            >
              {(Object.keys(suggestionImpactLabels) as SuggestionImpact[]).map((i) => (
                <option key={i} value={i}>
                  {suggestionImpactLabels[i]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-charcoal/60">Priorité ressentie</span>
            <select
              className={inputCls}
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as SuggestionPriority }))}
            >
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            disabled={!form.description.trim() || !form.screen.trim()}
            onClick={submit}
          >
            Envoyer la suggestion
          </Button>
        </div>
      </Modal>
    </Card>
  );
}

function MyIndicators() {
  const k = useKovela();
  const myId = "sup1";
  const me = k.supervisors.find((s) => s.id === myId);
  const mine = k.patients.filter((p) => p.supervisorId === myId);
  const actifs = mine.filter((p) => p.status !== "cloture").length;
  const treated = mine.reduce((acc, p) => acc + p.messages.filter((m) => m.treated).length, 0);
  const untreated = mine.reduce(
    (acc, p) => acc + p.messages.filter((m) => m.author === "patient" && !m.treated).length,
    0
  );
  // Délai moyen patient → réponse (h)
  const delays: number[] = [];
  mine.forEach((p) => {
    for (let i = 0; i < p.messages.length - 1; i++) {
      if (p.messages[i].author === "patient" && p.messages[i + 1].author !== "patient") {
        const dt =
          (new Date(p.messages[i + 1].at).getTime() - new Date(p.messages[i].at).getTime()) / 36e5;
        if (dt >= 0) delays.push(dt);
      }
    }
  });
  const delayH = delays.length ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;
  const reportsMine = k.reports.filter((r) => mine.some((p) => p.id === r.patientId));
  const crFinalises = reportsMine.filter((r) => r.status === "valide" || r.status === "disponible").length;
  const crEnAttente = mine.filter((p) => p.status === "cr_en_attente").length;
  const assignedIds = new Set(mine.map((p) => p.id));
  const myLogs = k.aiLogs.filter((l) => l.patientId && assignedIds.has(l.patientId));
  const usage = myLogs.filter((l) => l.decision === "propose").length;
  const ac = myLogs.filter((l) => l.decision === "accepte").length;
  const mo = myLogs.filter((l) => l.decision === "modifie").length;
  const minutes = myLogs
    .filter((l) => l.decision === "propose")
    .reduce((acc, l) => acc + aiEstimatedMinutes(l.fn), 0);

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-900/[0.06] px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Mes indicateurs</h3>
          <p className="text-[11px] text-charcoal/55">
            Ces indicateurs aident KOVELA à maintenir une qualité de traitement homogène.
          </p>
        </div>
        {me && (
          <Badge className={formationStyles[me.formationStatus]}>{formationLabels[me.formationStatus]}</Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Patients actifs", String(actifs)],
          ["Messages traités", String(treated)],
          ["Non traités", String(untreated)],
          ["Délai moyen", delayH ? `${delayH.toFixed(1)} h` : "—"],
          ["CR finalisés", String(crFinalises)],
          ["CR en attente", String(crEnAttente)],
          ["Usage IA", String(usage)],
          ["IA acceptées / modifiées", `${ac} / ${mo}`],
          ["Temps estimé gagné (IA)", formatMinutes(minutes)],
        ].map(([label, value]) => (
          <div key={label} className="bg-white px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-charcoal/45">{label}</p>
            <p className="mt-1 font-display text-lg text-navy-900">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface Section {
  key: string;
  title: string;
  hint: string;
  match: (p: Patient, ctx: { unTreated: (p: Patient) => number }) => boolean;
}

const sections: Section[] = [
  {
    key: "non_traites",
    title: "Messages non traités",
    hint: "Critère : message patient non lu / non traité",
    match: (p, ctx) => ctx.unTreated(p) > 0,
  },
  {
    key: "silencieux",
    title: "Patients silencieux",
    hint: "Critère : absence de réponse patient",
    match: (p) => p.status === "silencieux",
  },
  {
    key: "escalades",
    title: "Escalades ouvertes",
    hint: "Critère : escalade ouverte (signal déclaré)",
    match: (p) => p.status === "escalade_ouverte",
  },
  {
    key: "cr",
    title: "CR à faire",
    hint: "Critère : CR en attente",
    match: (p) => p.status === "cr_en_attente",
  },
  {
    key: "suivis",
    title: "Suivis du jour",
    hint: "Critère : suivi actif en cours",
    match: (p) => p.status === "actif",
  },
  {
    key: "clotures",
    title: "Clôtures à faire",
    hint: "Critère : onboarding incomplet à finaliser",
    match: (p) => p.status === "onboarding_incomplet",
  },
];

export default function SuperviseurInbox() {
  const k = useKovela();
  const [onlyMine, setOnlyMine] = useState(true);
  const myId = "sup1"; // Inès Carvalho (superviseur de démo)

  const unTreated = (p: Patient) => p.messages.filter((m) => m.author === "patient" && !m.treated).length;

  const scope = useMemo(() => {
    return onlyMine ? k.patients.filter((p) => p.supervisorId === myId) : k.patients;
  }, [k.patients, onlyMine]);

  return (
    <Shell>
      <PageHeader
        eyebrow="Espace superviseur"
        title="Inbox opérationnelle"
        subtitle="File organisée selon des critères opérationnels : messages non traités, délais, CR en attente et escalades ouvertes."
      >
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-xs text-navy-100/80 ring-1 ring-white/10">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="h-4 w-4 rounded border-navy-200 text-teal-500"
          />
          Mes patients uniquement
        </label>
      </PageHeader>

      <DoctrineNote className="mb-6" />

      <MyIndicators />

      <SuggestionsBlock />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const list = scope.filter((p) => section.match(p, { unTreated }));
          return (
            <Card key={section.key} className="flex flex-col">
              <div className="flex items-center justify-between border-b border-navy-900/[0.06] px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-navy-900">{section.title}</h2>
                  <p className="text-[11px] text-charcoal/45">{section.hint}</p>
                </div>
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-navy-900 px-1.5 text-xs font-semibold text-white">
                  {list.length}
                </span>
              </div>
              <div className="flex-1 divide-y divide-navy-900/[0.05]">
                {list.length === 0 && (
                  <p className="px-4 py-6 text-center text-xs text-charcoal/45">Rien à traiter ici.</p>
                )}
                {list.map((p) => {
                  const n = unTreated(p);
                  const lastMsg = p.messages[p.messages.length - 1];
                  return (
                    <Link
                      key={p.id}
                      href={`/superviseur/patient/${p.id}`}
                      className="group block px-4 py-3 hover:bg-teal-50/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-navy-900">{p.name}</p>
                        <span className="shrink-0 text-[11px] text-charcoal/40">
                          {relativeDays(p.lastMessageAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-charcoal/50">
                        {k.surgeonName(p.surgeonId)}
                        {lastMsg ? ` · ${lastMsg.text}` : ""}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {n > 0 && (
                            <Badge className="bg-amber-50 text-amber-700 ring-amber-100">
                              {n} non traité
                            </Badge>
                          )}
                          <Badge className={statusStyles[p.status]}>{statusLabels[p.status]}</Badge>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-teal-600 opacity-0 transition-opacity group-hover:opacity-100">
                          Ouvrir →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
