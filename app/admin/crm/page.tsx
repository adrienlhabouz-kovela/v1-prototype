"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Modal,
  PageHeader,
  SectionTitle,
  StatCard,
} from "@/components/ui";
import { useKovela, type ProspectInput } from "@/lib/store";
import {
  interestLabels,
  interestStyles,
  isRelanceDueWithin,
  prospectStatusLabels,
  prospectStatusStyles,
  formatDate,
  mandateLabels,
  mandateStyles,
  priorityLabels,
} from "@/lib/format";
import type {
  CabinetType,
  InterestLevel,
  Priority,
  Prospect,
  ProspectStatus,
} from "@/lib/types";

const PIPELINE: ProspectStatus[] = [
  "a_contacter",
  "contacte",
  "call_prevu",
  "demo_faite",
  "en_reflexion",
  "accord_verbal",
  "onboarding_cabinet",
  "actif",
  "perdu",
];

const SPECIALIZATIONS = [
  "Chirurgie esthétique / plastique",
  "Chirurgie maxillo-faciale",
  "Chirurgie orthopédique",
  "Chirurgie ORL",
  "Chirurgie ophtalmologique",
  "Chirurgie urologique",
  "Chirurgie gynécologique",
  "Autre spécialité ambulatoire",
];

const VERTICALS = [
  "Esthétique & plastique",
  "ORL / maxillo-facial",
  "Ambulatoire orthopédique",
  "Ophtalmologie",
  "Urologie",
  "Gynécologie",
  "Autre ambulatoire",
];

const SOURCES = ["LinkedIn", "Recommandation", "Salon", "Inbound site", "Réseau"];

const inputCls =
  "w-full rounded-xl border border-navy-100 px-3 py-2 text-sm outline-none focus:border-teal-400";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
        {label}
      </span>
      {children}
    </label>
  );
}

function emptyInput(): ProspectInput {
  return {
    firstName: "",
    lastName: "",
    specialty: SPECIALIZATIONS[0],
    vertical: VERTICALS[0],
    cabinet: "",
    city: "",
    email: "",
    phone: "",
    linkedin: "",
    source: SOURCES[0],
    cabinetType: "solo",
    monthlyVolume: 0,
    interest: "tiede",
    priority: "moyenne",
    salesOwnerId: "so1",
  };
}

const closingStatuses: ProspectStatus[] = ["accord_verbal", "onboarding_cabinet", "actif"];


