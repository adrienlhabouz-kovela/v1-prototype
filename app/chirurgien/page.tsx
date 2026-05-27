"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, StatCard } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { formatDate, relativeDays, statusLabels, statusStyles } from "@/lib/format";

const MY_SURGEON_ID = "s1"; // Dr. Camille Aragon (chirurgien de démo)

export default function ChirurgienDashboard() {
  const k = useKovela();

  const myPatients = useMemo(
    () => k.patients.filter((p) => p.surgeonId === MY_SURGEON_ID),
    [k.patients]
  );

  const stats = useMemo(() => {
    const actifs = myPatients.filter((p) => p.status !== "cloture").length;
    const crDispo = myPatients.filter((p) => {
      const r = k.reportFor(p.id);
      return r && (r.status === "disponible" || r.status === "valide");
    }).length;
    const escalades = myPatients.filter((p) => {
      const e = k.escalationFor(p.id);
      return e && e.status === "transmise";
    }).length;
    const activesMois = myPatients.filter((p) => p.activatedThisMonth).length;
    return { actifs, crDispo, escalades, activesMois };
  }, [myPatients, k]);

  const montant = k.pricing.baseMonthly + stats.activesMois * k.pricing.perActivatedPatient;

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900">Mes patients</h1>
        <p className="text-sm text-slate-500">
          {k.surgeonName(MY_SURGEON_ID)} — information claire et exploitable. Vous gardez la main.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Patients suivis" value={myPatients.length} />
        <StatCard label="Patients actifs" value={stats.actifs} />
        <StatCard label="CR disponibles" value={stats.crDispo} accent />
        <StatCard label="Escalades reçues" value={stats.escalades} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Patients suivis" subtitle="Statut, CR et escalades transmises" />
          <div className="divide-y divide-slate-50">
            {myPatients.map((p) => {
              const report = k.reportFor(p.id);
              const esc = k.escalationFor(p.id);
              const escTransmise = esc?.status === "transmise";
              return (
                <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-900">{p.name}</p>
                    <p className="truncate text-xs text-slate-400">
                      {p.intervention} · {formatDate(p.interventionDate)} · {relativeDays(p.lastMessageAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {escTransmise && (
                      <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-200">Escalade reçue</Badge>
                    )}
                    {report && (report.status === "disponible" || report.status === "valide") && (
                      <Badge className="bg-teal-50 text-teal-700 ring-teal-200">CR dispo</Badge>
                    )}
                    <Badge className={statusStyles[p.status]}>{statusLabels[p.status]}</Badge>
                    <Link href={`/chirurgien/patient/${p.id}`}>
                      <Button variant="subtle">Voir dossier</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="Abonnement" subtitle="Simulation — aucun paiement réel" />
          <div className="space-y-3 p-5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Statut</span>
              <Badge className="bg-teal-50 text-teal-700 ring-teal-200">Actif</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mandat GoCardless</span>
              <Badge className="bg-slate-100 text-slate-600 ring-slate-200">MND-FICTIF-7733</Badge>
            </div>
            <div className="my-2 border-t border-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Patients activés (mois)</span>
              <span className="font-medium text-navy-900">{stats.activesMois}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-navy-50 px-3 py-2">
              <span className="font-semibold text-navy-900">Montant estimé</span>
              <span className="text-lg font-semibold text-teal-600">{montant} € HT</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {k.pricing.baseMonthly} € HT / mois + {k.pricing.perActivatedPatient} € HT / patient activé.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
