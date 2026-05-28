"use client";

import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { Badge, Button, Card, CardHeader, DoctrineNote, PageHeader, SectionTitle, StatCard } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { aiEstimatedMinutes, formatMinutes } from "@/lib/ai";
import {
  formationLabels,
  formationStyles,
  qualityLabels,
  qualityStyles,
} from "@/lib/format";
import { seedConversationsToReview, seedCRsToControl } from "@/lib/mock-data";

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// Délai patient → première réponse non-patient suivante (en heures).
function patientResponseDelaysH(messages: { author: string; at: string }[]): number[] {
  const ds: number[] = [];
  for (let i = 0; i < messages.length - 1; i++) {
    if (messages[i].author === "patient" && messages[i + 1].author !== "patient") {
      const dt = (new Date(messages[i + 1].at).getTime() - new Date(messages[i].at).getTime()) / 36e5;
      if (dt >= 0) ds.push(dt);
    }
  }
  return ds;
}

export default function SupervisionPage() {
  const k = useKovela();
  // Toggles locaux pour la démo qualité (OK / à revoir), initialisés depuis le seed.
  const [convStatuses, setConvStatuses] = useState<Record<string, "a_relire" | "ok" | "a_revoir">>(
    () => Object.fromEntries(seedConversationsToReview.map((c) => [c.id, c.status]))
  );
  const [crStatuses, setCrStatuses] = useState<Record<string, "a_controler" | "ok" | "a_revoir">>(
    () => Object.fromEntries(seedCRsToControl.map((c) => [c.id, c.status]))
  );

  const patients = k.patients;
  const aiLogs = k.aiLogs;

  // KPIs globaux
  const global = useMemo(() => {
    const followed = patients.filter((p) => p.onboardingComplete && p.planningStatus !== "annule");
    const actifs = followed.filter((p) => p.status !== "cloture").length;
    const treated = patients.reduce((acc, p) => acc + p.messages.filter((m) => m.treated).length, 0);
    const untreated = patients.reduce(
      (acc, p) => acc + p.messages.filter((m) => m.author === "patient" && !m.treated).length,
      0
    );
    const allDelays = patients.flatMap((p) => patientResponseDelaysH(p.messages));
    const delayH = avg(allDelays);
    const reports = k.reports;
    const crFinalises = reports.filter((r) => r.status === "valide" || r.status === "disponible").length;
    const crEnRetard = patients.filter((p) => p.status === "cr_en_attente").length;
    const escalades = k.escalations.filter((e) => e.status === "transmise").length;
    const accepted = aiLogs.filter((l) => l.decision === "accepte").length;
    const modified = aiLogs.filter((l) => l.decision === "modifie").length;
    const refused = aiLogs.filter((l) => l.decision === "refuse").length;
    const proposes = aiLogs.filter((l) => l.decision === "propose");
    const minutesSaved = proposes.reduce((acc, l) => acc + aiEstimatedMinutes(l.fn), 0);
    return {
      supervisors: k.supervisors.length,
      actifs,
      treated,
      untreated,
      delayH,
      crFinalises,
      crEnRetard,
      escalades,
      accepted,
      modified,
      refused,
      minutesSaved,
    };
  }, [patients, aiLogs, k.reports, k.escalations, k.supervisors.length]);

  const convToReviewCount = Object.values(convStatuses).filter((s) => s === "a_relire").length;
  const crToControlCount = Object.values(crStatuses).filter((s) => s === "a_controler").length;

  // Tableau superviseurs
  const supervisorRows = useMemo(() => {
    return k.supervisors.map((s) => {
      const assigned = patients.filter((p) => p.supervisorId === s.id);
      const actifs = assigned.filter((p) => p.status !== "cloture").length;
      const treated = assigned.reduce((acc, p) => acc + p.messages.filter((m) => m.treated).length, 0);
      const untreated = assigned.reduce(
        (acc, p) => acc + p.messages.filter((m) => m.author === "patient" && !m.treated).length,
        0
      );
      const delays = assigned.flatMap((p) => patientResponseDelaysH(p.messages));
      const delayH = avg(delays);
      const reports = k.reports.filter((r) => assigned.some((p) => p.id === r.patientId));
      const crFinalises = reports.filter((r) => r.status === "valide" || r.status === "disponible").length;
      const crEnRetard = assigned.filter((p) => p.status === "cr_en_attente").length;
      const escalades = k.escalations.filter(
        (e) => e.status === "transmise" && assigned.some((p) => p.id === e.patientId)
      ).length;
      const assignedIds = new Set(assigned.map((p) => p.id));
      const supLogs = aiLogs.filter((l) => l.patientId && assignedIds.has(l.patientId));
      const usage = supLogs.filter((l) => l.decision === "propose").length;
      const ac = supLogs.filter((l) => l.decision === "accepte").length;
      const mo = supLogs.filter((l) => l.decision === "modifie").length;
      const re = supLogs.filter((l) => l.decision === "refuse").length;
      const minutes = supLogs
        .filter((l) => l.decision === "propose")
        .reduce((acc, l) => acc + aiEstimatedMinutes(l.fn), 0);
      return { sup: s, actifs, treated, untreated, delayH, crFinalises, crEnRetard, escalades, usage, ac, mo, re, minutes };
    });
  }, [k.supervisors, patients, k.reports, k.escalations, aiLogs]);

  const patientName = (id: string) => patients.find((p) => p.id === id)?.name ?? id;
  const supName = (id: string) => k.supervisors.find((s) => s.id === id)?.name ?? id;

  const reviewBadgeStyle: Record<string, string> = {
    a_relire: "bg-amber-50/70 text-amber-700 ring-amber-100",
    a_controler: "bg-amber-50/70 text-amber-700 ring-amber-100",
    ok: "bg-teal-50 text-teal-700 ring-teal-100",
    a_revoir: "bg-navy-50 text-navy-700 ring-navy-100",
  };
  const reviewLabel: Record<string, string> = {
    a_relire: "À relire",
    a_controler: "À contrôler",
    ok: "OK",
    a_revoir: "À revoir",
  };

  function markConv(id: string, status: "ok" | "a_revoir", label: string) {
    setConvStatuses((prev) => ({ ...prev, [id]: status }));
    k.logQualityReview(`Conversation — ${label}`, status);
  }
  function markCr(id: string, status: "ok" | "a_revoir", label: string) {
    setCrStatuses((prev) => ({ ...prev, [id]: status }));
    k.logQualityReview(`CR — ${label}`, status);
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Head of Care"
        title="Supervision & qualité"
        subtitle="Pilotage de la charge, de la qualité de traitement, de la formation et de l'usage de l'IA assistive."
      />

      <DoctrineNote className="mb-6" />

      {/* KPIs globaux */}
      <SectionTitle hint="Vue d'ensemble — indicateurs opérationnels">Indicateurs globaux</SectionTitle>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Superviseurs actifs" value={global.supervisors} />
        <StatCard label="Patients actifs suivis" value={global.actifs} />
        <StatCard label="Messages traités" value={global.treated} />
        <StatCard label="Messages non traités" value={global.untreated} />
        <StatCard label="Délai moyen de traitement" value={`${global.delayH.toFixed(1)} h`} />
        <StatCard label="CR finalisés" value={global.crFinalises} />
        <StatCard label="CR en retard" value={global.crEnRetard} />
        <StatCard label="Escalades transmises" value={global.escalades} />
        <StatCard label="IA — acceptées" value={global.accepted} />
        <StatCard label="IA — modifiées" value={global.modified} />
        <StatCard label="IA — refusées" value={global.refused} />
        <StatCard
          label="Temps estimé gagné (IA)"
          value={formatMinutes(global.minutesSaved)}
          accent
          hint="Estimation prototype"
        />
        <StatCard label="Conversations à relire" value={convToReviewCount} />
        <StatCard label="CR à contrôler" value={crToControlCount} />
      </div>

      {/* Tableau superviseurs */}
      <div className="mt-8">
        <SectionTitle hint="Indicateurs opérationnels par superviseur">Tableau superviseurs</SectionTitle>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-900/[0.06] text-left text-[11px] uppercase tracking-[0.08em] text-charcoal/45">
                  <th className="px-5 py-3.5 font-medium">Superviseur</th>
                  <th className="px-5 py-3.5 font-medium">Statut</th>
                  <th className="px-5 py-3.5 font-medium">Patients actifs</th>
                  <th className="px-5 py-3.5 font-medium">Msg. traités</th>
                  <th className="px-5 py-3.5 font-medium">Non traités</th>
                  <th className="px-5 py-3.5 font-medium">Délai moyen</th>
                  <th className="px-5 py-3.5 font-medium">CR finalisés</th>
                  <th className="px-5 py-3.5 font-medium">CR en retard</th>
                  <th className="px-5 py-3.5 font-medium">Escalades</th>
                  <th className="px-5 py-3.5 font-medium">Usage IA</th>
                  <th className="px-5 py-3.5 font-medium">IA A/M/R</th>
                  <th className="px-5 py-3.5 font-medium">Temps gagné</th>
                  <th className="px-5 py-3.5 font-medium">Formation</th>
                  <th className="px-5 py-3.5 font-medium">Qualité</th>
                </tr>
              </thead>
              <tbody>
                {supervisorRows.map((r) => (
                  <tr key={r.sup.id} className="border-b border-navy-900/[0.04] hover:bg-teal-50/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[11px] font-semibold text-white">
                          {r.sup.initials}
                        </span>
                        <span className="font-medium text-navy-900">{r.sup.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={formationStyles[r.sup.formationStatus]}>
                        {r.sup.formationStatus === "pret" ? "Actif" : r.sup.formationStatus === "en_cours" ? "En formation" : "À former"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-navy-900">{r.actifs}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{r.treated}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{r.untreated}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{r.delayH ? `${r.delayH.toFixed(1)} h` : "—"}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{r.crFinalises}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{r.crEnRetard}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{r.escalades}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">{r.usage}</td>
                    <td className="px-5 py-3.5 text-charcoal/70">
                      {r.ac}/{r.mo}/{r.re}
                    </td>
                    <td className="px-5 py-3.5 text-teal-700">{formatMinutes(r.minutes)}</td>
                    <td className="px-5 py-3.5">
                      <Badge className={formationStyles[r.sup.formationStatus]}>
                        {formationLabels[r.sup.formationStatus]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge className={qualityStyles[r.sup.qualityStatus]}>
                        {qualityLabels[r.sup.qualityStatus]}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Revue qualité */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Conversations à relire" subtitle="Échantillonnage qualité — démonstratif" />
          <div className="divide-y divide-navy-900/[0.05]">
            {seedConversationsToReview.map((c) => {
              const st = convStatuses[c.id];
              return (
                <div key={c.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{patientName(c.patientId)}</p>
                      <p className="text-xs text-charcoal/55">Superviseur : {supName(c.supervisorId)}</p>
                    </div>
                    <Badge className={reviewBadgeStyle[st]}>{reviewLabel[st]}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-charcoal/70">Raison : {c.reason}</p>
                  <p className="mt-1 text-xs italic text-charcoal/55">« {c.comment} »</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="subtle" onClick={() => markConv(c.id, "ok", patientName(c.patientId))}>
                      Marquer OK
                    </Button>
                    <Button variant="subtle" onClick={() => markConv(c.id, "a_revoir", patientName(c.patientId))}>
                      Marquer à revoir
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="CR à contrôler" subtitle="Contrôle qualité — démonstratif" />
          <div className="divide-y divide-navy-900/[0.05]">
            {seedCRsToControl.map((c) => {
              const st = crStatuses[c.id];
              return (
                <div key={c.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-navy-900">{patientName(c.patientId)}</p>
                      <p className="text-xs text-charcoal/55">Superviseur : {supName(c.supervisorId)}</p>
                    </div>
                    <Badge className={reviewBadgeStyle[st]}>{reviewLabel[st]}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-charcoal/70">{c.lastAction}</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="subtle" onClick={() => markCr(c.id, "ok", patientName(c.patientId))}>
                      Marquer OK
                    </Button>
                    <Button variant="subtle" onClick={() => markCr(c.id, "a_revoir", patientName(c.patientId))}>
                      Marquer à revoir
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Socle qualité KOVELA */}
      <div className="mt-8">
        <SectionTitle hint="Préparation à une organisation qualité structurée">Socle qualité KOVELA</SectionTitle>
        <Card className="p-5">
          <p className="mb-4 text-sm text-charcoal/65">
            KOVELA s'inspire d'une démarche qualité et prépare une organisation structurée : socle
            documentaire, revue qualité, amélioration continue.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Procédures", "Procédures internes documentées (mise en place cabinet, supervision, escalade, CR)."],
              ["Formation superviseur", "Checklist de démarrage, règles KOVELA, lexique, cas pratiques, quiz."],
              ["Logs", "Traçabilité opérationnelle de chaque action humaine et IA."],
              ["Revue qualité", "Échantillonnage des conversations et des CR par le Head of Care."],
              ["Contrôle des CR", "Gating brouillon → validé en interne → disponible pour le chirurgien."],
              ["Gestion des incidents opérationnels", "Identification, suivi et résolution (à formaliser)."],
              ["Traçabilité", "Logs immuables prévus à l'architecture cible."],
              ["Amélioration continue", "Boucle de retour Head of Care → superviseurs → formation."],
              ["Documentation interne", "Socle documentaire opéré par l'équipe KOVELA."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl bg-white p-4 ring-1 ring-navy-900/[0.05]">
                <p className="text-sm font-semibold text-navy-900">{t}</p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/60">{d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-charcoal/45">
            Architecture cible — préparation à une organisation qualité structurée. Aucune certification revendiquée à ce stade.
          </p>
        </Card>
      </div>
    </Shell>
  );
}
