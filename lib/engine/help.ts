// ─────────────────────────────────────────────────────────────────────────
// Aide contextuelle progressive — Cap au Vent
//
// Règle produit : l'utilisateur ne reste jamais bloqué. On dévoile l'aide par
// paliers : indice 1 → indice 2 → explication pédagogique → réponse complète
// (en dernier recours). Les indices peuvent être rédigés sur la question
// (`question.hints`) ; sinon on génère un repli utile à partir du concept et du
// type de question. L'explication (`question.explanation`) existe pour toutes
// les questions, et la réponse est dérivée du type de question.
// ─────────────────────────────────────────────────────────────────────────

import type { ProgressState, Question } from "@/lib/types";
import { BOAT_ZONES, conceptLabel } from "@/lib/content/modules";

export type HelpTierKind = "hint" | "explanation" | "answer";

export interface HelpTier {
  kind: HelpTierKind;
  /** Libellé du niveau (ex. « Indice 1 »). */
  label: string;
  body: string;
}

/** Indices de repli selon le type de question (jamais bloquant). */
function fallbackSecondHint(q: Question): string {
  switch (q.kind) {
    case "qcm":
    case "chooseSail":
    case "chooseManeuver":
    case "goNoGo":
      return "Élimine d'abord les options qui te semblent clairement fausses, il en restera peu.";
    case "trueFalse":
      return "Demande-toi si l'affirmation est toujours vraie, ou seulement dans certains cas.";
    case "windAngle":
      return "Repère-toi : 0° = face au vent (zone interdite), 90° = vent de côté, 180° = vent arrière.";
    case "clickZone":
      return "Place-toi mentalement à bord, face à l'avant : repère l'avant, l'arrière et les deux côtés.";
    case "orderSteps":
      return "Commence par l'action de préparation et termine par celle qui stabilise la manœuvre.";
    default:
      return "Reprends calmement l'énoncé : la leçon contient toujours l'indice clé.";
  }
}

/** Réponse complète dérivée de la structure de la question. */
function answerFor(q: Question): string {
  switch (q.kind) {
    case "qcm":
    case "chooseSail":
    case "chooseManeuver":
    case "goNoGo": {
      const i = typeof q.correct === "number" ? q.correct : Array.isArray(q.correct) ? q.correct[0] : -1;
      return q.options?.[i] ?? "Voir l'explication ci-dessus.";
    }
    case "trueFalse":
      return q.answer ? "Vrai." : "Faux.";
    case "windAngle":
      return `Place le bateau à environ ${q.target}° du vent.`;
    case "clickZone": {
      const zone = BOAT_ZONES.find((z) => z.id === q.target);
      return zone ? `${zone.label} — ${zone.desc}` : "Voir l'explication ci-dessus.";
    }
    case "orderSteps":
      return (q.steps ?? []).map((s, i) => `${i + 1}. ${s}`).join("  ");
    default:
      return "Voir l'explication ci-dessus.";
  }
}

/** Construit les paliers d'aide d'une question. */
export function buildQuestionHelp(q: Question): HelpTier[] {
  const authored = q.hints ?? [];
  const hint1 =
    authored[0] ??
    `Cette question porte sur « ${conceptLabel(q.concept)} ». Repense à ce que la leçon en disait.`;
  const hint2 = authored[1] ?? fallbackSecondHint(q);

  return [
    { kind: "hint", label: "Indice 1", body: hint1 },
    { kind: "hint", label: "Indice 2", body: hint2 },
    { kind: "explanation", label: "Explication", body: q.explanation },
    { kind: "answer", label: "La réponse", body: answerFor(q) },
  ];
}

/** Concepts pour lesquels l'utilisateur a le plus demandé d'aide. */
export function topHelpConcepts(
  state: ProgressState,
  limit = 5,
): { concept: string; count: number }[] {
  return Object.entries(state.helpUsage ?? {})
    .map(([concept, count]) => ({ concept, count }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
