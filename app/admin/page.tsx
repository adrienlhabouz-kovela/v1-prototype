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
  PageHeader,
  SectionTitle,
  StatCard,
} from "@/components/ui";
import { useKovela } from "@/lib/store";
import { formatDate, relativeDays, statusLabels, statusStyles } from "@/lib/format";
import type { Patient } from "@/lib/types";

type Filter = "all" | "sans_superviseur" | "escalade" | "cr_a_faire" | "silencieux" | "messages";

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
    const escalades = k.patients.filter((p) => p.status === "escalade_ouverte").length;
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
      const silencieux = assigned.filter((p) => p.status === "silencieux").length;
      const nonTraites = assigned.reduce(
        (acc, p) => acc + p.messages.filter((m) => m.author === "patient" && !m.treated).length,
        0
      );
      return { ...s, count: assigned.length, escalades, cr, silencieux, nonTraites };
    });
  }, [k.patients, k.supervisors]);

  const maxLoad = Math.max(1, ...supervisorLoad.map((s) => s.count));

  const hasUntreated = (p: Patient) =>
    p.messages.some((m) => m.author === "patient" && !m.treated);

  const filtered = useMemo(() => {
    let list = k.patients;
    if (filter === "sans_superviseur") list = list.filter((p) => p.supervisorId === null);
    if (filter === "escalade") list = list.filter((p) => p.status === "escalade_ouverte");
    if (filter === "cr_a_faire") list = list.filter((p) => p.status === "cr_en_attente");
    if (filter === "silencieux") list = list.filter((p) => p.status === "silencieux");
    if (filter === "messages") list = list.filter(hasUntreated);
    return list;
  }, [k.patients, filter]);

  function focusTable(f: Filter) {
    setFilter(f);
    document.getElementById("patients-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Admin KOVELA"
        title="Tableau de bord"
        subtitle="Pilotage opérationnel de la coordination post-opératoire. Données fictives."
      >
        <Link href="/admin/crm">
          <Button variant="primary">Voir le CRM chirurgiens</Button>
        </Link>
      </PageHeader>

      <DoctrineNote className="mb-6" />

      {/* Actions prioritaires */}
      <SectionTitle hint="Où concentrer la coordination">Actions prioritaires</SectionTitle>
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {([
          ["sans_superviseur", stats.sansSuperviseur, "Patients sans superviseur", "à attribuer"],
          ["messages", stats.messagesNonTraites, "Messages non traités", "à traiter"],
          ["cr_a_faire", stats.crAFaire, "CR à faire", "brouillons à préparer"],
          ["escalade", stats.escalades, "Escalades ouvertes", "à transmettre"],
          ["silencieux", stats.silencieux, "Patients silencieux", "à relancer"],
        ] as [Filter, number, string, string][]).map(([f, count, label, desc]) => (
          <Card key={f} className="flex flex-col p-5">
            <p className="font-display text-[2rem] leading-none text-navy-900">{count}</p>
            <p className="mt-2 text-sm font-medium text-navy-900">{label}</p>
            <p className="mt-0.5 text-xs text-charcoal/50">{desc}</p>
            <button
              onClick={() => focusTable(f)}
              className="mt-3 inline-flex w-fit items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              Voir →
            </button>
          </Card>
        ))}
      </div>

      {/* Stats principales */}
      <SectionTitle hint="Vue d'ensemble">Indicateurs</SectionTitle>
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
                  <span className="font-semibold text-navy-900">{s.count} patients actifs</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-navy-100/70">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${(s.count / maxLoad) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-charcoal/55">
                  <span>{s.nonTraites} message(s) non traité(s)</span>
                  <span>{s.silencieux} silencieux</span>
                  <span>{s.escalades} escalade(s) ouverte(s)</span>
                  <span>{s.cr} CR à faire</span>
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
              <span className="text-charcoal/55">Statut abonnement</span>
              <Badge className="bg-teal-50 text-teal-700 ring-teal-100">Actif</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal/55">Mandat GoCardless</span>
              <Badge className="bg-navy-50 text-charcoal/70 ring-navy-100">MND-FICTIF-4821</Badge>
            </div>
            <div className="my-3 border-t border-navy-900/[0.06]" />
            <div className="flex items-center justify-between">
              <span className="text-charcoal/55">Forfait de base</span>
              <span className="font-medium text-navy-900">{k.pricing.baseMonthly} € HT</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal/55">
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
            <p className="text-[11px] leading-tight text-charcoal/45">
              Patient activé = onboarding validé + suivi lancé.
            </p>
          </div>
        </Card>
      </div>

      {/* Chirurgiens & verticales */}
      <div className="mt-8">
        <SectionTitle hint="KOVELA démarre en esthétique / plastique, extensible à d'autres segments">
          Chirurgiens & verticales
        </SectionTitle>
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(
              k.surgeons.reduce<Record<string, number>>((acc, s) => {
                const v = s.config.vertical || "Autre";
                acc[v] = (acc[v] ?? 0) + 1;
                return acc;
              }, {})
            ).map(([vertical, count]) => (
              <span
                key={vertical}
                className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-xs text-charcoal/70"
              >
                {vertical}
                <span className="font-semibold text-navy-900">{count}</span>
              </span>
            ))}
          </div>
          <div className="divide-y divide-navy-900/[0.05]">
            {k.surgeons.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy-900">{s.name}</p>
                  <p className="truncate text-xs text-charcoal/45">{s.config.specialization}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge className="bg-teal-50/60 text-navy-700 ring-teal-100">{s.config.vertical}</Badge>
                  {!s.config.configured && (
                    <Badge className="bg-amber-50/70 text-amber-700 ring-amber-100">À configurer</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Table patients */}
      <div className="mt-8 scroll-mt-6" id="patients-table">
        <SectionTitle hint={`${filtered.length} patient(s)`}>Patients</SectionTitle>
        <div className="mb-3 flex flex-wrap gap-2">
          {([
            ["all", "Tous"],
            ["sans_superviseur", "Sans superviseur"],
            ["messages", "Messages non traités"],
            ["cr_a_faire", "CR à faire"],
            ["escalade", "Escalades ouvertes"],
            ["silencieux", "Patients silencieux"],
          ] as [Filter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-navy-900 text-white"
                  : "bg-white text-charcoal/65 ring-1 ring-navy-100 hover:bg-teal-50/50 hover:text-navy-900"
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
                <tr className="border-b border-navy-900/[0.06] text-left text-[11px] uppercase tracking-[0.08em] text-charcoal/45">
                  <th className="px-5 py-3.5 font-medium">Patient</th>
                  <th className="px-5 py-3.5 font-medium">Chirurgien</th>
                  <th className="px-5 py-3.5 font-medium">Intervention</th>
                  <th className="px-5 py-3.5 font-medium">Statut</th>
                  <th className="px-5 py-3.5 font-medium">Superviseur</th>
                  <th className="px-5 py-3.5 font-medium">Dernier msg</th>
                  <th className="px-5 py-3.5 font-medium">CR</th>
                  <th className="px-5 py-3.5 font-medium">Esc.</th>
                  <th className="px-5 py-3.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const report = k.reportFor(p.id);
                  const esc = k.escalationFor(p.id);
                  return (
                    <tr key={p.id} className="border-b border-navy-900/[0.04] hover:bg-teal-50/30">
                      <td className="px-5 py-3.5">
                        <Link href={`/superviseur/patient/${p.id}`} className="font-medium text-navy-900 hover:text-teal-600">
                          {p.name}
                        </Link>
                        <div className="text-xs text-charcoal/45">{formatDate(p.interventionDate)}</div>
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">{k.surgeonName(p.surgeonId)}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{p.intervention}</td>
                      <td className="px-5 py-3.5">
                        <Badge className={statusStyles[p.status]}>{statusLabels[p.status]}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        {p.supervisorId ? (
                          <span className="text-charcoal/70">{k.supervisorName(p.supervisorId)}</span>
                        ) : (
                          <span className="text-amber-600">Non assigné</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/55">{relativeDays(p.lastMessageAt)}</td>
                      <td className="px-5 py-3.5">
                        {report ? (
                          <span className="text-xs text-charcoal/70">
                            {report.status === "brouillon"
                              ? "Brouillon"
                              : report.status === "valide"
                              ? "Validé interne"
                              : "Disponible"}
                          </span>
                        ) : (
                          <span className="text-xs text-charcoal/30">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {p.status === "escalade_ouverte" ? (
                          <span className="text-xs text-navy-700" title={esc?.status === "transmise" ? "Transmise" : "En préparation"}>
                            {esc?.status === "transmise" ? "Transmise" : "Préparée"}
                          </span>
                        ) : (
                          <span className="text-charcoal/30">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
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
        <p className="mb-4 text-sm text-charcoal/55">
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
                className={`flex w-full items-center justify-between rounded-xl border px-5 py-3.5 text-left transition-colors ${
                  isCurrent ? "border-teal-200 bg-teal-50/60" : "border-navy-100 hover:bg-teal-50/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[11px] font-semibold text-white">
                    {s.initials}
                  </span>
                  <span className="text-sm font-medium text-navy-900">{s.name}</span>
                </span>
                <span className="text-xs text-charcoal/45">{load} patients{isCurrent ? " · actuel" : ""}</span>
              </button>
            );
          })}
          {assignPatient?.supervisorId && (
            <button
              onClick={() => {
                if (assignPatient) k.assignSupervisor(assignPatient.id, null);
                setAssignPatient(null);
              }}
              className="w-full rounded-xl border border-navy-100 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
            >
              Retirer l'attribution
            </button>
          )}
        </div>
      </Modal>
    </Shell>
  );
}
