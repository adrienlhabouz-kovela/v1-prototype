"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, Modal, PageHeader } from "@/components/ui";
import { useKovela, type SuggestionInput } from "@/lib/store";
import { aiEstimatedMinutes, formatMinutes } from "@/lib/ai";
import {
  formationLabels,
  formationStyles,
  suggestionImpactLabels,
  suggestionTypeLabels,
} from "@/lib/format";
import type { Patient, SuggestionImpact, SuggestionPriority, SuggestionType } from "@/lib/types";
import {
  countByOperationalStatus,
  getLastEvent,
  getOperationalStatus,
  getPostOpDay,
  getRecommendedAction,
  getUrgence,
  getUrgenceLabelDetailed,
  operationalStatusHints,
  operationalStatusLabels,
  operationalStatusOrder,
  type OperationalStatus,
  urgenceStyles,
} from "@/lib/supervisor";

const MY_SUPERVISOR_ID = "sup1";

// ---------------------------------------------------------------------------
// Améliorations terrain — composant existant conservé (déplacé en bas).
// ---------------------------------------------------------------------------

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
    <Card className="mt-6 overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-navy-900/[0.06] px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold text-navy-900">Améliorations terrain</h3>
          <p className="text-[11px] text-charcoal/55">
            Les superviseurs utilisent KOVELA au quotidien. Leurs retours permettent d'améliorer
            les templates, l'IA assistive, la formation et l'organisation du service opéré.
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

// ---------------------------------------------------------------------------
// Bandeau "Mes indicateurs" — détails IA repliés.
// ---------------------------------------------------------------------------

