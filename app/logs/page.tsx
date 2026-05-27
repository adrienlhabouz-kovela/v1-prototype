"use client";

import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Badge, Card, DoctrineNote } from "@/components/ui";
import { useKovela } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import type { AiDecision, AiFunction, LogKind } from "@/lib/types";

const logKindLabel: Record<LogKind, string> = {
  patient_attribue: "Patient attribué",
  message_envoye: "Message envoyé",
  cr_prepare: "CR préparé",
  cr_valide: "CR validé",
  cr_disponible: "CR disponible",
  ia_utilisee: "IA utilisée",
  ia_suggestion: "Suggestion IA",
  escalade_transmise: "Escalade transmise",
  onboarding_complete: "Onboarding complété",
  patient_relance: "Patient relancé",
  suivi_cloture: "Suivi clôturé",
  note_interne: "Note interne",
};

const logKindStyle: Partial<Record<LogKind, string>> = {
  ia_utilisee: "bg-teal-50 text-teal-700 ring-teal-200",
  ia_suggestion: "bg-teal-50 text-teal-700 ring-teal-200",
  escalade_transmise: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  cr_disponible: "bg-sky-50 text-sky-700 ring-sky-200",
  cr_valide: "bg-sky-50 text-sky-700 ring-sky-200",
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

export default function LogsPage() {
  const k = useKovela();
  const [tab, setTab] = useState<"ops" | "ia">("ops");

  const patientName = (id?: string) =>
    id ? k.patients.find((p) => p.id === id)?.name ?? id : "—";

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900">Logs</h1>
        <p className="text-sm text-charcoal/55">
          Traçabilité opérationnelle. Logs fictifs de démonstration.
        </p>
      </div>

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
                {k.logs.map((l) => (
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
