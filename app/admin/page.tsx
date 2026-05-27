"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  DoctrineNote,
  Modal,
  SectionTitle,
  StatCard,
} from "@/components/ui";
import { useKovela } from "@/lib/store";
import { formatDate, relativeDays, statusLabels, statusStyles } from "@/lib/format";
import type { Patient } from "@/lib/types";

type Filter = "all" | "sans_superviseur" | "escalade" | "cr_a_faire";

export default function AdminPage() {
  const k = useKovela();
  const [filter, setFilter] = useState<Filter>("all");
  const [assignPatient, setAssignPatient] = useState<Patient | null>(null);

  const stats = useMemo(() => {
    const activePatients = k.patients.filter((p) => p.status !== "cloture").length;
    const sansSuperviseur = k.patients.filter((p) => p.supervisorId === null).length;
    const messagesNonTraites = k.patients.reduce(
      (acc, p) => acc + p.messages.filter((m) => m.author === "patient" && !m.treated).length,
      0
    );
    const silencieux = k.patients.filter((p) => p.status === "silencieux").length;
    const escalades = k.escalations.filter((e) => e.status === "ouverte").length;
    const crAFaire = k.patients.filter((p) => p.status === "cr_en_attente").length;
    const activesMois = k.patients.filter((p) => p.activatedThisMonth).length;
    const montant = k.pricing.baseMonthly + activesMois * k.pricing.perActivatedPatient;
    return {
      chirurgiens: k.surgeons.length,
      activePatients,
      sansSuperviseur,
      messagesNonTraites,
      silencieux,
      escalades,
      crAFaire,
      activesMois,
      montant,
    };
  }, [k.patients, k.escalations, k.surgeons.length, k.pricing]);

  const supervisorLoad = useMemo(() => {
    return k.supervisors.map((s) => {
      const assigned = k.patients.filter((p) => p.supervisorId === s.id && p.status !== "cloture");
      const escalades = assigned.filter((p) => p.status === "escalade_ouverte").length;
      const cr = assigned.filter((p) => p.status === "cr_en_attente").length;
      return { ...s, count: assigned.length, escalades, cr };
    });
  }, [k.patients, k.supervisors]);

  const maxLoad = Math.max(1, ...supervisorLoad.map((s) => s.count));

  const filtered = useMemo(() => {
    let list = k.patients;
    if (filter === "sans_superviseur") list = list.filter((p) => p.supervisorId === null);
    if (filter === "escalade") list = list.filter((p) => p.status === "escalade_ouverte");
    if (filter === "cr_a_faire") list = list.filter((p) => p.status === "cr_en_attente");
    return list;
  }, [k.patients, filter]);

  return (
    <Shell>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900">Tableau de bord — Admin KOVELA</h1>
        <p className="text-sm text-slate-500">
          Pilotage opérationnel de la coordination post-opératoire. Données fictives.
        </p>
      </div>

      <DoctrineNote className="mb-6" />

      {/* Stats principales */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Chirurgiens actifs" value={stats.chirurgiens} />
        <StatCard label="Patients actifs" value={stats.activePatients} />
        <StatCard label="Patients sans superviseur" value={stats.sansSuperviseur} hint="à attribuer" />
        <StatCard label="Messages non traités" value={stats.messagesNonTraites} />
        <StatCard label="Patients silencieux" value={stats.silencieux} />
        <StatCard label="Escalades ouvertes" value={stats.escalades} />
        <StatCard label="CR à faire" value={stats.crAFaire} />
        <StatCard label="Patients activés (mois)" value={stats.activesMois} accent />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Charge superviseur */}
        <Card className="lg:col-span-2">
          <CardHeader title="Charge par superviseur" subtitle="Patients en suivi actif assignés" />
          <div className="space-y-4 p-5">
            {supervisorLoad.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[11px] font-semibold text-white">
                      {s.initials}
                    </span>
                    <span className="font-medium text-navy-900">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {s.escalades > 0 && <span className="text-indigo-600">{s.escalades} escalade(s)</span>}
                    {s.cr > 0 && <span className="text-sky-600">{s.cr} CR</span>}
                    <span className="font-semibold text-navy-900">{s.count} patients</span>
                  </div>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${(s.count / maxLoad) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Facturation simulée */}
        <Card>
          <CardHeader title="Abonnement & facturation" subtitle="Simulation — aucun paiement réel" />
          <div className="space-y-3 p-5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Statut abonnement</span>
              <Badge className="bg-teal-50 text-teal-700 ring-teal-200">Actif</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mandat GoCardless</span>
              <Badge className="bg-slate-100 text-slate-600 ring-slate-200">MND-FICTIF-4821</Badge>
            </div>
            <div className="my-3 border-t border-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Forfait de base</span>
              <span className="font-medium text-navy-900">{k.pricing.baseMonthly} € HT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">
                Patients activés ({stats.activesMois} × {k.pricing.perActivatedPatient} €)
              </span>
              <span className="font-medium text-navy-900">
                {stats.activesMois * k.pricing.perActivatedPatient} € HT
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-navy-50 px-3 py-2">
              <span className="font-semibold text-navy-900">Montant estimé du mois</span>
              <span className="text-lg font-semibold text-teal-600">{stats.montant} € HT</span>
            </div>
            <p className="text-[11px] leading-tight text-slate-400">
              Patient activé = onboarding validé + suivi lancé.
            </p>
          </div>
        </Card>
      </div>

      {/* Table patients */}
      <div className="mt-8">
        <SectionTitle hint={`${filtered.length} patient(s)`}>Patients</SectionTitle>
        <div className="mb-3 flex flex-wrap gap-2">
          {([
            ["all", "Tous"],
            ["sans_superviseur", "Sans superviseur"],
            ["escalade", "Escalades ouvertes"],
            ["cr_a_faire", "CR à faire"],
          ] as [Filter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f ? "bg-navy-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Chirurgien</th>
                  <th className="px-4 py-3 font-medium">Intervention</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Superviseur</th>
                  <th className="px-4 py-3 font-medium">Dernier msg</th>
                  <th className="px-4 py-3 font-medium">CR</th>
                  <th className="px-4 py-3 font-medium">Esc.</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const report = k.reportFor(p.id);
                  const esc = k.escalationFor(p.id);
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <Link href={`/superviseur/patient/${p.id}`} className="font-medium text-navy-900 hover:text-teal-600">
                          {p.name}
                        </Link>
                        <div className="text-xs text-slate-400">{formatDate(p.interventionDate)}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{k.surgeonName(p.surgeonId)}</td>
                      <td className="px-4 py-3 text-slate-600">{p.intervention}</td>
                      <td className="px-4 py-3">
                        <Badge className={statusStyles[p.status]}>{statusLabels[p.status]}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        {p.supervisorId ? (
                          <span className="text-slate-600">{k.supervisorName(p.supervisorId)}</span>
                        ) : (
                          <span className="text-amber-600">Non assigné</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{relativeDays(p.lastMessageAt)}</td>
                      <td className="px-4 py-3">
                        {report ? (
                          <span className="text-xs text-teal-600">{report.status}</span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {esc ? <span className="text-xs text-indigo-600">●</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="subtle" onClick={() => setAssignPatient(p)}>
                          {p.supervisorId ? "Réattribuer" : "Attribuer"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal attribution */}
      <Modal
        open={assignPatient !== null}
        onClose={() => setAssignPatient(null)}
        title={`Attribuer un superviseur — ${assignPatient?.name ?? ""}`}
      >
        <p className="mb-4 text-sm text-slate-500">
          Sélectionnez le superviseur en charge de la coordination de ce patient.
        </p>
        <div className="space-y-2">
          {k.supervisors.map((s) => {
            const isCurrent = assignPatient?.supervisorId === s.id;
            const load = k.patients.filter((p) => p.supervisorId === s.id && p.status !== "cloture").length;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (assignPatient) k.assignSupervisor(assignPatient.id, s.id);
                  setAssignPatient(null);
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                  isCurrent ? "border-teal-300 bg-teal-50" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[11px] font-semibold text-white">
                    {s.initials}
                  </span>
                  <span className="text-sm font-medium text-navy-900">{s.name}</span>
                </span>
                <span className="text-xs text-slate-400">{load} patients{isCurrent ? " · actuel" : ""}</span>
              </button>
            );
          })}
          {assignPatient?.supervisorId && (
            <button
              onClick={() => {
                if (assignPatient) k.assignSupervisor(assignPatient.id, null);
                setAssignPatient(null);
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
            >
              Retirer l'attribution
            </button>
          )}
        </div>
      </Modal>
    </Shell>
  );
}