function DetailsIA({ patients }: { patients: Patient[] }) {
  const k = useKovela();
  const [open, setOpen] = useState(false);
  const me = k.supervisors.find((s) => s.id === MY_SUPERVISOR_ID);

  const ids = new Set(patients.map((p) => p.id));
  const myLogs = k.aiLogs.filter((l) => l.patientId && ids.has(l.patientId));
  const usage = myLogs.filter((l) => l.decision === "propose").length;
  const ac = myLogs.filter((l) => l.decision === "accepte").length;
  const mo = myLogs.filter((l) => l.decision === "modifie").length;
  const minutes = myLogs
    .filter((l) => l.decision === "propose")
    .reduce((acc, l) => acc + aiEstimatedMinutes(l.fn), 0);

  // Délai moyen patient → réponse (h)
  const delays: number[] = [];
  patients.forEach((p) => {
    for (let i = 0; i < p.messages.length - 1; i++) {
      if (p.messages[i].author === "patient" && p.messages[i + 1].author !== "patient") {
        const dt =
          (new Date(p.messages[i + 1].at).getTime() - new Date(p.messages[i].at).getTime()) / 36e5;
        if (dt >= 0) delays.push(dt);
      }
    }
  });
  const delayH = delays.length ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;

  return (
    <div className="mt-3 rounded-xl bg-bone/40 ring-1 ring-navy-900/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-bone/70"
      >
        <span className="flex items-center gap-2 text-[11.5px] font-medium tracking-tight text-charcoal/65">
          Voir détails IA & qualité
          {me && (
            <Badge className={formationStyles[me.formationStatus]}>
              {formationLabels[me.formationStatus]}
            </Badge>
          )}
        </span>
        <span
          className={`text-[12px] text-charcoal/45 transition-transform ${open ? "rotate-90" : ""}`}
        >
          ›
        </span>
      </button>
      {open && (
        <div className="border-t border-navy-900/[0.05] px-4 py-3">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-navy-900/[0.04] sm:grid-cols-4">
            {[
              ["Délai moyen patient → réponse", delayH ? `${delayH.toFixed(1)} h` : "—"],
              ["Usage IA", String(usage)],
              ["IA acceptées / modifiées", `${ac} / ${mo}`],
              ["Temps estimé gagné (IA)", formatMinutes(minutes)],
            ].map(([label, value]) => (
              <div key={label} className="bg-white px-3 py-2.5">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                  {label}
                </p>
                <p className="mt-1.5 font-display text-[15px] font-medium tracking-tight text-navy-900">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carte patient enrichie — 4 lignes, action-first.
// ---------------------------------------------------------------------------

function PatientCard({ patient }: { patient: Patient }) {
  const k = useKovela();
  const ctx = { reportFor: k.reportFor, escalationFor: k.escalationFor };
  const day = getPostOpDay(patient);
  const last = getLastEvent(patient, ctx);
  const action = getRecommendedAction(patient, ctx);
  const urgence = getUrgence(patient, ctx);
  const urgenceLabel = getUrgenceLabelDetailed(patient, ctx);

  return (
    <Link
      href={`/superviseur/patient/${patient.id}`}
      className="group block border-t border-navy-900/[0.04] px-4 py-3 transition-colors first:border-t-0 hover:bg-bone/40"
    >
      {/* Ligne 1 : Patient · J+X · Intervention · Badge priorité */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <span className="truncate text-[13.5px] font-medium tracking-tight text-navy-900">
            {patient.name}
          </span>
          <span className="text-[11.5px] font-mono font-medium text-teal-700">{day}</span>
          <span className="truncate text-[11.5px] text-charcoal/55">{patient.intervention}</span>
        </div>
        <Badge className={`${urgenceStyles[urgence]} shrink-0`}>{urgenceLabel}</Badge>
      </div>

      {/* Ligne 2 : Chirurgien */}
      <p className="mt-1 text-[11.5px] text-charcoal/55">
        {k.surgeonName(patient.surgeonId)}
      </p>

      {/* Ligne 3 : Dernier événement */}
      <p className="mt-1.5 flex items-center gap-2 text-[12px] tracking-tight text-charcoal/65">
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-navy-900/30" />
        <span className="truncate">
          {last.label}
          {last.ageLabel && (
            <span className="ml-1 text-charcoal/45">— {last.ageLabel}</span>
          )}
        </span>
      </p>

      {/* Ligne 4 : Prochaine action + délai */}
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2 text-[12px] tracking-tight">
          <span className="font-medium text-teal-700">→</span>
          <span className="truncate font-medium text-navy-900">{action.label}</span>
          {action.delay && (
            <span className="shrink-0 text-charcoal/55">· {action.delay}</span>
          )}
        </p>
        <span className="shrink-0 text-[11.5px] font-medium text-teal-700 opacity-0 transition-opacity group-hover:opacity-100">
          Ouvrir →
        </span>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Groupe d'inbox — un statut opérationnel.
// ---------------------------------------------------------------------------

function InboxGroup({
  status,
  patients,
}: {
  status: OperationalStatus;
  patients: Patient[];
}) {
  // Couleurs sobres — priorité opérationnelle, pas alerte clinique.
  const accentBar =
    status === "a_traiter"
      ? "bg-amber-500/80"
      : status === "a_relancer"
      ? "bg-amber-300/70"
      : status === "a_transmettre_cabinet"
      ? "bg-teal-500/80"
      : status === "en_attente_cabinet"
      ? "bg-navy-900/30"
      : status === "cloture_a_preparer"
      ? "bg-navy-900/30"
      : "bg-navy-900/[0.08]";

  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-4 border-b border-navy-900/[0.05] px-5 py-4">
        <span className={`mt-1 h-7 w-[2px] shrink-0 rounded-full ${accentBar}`} />
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-[14.5px] font-semibold tracking-tight text-navy-900">
              {operationalStatusLabels[status]}
            </h3>
            <span className="flex h-6 min-w-[24px] items-center justify-center rounded-md bg-navy-900 px-1.5 text-[11px] font-semibold text-white">
              {patients.length}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] tracking-tight text-charcoal/55">
            {operationalStatusHints[status]}
          </p>
        </div>
      </div>
      <div>
        {patients.length === 0 ? (
          <p className="px-5 py-6 text-center text-[12px] tracking-tight text-charcoal/45">
            Rien à traiter ici.
          </p>
        ) : (
          patients.map((p) => <PatientCard key={p.id} patient={p} />)
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

export default function SuperviseurInbox() {
  const k = useKovela();
  const [onlyMine, setOnlyMine] = useState(true);

  const ctx = useMemo(
    () => ({ reportFor: k.reportFor, escalationFor: k.escalationFor }),
    [k.reportFor, k.escalationFor]
  );

  const scope = useMemo(() => {
    return onlyMine
      ? k.patients.filter((p) => p.supervisorId === MY_SUPERVISOR_ID)
      : k.patients;
  }, [k.patients, onlyMine]);

  // Regroupement par statut opérationnel.
  const grouped = useMemo(() => {
    const map: Record<OperationalStatus, Patient[]> = {
      a_traiter: [],
      a_relancer: [],
      a_transmettre_cabinet: [],
      en_attente_cabinet: [],
      cloture_a_preparer: [],
      suivi_habituel: [],
    };
    scope.forEach((p) => {
      const s = getOperationalStatus(p, ctx);
      if (s) map[s].push(p);
    });
    return map;
  }, [scope, ctx]);

  // KPI compacts — 4 indicateurs métier.
  const counts = useMemo(() => countByOperationalStatus(scope, ctx), [scope, ctx]);
  const patientsActifs = scope.filter((p) => p.status !== "cloture").length;
  const crAPreparer =
    counts.a_transmettre_cabinet +
    scope.filter((p) => {
      const r = k.reportFor(p.id);
      return r?.status === "brouillon" || r?.status === "valide";
    }).length -
    // éviter de compter en double les CR à publier
    scope.filter((p) => {
      const r = k.reportFor(p.id);
      return r?.status === "brouillon" || r?.status === "valide";
    }).length;
  // Simplification : on prend le nombre direct de CR brouillon + valide non publié.
  const crToWork = scope.filter((p) => {
    const r = k.reportFor(p.id);
    return r?.status === "brouillon" || r?.status === "valide";
  }).length;

  // Charge / retard
  const enRetard = scope.filter((p) => getUrgence(p, ctx) === "en_retard").length;

  return (
    <Shell>
      <PageHeader
        eyebrow="Espace superviseur"
        title="Inbox opérationnelle"
        subtitle="Patients organisés par prochaine action. Action-first : ce qu'il faut faire maintenant, sans qualification médicale."
      >
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-[11.5px] tracking-tight text-navy-100/80 ring-1 ring-white/10">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="h-4 w-4 rounded border-navy-200 text-teal-500"
          />
          Mes patients uniquement
        </label>
      </PageHeader>

      {/* Mini-bandeau de charge */}
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-white px-5 py-3.5 shadow-card ring-1 ring-navy-900/[0.045]">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
          Aujourd'hui
        </span>
        <span className="text-[13px] tracking-tight text-navy-900">
          <span className="font-medium">{patientsActifs}</span>{" "}
          <span className="text-charcoal/60">patients actifs</span>
        </span>
        <span className="h-3 w-px bg-navy-900/[0.08]" />
        <span className="text-[13px] tracking-tight text-amber-900">
          <span className="font-medium">{counts.a_traiter}</span>{" "}
          <span className="text-amber-800/75">à traiter</span>
        </span>
        <span className="h-3 w-px bg-navy-900/[0.08]" />
        <span className="text-[13px] tracking-tight text-teal-700">
          <span className="font-medium">{counts.a_transmettre_cabinet}</span>{" "}
          <span className="text-teal-700/70">à transmettre cabinet</span>
        </span>
        <span className="h-3 w-px bg-navy-900/[0.08]" />
        <span className="text-[13px] tracking-tight text-navy-900">
          <span className="font-medium">{counts.en_attente_cabinet}</span>{" "}
          <span className="text-charcoal/60">en attente cabinet</span>
        </span>
        {enRetard > 0 && (
          <>
            <span className="h-3 w-px bg-navy-900/[0.08]" />
            <span className="text-[13px] tracking-tight text-amber-900">
              <span className="font-medium">{enRetard}</span>{" "}
              <span className="text-amber-800/75">en retard</span>
            </span>
          </>
        )}
      </div>

      {/* 4 KPI compacts + détails IA repliés */}
      <Card className="mb-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-navy-900/[0.05] px-5 py-3.5">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-navy-900">Vue du jour</h3>
            <p className="text-[11px] tracking-tight text-charcoal/55">
              Pilotage opérationnel — sans qualification médicale.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
          {[
            ["Patients actifs", String(patientsActifs)],
            ["À traiter maintenant", String(counts.a_traiter)],
            ["En attente cabinet", String(counts.en_attente_cabinet)],
            ["CR à préparer / finaliser", String(crToWork)],
          ].map(([label, value]) => (
            <div key={label} className="bg-white px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                {label}
              </p>
              <p className="mt-2 font-display text-[22px] font-medium tracking-tight text-navy-900">
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="px-5 pb-4">
          <DetailsIA patients={scope} />
        </div>
      </Card>

      {/* Doctrine courte — détail en accordéon pour ne pas alourdir l'inbox. */}
      <details className="mb-6 rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
        <summary className="flex cursor-pointer items-center justify-between gap-3 list-none px-5 py-3.5">
          <p className="text-[12.5px] tracking-tight text-charcoal/75">
            <span className="font-semibold text-navy-900">Doctrine KOVELA :</span> documenter,
            transmettre, ne jamais décider médicalement.
          </p>
          <span className="text-[11px] tracking-tight text-charcoal/45">Voir détail</span>
        </summary>
        <div className="border-t border-navy-900/[0.05] px-5 py-3.5 text-[12px] leading-relaxed text-charcoal/70">
          <p>
            KOVELA structure, trace, priorise opérationnellement et transmet au cabinet selon les
            règles définies. L'IA est assistive, interne, loggée et human-in-the-loop. Toute
            décision médicale relève du chirurgien.
          </p>
        </div>
      </details>

      {/* Inbox — 6 groupes verticaux par statut opérationnel */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {operationalStatusOrder.map((status) => (
          <InboxGroup key={status} status={status} patients={grouped[status]} />
        ))}
      </div>

      <SuggestionsBlock />
    </Shell>
  );
}
