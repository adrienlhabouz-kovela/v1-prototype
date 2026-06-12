"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, PageHeader, StatCard } from "@/components/ui";
import { useKovela } from "@/lib/store";
import {
  followTypeLabels,
  formatDate,
  mandateLabels,
  mandateStyles,
  relativeDays,
  statusLabels,
  statusStyles,
} from "@/lib/format";

const MY_SURGEON_ID = "s1"; // Dr. Camille Aragon (chirurgien de démo)

export default function ChirurgienDashboard() {
  const k = useKovela();

  const myPatients = useMemo(
    () => k.patients.filter((p) => p.surgeonId === MY_SURGEON_ID),
    [k.patients]
  );

  // « Patients suivis » = réellement actifs/clôturés (onboarding complété),
  // hors planning non activé, onboarding incomplet et interventions annulées.
  const followedPatients = useMemo(
    () => myPatients.filter((p) => p.onboardingComplete && p.planningStatus !== "annule"),
    [myPatients]
  );

  const config = k.surgeon(MY_SURGEON_ID)?.config;
  const assistant = k.assistantsFor(MY_SURGEON_ID)[0];

  const NOW = new Date("2026-05-27T12:00:00Z").getTime();

  const stats = useMemo(() => {
    const actifs = myPatients.filter((p) => p.status !== "cloture").length;
    const crDispo = myPatients.filter((p) => {
      const r = k.reportFor(p.id);
      return r && r.status === "disponible";
    }).length;
    const escalades = myPatients.filter((p) => {
      const e = k.escalationFor(p.id);
      return e && e.status === "transmise";
    }).length;
    const activesMois = myPatients.filter((p) => p.activatedThisMonth).length;
    const aVenir = myPatients.filter(
      (p) => p.planningStatus !== "annule" && new Date(p.interventionDate).getTime() >= NOW
    ).length;
    const onboardingsACompleter = myPatients.filter(
      (p) => p.planningStatus !== "annule" && !p.onboardingComplete
    ).length;
    return { actifs, crDispo, escalades, activesMois, aVenir, onboardingsACompleter };
  }, [myPatients, k, NOW]);

  const montant = k.pricing.baseMonthly + stats.activesMois * k.pricing.perActivatedPatient;

  return (
    <Shell>
      <PageHeader
        eyebrow={k.surgeonName(MY_SURGEON_ID)}
        title="Mes patients"
        subtitle="Vous ne recevez pas du bruit : un historique clair et exploitable. Vous gardez la main."
      >
        <Link href="/chirurgien/planning">
          <Button variant="primary">Transmettre / modifier mon planning opératoire</Button>
        </Link>
      </PageHeader>

      {/* Moment clé · 1er CR disponible — affiché si au moins 1 CR disponible. */}
      {stats.crDispo > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-teal-100/60">
          <div className="border-l-[3px] border-teal-500/80 px-6 py-5">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-teal-700">
              {stats.crDispo === 1 ? "Premier compte-rendu disponible" : "Comptes-rendus disponibles"}
            </p>
            <p className="mt-1.5 font-display text-[17px] font-semibold tracking-tight text-navy-900">
              {stats.crDispo === 1
                ? "Votre premier CR factuel est prêt."
                : `${stats.crDispo} CR factuels prêts à consulter.`}
            </p>
            <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-charcoal/65">
              Synthèse opérationnelle préparée par l&apos;IA, relue et validée par l&apos;équipe
              KOVELA. Vous consultez le CR factuel ; aucune décision médicale n&apos;est prise par
              KOVELA.
            </p>
          </div>
        </div>
      )}

      {config && !config.referentielComplete && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-navy-900/[0.045]">
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="mt-1 h-9 w-[2px] shrink-0 rounded-full bg-amber-400/60" />
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-amber-700/90">
                  Action requise
                </p>
                <p className="mt-1.5 font-display text-[16px] font-semibold tracking-tight text-navy-900">
                  Référentiel de suivi cabinet à compléter
                </p>
                <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-charcoal/65">
                  Indiquez vos préférences de suivi par type d'intervention pour permettre à
                  l'équipe KOVELA de préparer les parcours patients selon les habitudes de votre
                  cabinet.
                </p>
                <p className="mt-2.5 text-[12px] leading-relaxed text-charcoal/55">
                  Vous pouvez aussi préparer un{" "}
                  <Link
                    href="/chirurgien/referentiel"
                    className="font-medium text-teal-700 underline-offset-2 hover:text-teal-800 hover:underline"
                  >
                    référentiel essentiel
                  </Link>{" "}
                  — 2 ou 3 interventions prioritaires, généralement finalisé avec l'équipe KOVELA.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <Link href="/chirurgien/referentiel-suivi">
                <Button variant="primary" className="w-full">
                  Compléter le référentiel
                </Button>
              </Link>
              <Link href="/chirurgien/referentiel">
                <Button variant="subtle" className="w-full">
                  Commencer avec mes interventions prioritaires →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Transmissions cabinet" value={stats.escalades} accent />
        <StatCard label="CR factuels disponibles" value={stats.crDispo} />
        <StatCard label="Patients en suivi" value={stats.actifs} />
        <StatCard label="Interventions à venir" value={stats.aVenir} />
        <StatCard label="Onboardings à compléter" value={stats.onboardingsACompleter} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Patients suivis"
            subtitle="Patients réellement en suivi KOVELA (onboarding complété)"
          />
          <div className="divide-y divide-navy-900/[0.05]">
            {followedPatients.length === 0 && (
              <p className="px-5 py-6 text-sm text-charcoal/45">Aucun patient en suivi pour le moment.</p>
            )}
            {followedPatients.map((p) => {
              const report = k.reportFor(p.id);
              const esc = k.escalationFor(p.id);
              const escTransmise = esc?.status === "transmise";
              return (
                <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-navy-900">{p.name}</p>
                    <p className="truncate text-xs text-charcoal/45">
                      {p.intervention} · {formatDate(p.interventionDate)} · {relativeDays(p.lastMessageAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {escTransmise && (
                      <Badge className="bg-navy-900 text-teal-100 ring-navy-900">Transmission cabinet</Badge>
                    )}
                    {report && report.status === "disponible" && (
                      <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">CR factuel disponible</Badge>
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

        <div className="space-y-6">
          {/* Service cabinet */}
          <Card>
            <CardHeader
              title="Service cabinet"
              subtitle={
                config?.configured
                  ? "Espace de pilotage du service opéré par KOVELA"
                  : "Mise en place à finaliser avec l'équipe KOVELA"
              }
              action={
                <Link href="/chirurgien/onboarding" className="text-xs font-medium text-teal-600 hover:text-teal-700">
                  Modifier →
                </Link>
              }
            />
            <div className="space-y-2.5 p-5 text-sm">
              <Row
                label="Statut"
                value={
                  config?.configured ? (
                    <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Service activé</Badge>
                  ) : (
                    <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">
                      Mise en place à finaliser
                    </Badge>
                  )
                }
              />
              <Row
                label="Mise en place guidée"
                value={
                  config?.configured ? (
                    <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Complétée</Badge>
                  ) : (
                    <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">À finaliser</Badge>
                  )
                }
              />
              <Row
                label="Documents de service"
                value={
                  config?.documentsAcceptedAt ? (
                    <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Validés</Badge>
                  ) : (
                    <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">À finaliser</Badge>
                  )
                }
              />
              {config?.documentsAcceptedAt && (
                <>
                  <Row
                    label="Dernière validation"
                    value={
                      <span className="text-xs text-charcoal/70">
                        {new Date(config.documentsAcceptedAt).toLocaleString("fr-FR")}
                      </span>
                    }
                  />
                  <Row
                    label="Versions"
                    value={
                      <span className="text-[11px] text-charcoal/65">
                        CGS {config.documentVersions.cgs ?? "—"} · Confidentialité{" "}
                        {config.documentVersions.confidentialite ?? "—"} · DPA{" "}
                        {config.documentVersions.dpa ?? "—"} · Annexe{" "}
                        {config.documentVersions.annexe ?? "—"}
                      </span>
                    }
                  />
                </>
              )}
              <Row label="Spécialisation" value={config?.specialization ?? "—"} />
              <Row label="Verticale" value={<Badge className="bg-navy-900/[0.04] text-charcoal/70 ring-navy-900/[0.06]">{config?.vertical ?? "—"}</Badge>} />
              <Row
                label="Référentiel de suivi"
                value={
                  config?.referentielComplete ? (
                    <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Complété</Badge>
                  ) : (
                    <Badge className="bg-amber-50/50 text-amber-800 ring-amber-200/50">À compléter</Badge>
                  )
                }
              />
              <Row label="Typologie de suivi" value={config ? followTypeLabels[config.followType] : "—"} />
              <Row label="Fréquence CR" value={config?.crFrequency ?? "—"} />
              <Row label="Contact cabinet autorisé" value={assistant?.name ?? "—"} />
              <Row
                label="Mandat GoCardless"
                value={
                  config ? (
                    <Badge className={mandateStyles[config.mandateStatus]}>
                      {config.mandateStatus === "mandat_actif" || config.mandateStatus === "prelevement_pret"
                        ? "Actif"
                        : "À finaliser"}
                    </Badge>
                  ) : (
                    "—"
                  )
                }
              />
              <p className="pt-1 text-[11px] text-charcoal/45">
                Informations modifiables à tout moment.
              </p>
              <Link href="/chirurgien/onboarding" className="block">
                <Button variant="primary" className="mt-1 w-full">
                  {config?.configured
                    ? "Modifier les paramètres de service"
                    : "Mettre en place le service pour mon cabinet"}
                </Button>
              </Link>
              <div className="mt-2 rounded-lg bg-bone/60 px-3.5 py-2.5 text-[12px] tracking-tight text-charcoal/70 ring-1 ring-navy-900/[0.04]">
                Prochaine étape —{" "}
                <Link
                  href="/chirurgien/planning"
                  className="font-medium text-teal-700 transition-colors hover:text-teal-800"
                >
                  transmettre mon planning opératoire →
                </Link>
              </div>
            </div>
          </Card>

          {/* Abonnement */}
          <Card>
            <CardHeader title="Abonnement" subtitle="Simulation — aucun paiement réel" />
            <div className="space-y-3 p-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-charcoal/55">Statut</span>
                <Badge className="bg-teal-50/60 text-teal-700 ring-teal-100/70">Actif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal/55">Mandat GoCardless</span>
                {config && (
                  <Badge className={mandateStyles[config.mandateStatus]}>
                    {mandateLabels[config.mandateStatus]}
                  </Badge>
                )}
              </div>
              <div className="my-2 border-t border-navy-900/[0.06]" />
              <div className="flex items-center justify-between">
                <span className="text-charcoal/55">Patients activés (mois)</span>
                <span className="font-medium text-navy-900">{stats.activesMois}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-bone/60 px-3.5 py-2.5 ring-1 ring-navy-900/[0.04]">
                <span className="text-[12.5px] font-medium tracking-tight text-navy-900">
                  Montant estimé
                </span>
                <span className="font-display text-[18px] font-medium tracking-tight text-teal-700">
                  {montant} € HT
                </span>
              </div>
              <p className="text-[11px] text-charcoal/45">
                {k.pricing.baseMonthly} € HT / mois ·{" "}
                {k.pricing.includedPatients} patients activés inclus · puis{" "}
                {k.pricing.perActivatedPatient} € HT / patient supplémentaire.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Durées par type d'intervention + Cadre cible */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Durées de suivi par type d'intervention"
            subtitle="Référentiel de suivi cabinet — ajustables patient par patient"
            action={
              <Link href="/chirurgien/referentiel-suivi" className="text-xs font-medium text-teal-600 hover:text-teal-700">
                Modifier →
              </Link>
            }
          />
          <div className="p-5">
            {config && Object.keys(config.interventionDurations).length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(config.interventionDurations).map(([type, dur]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-lg bg-bone/60 px-3.5 py-2 text-[13px] tracking-tight ring-1 ring-navy-900/[0.04]"
                  >
                    <span className="truncate text-navy-900">{type}</span>
                    <span className="ml-2 shrink-0 text-charcoal/70">{dur}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-charcoal/45">Aucune durée configurée pour le moment.</p>
            )}
            <p className="mt-3 text-[11px] text-charcoal/45">
              Préférences de fonctionnement déclarées par le cabinet, ajustables patient par patient.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Cadre cible" subtitle="HDS · RGPD · principes CNIL — architecture cible" />
          <div className="space-y-2 p-5 text-sm">
            {[
              "HDS pour l'application métier",
              "RGPD",
              "Principes CNIL (minimisation, traçabilité, droits)",
              "Accès par rôle",
              "Traçabilité des actions humaines et IA",
              "Aucune donnée patient dans le CRM ou la landing",
            ].map((p) => (
              <div key={p} className="flex items-start gap-2 text-charcoal/75">
                <span className="mt-0.5 text-teal-500">•</span>
                {p}
              </div>
            ))}
            <p className="mt-2 text-[11px] text-charcoal/45">
              Architecture cible — éléments à valider juridiquement avant un déploiement en production.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-charcoal/55">{label}</span>
      <span className="text-right font-medium text-navy-900">{value}</span>
    </div>
  );
}
