"use client";

import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Badge, Card, DoctrineNote, PageHeader } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import type { AiDecision, AiFunction, LogKind } from "@/lib/types";

const logKindLabel: Record<LogKind, string> = {
  patient_attribue: "Patient attribué",
  message_envoye: "Message envoyé",
  cr_prepare: "CR — brouillon préparé",
  cr_valide: "CR — validé en interne",
  cr_disponible: "CR — disponible pour le chirurgien",
  ia_utilisee: "IA utilisée",
  ia_suggestion: "Suggestion IA",
  compilation_preparee: "Compilation factuelle préparée",
  escalade_transmise: "Escalade transmise au chirurgien",
  onboarding_complete: "Onboarding complété",
  onboarding_envoye: "Lien onboarding envoyé",
  patient_relance: "Patient relancé",
  suivi_cloture: "Suivi clôturé",
  note_interne: "Note interne",
  planning_ajout: "Planning — ajout",
  planning_modifie: "Planning — modification",
  planning_reporte: "Planning — report",
  planning_annule: "Planning — annulation",
  planning_import: "Planning — import",
  cabinet_configure: "Cabinet — configuration",
  mandat_gocardless: "Mandat GoCardless (fictif)",
  assistante_invitee: "Assistante invitée",
  crm_prospect_cree: "CRM — prospect créé",
  crm_statut: "CRM — statut modifié",
  crm_note: "CRM — note ajoutée",
  crm_demo: "CRM — démo faite",
  crm_relance: "CRM — relance programmée",
  crm_onboarding_lance: "CRM — onboarding cabinet lancé",
  crm_active: "CRM — chirurgien actif",
  qualite_revue: "Qualité — revue",
  qualite_commentaire: "Qualité — commentaire",
  formation_completee: "Formation — complétée",
  consentement_patient: "Patient — consentements confirmés",
  signalement_cabinet: "Patient — signalement cabinet",
};

const logKindStyle: Partial<Record<LogKind, string>> = {
  ia_utilisee: "bg-teal-50 text-teal-700 ring-teal-100",
  ia_suggestion: "bg-teal-50 text-teal-700 ring-teal-100",
  compilation_preparee: "bg-amber-50/70 text-amber-700 ring-amber-100",
  escalade_transmise: "bg-navy-900 text-teal-100 ring-navy-900",
  cr_disponible: "bg-teal-50 text-teal-700 ring-teal-100",
  cr_valide: "bg-navy-50 text-navy-700 ring-navy-100",
};

const aiFnLabel: Record<AiFunction, string> = {
  resume_conversation: "Résumé conversation",
  preparation_cr: "Préparation CR",
  reformulation: "Reformulation",
  compilation_escalade: "Compilation escalade",
};

const aiDecisionStyle: Record<AiDecision, string> = {
  propose: "bg-navy-50 text-charcoal/70 ring-navy-100",
  accepte: "bg-teal-50 text-teal-700 ring-teal-200",
  modifie: "bg-amber-50 text-amber-700 ring-amber-200",
  refuse: "bg-rose-50 text-rose-700 ring-rose-200",
};

const aiDecisionLabel: Record<AiDecision, string> = {
  propose: "Proposée",
  accepte: "Acceptée",
  modifie: "Modifiée",
  refuse: "Refusée",
};

type OpsFilter = "all" | "ia" | "cr" | "escalade" | "patient" | "attribution" | "cabinet" | "crm" | "qualite";

const opsFilterKinds: Record<Exclude<OpsFilter, "all">, LogKind[]> = {
  ia: ["ia_utilisee", "ia_suggestion"],
  cr: ["cr_prepare", "cr_valide", "cr_disponible"],
  escalade: ["compilation_preparee", "escalade_transmise"],
  cabinet: ["cabinet_configure", "mandat_gocardless", "assistante_invitee"],
  crm: [
    "crm_prospect_cree",
    "crm_statut",
    "crm_note",
    "crm_demo",
    "crm_relance",
    "crm_onboarding_lance",
    "crm_active",
  ],
  qualite: ["qualite_revue", "qualite_commentaire", "formation_completee"],
  patient: [
    "message_envoye",
    "patient_relance",
    "suivi_cloture",
    "onboarding_complete",
    "onboarding_envoye",
    "note_interne",
    "consentement_patient",
    "signalement_cabinet",
    "planning_ajout",
    "planning_modifie",
    "planning_reporte",
    "planning_annule",
    "planning_import",
  ],
  attribution: ["patient_attribue"],
};