export default function CRMPage() {
  const k = useKovela();
  const [tab, setTab] = useState<"pipeline" | "table">("pipeline");
  const [addOpen, setAddOpen] = useState(false);
  const [target, setTarget] = useState<Prospect | null>(null);

  // Filtres (Table)
  const [fStatus, setFStatus] = useState<ProspectStatus | "all">("all");
  const [fSpecialty, setFSpecialty] = useState<string>("all");
  const [fVertical, setFVertical] = useState<string>("all");
  const [fCity, setFCity] = useState<string>("all");
  const [fSource, setFSource] = useState<string>("all");
  const [fInterest, setFInterest] = useState<InterestLevel | "all">("all");
  const [fDemo, setFDemo] = useState<"all" | "yes" | "no">("all");
  const [fOnboarding, setFOnboarding] = useState<"all" | "yes" | "no">("all");
  const [fActive, setFActive] = useState<"all" | "yes" | "no">("all");
  const [fOwner, setFOwner] = useState<string>("all");
  const [fRelanceDue, setFRelanceDue] = useState<"all" | "yes">("all");

  const prospects = k.prospects;

  const stats = useMemo(() => {
    const demos = prospects.filter((p) => p.demoDone).length;
    const reflexion = prospects.filter((p) => p.status === "en_reflexion").length;
    const onboardings = prospects.filter((p) => p.onboardingLaunched).length;
    const actifs = prospects.filter((p) => p.isActive).length;
    const closingOrActive = prospects.filter((p) => closingStatuses.includes(p.status));
    const monthlyVolume = closingOrActive.reduce((acc, p) => acc + (p.monthlyVolume || 0), 0);
    const caPotentiel = closingOrActive.length * k.pricing.baseMonthly + monthlyVolume * k.pricing.perActivatedPatient;
    return { total: prospects.length, demos, reflexion, onboardings, actifs, monthlyVolume, caPotentiel };
  }, [prospects, k.pricing]);

  const cities = useMemo(
    () => Array.from(new Set(prospects.map((p) => p.city))).sort(),
    [prospects]
  );

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (fStatus !== "all" && p.status !== fStatus) return false;
      if (fSpecialty !== "all" && p.specialty !== fSpecialty) return false;
      if (fVertical !== "all" && p.vertical !== fVertical) return false;
      if (fCity !== "all" && p.city !== fCity) return false;
      if (fSource !== "all" && p.source !== fSource) return false;
      if (fInterest !== "all" && p.interest !== fInterest) return false;
      if (fDemo !== "all" && p.demoDone !== (fDemo === "yes")) return false;
      if (fOnboarding !== "all" && p.onboardingLaunched !== (fOnboarding === "yes")) return false;
      if (fActive !== "all" && p.isActive !== (fActive === "yes")) return false;
      if (fOwner !== "all" && p.salesOwnerId !== fOwner) return false;
      if (fRelanceDue === "yes" && !isRelanceDueWithin(p.nextRelanceAt, 7)) return false;
      return true;
    });
  }, [
    prospects,
    fStatus,
    fSpecialty,
    fVertical,
    fCity,
    fSource,
    fInterest,
    fDemo,
    fOnboarding,
    fActive,
    fOwner,
    fRelanceDue,
  ]);

  // Performance commerciale par sales — pilotage opérationnel.
  const perSales = useMemo(() => {
    return k.salesOwners.map((o) => {
      const assigned = prospects.filter((p) => p.salesOwnerId === o.id);
      const demos = assigned.filter((p) => p.demoDone).length;
      const reflexion = assigned.filter((p) => p.status === "en_reflexion").length;
      const onboardings = assigned.filter((p) => p.onboardingLaunched).length;
      const actifs = assigned.filter((p) => p.isActive).length;
      const closingOrActive = assigned.filter((p) => closingStatuses.includes(p.status));
      const monthlyVolume = closingOrActive.reduce((acc, p) => acc + (p.monthlyVolume || 0), 0);
      const caPotentiel = closingOrActive.length * k.pricing.baseMonthly + monthlyVolume * k.pricing.perActivatedPatient;
      const relancesDues = assigned.filter((p) => isRelanceDueWithin(p.nextRelanceAt, 7)).length;
      const nextAction =
        assigned
          .filter((p) => isRelanceDueWithin(p.nextRelanceAt, 7))
          .sort((a, b) => (a.nextRelanceAt ?? "").localeCompare(b.nextRelanceAt ?? ""))[0]
          ?.nextAction || "—";
      return { owner: o, assigned: assigned.length, demos, reflexion, onboardings, actifs, monthlyVolume, caPotentiel, relancesDues, nextAction };
    });
  }, [prospects, k.salesOwners, k.pricing]);

  const relancesDuesWeek = prospects.filter((p) => isRelanceDueWithin(p.nextRelanceAt, 7)).length;
  const demoToOnboardingRate =
    stats.demos > 0 ? Math.round((stats.onboardings / stats.demos) * 100) : 0;

  return (
    <Shell>
      <PageHeader
        eyebrow="Admin KOVELA"
        title="CRM Chirurgiens"
        subtitle="Prospection, démos, mise en place cabinet et activation des chirurgiens. Aucune donnée patient."
      >
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          Ajouter un prospect
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Prospects" value={stats.total} />
        <StatCard label="Démos faites" value={stats.demos} />
        <StatCard label="En réflexion" value={stats.reflexion} />
        <StatCard label="Onboardings" value={stats.onboardings} />
        <StatCard label="Chirurgiens actifs" value={stats.actifs} accent />
        <StatCard label="Volume patients / mois" value={stats.monthlyVolume} hint="closing + actifs" />
        <StatCard label="CA mensuel potentiel" value={`${stats.caPotentiel} €`} hint="estimation commerciale" />
      </div>
      <p className="mb-4 text-[11px] text-charcoal/45">
        Estimation commerciale — données fictives. {k.pricing.baseMonthly} € HT × (closing + actifs) +{" "}
        {k.pricing.perActivatedPatient} € HT × volume patients estimé.
      </p>

      {/* Performance commerciale */}
      <SectionTitle hint="Pilotage commercial — indicateurs commerciaux non punitifs">
        Performance commerciale
      </SectionTitle>
      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Prospects total" value={stats.total} />
        <StatCard label="Prospects actifs" value={prospects.filter((p) => p.status !== "perdu").length} />
        <StatCard label="Démos faites" value={stats.demos} />
        <StatCard label="Taux démo → onboarding" value={`${demoToOnboardingRate} %`} hint="estimation" />
        <StatCard label="Relances dues cette semaine" value={relancesDuesWeek} accent />
      </div>
      <Card className="mb-8 overflow-hidden">
        <CardHeader title="Performance par sales" subtitle="Indicateurs commerciaux par responsable commercial" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-900/[0.06] text-left text-[11px] uppercase tracking-[0.08em] text-charcoal/45">
                <th className="px-5 py-3 font-medium">Sales</th>
                <th className="px-5 py-3 font-medium">Prospects</th>
                <th className="px-5 py-3 font-medium">Démos</th>
                <th className="px-5 py-3 font-medium">En réflexion</th>
                <th className="px-5 py-3 font-medium">Onboardings</th>
                <th className="px-5 py-3 font-medium">Actifs</th>
                <th className="px-5 py-3 font-medium">Vol / mois</th>
                <th className="px-5 py-3 font-medium">CA potentiel</th>
                <th className="px-5 py-3 font-medium">Relances dues</th>
                <th className="px-5 py-3 font-medium">Prochaine action</th>
              </tr>
            </thead>
            <tbody>
              {perSales.map((s) => (
                <tr key={s.owner.id} className="border-b border-navy-900/[0.04]">
                  <td className="px-5 py-3">
                    <div className="font-medium text-navy-900">{s.owner.name}</div>
                    <div className="text-[11px] text-charcoal/55">{s.owner.role}</div>
                  </td>
                  <td className="px-5 py-3 text-charcoal/70">{s.assigned}</td>
                  <td className="px-5 py-3 text-charcoal/70">{s.demos}</td>
                  <td className="px-5 py-3 text-charcoal/70">{s.reflexion}</td>
                  <td className="px-5 py-3 text-charcoal/70">{s.onboardings}</td>
                  <td className="px-5 py-3 text-navy-900">{s.actifs}</td>
                  <td className="px-5 py-3 text-charcoal/70">{s.monthlyVolume}</td>
                  <td className="px-5 py-3 text-teal-700">{s.caPotentiel} €</td>
                  <td className="px-5 py-3 text-charcoal/70">{s.relancesDues}</td>
                  <td className="px-5 py-3 text-charcoal/70">{s.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("pipeline")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "pipeline" ? "bg-navy-900 text-white" : "bg-white text-charcoal/70 ring-1 ring-navy-100"
          }`}
        >
          Pipeline
        </button>
        <button
          onClick={() => setTab("table")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "table" ? "bg-navy-900 text-white" : "bg-white text-charcoal/70 ring-1 ring-navy-100"
          }`}
        >
          Table
        </button>
      </div>

      {/* Pipeline */}
      {tab === "pipeline" && (
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3">
            {PIPELINE.map((status) => {
              const items = prospects.filter((p) => p.status === status);
              return (
                <div key={status} className="w-64 shrink-0 rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.05]">
                  <div className="flex items-center justify-between border-b border-navy-900/[0.06] px-4 py-3">
                    <span className="text-xs font-semibold text-navy-900">{prospectStatusLabels[status]}</span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-navy-900 px-1.5 text-[10px] font-semibold text-white">
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    {items.length === 0 && (
                      <p className="px-1 py-4 text-center text-[11px] text-charcoal/40">—</p>
                    )}
                    {items.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setTarget(p)}
                        className="block w-full rounded-xl border border-navy-100 bg-white p-3 text-left transition-colors hover:border-teal-200 hover:bg-teal-50/30"
                      >
                        <p className="truncate text-sm font-medium text-navy-900">
                          Dr. {p.firstName} {p.lastName}
                        </p>
                        <p className="truncate text-[11px] text-charcoal/55">
                          {p.cabinet} · {p.city}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-charcoal/45">{p.specialty}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge className={interestStyles[p.interest]}>{interestLabels[p.interest]}</Badge>
                          <span className="text-[11px] text-charcoal/60">{p.monthlyVolume}/mois</span>
                        </div>
                        <p className="mt-2 truncate text-[11px] text-charcoal/45">
                          Sales : {k.salesOwners.find((o) => o.id === p.salesOwnerId)?.name ?? "—"}
                          {p.nextRelanceAt ? ` · relance ${p.nextRelanceAt}` : ""}
                        </p>
                        {p.nextAction && (
                          <p className="mt-2 truncate text-[11px] text-charcoal/55">
                            ↳ {p.nextAction}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      {tab === "table" && (
        <>
          <Card className="mb-4 p-4">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Sel label="Statut" value={fStatus} onChange={(v) => setFStatus(v as ProspectStatus | "all")}>
                <option value="all">Tous</option>
                {PIPELINE.map((s) => (
                  <option key={s} value={s}>
                    {prospectStatusLabels[s]}
                  </option>
                ))}
              </Sel>
              <Sel label="Spécialité" value={fSpecialty} onChange={setFSpecialty}>
                <option value="all">Toutes</option>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Sel>
              <Sel label="Verticale" value={fVertical} onChange={setFVertical}>
                <option value="all">Toutes</option>
                {VERTICALS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Sel>
              <Sel label="Ville" value={fCity} onChange={setFCity}>
                <option value="all">Toutes</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Sel>
              <Sel label="Source" value={fSource} onChange={setFSource}>
                <option value="all">Toutes</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Sel>
              <Sel label="Intérêt" value={fInterest} onChange={(v) => setFInterest(v as InterestLevel | "all")}>
                <option value="all">Tous</option>
                <option value="froid">Froid</option>
                <option value="tiede">Tiède</option>
                <option value="chaud">Chaud</option>
              </Sel>
              <Sel label="Démo faite" value={fDemo} onChange={(v) => setFDemo(v as "all" | "yes" | "no")}>
                <option value="all">Tous</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </Sel>
              <Sel
                label="Onboarding lancé"
                value={fOnboarding}
                onChange={(v) => setFOnboarding(v as "all" | "yes" | "no")}
              >
                <option value="all">Tous</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </Sel>
              <Sel label="Actif" value={fActive} onChange={(v) => setFActive(v as "all" | "yes" | "no")}>
                <option value="all">Tous</option>
                <option value="yes">Oui</option>
                <option value="no">Non</option>
              </Sel>
              <Sel label="Sales owner" value={fOwner} onChange={setFOwner}>
                <option value="all">Tous</option>
                {k.salesOwners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </Sel>
              <Sel label="Relance due (7 j)" value={fRelanceDue} onChange={(v) => setFRelanceDue(v as "all" | "yes")}>
                <option value="all">Toutes</option>
                <option value="yes">Oui</option>
              </Sel>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-900/[0.06] text-left text-[11px] uppercase tracking-[0.08em] text-charcoal/45">
                    <th className="px-5 py-3.5 font-medium">Chirurgien</th>
                    <th className="px-5 py-3.5 font-medium">Cabinet</th>
                    <th className="px-5 py-3.5 font-medium">Spécialité</th>
                    <th className="px-5 py-3.5 font-medium">Verticale</th>
                    <th className="px-5 py-3.5 font-medium">Ville</th>
                    <th className="px-5 py-3.5 font-medium">Sales</th>
                    <th className="px-5 py-3.5 font-medium">Statut</th>
                    <th className="px-5 py-3.5 font-medium">Volume / mois</th>
                    <th className="px-5 py-3.5 font-medium">Dernier contact</th>
                    <th className="px-5 py-3.5 font-medium">Prochaine action</th>
                    <th className="px-5 py-3.5 font-medium">Source</th>
                    <th className="px-5 py-3.5 font-medium">Démo</th>
                    <th className="px-5 py-3.5 font-medium">Onb.</th>
                    <th className="px-5 py-3.5 font-medium">Actif</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setTarget(p)}
                      className="cursor-pointer border-b border-navy-900/[0.04] hover:bg-teal-50/30"
                    >
                      <td className="px-5 py-3.5 font-medium text-navy-900">
                        Dr. {p.firstName} {p.lastName}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.cabinet}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.specialty}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.vertical}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.city}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">
                        {k.salesOwners.find((o) => o.id === p.salesOwnerId)?.name ?? "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge className={prospectStatusStyles[p.status]}>
                          {prospectStatusLabels[p.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.monthlyVolume}</td>
                      <td className="px-5 py-3.5 text-charcoal/55">{formatDate(p.lastContactAt)}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.nextAction || "—"}</td>
                      <td className="px-5 py-3.5 text-charcoal/55">{p.source}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.demoDone ? "✓" : "—"}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.onboardingLaunched ? "✓" : "—"}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.isActive ? "✓" : "—"}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={14} className="px-5 py-8 text-center text-sm text-charcoal/45">
                        Aucun prospect ne correspond aux filtres.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Modal ajout */}
      <AddProspectModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={(input) => {
          k.addProspect(input);
          setAddOpen(false);
        }}
      />

      {/* Modal fiche */}
      <ProspectModal target={target} onClose={() => setTarget(null)} />
    </Shell>
  );
}

function Sel({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Field label={label}>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </Field>
  );
}

function AddProspectModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ProspectInput) => void;
}) {
  const k = useKovela();
  const [form, setForm] = useState<ProspectInput>(emptyInput());
  const [seed, setSeed] = useState("");
  if (open && seed !== "open") {
    setSeed("open");
    setForm(emptyInput());
  }
  if (!open && seed === "open") setSeed("");

  const set =
    <K extends keyof ProspectInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: (e.target as HTMLInputElement).value as ProspectInput[K] }));

  const setNum =
    (key: keyof ProspectInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: Number(e.target.value) || 0 }) as ProspectInput);

  return (
    <Modal open={open} onClose={onClose} title="Ajouter un prospect chirurgien" wide>
      <p className="mb-4 text-xs text-charcoal/55">
        Données 100 % fictives. AUCUNE donnée patient n'est collectée ici.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom">
          <input className={inputCls} value={form.firstName} onChange={set("firstName")} />
        </Field>
        <Field label="Nom">
          <input className={inputCls} value={form.lastName} onChange={set("lastName")} />
        </Field>
        <Field label="Spécialité">
          <select className={inputCls} value={form.specialty} onChange={set("specialty")}>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Verticale KOVELA">
          <select className={inputCls} value={form.vertical} onChange={set("vertical")}>
            {VERTICALS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cabinet">
          <input className={inputCls} value={form.cabinet} onChange={set("cabinet")} />
        </Field>
        <Field label="Ville">
          <input className={inputCls} value={form.city} onChange={set("city")} />
        </Field>
        <Field label="Email (fictif)">
          <input className={inputCls} value={form.email} onChange={set("email")} placeholder="prenom.nom@exemple.test" />
        </Field>
        <Field label="Téléphone (fictif)">
          <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="06 00 00 00 00" />
        </Field>
        <Field label="LinkedIn (fictif)">
          <input className={inputCls} value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/..." />
        </Field>
        <Field label="Source">
          <select className={inputCls} value={form.source} onChange={set("source")}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Typologie cabinet">
          <select className={inputCls} value={form.cabinetType} onChange={set("cabinetType")}>
            <option value="solo">Solo</option>
            <option value="groupe">Groupe</option>
            <option value="clinique">Clinique partenaire</option>
          </select>
        </Field>
        <Field label="Volume patients / mois estimé">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.monthlyVolume}
            onChange={setNum("monthlyVolume")}
          />
        </Field>
        <Field label="Niveau d'intérêt">
          <select className={inputCls} value={form.interest} onChange={set("interest")}>
            <option value="froid">Froid</option>
            <option value="tiede">Tiède</option>
            <option value="chaud">Chaud</option>
          </select>
        </Field>
        <Field label="Priorité">
          <select className={inputCls} value={form.priority} onChange={set("priority")}>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </Field>
        <Field label="Sales owner">
          <select className={inputCls} value={form.salesOwnerId} onChange={set("salesOwnerId")}>
            {k.salesOwners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} — {o.role}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button
          variant="primary"
          disabled={!form.firstName.trim() || !form.lastName.trim() || !form.cabinet.trim()}
          onClick={() => onSubmit(form)}
        >
          Ajouter au CRM
        </Button>
      </div>
    </Modal>
  );
}

