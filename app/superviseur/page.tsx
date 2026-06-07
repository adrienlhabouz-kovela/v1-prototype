"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { QueueRail } from "@/components/SupervisorQueueRail";
import { Badge, Button, Card, Modal } from "@/components/ui";
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
  getFollowUpWindow,
  getTodayScheduledLabel,
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
// Tri d'une liste de patients selon le critère sélectionné dans la barre filtres.
// ---------------------------------------------------------------------------

type SortKey = "action" | "retard" | "jplus" | "chirurgien";

function daysSinceIntervention(p: Patient, now: number): number {
  const t = new Date(p.interventionDate).getTime();
  return Math.floor((now - t) / 86_400_000);
}

function sortPatients(
  list: Patient[],
  by: SortKey,
  ctx: { reportFor: (id: string) => unknown; escalationFor: (id: string) => unknown },
  k: { surgeonName: (id: string) => string }
): Patient[] {
  const arr = [...list];
  const now = Date.now();
  if (by === "chirurgien") {
    arr.sort((a, b) => k.surgeonName(a.surgeonId).localeCompare(k.surgeonName(b.surgeonId), "fr"));
    return arr;
  }
  if (by === "jplus") {
    arr.sort((a, b) => daysSinceIntervention(a, now) - daysSinceIntervention(b, now));
    return arr;
  }
  if (by === "retard") {
    const score = (p: Patient) => {
      const u = getUrgence(p, ctx as never);
      return u === "en_retard" ? 0 : u === "aujourdhui" ? 1 : 2;
    };
    arr.sort((a, b) => score(a) - score(b));
    return arr;
  }
  arr.sort((a, b) => {
    const ua = getUrgence(a, ctx as never);
    const ub = getUrgence(b, ctx as never);
    const order = { en_retard: 0, aujourdhui: 1, a_venir: 2 } as const;
    const da = order[ua as keyof typeof order] ?? 3;
    const db = order[ub as keyof typeof order] ?? 3;
    if (da !== db) return da - db;
    return daysSinceIntervention(a, now) - daysSinceIntervention(b, now);
  });
  return arr;
}

// ---------------------------------------------------------------------------
// Ligne patient — version hero (À traiter maintenant) : dense, action visible.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Tête de la table opérationnelle « À traiter maintenant ».
// Colonnes alignées avec les rangs HeroRow → lecture verticale possible.
// ---------------------------------------------------------------------------

