"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";
import {
  ADMIN_CONSTANTS,
  DATA_CATEGORY_LABELS,
  DATA_CATEGORY_STYLES,
  type DataCategory,
} from "@/lib/admin-constants";
import {
  adminPeriodLabels,
  decisionSeverityLabels,
  decisionSeverityStyles,
  generalStateLabels,
  generalStateStyles,
  getCapacityActuelle,
  getCapacityProjection,
  getCareOpsMetrics,
  getDecisions,
  getExecutiveKPIs,
  getExecutiveSummary,
  getFinanceMetrics,
  getGeneralState,
  getGrowthMetrics,
  getHeadOfCareStatus,
  getNormalizedFinanceMetrics,
  getRiskMetrics,
  getSaturationEstimate,
  headOfCareLabels,
  headOfCareStyles,
  type AdminPeriod,
  type AdminState,
} from "@/lib/admin-kpi";

// ---------------------------------------------------------------------------
// Helpers UI locaux
// ---------------------------------------------------------------------------

function formatEur(n: number): string {
  return `${n.toLocaleString("fr-FR")} €`;
}
function formatPct(n: number, digits = 0): string {
  return `${(n * 100).toFixed(digits)} %`;
}

// Mini-KPI card sobre + badge catégorie (mesuré / estimé / hypothèse / v1).
function KpiCard({
  label,
  value,
  hint,
  accent,
  category,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: boolean;
  category?: DataCategory;
}) {
  return (
    <Card className="px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
          {label}
        </p>
        {category && (
          <Badge className={DATA_CATEGORY_STYLES[category]}>
            {category === "mesure"
              ? "Mesuré"
              : category === "estime"
              ? "Estimé"
              : category === "hypothese"
              ? "Hyp."
              : "V1"}
          </Badge>
        )}
      </div>
      <p
        className={`mt-3 font-display text-[1.85rem] font-medium leading-none tracking-tight ${
          accent ? "text-teal-700" : "text-navy-900"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-[11px] leading-relaxed text-charcoal/55">{hint}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

type Tab = "growth" | "care" | "finance" | "risk";

export default function AdminCockpit() {
  const k = useKovela();
  const [period, setPeriod] = useState<AdminPeriod>("month");
  const [tab, setTab] = useState<Tab>("care");
  const [showInvestor, setShowInvestor] = useState(false);

  const state: AdminState = useMemo(
    () => ({
      patients: k.patients,
      surgeons: k.surgeons,
      supervisors: k.supervisors,
      prospects: k.prospects,
      reports: k.reports,
      escalations: k.escalations,
      reportFor: k.reportFor,
      escalationFor: k.escalationFor,
      pricing: k.pricing,
    }),
    [
      k.patients,
      k.surgeons,
      k.supervisors,
      k.prospects,
      k.reports,
      k.escalations,
      k.reportFor,
      k.escalationFor,
      k.pricing,
    ]
  );

  const general = getGeneralState(state);
  const exec = getExecutiveKPIs(state);
  const summary = getExecutiveSummary(state);
  const decisions = getDecisions(state);
  const decisionsTop = decisions.slice(0, 4);
  const decisionsRest = decisions.slice(4);
  const cap = getCapacityActuelle(state);
  const proj7 = getCapacityProjection(state, 7);
  const proj14 = getCapacityProjection(state, 14);
  const proj30 = getCapacityProjection(state, 30);
  const saturation = getSaturationEstimate(state);
  const fin = getFinanceMetrics(state);
  const norm = getNormalizedFinanceMetrics(state);
  const risk = getRiskMetrics(state);
  const growth = getGrowthMetrics(state);
  const care = getCareOpsMetrics(state);
  const hoc = getHeadOfCareStatus(state);

  return (
    <Shell>
      <PageHeader
        eyebrow="Admin KOVELA"
        title="Cockpit KOVELA"
        subtitle="Pilotage business, care operations, capacité et risques — données prototype."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={generalStateStyles[general]}>
            {generalStateLabels[general]}
          </Badge>
          <div className="flex items-center gap-1 rounded-lg bg-white/[0.05] p-0.5 ring-1 ring-white/10">
            {(["today", "7d", "month", "prev_month"] as AdminPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium tracking-tight transition-colors ${
                  period === p
                    ? "bg-white text-navy-900 shadow-soft"
                    : "text-navy-100/70 hover:text-white"
                }`}
              >
                {adminPeriodLabels[p]}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      {/* B. Executive summary */}
      <Card className="mb-5 px-6 py-4">
        <div className="flex items-start gap-4">
          <span className="mt-1 h-7 w-[2px] shrink-0 rounded-full bg-teal-500/80" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
              Executive summary
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed tracking-tight text-navy-900">
              {summary}
            </p>
          </div>
        </div>
      </Card>

      {/* C. KPI cards executive — max 8 */}
      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        <KpiCard
          label="Chirurgiens actifs"
          value={exec.chirurgiensActifs}
          category="mesure"
        />
        <KpiCard
          label="Patients suivis (mois)"
          value={exec.patientsSuivisMois}
          category="mesure"
        />
        <KpiCard
          label="Patients actifs"
          value={exec.patientsActifsAujourdhui}
          category="mesure"
        />
        <KpiCard
          label="MRR estimé"
          value={formatEur(exec.mrrEstimated)}
          category="estime"
        />
        <KpiCard
          label="ARR estimé"
          value={formatEur(exec.arrEstimated)}
          category="estime"
        />
        <KpiCard
          label="Marge normalisée"
          value={formatPct(exec.margeBruteNormaliseePercent)}
          hint={`À ${norm.chirurgiensCible} chirurgiens × ${norm.patientsParChirurgienCible} patients/mois`}
          category="hypothese"
        />
        <KpiCard
          label="Capacité superviseurs"
          value={formatPct(exec.capaciteUtiliseePercent)}
          hint={
            exec.capaciteUtiliseePercent >= ADMIN_CONSTANTS.SEUIL_CAPACITE_ATTENTION
              ? "À surveiller"
              : "Maîtrisée"
          }
          category="estime"
        />
        <KpiCard
          label="Décisions à prendre"
          value={exec.decisionsCount}
          accent={exec.decisionsCount > 0}
          category="mesure"
        />
      </div>

      {/* D. Decision Center */}
      <Card className="mb-6 overflow-hidden">
        <CardHeader
          title="Aujourd'hui, décisions à prendre"
          subtitle="Vue dérivée : capacité, qualité, retards, activation, management care."
        />
        <div className="divide-y divide-navy-900/[0.05]">
          {decisionsTop.length === 0 && (
            <p className="px-6 py-6 text-center text-[12.5px] text-charcoal/50">
              Aucune décision prioritaire — ops maîtrisée à ce stade.
            </p>
          )}
          {decisionsTop.map((d) => (
            <div key={d.key} className="flex items-start gap-4 px-6 py-4">
              <Badge className={`shrink-0 ${decisionSeverityStyles[d.severity]}`}>
                {decisionSeverityLabels[d.severity]}
              </Badge>
              <div className="flex-1">
                <p className="font-display text-[13.5px] font-semibold tracking-tight text-navy-900">
                  {d.label}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-charcoal/65">
                  {d.consequence}
                </p>
                <p className="mt-1 text-[12px] font-medium tracking-tight text-teal-700">
                  → {d.action}
                </p>
              </div>
              {d.link && (
                <Link href={d.link} className="shrink-0">
                  <Button variant="subtle">{d.linkLabel ?? "Voir"}</Button>
                </Link>
              )}
            </div>
          ))}
        </div>
        {decisionsRest.length > 0 && (
          <details className="border-t border-navy-900/[0.05]">
            <summary className="cursor-pointer list-none px-6 py-3 text-[12px] font-medium tracking-tight text-charcoal/65 hover:text-navy-900">
              Voir {decisionsRest.length} décision{decisionsRest.length > 1 ? "s" : ""}{" "}
              supplémentaire{decisionsRest.length > 1 ? "s" : ""} ›
            </summary>
            <div className="divide-y divide-navy-900/[0.05]">
              {decisionsRest.map((d) => (
                <div key={d.key} className="flex items-start gap-4 px-6 py-3">
                  <Badge
                    className={`shrink-0 ${decisionSeverityStyles[d.severity]}`}
                  >
                    {decisionSeverityLabels[d.severity]}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-[12.5px] font-medium tracking-tight text-navy-900">
                      {d.label}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-charcoal/65">
                      → {d.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </Card>

      {/* E. Onglets cockpit */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            ["growth", "Growth"],
            ["care", "Care ops"],
            ["finance", "Finance"],
            ["risk", "Risk & quality"],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 text-[12.5px] font-medium tracking-tight transition-colors ${
              tab === t
                ? "bg-navy-900 text-white shadow-soft"
                : "bg-white text-charcoal/70 ring-1 ring-navy-900/[0.06] hover:text-navy-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* === ONGLET GROWTH === */}
      {tab === "growth" && (
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Pipeline & activation chirurgiens"
              subtitle="Suivi du funnel commercial et de l'activation cabinet."
              action={
                <Link
                  href="/admin/crm"
                  className="text-[11.5px] font-medium tracking-tight text-teal-700 hover:text-teal-800"
                >
                  Voir CRM détaillé →
                </Link>
              }
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {growth.fungelStages.map((s) => (
                <div key={s.label} className="bg-white px-4 py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {s.label}
                  </p>
                  <p className="mt-2 font-display text-[20px] font-medium tracking-tight text-navy-900">
                    {s.count}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid gap-px border-t border-navy-900/[0.05] bg-navy-900/[0.04] sm:grid-cols-3">
              <div className="bg-white px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                  Taux démo → onboarding
                </p>
                <p className="mt-1.5 font-display text-[16px] font-medium tracking-tight text-navy-900">
                  {formatPct(growth.tauxDemoOnboarding)}
                </p>
              </div>
              <div className="bg-white px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                  Cabinet signé non activé
                </p>
                <p className="mt-1.5 font-display text-[16px] font-medium tracking-tight text-navy-900">
                  {growth.cabinetSigneNonActiveCount}
                </p>
              </div>
              <div className="bg-white px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                  Délai signature → activation
                </p>
                <p className="mt-1.5 font-display text-[16px] font-medium tracking-tight text-charcoal/55">
                  À mesurer V1
                </p>
              </div>
            </div>
            <div className="border-t border-navy-900/[0.05] px-6 py-3 text-[11px] leading-relaxed text-charcoal/55">
              CAC, payback et churn chirurgien : à créer en V1 (historique réel
              nécessaire).
            </div>
          </Card>
        </div>
      )}

      {/* === ONGLET CARE OPS === */}
      {tab === "care" && (
        <div className="space-y-5">
          {/* KPI care */}
          <Card>
            <CardHeader
              title="Care operations"
              subtitle="Charge patients, retards et coordination."
              action={
                <Link
                  href="/admin/supervision"
                  className="text-[11.5px] font-medium tracking-tight text-teal-700 hover:text-teal-800"
                >
                  Voir supervision détaillée →
                </Link>
              }
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                ["Patients actifs", care.patientsActifs],
                ["Patients suivis (mois)", care.patientsSuivisMois],
                ["Dossiers à traiter", care.dossiersATraiter],
                ["Retards opérationnels", care.retardsOperationnels],
                ["CR à préparer / finaliser", care.crAPreparer],
                ["Transmissions cabinet", care.transmissionsCabinet],
                ["En attente cabinet", care.enAttenteCabinet],
                ["Clôtures à préparer", care.cloturesAPreparer],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-[18px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Capacité actuelle */}
          <Card>
            <CardHeader
              title="Capacité actuelle"
              subtitle={`Hypothèse capacité optimale : ${ADMIN_CONSTANTS.CAPACITE_SUPERVISEUR_PATIENTS_OPTIMAL} patients par superviseuse.`}
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                ["Superviseuses actives", cap.superviseusesActives],
                ["Patients / superviseuse", cap.patientsParSupMoyenne],
                ["Capacité utilisée", formatPct(cap.capaciteUtiliseePercent)],
                ["Proches saturation", cap.prochesSaturation],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-[18px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3 px-5 py-4">
              {cap.perSupervisor.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[10px] font-semibold text-white">
                        {s.initials}
                      </span>
                      <span className="font-medium tracking-tight text-navy-900">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-charcoal/65">
                      {s.patients} patients · {formatPct(s.loadPercent)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-navy-900/[0.06]">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.status === "surcharge"
                          ? "bg-amber-500/80"
                          : s.status === "saturation"
                          ? "bg-amber-400/80"
                          : s.status === "attention"
                          ? "bg-amber-300/80"
                          : "bg-teal-500"
                      }`}
                      style={{
                        width: `${Math.min(100, s.loadPercent * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Prévision de surcharge */}
          <Card>
            <CardHeader
              title="Prévision de surcharge"
              subtitle={`Projection basée sur hypothèses prototype (croissance ${ADMIN_CONSTANTS.NOUVEAUX_PATIENTS_HEBDO_HYPOTHESE} patients / semaine).`}
            />
            <div className="grid grid-cols-1 gap-px bg-navy-900/[0.04] sm:grid-cols-3">
              {[
                [
                  "À 7 jours",
                  proj7.patientsProjetes,
                  proj7.capaciteProjeteePercent,
                ],
                [
                  "À 14 jours",
                  proj14.patientsProjetes,
                  proj14.capaciteProjeteePercent,
                ],
                [
                  "À 30 jours",
                  proj30.patientsProjetes,
                  proj30.capaciteProjeteePercent,
                ],
              ].map(([label, patients, pct]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-[18px] font-medium tracking-tight text-navy-900">
                    {patients} patients
                  </p>
                  <p
                    className={`mt-0.5 text-[11.5px] font-medium tracking-tight ${
                      (pct as number) >= ADMIN_CONSTANTS.SEUIL_CAPACITE_RISQUE
                        ? "text-amber-900"
                        : (pct as number) >=
                          ADMIN_CONSTANTS.SEUIL_CAPACITE_ATTENTION
                        ? "text-amber-800"
                        : "text-teal-700"
                    }`}
                  >
                    Capacité {formatPct(pct as number)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[12px] leading-relaxed text-charcoal/65">
              {saturation.joursAvantSaturation !== null &&
              saturation.joursAvantSaturation > 0 ? (
                <>
                  Saturation estimée à 85% dans environ{" "}
                  <span className="font-medium text-navy-900">
                    {saturation.joursAvantSaturation} jours
                  </span>
                  {saturation.dateSaturation
                    ? ` (${new Date(saturation.dateSaturation).toLocaleDateString("fr-FR")})`
                    : ""}{" "}
                  · pré-sourcer une superviseuse avant cette date.
                </>
              ) : saturation.joursAvantSaturation === 0 ? (
                <>Capacité déjà au-dessus du seuil — activer back-up.</>
              ) : (
                <>Projection non calculable (capacité indéfinie).</>
              )}
            </div>
          </Card>

          {/* Équipe care — Head of Care */}
          <Card>
            <CardHeader
              title="Équipe care"
              subtitle="Niveaux d'administration et besoin Head of Care."
              action={
                <Badge className={headOfCareStyles[hoc.recommendation]}>
                  {headOfCareLabels[hoc.recommendation]}
                </Badge>
              }
            />
            <div className="grid gap-px bg-navy-900/[0.04] sm:grid-cols-3">
              {[
                ["Niveau 1 — Superviseuses", cap.superviseusesActives],
                [
                  "Niveau 2 — Lead / Head of Care",
                  hoc.recommendation === "non"
                    ? "Non requis"
                    : hoc.recommendation === "lead_part_time"
                    ? "Lead part-time"
                    : hoc.recommendation === "a_anticiper"
                    ? "À anticiper"
                    : "Head of Care recommandé",
                ],
                ["Niveau 3 — Admin / CEO / Ops", "Pilotage actuel"],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 text-[13px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {hoc.reasons.length > 0 && (
              <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[12px] leading-relaxed text-charcoal/65">
                <span className="font-medium text-navy-900">Déclencheurs :</span>{" "}
                {hoc.reasons.join(" · ")}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* === ONGLET FINANCE === */}
      {tab === "finance" && (
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Revenu récurrent estimé"
              subtitle={`Hypothèses : ${ADMIN_CONSTANTS.COUT_SUPERVISEUR_MENSUEL_EUR} € / superviseuse / mois · ${ADMIN_CONSTANTS.COUT_DIRECT_PATIENT_EUR} € coût direct patient.`}
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                ["MRR estimé", formatEur(fin.mrrEstimated), "estime" as DataCategory],
                ["ARR estimé", formatEur(fin.arrEstimated), "estime" as DataCategory],
                [
                  "Revenu abonnement",
                  formatEur(fin.revenuAbonnement),
                  "estime" as DataCategory,
                ],
                [
                  "Revenu variable patients",
                  formatEur(fin.revenuVariablePatients),
                  "estime" as DataCategory,
                ],
                [
                  "Revenu moyen / chirurgien",
                  formatEur(fin.revenuMoyenParChirurgien),
                  "estime" as DataCategory,
                ],
                [
                  "Revenu / patient activé",
                  formatEur(fin.revenuMoyenParPatient),
                  "mesure" as DataCategory,
                ],
                [
                  "Coût superviseur mensuel",
                  formatEur(fin.coutSuperviseurMensuel),
                  "hypothese" as DataCategory,
                ],
                [
                  "Coût direct patients mensuel",
                  formatEur(fin.coutDirectPatientsMensuel),
                  "hypothese" as DataCategory,
                ],
              ].map(([label, value, cat]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                      {label}
                    </p>
                    <Badge className={DATA_CATEGORY_STYLES[cat as DataCategory]}>
                      {(cat as DataCategory) === "mesure"
                        ? "Mesuré"
                        : (cat as DataCategory) === "estime"
                        ? "Estimé"
                        : "Hyp."}
                    </Badge>
                  </div>
                  <p className="mt-1.5 font-display text-[16px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {/* Marge brute prototype — affichée mais contextualisée. */}
            <div className="border-t border-navy-900/[0.05] px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  Marge brute prototype — faible volume
                </p>
                <p
                  className={`font-display text-[22px] font-medium tracking-tight ${
                    fin.margeBruteEur >= 0 ? "text-teal-700" : "text-amber-900"
                  }`}
                >
                  {formatEur(fin.margeBruteEur)}
                </p>
                <p className="text-[13px] tracking-tight text-charcoal/65">
                  ({formatPct(fin.margeBrutePercent, 1)})
                </p>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-charcoal/55">
                Non représentative à ce stade : faible volume patients vs coûts
                fixes de supervision.
              </p>
            </div>
          </Card>

          {/* Marge brute normalisée — lecture à volume cible. */}
          <Card>
            <CardHeader
              title="Marge brute normalisée"
              subtitle={`À volume cible : ${norm.chirurgiensCible} chirurgiens × ${norm.patientsParChirurgienCible} patients/mois = ${norm.patientsTotalCible} patients. Capacité cible : ${norm.patientsParSuperviseurCible} patients / superviseuse.`}
              action={
                <Badge className={DATA_CATEGORY_STYLES.hypothese}>
                  {DATA_CATEGORY_LABELS.hypothese}
                </Badge>
              }
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                ["Chirurgiens cible", norm.chirurgiensCible],
                [
                  "Patients/mois cible",
                  norm.patientsTotalCible,
                ],
                ["Superviseuses requises", norm.superviseusesCible],
                ["MRR normalisé", formatEur(norm.mrrNormalise)],
                ["ARR normalisé", formatEur(norm.arrNormalise)],
                [
                  "Revenu abonnement",
                  formatEur(norm.revenuAbonnementNormalise),
                ],
                ["Revenu variable", formatEur(norm.revenuVariableNormalise)],
                [
                  "Coût supervision",
                  formatEur(norm.coutSuperviseurNormalise),
                ],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-[16px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  Marge brute normalisée
                </p>
                <p
                  className={`font-display text-[22px] font-medium tracking-tight ${
                    norm.margeBruteNormaliseeEur >= 0
                      ? "text-teal-700"
                      : "text-amber-900"
                  }`}
                >
                  {formatEur(norm.margeBruteNormaliseeEur)}
                </p>
                <p className="text-[13px] tracking-tight text-charcoal/65">
                  ({formatPct(norm.margeBruteNormaliseePercent, 1)})
                </p>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-charcoal/55">
                Hypothèse prototype — calcul honnête basé sur les paramètres
                affichés. À ajuster avec données réelles V1 (capacité
                superviseur, pricing, mix abonnement/variable).
              </p>
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[11px] leading-relaxed text-charcoal/55">
              Burn / runway / CAC / payback : à créer en V1 (cash et historique
              nécessaires).
            </div>
          </Card>
        </div>
      )}

      {/* === ONGLET RISK & QUALITY === */}
      {tab === "risk" && (
        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Risk & quality"
              subtitle="Où le modèle peut casser — référentiels, mappings, retards."
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                [
                  "% patients avec référentiel",
                  formatPct(risk.pctReferentielApplicable),
                ],
                ["Patients sans référentiel", risk.patientsSansReferentiel],
                ["Interventions non mappées", risk.interventionsNonMappees],
                ["Référentiels à relire", risk.referentielsArRelire],
                ["CR en retard", risk.crEnRetard],
                ["Transmissions en attente", risk.transmissionsEnAttente],
                ["Patients sans superviseuse", risk.patientsSansSuperviseur],
                ["Risques opérationnels", risk.risquesOuverts],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-[16px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  Score qualité opérationnelle estimé
                </p>
                <p
                  className={`font-display text-[22px] font-medium tracking-tight ${
                    risk.scoreQualiteOpsPercent <
                    ADMIN_CONSTANTS.SEUIL_QUALITE_OPS_MIN
                      ? "text-amber-900"
                      : "text-teal-700"
                  }`}
                >
                  {formatPct(risk.scoreQualiteOpsPercent, 1)}
                </p>
              </div>
              <p className="mt-1 text-[11px] tracking-tight text-charcoal/55">
                Moyenne simple : référentiels validés, CR à jour, patients
                assignés. À affiner en V1.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* F. Investor snapshot — replié par défaut */}
      <Card className="mt-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowInvestor((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left transition-colors hover:bg-bone/40"
        >
          <div>
            <p className="font-display text-[14px] font-semibold tracking-tight text-navy-900">
              Investor snapshot
            </p>
            <p className="mt-0.5 text-[11.5px] tracking-tight text-charcoal/55">
              Vue pitch-ready compacte — données prototype, structure de
              pilotage cible.
            </p>
          </div>
          <span
            className={`text-[12px] text-charcoal/45 transition-transform ${
              showInvestor ? "rotate-90" : ""
            }`}
          >
            ›
          </span>
        </button>
        {showInvestor && (
          <div className="border-t border-navy-900/[0.05] px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Traction & revenu
                </p>
                <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/75">
                  <li>
                    <span className="font-medium text-navy-900">
                      {exec.chirurgiensActifs}
                    </span>{" "}
                    chirurgiens actifs · {exec.patientsSuivisMois} patients suivis
                  </li>
                  <li>
                    MRR estimé{" "}
                    <span className="font-medium text-navy-900">
                      {formatEur(exec.mrrEstimated)}
                    </span>{" "}
                    · ARR{" "}
                    <span className="font-medium text-navy-900">
                      {formatEur(exec.arrEstimated)}
                    </span>
                  </li>
                  <li>
                    Marge prototype :{" "}
                    <span className="font-medium text-amber-900">
                      non représentative (faible volume)
                    </span>
                  </li>
                  <li>
                    Marge normalisée à volume cible :{" "}
                    <span className="font-medium text-navy-900">
                      {formatPct(exec.margeBruteNormaliseePercent)}
                    </span>{" "}
                    <span className="text-charcoal/55">
                      ({norm.chirurgiensCible}×{norm.patientsParChirurgienCible}/mois)
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Capacité & qualité
                </p>
                <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/75">
                  <li>
                    Capacité superviseurs{" "}
                    <span className="font-medium text-navy-900">
                      {formatPct(cap.capaciteUtiliseePercent)}
                    </span>
                  </li>
                  <li>
                    Capacité projetée 14j{" "}
                    <span className="font-medium text-navy-900">
                      {formatPct(proj14.capaciteProjeteePercent)}
                    </span>
                  </li>
                  <li>
                    Score qualité ops estimé{" "}
                    <span className="font-medium text-navy-900">
                      {formatPct(risk.scoreQualiteOpsPercent)}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Risques ouverts
                </p>
                <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/75">
                  <li>{risk.referentielsArRelire} référentiels à relire</li>
                  <li>{risk.patientsSansReferentiel} patients sans référentiel</li>
                  <li>{risk.crEnRetard} CR en retard</li>
                  <li>
                    {headOfCareLabels[hoc.recommendation]} (management care)
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                  Milestones 30 / 60 / 90 jours
                </p>
                <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-charcoal/75">
                  <li>30j — activer cabinets signés, stabiliser capacité</li>
                  <li>60j — Lead superviseuse, premiers référentiels relus</li>
                  <li>
                    90j — capacité projetée maîtrisée, marge brute consolidée
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-bone/60 px-3 py-2 text-[10.5px] tracking-tight text-charcoal/60 ring-1 ring-navy-900/[0.04]">
              Données prototype — structure de pilotage cible. Pas un reporting
              comptable.
            </p>
          </div>
        )}
      </Card>

      {/* G. Data integrity footer */}
      <Card className="mt-6">
        <CardHeader
          title="Data integrity"
          subtitle={`Cockpit ${ADMIN_CONSTANTS.COCKPIT_VERSION} — dernière mise à jour : live (état volatile).`}
        />
        <div className="grid gap-4 px-6 py-5 sm:grid-cols-4">
          {(
            [
              [
                "mesure",
                "patients, statuts, CR, transmissions, superviseurs, prospects",
              ],
              [
                "estime",
                "MRR, ARR, marge brute prototype, capacité utilisée et projetée",
              ],
              [
                "hypothese",
                "capacité superviseur, coût superviseur, coût patient, croissance hebdo, volume cible (chirurgiens, patients/mois, capacité). Marge normalisée = hypothèse prototype, non donnée réelle.",
              ],
              [
                "v1",
                "churn, CAC, payback, runway, cohortes, historique M/M réel",
              ],
            ] as [DataCategory, string][]
          ).map(([cat, content]) => (
            <div key={cat}>
              <Badge className={DATA_CATEGORY_STYLES[cat]}>
                {DATA_CATEGORY_LABELS[cat]}
              </Badge>
              <p className="mt-2 text-[11.5px] leading-relaxed text-charcoal/65">
                {content}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