function ProspectModal({ target, onClose }: { target: Prospect | null; onClose: () => void }) {
  const k = useKovela();
  const [note, setNote] = useState("");
  const [relanceDate, setRelanceDate] = useState("");
  const [relanceAction, setRelanceAction] = useState("");
  const [seed, setSeed] = useState("");

  if (target && seed !== target.id) {
    setSeed(target.id);
    setNote("");
    setRelanceDate(target.nextRelanceAt ?? "");
    setRelanceAction(target.nextAction ?? "");
  }
  if (!target && seed) setSeed("");

  if (!target) return null;
  // Source de vérité = store (mises à jour live).
  const p = k.prospects.find((x) => x.id === target.id) ?? target;

  return (
    <Modal open={true} onClose={onClose} title={`Dr. ${p.firstName} ${p.lastName} — ${p.cabinet}`} wide>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Identité */}
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/55">Identité</h3>
          <div className="space-y-1.5 text-sm">
            <Line k="Spécialité" v={p.specialty} />
            <Line k="Verticale" v={<Badge className="bg-navy-50 text-charcoal/70 ring-navy-100">{p.vertical}</Badge>} />
            <Line k="Ville" v={p.city} />
            <Line k="Email" v={p.email} />
            <Line k="Téléphone" v={p.phone} />
            <Line k="LinkedIn" v={p.linkedin} />
            <Line k="Source" v={p.source} />
          </div>
        </section>

        {/* Potentiel */}
        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/55">Potentiel</h3>
          <div className="space-y-1.5 text-sm">
            <Line k="Volume / mois estimé" v={`${p.monthlyVolume} patients`} />
            <Line k="Typologie cabinet" v={cabinetTypeLabel(p.cabinetType)} />
            <Line
              k="Intérêt"
              v={
                <select
                  className="rounded-md border border-navy-100 px-2 py-0.5 text-xs"
                  value={p.interest}
                  onChange={(e) =>
                    // intérêt édité via action générique : on log via note implicite
                    k.addProspectNote(p.id, `Intérêt mis à jour : ${e.target.value}.`)
                  }
                >
                  <option value="froid">Froid</option>
                  <option value="tiede">Tiède</option>
                  <option value="chaud">Chaud</option>
                </select>
              }
            />
            <Line k="Priorité" v={priorityLabels[p.priority]} />
            <Line
              k="Potentiel mensuel"
              v={`${k.pricing.baseMonthly + p.monthlyVolume * k.pricing.perActivatedPatient} € HT`}
            />
          </div>
        </section>

        {/* Suivi commercial */}
        <section className="md:col-span-2">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/55">Suivi commercial</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Statut pipeline">
              <select
                className={inputCls}
                value={p.status}
                onChange={(e) => k.updateProspectStatus(p.id, e.target.value as ProspectStatus)}
              >
                {PIPELINE.map((s) => (
                  <option key={s} value={s}>
                    {prospectStatusLabels[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sales owner">
              <select
                className={inputCls}
                value={p.salesOwnerId}
                onChange={(e) => k.assignProspectSalesOwner(p.id, e.target.value)}
              >
                {k.salesOwners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} — {o.role}
                  </option>
                ))}
              </select>
            </Field>
            <Line k="Dernier contact" v={formatDate(p.lastContactAt)} />
            <Field label="Prochaine action">
              <input
                className={inputCls}
                value={relanceAction}
                onChange={(e) => setRelanceAction(e.target.value)}
                placeholder="ex : envoyer la simulation devis"
              />
            </Field>
            <Field label="Date de relance">
              <input
                type="date"
                className={inputCls}
                value={relanceDate}
                onChange={(e) => setRelanceDate(e.target.value)}
              />
            </Field>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="subtle"
              disabled={!relanceDate}
              onClick={() => k.scheduleProspectRelance(p.id, relanceDate, relanceAction)}
            >
              Programmer la relance
            </Button>
            <Button variant="subtle" onClick={() => k.markProspectDemoDone(p.id)} disabled={p.demoDone}>
              Marquer « démo faite »
            </Button>
            <Button
              variant="secondary"
              onClick={() => k.launchProspectOnboarding(p.id)}
              disabled={p.onboardingLaunched || p.isActive}
            >
              Envoyer le lien de mise en place
            </Button>
            <Button
              variant="primary"
              onClick={() => k.activateProspectAsSurgeon(p.id)}
              disabled={p.isActive}
            >
              Transformer en chirurgien actif
            </Button>
            {(p.onboardingLaunched || p.isActive) && (
              <a
                href="/chirurgien/onboarding"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-navy-100 px-3 py-2 text-sm text-navy-900 hover:bg-teal-50/40"
              >
                Ouvrir mise en place cabinet ↗
              </a>
            )}
          </div>
          {p.objections && (
            <p className="mt-3 rounded-xl bg-amber-50/60 p-3 text-sm text-amber-800">
              Objections : {p.objections}
            </p>
          )}
        </section>

        {/* Activation */}
        <section className="md:col-span-2">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/55">Activation</h3>
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Pill ok={p.onboardingLaunched} label="Lien de mise en place envoyé" />
            <Pill ok={p.cabinetConfigured} label="Service activé" />
            <Pill ok={p.assistantAdded} label="Assistante ajoutée" />
            <div className="rounded-xl border border-navy-100 px-3 py-2 text-xs">
              <span className="text-charcoal/55">Mandat GoCardless · </span>
              <Badge className={mandateStyles[p.mandateStatus]}>{mandateLabels[p.mandateStatus]}</Badge>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-charcoal/45">
            État reflété depuis la mise en place cabinet (lecture). Aucune donnée patient ne transite par le CRM.
          </p>
        </section>

        {/* Notes */}
        <section className="md:col-span-2">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/55">Notes</h3>
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ajouter une note commerciale…"
            />
            <Button
              variant="subtle"
              disabled={!note.trim()}
              onClick={() => {
                k.addProspectNote(p.id, note.trim());
                setNote("");
              }}
            >
              Ajouter
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {p.notes.length === 0 && <p className="text-xs text-charcoal/45">Aucune note.</p>}
            {p.notes.map((n) => (
              <div key={n.id} className="rounded-xl bg-navy-50/50 p-3">
                <p className="text-sm text-navy-900">{n.text}</p>
                <p className="mt-0.5 text-[10px] text-charcoal/45">
                  {n.author} · {formatDate(n.at)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
}

function cabinetTypeLabel(t: CabinetType): string {
  return t === "solo" ? "Solo" : t === "groupe" ? "Groupe" : "Clinique partenaire";
}

function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-charcoal/55">{k}</span>
      <span className="text-right text-sm text-navy-900">{v}</span>
    </div>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs ring-1 ${
        ok ? "bg-teal-50 text-teal-700 ring-teal-100" : "bg-navy-50 text-charcoal/55 ring-navy-100"
      }`}
    >
      <span>{ok ? "✓" : "—"}</span>
      {label}
    </div>
  );
}
