"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Badge, Card, CardHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { formatDate, formatDateTime, statusLabels, statusStyles } from "@/lib/format";

export default function ChirurgienPatient() {
  const k = useKovela();
  const params = useParams<{ id: string }>();
  const patient = k.patients.find((p) => p.id === params.id);

  if (!patient) {
    return (
      <Shell>
        <p className="text-sm text-charcoal/55">Patient introuvable.</p>
        <Link href="/chirurgien" className="text-sm text-teal-600">← Retour</Link>
      </Shell>
    );
  }

  const report = k.reportFor(patient.id);
  const escalation = k.escalationFor(patient.id);
  // Côté chirurgien : uniquement les CR explicitement rendus disponibles.
  const visibleReport = report && report.status === "disponible" ? report : null;
  const visibleEscalation = escalation?.status === "transmise" ? escalation : null;

  return (
    <Shell>
      <Link href="/chirurgien" className="mb-4 inline-block text-sm text-teal-600 hover:text-teal-700">
        ← Mes patients
      </Link>

      <div className="mb-6 flex items-center gap-3">
        <h1 className="font-display text-3xl tracking-tight text-navy-900">{patient.name}</h1>
        <Badge className={statusStyles[patient.status]}>{statusLabels[patient.status]}</Badge>
      </div>
      <p className="-mt-4 mb-6 text-sm text-charcoal/55">
        {patient.intervention} · Intervention le {formatDate(patient.interventionDate)} · Protocole{" "}
        {patient.protocol} · Coordination : {k.supervisorName(patient.supervisorId)}
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compilation d'escalade transmise */}
        <Card>
          <CardHeader
            title="Compilation factuelle d'escalade"
            subtitle={visibleEscalation ? "Transmise par la coordination" : "Aucune escalade transmise"}
          />
          <div className="p-5">
            {visibleEscalation?.compilation ? (
              <pre className="whitespace-pre-wrap rounded-xl bg-navy-50/50 p-4 font-sans text-sm leading-relaxed text-navy-900">
                {visibleEscalation.compilation}
              </pre>
            ) : (
              <p className="text-sm text-charcoal/45">
                Aucune compilation factuelle transmise pour ce patient.
              </p>
            )}
          </div>
        </Card>

        {/* CR */}
        <Card>
          <CardHeader
            title="Compte-rendu factuel du suivi"
            subtitle={visibleReport ? `Mis à jour le ${formatDate(visibleReport.updatedAt)}` : "Aucun CR disponible"}
          />
          <div className="p-5">
            {visibleReport ? (
              <>
                <Badge className="mb-3 bg-teal-50/60 text-teal-700 ring-teal-100/70">
                  CR disponible pour le chirurgien
                </Badge>
                <pre className="whitespace-pre-wrap rounded-xl bg-navy-50/50 p-4 font-sans text-sm leading-relaxed text-navy-900">
                  {visibleReport.content}
                </pre>
              </>
            ) : (
              <p className="text-sm text-charcoal/45">
                Aucun CR disponible. Les brouillons et les CR validés en interne restent côté
                coordination jusqu'à mise à disposition explicite.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Dossier résumé : derniers échanges (lecture seule) */}
      <Card className="mt-6">
        <CardHeader title="Dossier résumé" subtitle="Synthèse opérationnelle des derniers échanges" />
        <div className="space-y-3 p-5">
          {patient.messages.slice(-5).map((m) => (
            <div key={m.id} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 w-24 shrink-0 text-xs capitalize text-charcoal/45">
                {m.author} · {formatDateTime(m.at)}
              </span>
              <span className="text-navy-900">{m.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