function HeroTableHeader() {
  return (
    <div className="hidden border-b border-navy-900/[0.06] bg-bone/40 px-5 py-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/55 sm:grid sm:grid-cols-[1.5fr_1.2fr_3rem_1.2fr_1.2fr_1.4fr_6rem] sm:items-center sm:gap-3">
      <span>Patient</span>
      <span>Intervention</span>
      <span className="text-center">J+</span>
      <span>Cabinet</span>
      <span>Dernier événement</span>
      <span>Action attendue</span>
      <span className="text-right">CTA</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ligne patient « À traiter maintenant » — format LISTE / TABLE opérationnelle
// (et non card). Colonnes alignées, scan vertical fluide, rythme premium.
// ---------------------------------------------------------------------------

function HeroPatientRow({ patient }: { patient: Patient }) {
  const k = useKovela();
  const ctx = { reportFor: k.reportFor, escalationFor: k.escalationFor };
  const day = getPostOpDay(patient);
  const last = getLastEvent(patient, ctx);
  const action = getRecommendedAction(patient, ctx);
  const urgence = getUrgence(patient, ctx);

  const lastPatientMsg = [...patient.messages]
    .reverse()
    .find((m) => m.author === "patient");
  const preview = lastPatientMsg
    ? lastPatientMsg.text.length > 70
      ? lastPatientMsg.text.slice(0, 70) + "…"
      : lastPatientMsg.text
    : null;

  const reason = (() => {
    const r = k.reportFor(patient.id);
    if (r?.status === "brouillon") return "CR brouillon IA à relire";
    if (r?.status === "valide") return "CR factuel validé";
    if (patient.status === "silencieux") return "Patient sans réponse selon référentiel";
    if (patient.status === "escalade_ouverte") return "Transmission cabinet à préparer";
    if (urgence === "en_retard") return "Action en retard";
    return "À revoir selon référentiel";
  })();

  const initials = patient.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <Link
      href={`/superviseur/patient/${patient.id}`}
      className="group block border-t border-navy-900/[0.05] transition-colors first:border-t-0 hover:bg-bone/40"
    >
      {/* Layout mobile : empilé. Layout desktop : grille alignée. */}
      <div className="flex flex-col gap-1.5 px-5 py-3 sm:grid sm:grid-cols-[1.5fr_1.2fr_3rem_1.2fr_1.2fr_1.4fr_6rem] sm:items-center sm:gap-3 sm:py-2.5">
        {/* Colonne 1 — Patient (avatar + nom + raison) */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-[11px] font-semibold tracking-tight text-navy-900 ring-1 ring-navy-100">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold tracking-tight text-navy-900">
              {patient.name}
            </p>
            <p className="truncate text-[10.5px] font-medium tracking-tight text-amber-800">
              {reason}
            </p>
          </div>
        </div>

        {/* Colonne 2 — Intervention */}
        <p className="truncate text-[11.5px] tracking-tight text-charcoal/75 sm:text-[11px]">
          {patient.intervention}
        </p>

        {/* Colonne 3 — J+ */}
        <p className="font-mono text-[11.5px] font-medium tracking-tight text-teal-700 sm:text-center">
          {day}
        </p>

        {/* Colonne 4 — Cabinet (chirurgien) */}
        <p className="truncate text-[11px] tracking-tight text-charcoal/65">
          {k.surgeonName(patient.surgeonId)}
        </p>

        {/* Colonne 5 — Dernier événement (preview message si présent, sinon âge) */}
        <div className="min-w-0">
          {preview ? (
            <p className="truncate text-[10.5px] italic tracking-tight text-charcoal/65">
              <span className="not-italic text-amber-700">«</span> {preview}{" "}
              <span className="not-italic text-amber-700">»</span>
            </p>
          ) : (
            <p className="text-[10.5px] tracking-tight text-charcoal/55">—</p>
          )}
          {last.ageLabel && (
            <p className="text-[9.5px] tracking-tight text-charcoal/45">
              {last.ageLabel}
            </p>
          )}
        </div>

        {/* Colonne 6 — Action attendue */}
        <p className="truncate text-[11px] font-medium tracking-tight text-navy-900">
          <span className="text-teal-700">→</span> {action.label}
        </p>

        {/* Colonne 7 — CTA */}
        <div className="flex justify-end">
          <span className="rounded-md bg-navy-900 px-3 py-1.5 text-[11px] font-medium text-white transition-colors group-hover:bg-navy-800">
            Ouvrir le dossier
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Ligne patient — version compacte pour files secondaires.
// ---------------------------------------------------------------------------

function QueuePatientRow({ patient }: { patient: Patient }) {
  const k = useKovela();
  const ctx = { reportFor: k.reportFor, escalationFor: k.escalationFor };
  const day = getPostOpDay(patient);
  const action = getRecommendedAction(patient, ctx);
  const urgence = getUrgence(patient, ctx);
  const last = getLastEvent(patient, ctx);

  return (
    <Link
      href={`/superviseur/patient/${patient.id}`}
      className="group block border-t border-navy-900/[0.04] px-4 py-2.5 transition-colors first:border-t-0 hover:bg-bone/40"
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <span className="truncate text-[12.5px] font-medium tracking-tight text-navy-900">
            {patient.name}
          </span>
          <span className="font-mono text-[10.5px] font-medium text-teal-700">{day}</span>
          <span className="truncate text-[10.5px] text-charcoal/55">{patient.intervention}</span>
        </div>
        {urgence === "en_retard" && (
          <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9.5px] font-medium text-amber-800 ring-1 ring-amber-100">
            Retard
          </span>
        )}
      </div>
      <p className="mt-0.5 flex items-center gap-x-2 text-[11px] tracking-tight text-charcoal/55">
        <span className="text-teal-700">→</span>
        <span className="truncate text-navy-900">{action.label}</span>
        {last.ageLabel && <span className="text-charcoal/45">· {last.ageLabel}</span>}
      </p>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Carte d'une file secondaire — compact.
// ---------------------------------------------------------------------------

function SecondaryQueue({
  title,
  hint,
  accentColor,
  patients,
  limit,
  onExpand,
  expanded,
}: {
  title: string;
  hint: string;
  accentColor: string;
  patients: Patient[];
  limit: number;
  onExpand: () => void;
  expanded: boolean;
}) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="flex items-start gap-3 border-b border-navy-900/[0.05] px-4 py-3">
        <span className={`mt-1 h-5 w-[2px] shrink-0 rounded-full ${accentColor}`} />
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-[13px] font-semibold tracking-tight text-navy-900">
              {title}
            </h3>
            <span className="flex h-5 min-w-[22px] items-center justify-center rounded-md bg-navy-900 px-1.5 text-[10.5px] font-semibold text-white">
              {patients.length}
            </span>
          </div>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-charcoal/55">
            {hint}
          </p>
        </div>
      </div>
      <div className="flex-1">
        {patients.length === 0 ? (
          <p className="px-4 py-5 text-center text-[11px] tracking-tight text-charcoal/40">
            Rien ici.
          </p>
        ) : (
          <>
            {patients.slice(0, limit).map((p) => (
              <QueuePatientRow key={p.id} patient={p} />
            ))}
            {patients.length > limit && (
              <button
                type="button"
                onClick={onExpand}
                className="w-full border-t border-navy-900/[0.05] px-4 py-2 text-center text-[11px] font-medium tracking-tight text-teal-700 hover:bg-bone/40"
              >
                Voir tout ({patients.length}) ↓
              </button>
            )}
            {expanded && patients.length > 6 && (
              <button
                type="button"
                onClick={onExpand}
                className="w-full border-t border-navy-900/[0.05] px-4 py-2 text-center text-[10.5px] tracking-tight text-charcoal/55 hover:bg-bone/40"
              >
                Replier
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Bloc Améliorations terrain — conservé.
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
    <div className="mt-8 rounded-2xl bg-bone/40 px-5 py-4 ring-1 ring-navy-900/[0.04]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
            Amélioration continue
          </p>
          <p className="mt-1 text-[12.5px] text-charcoal/70">
            {mine.length === 0
              ? "Aucune suggestion proposée."
              : `${mine.length} suggestion${mine.length > 1 ? "s" : ""} de votre part.`}
          </p>
        </div>
        <Button variant="subtle" onClick={() => setOpen(true)}>
          Proposer une amélioration
        </Button>
      </div>
      {confirm && (
        <div className="mt-3 rounded-md bg-teal-50/60 px-3 py-2 text-[11.5px] text-teal-700 ring-1 ring-teal-100">
          ✓ Suggestion enregistrée. Merci — elle sera relue par l&apos;équipe KOVELA.
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Proposer une amélioration terrain" wide>
        <p className="mb-3 text-xs text-charcoal/55">
          Retour superviseur — utilisé pour l&apos;amélioration continue du service opéré. Données fictives.
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
              placeholder="Décrivez la friction ou l&apos;idée d&apos;amélioration…"
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bloc indicateurs IA & qualité — repliable, secondaire.
// ---------------------------------------------------------------------------

function MetricsBlock({ patients }: { patients: Patient[] }) {
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

  const delays: number[] = [];
  patients.forEach((p) => {
    for (let i = 0; i < p.messages.length - 1; i++) {
      if (p.messages[i].author === "patient" && p.messages[i + 1].author !== "patient") {
        const dt =
          (new Date(p.messages[i + 1].at).getTime() - new Date(p.messages[i].at).getTime()) /
          36e5;
        if (dt >= 0) delays.push(dt);
      }
    }
  });
  const delayH = delays.length ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      className="mt-4 rounded-xl bg-bone/40 ring-1 ring-navy-900/[0.04]"
    >
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-[11.5px] tracking-tight text-charcoal/65 list-none hover:bg-bone/70">
        <span className="flex items-center gap-2">
          Indicateurs IA &amp; qualité
          {me && (
            <Badge className={formationStyles[me.formationStatus]}>
              {formationLabels[me.formationStatus]}
            </Badge>
          )}
        </span>
        <span className={`text-[12px] transition-transform ${open ? "rotate-90" : ""}`}>›</span>
      </summary>
      <div className="border-t border-navy-900/[0.04] px-4 py-3">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-navy-900/[0.04] sm:grid-cols-4">
          {[
            ["Délai moyen patient → réponse", delayH ? `${delayH.toFixed(1)} h` : "—"],
            ["Usage IA", String(usage)],
            ["IA acceptées / modifiées", `${ac} / ${mo}`],
            ["Temps estimé gagné (IA)", formatMinutes(minutes)],
          ].map(([label, value]) => (
            <div key={label} className="bg-white px-3 py-2.5">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                {label}
              </p>
              <p className="mt-1 font-display text-[14px] font-medium tracking-tight text-navy-900">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

// ---------------------------------------------------------------------------
// Page principale — cockpit superviseur.
// ---------------------------------------------------------------------------

export default function SuperviseurInbox() {
  const k = useKovela();
  const [onlyMine, setOnlyMine] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<"" | OperationalStatus>("");
  const [filterUrgence, setFilterUrgence] = useState<"" | "en_retard" | "aujourdhui" | "a_venir">("");
  const [filterSurgeon, setFilterSurgeon] = useState<string>("");
  const [filterCR, setFilterCR] = useState<"" | "brouillon" | "valide">("");
  const [filterSilencieux, setFilterSilencieux] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("action");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const HERO_LIMIT = 8;
  const QUEUE_LIMIT = 6;

  const ctx = useMemo(
    () => ({ reportFor: k.reportFor, escalationFor: k.escalationFor }),
    [k.reportFor, k.escalationFor]
  );

  const baseScope = useMemo(() => {
    return onlyMine
      ? k.patients.filter((p) => p.supervisorId === MY_SUPERVISOR_ID)
      : k.patients;
  }, [k.patients, onlyMine]);

  const scope = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseScope.filter((p) => {
      if (q) {
        const surgeon = k.surgeonName(p.surgeonId).toLowerCase();
        const hit =
          p.name.toLowerCase().includes(q) ||
          surgeon.includes(q) ||
          p.intervention.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (filterStatut && getOperationalStatus(p, ctx) !== filterStatut) return false;
      if (filterUrgence && getUrgence(p, ctx) !== filterUrgence) return false;
      if (filterSurgeon && p.surgeonId !== filterSurgeon) return false;
      if (filterCR) {
        const r = k.reportFor(p.id);
        if (!r || r.status !== filterCR) return false;
      }
      if (filterSilencieux && p.status !== "silencieux") return false;
      return true;
    });
  }, [baseScope, search, filterStatut, filterUrgence, filterSurgeon, filterCR, filterSilencieux, ctx, k]);

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

  const counts = useMemo(() => countByOperationalStatus(scope, ctx), [scope, ctx]);
  const patientsActifs = scope.filter((p) => p.status !== "cloture").length;
  const crBrouillonARelire = scope.filter((p) => k.reportFor(p.id)?.status === "brouillon").length;
  const crValidesAPublier = scope.filter((p) => k.reportFor(p.id)?.status === "valide").length;
  const enRetard = scope.filter((p) => getUrgence(p, ctx) === "en_retard").length;

  const surgeonsInScope = useMemo(() => {
    const ids = Array.from(new Set(baseScope.map((p) => p.surgeonId)));
    return ids
      .map((id) => ({ id, name: k.surgeonName(id) }))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [baseScope, k]);

  function clearFilters() {
    setSearch("");
    setFilterStatut("");
    setFilterUrgence("");
    setFilterSurgeon("");
    setFilterCR("");
    setFilterSilencieux(false);
  }

  const hasActiveFilter =
    !!search || !!filterStatut || !!filterUrgence || !!filterSurgeon || !!filterCR || filterSilencieux;

  const aTraiter = sortPatients(grouped.a_traiter, sortBy, ctx, k);

  // CR factuels = file dédiée (séparée des transmissions cabinet).
  // Patients dont le CR est en brouillon (à relire) ou validé (à publier).
  const crFactuelsList = useMemo(
    () =>
      sortPatients(
        scope.filter((p) => {
          const r = k.reportFor(p.id);
          return r?.status === "brouillon" || r?.status === "valide";
        }),
        sortBy,
        ctx,
        k
      ),
    [scope, sortBy, ctx, k]
  );

  // Files configurées explicitement — 5 files métier, regroupées en 2 tiers
  // visuellement distincts.
  type FileConfig = {
    key: string;
    title: string;
    hint: string;
    accentColor: string;
    patients: Patient[];
  };
  const tier1Files: FileConfig[] = [
    {
      key: "transmissions_cabinet",
      title: "Transmissions cabinet",
      hint: "Compilations préparées · transmissions à envoyer.",
      accentColor: "bg-teal-500/80",
      patients: sortPatients(grouped.a_transmettre_cabinet, sortBy, ctx, k),
    },
    {
      key: "patients_sans_reponse",
      title: "Patients sans réponse",
      hint: "Relance attendue selon référentiel.",
      accentColor: "bg-amber-300/70",
      patients: sortPatients(grouped.a_relancer, sortBy, ctx, k),
    },
    {
      key: "cr_factuels",
      title: "CR factuels",
      hint: "Brouillons IA à relire · validés à transmettre.",
      accentColor: "bg-teal-600/70",
      patients: crFactuelsList,
    },
  ];
  const tier2Files: FileConfig[] = [
    {
      key: "en_attente_cabinet",
      title: "Retours cabinet attendus",
      hint: "Transmission envoyée · réponse cabinet à intégrer.",
      accentColor: "bg-navy-900/30",
      patients: sortPatients(grouped.en_attente_cabinet, sortBy, ctx, k),
    },
    {
      key: "suivis_du_jour",
      title: "Suivis du jour",
      hint: "Pas d'action immédiate · veille référentiel.",
      accentColor: "bg-navy-900/[0.08]",
      patients: sortPatients(grouped.suivi_habituel, sortBy, ctx, k),
    },
    {
      key: "clotures",
      title: "Clôtures à finaliser",
      hint: "Suivi terminé · CR à transmettre · clôture à valider.",
      accentColor: "bg-navy-900/40",
      patients: sortPatients(grouped.cloture_a_preparer, sortBy, ctx, k),
    },
  ];

  // Charge du jour — synthèse opérationnelle visible en haut de page.
  const chargeTotal = aTraiter.length + counts.a_relancer + counts.a_transmettre_cabinet;
  const chargeLabel =
    chargeTotal === 0
      ? "Aucune action prioritaire — file vide"
      : chargeTotal < 6
      ? "Charge légère"
      : chargeTotal < 14
      ? "Charge soutenue"
      : "Charge forte";
  const chargeTone =
    chargeTotal === 0
      ? "bg-teal-50 text-teal-700 ring-teal-100"
      : chargeTotal < 6
      ? "bg-teal-50/70 text-teal-800 ring-teal-100"
      : chargeTotal < 14
      ? "bg-amber-50/70 text-amber-800 ring-amber-200/60"
      : "bg-amber-100/70 text-amber-900 ring-amber-300/60";

  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Shell>
      {/* ─── WORKSPACE SUPERVISEUR ──────────────────────────────────────────
          Layout 2 panneaux permanent :
            · Rail patient (gauche) — toujours visible, navigation en place.
            · Pane droit — vue cockpit dashboard (charge globale, file
              prioritaire, files secondaires).
          La superviseuse peut cliquer un patient dans le rail à tout
          moment pour basculer en vue fiche, sans quitter le workspace.
          ──────────────────────────────────────────────────────────────── */}
      <div className="flex gap-4">
        {/* Rail gauche — permanent, scrollable indépendamment */}
        <div className="hidden w-[264px] shrink-0 lg:block">
          <div className="sticky top-2 h-[calc(100vh-6rem)]">
            <QueueRail />
          </div>
        </div>

        {/* Pane droit — vue cockpit dashboard existante */}
        <div className="min-w-0 flex-1">
      {/* ─── COCKPIT HEADER ───────────────────────────────────────────────── */}
      <div className="mb-5 border-b border-navy-900/[0.06] pb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-teal-700">
              Poste superviseur
            </p>
            <h1 className="mt-1.5 font-sans text-[1.6rem] font-semibold tracking-tight text-navy-900">
              Cockpit opérationnel
            </h1>
            <p className="mt-1 text-[12px] tracking-tight text-charcoal/60">
              <span className="capitalize">{todayLabel}</span>
              <span className="text-charcoal/35"> · </span>
              {patientsActifs} patients suivis
              {enRetard > 0 && (
                <>
                  <span className="text-charcoal/35"> · </span>
                  <span className="text-amber-800">{enRetard} en retard</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-[11.5px]">
            <span
              className={`rounded-md px-2.5 py-1.5 font-medium ring-1 ${chargeTone}`}
              title={`${chargeTotal} dossiers prioritaires`}
            >
              <span className="opacity-70">État de charge · </span>
              {chargeLabel}
            </span>
            <span className="rounded-md bg-teal-50/60 px-2.5 py-1.5 font-medium text-teal-700 ring-1 ring-teal-100/70">
              Service actif · 8h–20h
            </span>
            <label className="flex cursor-pointer select-none items-center gap-2 rounded-md bg-bone/70 px-2.5 py-1.5 text-charcoal/70 ring-1 ring-navy-900/[0.04]">
              <input
                type="checkbox"
                checked={onlyMine}
                onChange={(e) => setOnlyMine(e.target.checked)}
                className="h-3.5 w-3.5"
              />
              Mes patients uniquement
            </label>
          </div>
        </div>

        {/* Bandeau métriques compact — 1 ligne pills, ne vole pas la vedette
            à la file prioritaire. */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] tracking-tight">
          {(
            [
              ["À traiter", counts.a_traiter, "amber"],
              ["Sans réponse", counts.a_relancer, "amber"],
              ["Transmissions", counts.a_transmettre_cabinet, "teal"],
              ["Retours cabinet", counts.en_attente_cabinet, "navy"],
              ["CR à relire", crBrouillonARelire, "teal"],
              ["Clôtures", counts.cloture_a_preparer, "navy"],
            ] as const
          ).map(([label, value, tone]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 ring-1 ring-navy-900/[0.06]"
            >
              <span className="text-charcoal/55">{label}</span>
              <span
                className={`font-mono text-[11.5px] font-semibold ${
                  value === 0
                    ? "text-charcoal/30"
                    : tone === "amber"
                    ? "text-amber-700"
                    : tone === "teal"
                    ? "text-teal-700"
                    : "text-navy-900"
                }`}
              >
                {value}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── HERO — À TRAITER MAINTENANT ───────────────────────────────────── */}
      <section className="mb-8 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.05]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-900/[0.06] bg-amber-50/40 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="h-7 w-[3px] rounded-full bg-amber-500" />
            <div>
              <h2 className="font-sans text-[15px] font-semibold tracking-tight text-navy-900">
                À traiter maintenant
              </h2>
              <p className="text-[11.5px] tracking-tight text-charcoal/60">
                {operationalStatusHints.a_traiter}
              </p>
            </div>
          </div>
          <span className="rounded-md bg-amber-100 px-3 py-1 text-[12.5px] font-semibold text-amber-800 ring-1 ring-amber-200/60">
            {aTraiter.length} patient{aTraiter.length > 1 ? "s" : ""}
          </span>
        </div>
        <div>
          {aTraiter.length === 0 ? (
            <p className="px-5 py-10 text-center text-[12.5px] tracking-tight text-charcoal/50">
              ✓ Aucun patient à traiter immédiatement. Bon début de journée.
            </p>
          ) : (
            <>
              <HeroTableHeader />
              {(expandedGroups.a_traiter ? aTraiter : aTraiter.slice(0, HERO_LIMIT)).map((p) => (
                <HeroPatientRow key={p.id} patient={p} />
              ))}
              {aTraiter.length > HERO_LIMIT && (
                <button
                  type="button"
                  onClick={() =>
                    setExpandedGroups((prev) => ({ ...prev, a_traiter: !prev.a_traiter }))
                  }
                  className="w-full border-t border-navy-900/[0.05] px-5 py-3 text-center text-[12px] font-medium tracking-tight text-teal-700 hover:bg-bone/40"
                >
                  {expandedGroups.a_traiter
                    ? "Replier"
                    : `Voir les ${aTraiter.length - HERO_LIMIT} suivants ↓`}
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* ─── BARRE FILTRES COMPACTE ───────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-navy-900/[0.045]">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher patient · chirurgien · intervention…"
          className="flex-1 min-w-[220px] rounded-md bg-bone/60 px-3 py-1.5 text-[12.5px] tracking-tight text-navy-900 placeholder:text-charcoal/45 ring-1 ring-navy-900/[0.06] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        />
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value as typeof filterStatut)}
          className="rounded-md bg-bone/60 px-2.5 py-1.5 text-[12px] tracking-tight text-navy-900 ring-1 ring-navy-900/[0.06] focus:bg-white focus:outline-none"
        >
          <option value="">Statut</option>
          {operationalStatusOrder.map((s) => (
            <option key={s} value={s}>
              {operationalStatusLabels[s]}
            </option>
          ))}
        </select>
        <select
          value={filterUrgence}
          onChange={(e) => setFilterUrgence(e.target.value as typeof filterUrgence)}
          className="rounded-md bg-bone/60 px-2.5 py-1.5 text-[12px] tracking-tight text-navy-900 ring-1 ring-navy-900/[0.06] focus:bg-white focus:outline-none"
        >
          <option value="">Retard</option>
          <option value="en_retard">En retard</option>
          <option value="aujourdhui">Aujourd&apos;hui</option>
          <option value="a_venir">À venir</option>
        </select>
        <select
          value={filterSurgeon}
          onChange={(e) => setFilterSurgeon(e.target.value)}
          className="rounded-md bg-bone/60 px-2.5 py-1.5 text-[12px] tracking-tight text-navy-900 ring-1 ring-navy-900/[0.06] focus:bg-white focus:outline-none"
        >
          <option value="">Chirurgien</option>
          {surgeonsInScope.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={filterCR}
          onChange={(e) => setFilterCR(e.target.value as typeof filterCR)}
          className="rounded-md bg-bone/60 px-2.5 py-1.5 text-[12px] tracking-tight text-navy-900 ring-1 ring-navy-900/[0.06] focus:bg-white focus:outline-none"
        >
          <option value="">CR</option>
          <option value="brouillon">Brouillon à relire</option>
          <option value="valide">Validé à transmettre</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded-md bg-white px-2.5 py-1.5 text-[12px] tracking-tight text-navy-900 ring-1 ring-navy-900/[0.06] focus:outline-none"
        >
          <option value="action">Tri · prochaine action</option>
          <option value="retard">Tri · retard</option>
          <option value="jplus">Tri · J+ croissant</option>
          <option value="chirurgien">Tri · chirurgien</option>
        </select>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md bg-white px-2.5 py-1.5 text-[11.5px] font-medium tracking-tight text-charcoal/70 ring-1 ring-navy-900/[0.08] hover:bg-bone"
          >
            ✕ Réinitialiser
          </button>
        )}
        {scope.length !== baseScope.length && (
          <span className="text-[10.5px] tracking-tight text-charcoal/55">
            {scope.length} sur {baseScope.length}
          </span>
        )}
      </div>

      {/* ─── FILES PRIORITAIRES (Tier 1) ──────────────────────────────────── */}
      <div className="mb-2.5 flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/65">
          Files prioritaires
        </h3>
        <p className="text-[10.5px] tracking-tight text-charcoal/55">
          Transmissions cabinet · sans réponse · retours cabinet
        </p>
      </div>
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {tier1Files.map((f) => (
          <SecondaryQueue
            key={f.key}
            title={f.title}
            hint={f.hint}
            accentColor={f.accentColor}
            patients={f.patients}
            limit={expandedGroups[f.key] ? Infinity : QUEUE_LIMIT}
            onExpand={() =>
              setExpandedGroups((prev) => ({ ...prev, [f.key]: !prev[f.key] }))
            }
            expanded={!!expandedGroups[f.key]}
          />
        ))}
      </div>

      {/* ─── FILES SECONDAIRES (Tier 2) ───────────────────────────────────── */}
      <div className="mb-2.5 flex items-baseline justify-between">
        <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
          Files secondaires
        </h3>
        <p className="text-[10px] tracking-tight text-charcoal/40">
          Retours cabinet · suivis du jour · clôtures
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {tier2Files.map((f) => (
          <SecondaryQueue
            key={f.key}
            title={f.title}
            hint={f.hint}
            accentColor={f.accentColor}
            patients={f.patients}
            limit={expandedGroups[f.key] ? Infinity : 4}
            onExpand={() =>
              setExpandedGroups((prev) => ({ ...prev, [f.key]: !prev[f.key] }))
            }
            expanded={!!expandedGroups[f.key]}
          />
        ))}
      </div>

      <div className="mt-6">
        <MetricsBlock patients={scope} />
      </div>

      <SuggestionsBlock />
        </div>
        {/* /Pane droit */}
      </div>
      {/* /Workspace flex */}
    </Shell>
  );
}
