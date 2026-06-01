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
  careRoleLabels,
  costTypeLabels,
  costTypeStyles,
  productivitySourceLabels,
  productivitySourceStyles,
  type CareRole,
  type DataCategory,
} from "@/lib/admin-constants";
import {
  adminPeriodLabels,
  decisionSeverityLabels,
  decisionSeverityStyles,
  generalStateLabels,
  generalStateStyles,
  getAIGainsMetrics,
  getBreakEvenScenarios,
  getCapacityActuelle,
  getCapacityProjection,
  getCareCostsActuels,
  getCareMarginActuelle,
  getCareOpsMetrics,
  getCareStaffCosts,
  getDecisions,
  getExecutiveKPIs,
  getExecutiveSummary,
  getFinanceMetrics,
  getGeneralState,
  getGrowthMetrics,
  getHeadOfCareStatus,
  getNormalizedFinanceMetrics,
  getProductivityMetrics,
  getRiskMetrics,
  getSaturationEstimate,
  getTimeScenarioMetrics,
  patientsParSupParMois,
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
  const careStaff = getCareStaffCosts();
  const careCosts = getCareCostsActuels(state);
  const careMargin = getCareMarginActuelle(state);
  const breakEvens = getBreakEvenScenarios(state);
  const productivity = getProductivityMetrics(state);
  const aiGains = getAIGainsMetrics(k.aiLogs);
  const timeScenarios = getTimeScenarioMetrics(state);

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

          {/* Productivité superviseur */}
          <Card>
            <CardHeader
              title="Productivité superviseur"
              subtitle="Dérivé prototype — les temps réels seront mesurés en pilote."
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                [
                  "Patients actifs / sup",
                  productivity.patientsParSuperviseuseMoyenne,
                ],
                [
                  "Patients suivis / sup / mois",
                  productivity.patientsSuivisParSupMoisMoyenne,
                ],
                [
                  "Messages traités / sup",
                  productivity.messagesTraitesParSupMoyenne,
                ],
                ["CR préparés / sup", productivity.crPreparesParSupMoyenne],
                [
                  "Transmissions cabinet / sup",
                  productivity.transmissionsParSupMoyenne,
                ],
                [
                  "Capacité actuelle",
                  `${productivity.capaciteActuellePatients} pat. / sup`,
                ],
                [
                  "Capacité cible V1",
                  `${productivity.capaciteCiblePatients} pat. / sup`,
                ],
                ["Patients lourds", "À classifier V1"],
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
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[11.5px] leading-relaxed text-charcoal/60">
              <span className="font-medium text-navy-900">À mesurer en pilote :</span>{" "}
              temps moyen / patient · temps moyen / CR · temps moyen /
              transmission cabinet · taux patients simples vs lourds.
            </div>
          </Card>

          {/* Gains IA & automation */}
          <Card>
            <CardHeader
              title="Gains IA & automation"
              subtitle="IA assistive — validation humaine systématique. Aucune décision médicale automatisée."
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                ["Propositions IA", aiGains.propositionsTotal],
                ["Acceptées", aiGains.acceptees],
                ["Modifiées par humain", aiGains.modifiees],
                ["Refusées", aiGains.refusees],
                [
                  "Taux validation humaine",
                  aiGains.tauxValidationHumaine > 0
                    ? `${Math.round(aiGains.tauxValidationHumaine * 100)} %`
                    : "—",
                ],
                ["Messages programmés", "Prototype — voir fiche patient"],
                ["Templates utilisés", "Prototype — voir fiche patient"],
                ["Gain temps estimé", "À mesurer en pilote"],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-[14.5px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[11.5px] leading-relaxed text-charcoal/60">
              <span className="font-medium text-navy-900">À mesurer en pilote :</span>{" "}
              temps CR sans / avec IA · minutes économisées par CR · minutes
              économisées par patient.
            </div>
          </Card>

          {/* Temps humain par patient — baseline terrain + scénarios */}
          <Card>
            <CardHeader
              title="Temps humain par patient"
              subtitle={`Baseline terrain V0 : ${ADMIN_CONSTANTS.MANUAL_BASELINE_MINUTES_PER_PATIENT_LOW}–${ADMIN_CONSTANTS.MANUAL_BASELINE_MINUTES_PER_PATIENT_HIGH} min/patient sur ${ADMIN_CONSTANTS.FOLLOW_UP_DURATION_DAYS_MIN}–${ADMIN_CONSTANTS.FOLLOW_UP_DURATION_DAYS_MAX} jours de suivi. Mode manuel WhatsApp/audio, sans interface ni IA.`}
              action={
                <Badge className={DATA_CATEGORY_STYLES.hypothese}>
                  {DATA_CATEGORY_LABELS.hypothese}
                </Badge>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-navy-900/[0.05] text-left text-[10px] uppercase tracking-[0.14em] text-charcoal/55">
                    <th className="px-5 py-2.5 font-medium">Scénario</th>
                    <th className="px-5 py-2.5 font-medium">Min / patient</th>
                    <th className="px-5 py-2.5 font-medium">
                      Capacité dérivée
                    </th>
                    <th className="px-5 py-2.5 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {timeScenarios.map((t) => (
                    <tr
                      key={t.scenario.key}
                      className="border-b border-navy-900/[0.04]"
                    >
                      <td className="px-5 py-2.5">
                        <p className="font-medium tracking-tight text-navy-900">
                          {t.scenario.label}
                        </p>
                        <p className="mt-0.5 text-[10.5px] leading-relaxed text-charcoal/55">
                          {t.scenario.hint}
                        </p>
                      </td>
                      <td className="px-5 py-2.5 font-mono text-navy-900">
                        {t.scenario.minMinutesPerPatient}–
                        {t.scenario.maxMinutesPerPatient} min
                      </td>
                      <td className="px-5 py-2.5 font-mono text-charcoal/70">
                        {t.capaciteMin}–{t.capaciteMax} pat. / sup / mois
                      </td>
                      <td className="px-5 py-2.5">
                        <Badge
                          className={
                            productivitySourceStyles[t.scenario.sourceType]
                          }
                        >
                          {productivitySourceLabels[t.scenario.sourceType]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[11.5px] leading-relaxed text-charcoal/60">
              <span className="font-medium text-navy-900">
                Capacité dérivée :
              </span>{" "}
              ({ADMIN_CONSTANTS.SUPERVISOR_PRODUCTIVE_HOURS_PER_MONTH} h
              productives/mois × 60) / minutes par patient.{" "}
              <span className="text-charcoal/55">
                Baseline historique = donnée terrain (17 ans d'expérience).
                Gains V1/V2 = hypothèses à mesurer en pilote, jamais promesses.
              </span>
            </div>
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

          {/* Coûts care par rôle */}
          <Card>
            <CardHeader
              title="Coûts care par rôle"
              subtitle={`${careStaff.countByCostType.renseigne} renseigné(s) · ${careStaff.countByCostType.hypothese} hypothèse(s) · ${careStaff.countByCostType.a_valider} à valider`}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-navy-900/[0.05] text-left text-[10px] uppercase tracking-[0.14em] text-charcoal/55">
                    <th className="px-5 py-2.5 font-medium">Poste</th>
                    <th className="px-5 py-2.5 font-medium">Rôle</th>
                    <th className="px-5 py-2.5 font-medium">Coût mensuel</th>
                    <th className="px-5 py-2.5 font-medium">Type</th>
                    <th className="px-5 py-2.5 font-medium">Statut</th>
                    <th className="px-5 py-2.5 font-medium">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {careStaff.members.map((m) => (
                    <tr
                      key={m.id}
                      className={`border-b border-navy-900/[0.04] ${
                        m.active ? "" : "opacity-60"
                      }`}
                    >
                      <td className="px-5 py-2.5">
                        <p className="font-medium tracking-tight text-navy-900">
                          {m.label}
                        </p>
                        {m.note && (
                          <p className="mt-0.5 text-[10.5px] text-charcoal/55">
                            {m.note}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-2.5 text-charcoal/65">
                        {m.customRoleLabel ?? careRoleLabels[m.role]}
                      </td>
                      <td className="px-5 py-2.5 font-medium text-navy-900">
                        {formatEur(m.monthlyCompanyCost)}
                      </td>
                      <td className="px-5 py-2.5">
                        <Badge className={costTypeStyles[m.costType]}>
                          {costTypeLabels[m.costType]}
                        </Badge>
                      </td>
                      <td className="px-5 py-2.5 text-charcoal/65">
                        {m.active ? "Actif" : "Non activé"}
                      </td>
                      <td className="px-5 py-2.5 text-[10.5px] text-charcoal/55">
                        {[
                          m.capacityContribution && "capacité",
                          m.managementContribution && "management",
                          m.qualityContribution && "qualité",
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[12px] tracking-tight text-charcoal/70">
              <span className="font-medium text-navy-900">
                Coût care staff actif :
              </span>{" "}
              {formatEur(careStaff.totalActiveMonthlyCost)} / mois ·{" "}
              <span className="text-charcoal/55">
                {careStaff.byRoleActive.supervisor} superviseuse(s) ·{" "}
                {careStaff.byRoleActive.lead_supervisor} lead ·{" "}
                {careStaff.byRoleActive.head_of_care} HoC ·{" "}
                {careStaff.byRoleActive.qa_care} QA
              </span>
            </div>
          </Card>

          {/* Unit economics care */}
          <Card>
            <CardHeader
              title="Unit economics care — simulation"
              subtitle={`Calcul honnête à partir des coûts renseignés + hypothèses prototype (outils ${ADMIN_CONSTANTS.COUT_OUTILS_CARE_PAR_PATIENT_EUR} € / patient · messagerie ${ADMIN_CONSTANTS.COUT_MESSAGERIE_PATIENT_EUR} € / patient).`}
              action={
                <Badge className={DATA_CATEGORY_STYLES.estime}>Simulation</Badge>
              }
            />
            <div className="grid grid-cols-2 gap-px bg-navy-900/[0.04] sm:grid-cols-4">
              {[
                ["Revenu / patient activé", formatEur(fin.revenuMoyenParPatient)],
                ["Revenu / chirurgien", formatEur(fin.revenuMoyenParChirurgien)],
                ["Coût care staff", formatEur(careCosts.staffCost)],
                ["Coût direct patient", formatEur(careCosts.directPatientCost)],
                ["Coût outils care", formatEur(careCosts.toolsCost)],
                ["Coût messagerie", formatEur(careCosts.messagingCost)],
                ["Coût care total", formatEur(careCosts.totalCost)],
                [
                  "Marge care / patient",
                  careCosts.patientCount > 0
                    ? formatEur(Math.round(careMargin.margePatientEur))
                    : "—",
                ],
              ].map(([label, value]) => (
                <div key={String(label)} className="bg-white px-4 py-3.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                    {label}
                  </p>
                  <p className="mt-1.5 font-display text-[15px] font-medium tracking-tight text-navy-900">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal/55">
                  Marge care actuelle — faible volume
                </p>
                <p
                  className={`font-display text-[20px] font-medium tracking-tight ${
                    careMargin.margeCareEur >= 0
                      ? "text-teal-700"
                      : "text-amber-900"
                  }`}
                >
                  {formatEur(Math.round(careMargin.margeCareEur))}
                </p>
                <p className="text-[12px] tracking-tight text-charcoal/65">
                  ({formatPct(careMargin.margeCarePercent, 1)})
                </p>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-charcoal/55">
                Non représentative à ce stade : faible volume vs coûts care
                fixes. Voir Point d'équilibre ci-dessous pour la sensibilité.
              </p>
            </div>
          </Card>

          {/* Point d'équilibre care */}
          <Card>
            <CardHeader
              title="Point d'équilibre care"
              subtitle={`Sensibilité productivité superviseur à volume cible (${breakEvens[0].patientsTotal} patients / mois).`}
              action={
                <Badge className={DATA_CATEGORY_STYLES.hypothese}>
                  {DATA_CATEGORY_LABELS.hypothese}
                </Badge>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-navy-900/[0.05] text-left text-[10px] uppercase tracking-[0.14em] text-charcoal/55">
                    <th className="px-5 py-2.5 font-medium">Scénario</th>
                    <th className="px-5 py-2.5 font-medium">Pat. / sup</th>
                    <th className="px-5 py-2.5 font-medium">Sup requises</th>
                    <th className="px-5 py-2.5 font-medium">Coût sup</th>
                    <th className="px-5 py-2.5 font-medium">Coût care total</th>
                    <th className="px-5 py-2.5 font-medium">Marge care</th>
                  </tr>
                </thead>
                <tbody>
                  {breakEvens.map((b) => (
                    <tr
                      key={b.scenario.key}
                      className="border-b border-navy-900/[0.04]"
                    >
                      <td className="px-5 py-2.5">
                        <p className="font-medium tracking-tight text-navy-900">
                          {b.scenario.label}
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-charcoal/55">
                          {b.scenario.hint}
                        </p>
                      </td>
                      <td className="px-5 py-2.5 font-mono text-navy-900">
                        {b.scenario.patientsPerSupervisor}
                      </td>
                      <td className="px-5 py-2.5 text-charcoal/65">
                        {b.superviseursRequis}
                      </td>
                      <td className="px-5 py-2.5 text-charcoal/65">
                        {formatEur(b.coutSuperviseurs)}
                      </td>
                      <td className="px-5 py-2.5 text-charcoal/65">
                        {formatEur(b.coutCareTotal)}
                      </td>
                      <td
                        className={`px-5 py-2.5 font-medium tracking-tight ${
                          b.margeCareEur >= 0
                            ? "text-teal-700"
                            : "text-amber-900"
                        }`}
                      >
                        {formatEur(b.margeCareEur)} ({formatPct(b.margeCarePercent, 0)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[11.5px] leading-relaxed text-charcoal/60">
              <span className="font-medium text-navy-900">
                Lecture pilote :
              </span>{" "}
              le point d'équilibre dépend de la productivité réelle par
              superviseuse, à valider en pilote avec données mesurées (temps,
              ratio patients simples/lourds, gain IA).
            </div>
          </Card>

          {/* Point d'équilibre par temps humain — modélisation Mélanie */}
          <Card>
            <CardHeader
              title="Point d'équilibre par temps humain"
              subtitle={`Lecture dérivée du temps humain par patient. Volume cible : ${timeScenarios[0].patientsTotal} patients/mois. Baseline terrain ${ADMIN_CONSTANTS.MANUAL_BASELINE_MINUTES_PER_PATIENT_LOW}–${ADMIN_CONSTANTS.MANUAL_BASELINE_MINUTES_PER_PATIENT_HIGH} min/patient (donnée historique).`}
              action={
                <Badge className={DATA_CATEGORY_STYLES.hypothese}>
                  {DATA_CATEGORY_LABELS.hypothese}
                </Badge>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-navy-900/[0.05] text-left text-[10px] uppercase tracking-[0.14em] text-charcoal/55">
                    <th className="px-5 py-2.5 font-medium">Scénario</th>
                    <th className="px-5 py-2.5 font-medium">Min / patient</th>
                    <th className="px-5 py-2.5 font-medium">Sup requises</th>
                    <th className="px-5 py-2.5 font-medium">Coût sup</th>
                    <th className="px-5 py-2.5 font-medium">Marge care</th>
                  </tr>
                </thead>
                <tbody>
                  {timeScenarios.map((t) => (
                    <tr
                      key={t.scenario.key}
                      className="border-b border-navy-900/[0.04]"
                    >
                      <td className="px-5 py-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium tracking-tight text-navy-900">
                            {t.scenario.label}
                          </p>
                          <Badge
                            className={
                              productivitySourceStyles[t.scenario.sourceType]
                            }
                          >
                            {productivitySourceLabels[t.scenario.sourceType]}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-5 py-2.5 font-mono text-charcoal/70">
                        {t.scenario.minMinutesPerPatient}–
                        {t.scenario.maxMinutesPerPatient}
                      </td>
                      <td className="px-5 py-2.5 font-mono text-charcoal/70">
                        {t.superviseursRequisMin}–{t.superviseursRequisMax}
                      </td>
                      <td className="px-5 py-2.5 text-charcoal/65">
                        {formatEur(t.coutSuperviseursMin)} –{" "}
                        {formatEur(t.coutSuperviseursMax)}
                      </td>
                      <td className="px-5 py-2.5 font-medium tracking-tight">
                        <span
                          className={
                            t.margeCareMaxEur >= 0
                              ? "text-teal-700"
                              : "text-amber-900"
                          }
                        >
                          {formatPct(t.margeCareMaxPercent, 0)}
                        </span>
                        {" / "}
                        <span
                          className={
                            t.margeCareMinEur >= 0
                              ? "text-teal-700"
                              : "text-amber-900"
                          }
                        >
                          {formatPct(t.margeCareMinPercent, 0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-navy-900/[0.05] px-5 py-3 text-[11.5px] leading-relaxed text-charcoal/60">
              <span className="font-medium text-navy-900">Lecture :</span>{" "}
              colonne marge care = (min / patient le plus rapide) /{" "}
              (min / patient le plus lent). La marge care dépend directement du
              temps humain : interface + IA + automation peuvent la faire
              basculer du négatif au positif. Hypothèses à mesurer en pilote,
              jamais promesses.
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
                "patients, statuts, CR, transmissions, superviseurs, prospects, propositions IA, taux validation humaine",
              ],
              [
                "estime",
                "MRR, ARR, marge brute prototype, marge care simulée, capacité utilisée et projetée",
              ],
              [
                "hypothese",
                `capacité superviseur, coûts care par poste, coût outils care, coût messagerie patient, volume cible, heures productives / mois. Baseline terrain V0 (${ADMIN_CONSTANTS.MANUAL_BASELINE_MINUTES_PER_PATIENT_LOW}–${ADMIN_CONSTANTS.MANUAL_BASELINE_MINUTES_PER_PATIENT_HIGH} min/patient) = donnée historique opérationnelle. Scénarios V1/V2 = hypothèses à mesurer.`,
              ],
              [
                "v1",
                "temps humain total / patient · temps CR · temps transmission cabinet · temps relance · ratio patients simples/lourds · gain interface réel · gain IA réel · capacité réelle superviseuse · coûts care réels (WhatsApp, outils, QA, Head of Care). Churn, CAC, payback, runway.",
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
        {/* Bilan coûts care */}
        <div className="border-t border-navy-900/[0.05] px-6 py-3 text-[11.5px] tracking-tight text-charcoal/65">
          <span className="font-medium text-navy-900">Coûts care :</span>{" "}
          {careStaff.countByCostType.renseigne} renseigné(s) ·{" "}
          {careStaff.countByCostType.hypothese} hypothèse(s) ·{" "}
          {careStaff.countByCostType.a_valider} à valider.
        </div>
      </Card>
    </Shell>
  );
}