export default function LogsPage() {
  const k = useKovela();
  const [tab, setTab] = useState<"ops" | "ia">("ops");
  const [opsFilter, setOpsFilter] = useState<OpsFilter>("all");

  const patientName = (id?: string) =>
    id ? k.patients.find((p) => p.id === id)?.name ?? id : "—";

  const opsLogs =
    opsFilter === "all" ? k.logs : k.logs.filter((l) => opsFilterKinds[opsFilter].includes(l.kind));

  return (
    <Shell>
      <PageHeader
        eyebrow="Traçabilité"
        title="Logs"
        subtitle="Traçabilité opérationnelle. Logs fictifs de démonstration."
      />

      <DoctrineNote className="mb-6" />

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("ops")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "ops" ? "bg-navy-900 text-white" : "bg-white text-charcoal/70 ring-1 ring-navy-100"
          }`}
        >
          Logs opérationnels ({k.logs.length})
        </button>
        <button
          onClick={() => setTab("ia")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            tab === "ia" ? "bg-navy-900 text-white" : "bg-white text-charcoal/70 ring-1 ring-navy-100"
          }`}
        >
          Logs IA ({k.aiLogs.length})
        </button>
      </div>

      {tab === "ops" && (
        <div className="mb-3 flex flex-wrap gap-2">
          {([
            ["all", "Tous"],
            ["ia", "IA"],
            ["cr", "CR"],
            ["escalade", "Escalade"],
            ["patient", "Patient"],
            ["attribution", "Attribution"],
            ["cabinet", "Cabinet"],
            ["crm", "CRM"],
            ["qualite", "Qualité"],
          ] as [OpsFilter, string][]).map(([f, label]) => (
            <button
              key={f}
              onClick={() => setOpsFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                opsFilter === f
                  ? "bg-navy-900 text-white"
                  : "bg-white text-charcoal/65 ring-1 ring-navy-100 hover:bg-teal-50/50 hover:text-navy-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {tab === "ops" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-900/[0.06] text-left text-xs uppercase tracking-wide text-charcoal/45">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Détail</th>
                  <th className="px-4 py-3 font-medium">Patient</th>
                  <th className="px-4 py-3 font-medium">Utilisateur</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {opsLogs.map((l) => (
                  <tr key={l.id} className="border-b border-navy-900/[0.05]">
                    <td className="px-4 py-3">
                      <Badge className={logKindStyle[l.kind] ?? "bg-navy-50 text-charcoal/70 ring-navy-100"}>
                        {logKindLabel[l.kind]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-navy-900">{l.detail}</td>
                    <td className="px-4 py-3 text-charcoal/55">{patientName(l.patientId)}</td>
                    <td className="px-4 py-3 text-charcoal/55">{l.user}</td>
                    <td className="px-4 py-3 text-charcoal/45">{formatDateTime(l.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {k.aiLogs.length === 0 ? (
            <p className="p-8 text-center text-sm text-charcoal/45">
              Aucune fonction IA utilisée pour l'instant. Lancez un résumé, un CR ou une
              compilation depuis une fiche patient superviseur.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-900/[0.06] text-left text-xs uppercase tracking-wide text-charcoal/45">
                    <th className="px-4 py-3 font-medium">Fonction IA</th>
                    <th className="px-4 py-3 font-medium">Prompt</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Utilisateur</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {k.aiLogs.map((l) => (
                    <tr key={l.id} className="border-b border-navy-900/[0.05]">
                      <td className="px-4 py-3 font-medium text-navy-900">{aiFnLabel[l.fn]}</td>
                      <td className="px-4 py-3 text-charcoal/55">{l.promptVersion}</td>
                      <td className="px-4 py-3">
                        <Badge className={aiDecisionStyle[l.decision]}>{aiDecisionLabel[l.decision]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-charcoal/55">{patientName(l.patientId)}</td>
                      <td className="px-4 py-3 text-charcoal/55">{l.user}</td>
                      <td className="px-4 py-3 text-charcoal/45">{formatDateTime(l.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </Shell>
  );
}
