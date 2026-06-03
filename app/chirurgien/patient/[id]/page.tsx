"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader } from "@/components/ui";
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

  const surgeon = k.surgeon(patient.surgeonId);
  const isClotured = patient.status === "cloture";

  // Journal d'action — événements opérationnels horodatés (réels + statuts
  // simulés de lecture cabinet pour démontrer le parcours en prototype).
  // Aucune vraie notification n'est envoyée. Statuts de lecture marqués
  // « simulation prototype » pour ne pas tromper le lecteur.
  type JournalEvent = {
    label: string;
    at: string;
    kind: "real" | "mock";
    sub?: string;
  };
  const journal: JournalEvent[] = [];

  if (visibleEscalation?.transmittedAt) {
    journal.push({
      label: "Transmission cabinet préparée par KOVELA",
      at: visibleEscalation.openedAt,
      kind: "real",
    });
    journal.push({
      label: "Transmission cabinet envoyée",
      at: visibleEscalation.transmittedAt,
      kind: "real",
    });
    // Mock statut lecture cabinet : si la transmission est > 1 h, on simule
    // une lecture cabinet confirmée 13 min après l'envoi.
    const tSent = new Date(visibleEscalation.transmittedAt).getTime();
    const NOW = Date.now();
    if (NOW - tSent > 60 * 60 * 1000) {
      const tRead = new Date(tSent + 13 * 60 * 1000).toISOString();
      journal.push({
        label: "Transmission ouverte par le cabinet",
        at: tRead,
        kind: "mock",
        sub: "Statut simulé · affichage opérationnel en V1",
      });
    } else {
      journal.push({
        label: "En attente de lecture cabinet",
        at: visibleEscalation.transmittedAt,
        kind: "mock",
        sub: "Statut simulé · affichage opérationnel en V1",
      });
    }
  }

  if (visibleReport) {
    journal.push({
      label: "CR factuel rendu disponible chirurgien",
      at: visibleReport.updatedAt,
      kind: "real",
    });
  }

  if (isClotured && visibleReport) {
    journal.push({
      label: "Suivi KOVELA clôturé · dossier archivé",
      at: visibleReport.updatedAt,
      kind: "real",
    });
  }

  // Tri chronologique ascendant.
  journal.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());

  return (
    <Shell>
      <Link href="/chirurgien" className="mb-4 inline-block text-sm text-teal-600 hover:text-teal-700">
        ← Mes patients
      </Link>

      <div className="mb-2 flex items-center gap-3">
        <h1 className="font-display text-3xl tracking-tight text-navy-900">{patient.name}</h1>
        <Badge className={statusStyles[patient.status]}>{statusLabels[patient.status]}</Badge>
      </div>
      <p className="mb-6 text-sm text-charcoal/55">
        {patient.intervention} · Intervention le {formatDate(patient.interventionDate)} · Protocole{" "}
        {patient.protocol} · Coordination : {k.supervisorName(patient.supervisorId)}
      </p>

      {/* Référentiel actif — montre que KOVELA applique le cadre du chirurgien. */}
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-white px-5 py-3.5 shadow-card ring-1 ring-navy-900/[0.045]">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
          Référentiel actif
        </span>
        <span className="text-[13px] tracking-tight text-navy-900">
          <span className="font-medium">{patient.intervention}</span>
          <span className="text-charcoal/55"> · {surgeon?.name ?? "—"}</span>
        </span>
        <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">version validée KOVELA</Badge>
      </div>

      {/* Banner clôture — affiché uniquement si suivi clôturé. */}
      {isClotured && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.06]">
          <div className="border-l-[3px] border-navy-900/60 px-6 py-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
              Suivi clôturé
            </p>
            <p className="mt-1.5 text-[14px] font-medium tracking-tight text-navy-900">
              Suivi KOVELA clôturé · dossier archivé.
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-charcoal/65">
              Patient renvoyé vers son suivi habituel cabinet. Le CR factuel final reste consultable
              ci-dessous.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compilation factuelle transmise */}
        <Card>
          <CardHeader
            title="Transmission cabinet"
            subtitle={visibleEscalation ? "Compilation factuelle transmise" : "Aucune transmission en cours"}
          />
          <div className="p-5">
            {visibleEscalation?.compilation ? (
              <pre className="whitespace-pre-wrap rounded-xl bg-navy-50/50 p-4 font-sans text-sm leading-relaxed text-navy-900">
                {visibleEscalation.compilation}
              </pre>
            ) : (
              <p className="text-sm text-charcoal/45">
                Aucune transmission cabinet en cours pour ce patient.
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
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">
                    CR disponible chirurgien
                  </Badge>
                  <Button
                    variant="subtle"
                    disabled
                    title="Export PDF prévu en V1"
                  >
                    Exporter le CR factuel (PDF prévu en V1)
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap rounded-xl bg-navy-50/50 p-4 font-sans text-sm leading-relaxed text-navy-900">
                  {visibleReport.content}
                </pre>
              </>
            ) : (
              <p className="text-sm text-charcoal/45">
                Aucun CR disponible. Les brouillons et les CR validés en interne restent côté
                coordination jusqu&apos;à mise à disposition explicite.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Journal d'action — horodatage des étapes opérationnelles. */}
      {journal.length > 0 && (
        <Card className="mt-6">
          <CardHeader
            title="Journal d'action"
            subtitle="Horodatage des étapes opérationnelles · transmissions et CR"
          />
          <div className="p-5">
            <ol className="space-y-3">
              {journal.map((e, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px]">
                  <span
                    className={`mt-1 flex h-2 w-2 shrink-0 rounded-full ${
                      e.kind === "real" ? "bg-teal-500" : "bg-charcoal/30"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="tracking-tight text-navy-900">
                      <span className="font-medium">{e.label}</span>
                      <span className="ml-2 text-[11.5px] text-charcoal/55">
                        · {formatDateTime(e.at)}
                      </span>
                    </p>
                    {e.sub && (
                      <p className="mt-0.5 text-[10.5px] leading-relaxed text-charcoal/45">{e.sub}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-[10.5px] leading-relaxed text-charcoal/45">
              Prototype · les statuts marqués « simulé » seront remplacés par un audit trail réel
              en V1 (accusé de lecture cabinet, journal d&apos;accès, horodatage signé).
            </p>
          </div>
        </Card>
      )}

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
