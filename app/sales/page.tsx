"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, Modal, PageHeader, StatCard } from "@/components/ui";
import { useKovela } from "@/lib/store";
import {
  formatDate,
  interestLabels,
  interestStyles,
  isRelanceDueWithin,
  mandateLabels,
  mandateStyles,
  prospectStatusLabels,
  prospectStatusStyles,
} from "@/lib/format";
import type { Prospect, ProspectStatus } from "@/lib/types";

const PIPELINE_STATUSES: ProspectStatus[] = [
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

const closingStatuses: ProspectStatus[] = ["accord_verbal", "onboarding_cabinet", "actif"];

const inputCls =
  "w-full rounded-xl border border-navy-100 px-3 py-2 text-sm outline-none focus:border-teal-400";

export default function SalesPage() {
  const k = useKovela();
  const [salesId, setSalesId] = useState<string>(() => k.salesOwners[0]?.id ?? "");
  const [target, setTarget] = useState<Prospect | null>(null);
  const [filterStatus, setFilterStatus] = useState<ProspectStatus | "all">("all");
  const [filterRelance, setFilterRelance] = useState<"all" | "yes">("all");

  const mine = useMemo(
    () => k.prospects.filter((p) => p.salesOwnerId === salesId),
    [k.prospects, salesId]
  );

  const stats = useMemo(() => {
    const relancesDues = mine.filter((p) => isRelanceDueWithin(p.nextRelanceAt, 1)).length;
    const demosPrevues = mine.filter((p) => p.status === "call_prevu").length;
    const prospectsChauds = mine.filter((p) => p.interest === "chaud").length;
    const accordsVerbaux = mine.filter((p) => p.status === "accord_verbal").length;
    const onboardings = mine.filter((p) => p.onboardingLaunched).length;
    const actifs = mine.filter((p) => p.isActive).length;
    const closingOrActive = mine.filter((p) => closingStatuses.includes(p.status));
    const monthlyVolume = closingOrActive.reduce((acc, p) => acc + (p.monthlyVolume || 0), 0);
    const caPotentiel = closingOrActive.length * k.pricing.baseMonthly + monthlyVolume * k.pricing.perActivatedPatient;
    return { relancesDues, demosPrevues, prospectsChauds, accordsVerbaux, onboardings, actifs, monthlyVolume, caPotentiel };
  }, [mine, k.pricing]);

  const filtered = useMemo(() => {
    return mine.filter((p) => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (filterRelance === "yes" && !isRelanceDueWithin(p.nextRelanceAt, 7)) return false;
      return true;
    });
  }, [mine, filterStatus, filterRelance]);

  const me = k.salesOwners.find((o) => o.id === salesId);

  return (
    <Shell>
      <PageHeader
        eyebrow="Vue sales"
        title="Mon portefeuille chirurgiens"
        subtitle="Pilotage commercial personnel — vue de démonstration, aucune permission réelle."
      >
        <label className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2 text-xs text-navy-100/80 ring-1 ring-white/10">
          Vu en tant que :
          <select
            value={salesId}
            onChange={(e) => setSalesId(e.target.value)}
            className="rounded-md bg-transparent text-white outline-none"
          >
            {k.salesOwners.map((o) => (
              <option key={o.id} value={o.id} className="text-navy-900">
                {o.name}
              </option>
            ))}
          </select>
        </label>
      </PageHeader>

      {me && (
        <p className="mb-6 text-xs text-charcoal/55">
          {me.role} · {me.email}
        </p>
      )}

      {/* Stats personnelles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
        <StatCard label="Relances dues" value={stats.relancesDues} accent hint="échéance ≤ 1 j" />
        <StatCard label="Démos prévues" value={stats.demosPrevues} />
        <StatCard label="Prospects chauds" value={stats.prospectsChauds} />
        <StatCard label="Accords verbaux" value={stats.accordsVerbaux} />
        <StatCard label="Onboardings en cours" value={stats.onboardings} />
        <StatCard label="Chirurgiens actifs" value={stats.actifs} />
        <StatCard label="Volume patients / mois" value={stats.monthlyVolume} hint="closing + actifs" />
        <StatCard label="CA mensuel potentiel" value={`${stats.caPotentiel} €`} hint="estimation commerciale" />
      </div>
      <p className="mt-2 text-[11px] text-charcoal/45">Estimation commerciale — données fictives.</p>

      {/* Filtres */}
      <Card className="mt-6 mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
              Statut pipeline
            </span>
            <select
              className={inputCls}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ProspectStatus | "all")}
            >
              <option value="all">Tous</option>
              {PIPELINE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {prospectStatusLabels[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
              Relance due (7 j)
            </span>
            <select
              className={inputCls}
              value={filterRelance}
              onChange={(e) => setFilterRelance(e.target.value as "all" | "yes")}
            >
              <option value="all">Toutes</option>
              <option value="yes">Oui</option>
            </select>
          </label>
        </div>
      </Card>

      {/* Table portefeuille */}
      <Card className="overflow-hidden">
        <CardHeader title={`${filtered.length} prospect${filtered.length > 1 ? "s" : ""}`} subtitle="Mon portefeuille — actions rapides en cliquant sur une ligne" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-900/[0.06] text-left text-[11px] uppercase tracking-[0.08em] text-charcoal/45">
                <th className="px-5 py-3 font-medium">Chirurgien</th>
                <th className="px-5 py-3 font-medium">Cabinet</th>
                <th className="px-5 py-3 font-medium">Ville</th>
                <th className="px-5 py-3 font-medium">Spécialité</th>
                <th className="px-5 py-3 font-medium">Verticale</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Intérêt</th>
                <th className="px-5 py-3 font-medium">Prochaine action</th>
                <th className="px-5 py-3 font-medium">Date relance</th>
                <th className="px-5 py-3 font-medium">Vol / mois</th>
                <th className="px-5 py-3 font-medium">Potentiel mensuel</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const potentiel = k.pricing.baseMonthly + p.monthlyVolume * k.pricing.perActivatedPatient;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setTarget(p)}
                    className="cursor-pointer border-b border-navy-900/[0.04] hover:bg-teal-50/30"
                  >
                    <td className="px-5 py-3 font-medium text-navy-900">
                      Dr. {p.firstName} {p.lastName}
                    </td>
                    <td className="px-5 py-3 text-charcoal/70">{p.cabinet}</td>
                    <td className="px-5 py-3 text-charcoal/70">{p.city}</td>
                    <td className="px-5 py-3 text-charcoal/70">{p.specialty}</td>
                    <td className="px-5 py-3 text-charcoal/70">{p.vertical}</td>
                    <td className="px-5 py-3">
                      <Badge className={prospectStatusStyles[p.status]}>{prospectStatusLabels[p.status]}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge className={interestStyles[p.interest]}>{interestLabels[p.interest]}</Badge>
                    </td>
                    <td className="px-5 py-3 text-charcoal/70">{p.nextAction || "—"}</td>
                    <td className="px-5 py-3 text-charcoal/70">
                      {p.nextRelanceAt ?? "—"}
                      {isRelanceDueWithin(p.nextRelanceAt, 7) && (
                        <span className="ml-2 rounded-md bg-amber-50/70 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-amber-100">
                          due
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-charcoal/70">{p.monthlyVolume}</td>
                    <td className="px-5 py-3 text-teal-700">{potentiel} €</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-5 py-8 text-center text-sm text-charcoal/45">
                    Aucun prospect dans votre portefeuille pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal actions rapides */}
      <SalesActionsModal target={target} onClose={() => setTarget(null)} />
    </Shell>
  );
}

function SalesActionsModal({ target, onClose }: { target: Prospect | null; onClose: () => void }) {
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
  const p = k.prospects.find((x) => x.id === target.id) ?? target;
  const potentiel = k.pricing.baseMonthly + p.monthlyVolume * k.pricing.perActivatedPatient;

  return (
    <Modal open={true} onClose={onClose} title={`Dr. ${p.firstName} ${p.lastName} — ${p.cabinet}`} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1 text-sm">
          <Row k="Spécialité" v={p.specialty} />
          <Row k="Verticale" v={p.vertical} />
          <Row k="Ville" v={p.city} />
          <Row k="Téléphone" v={p.phone} />
          <Row k="Email" v={p.email} />
          <Row k="Source" v={p.source} />
        </div>
        <div className="space-y-1 text-sm">
          <Row k="Volume / mois estimé" v={`${p.monthlyVolume} patients`} />
          <Row k="Intérêt" v={<Badge className={interestStyles[p.interest]}>{interestLabels[p.interest]}</Badge>} />
          <Row k="Statut" v={<Badge className={prospectStatusStyles[p.status]}>{prospectStatusLabels[p.status]}</Badge>} />
          <Row k="Mandat GoCardless" v={<Badge className={mandateStyles[p.mandateStatus]}>{mandateLabels[p.mandateStatus]}</Badge>} />
          <Row k="Dernier contact" v={formatDate(p.lastContactAt)} />
          <Row k="Potentiel mensuel" v={`${potentiel} €`} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
            Statut pipeline
          </span>
          <select
            className={inputCls}
            value={p.status}
            onChange={(e) => k.updateProspectStatus(p.id, e.target.value as ProspectStatus)}
          >
            {PIPELINE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {prospectStatusLabels[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
            Date de relance
          </span>
          <input
            type="date"
            className={inputCls}
            value={relanceDate}
            onChange={(e) => setRelanceDate(e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
            Prochaine action
          </span>
          <input
            className={inputCls}
            value={relanceAction}
            onChange={(e) => setRelanceAction(e.target.value)}
            placeholder="ex : envoyer la simulation devis"
          />
        </label>
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
        <Button variant="primary" onClick={() => k.activateProspectAsSurgeon(p.id)} disabled={p.isActive}>
          Transformer en chirurgien actif
        </Button>
        {(p.onboardingLaunched || p.isActive) && (
          <Link
            href="/chirurgien/onboarding"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-navy-100 px-3 py-2 text-sm text-navy-900 hover:bg-teal-50/40"
          >
            Ouvrir mise en place cabinet ↗
          </Link>
        )}
      </div>

      <div className="mt-5">
        <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-charcoal/50">
          Ajouter une note commerciale
        </span>
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note commerciale…"
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
        {p.notes.length > 0 && (
          <div className="mt-3 space-y-2">
            {p.notes.slice(0, 3).map((n) => (
              <div key={n.id} className="rounded-xl bg-navy-50/50 p-3">
                <p className="text-sm text-navy-900">{n.text}</p>
                <p className="mt-0.5 text-[10px] text-charcoal/45">
                  {n.author} · {formatDate(n.at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <Button variant="ghost" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </Modal>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-charcoal/55">{k}</span>
      <span className="text-right text-sm text-navy-900">{v}</span>
    </div>
  );
}
