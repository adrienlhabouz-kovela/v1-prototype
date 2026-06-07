import type { ConceptStat, ProgressState, Question } from "@/lib/types";

const DAY = 24 * 60 * 60 * 1000;

/** Intervalles de répétition espacée (ms) selon le nombre de réussites d'affilée. */
const INTERVALS = [0, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY];

/** Met à jour la stat d'un concept après une réponse. */
export function recordConcept(
  stats: Record<string, ConceptStat>,
  concept: string,
  correct: boolean,
  now = Date.now(),
): Record<string, ConceptStat> {
  const prev: ConceptStat =
    stats[concept] ?? {
      concept,
      seen: 0,
      correct: 0,
      wrong: 0,
      lastSeen: 0,
      dueAt: now,
    };

  const streak = correct ? Math.min(prev.correct + 1, INTERVALS.length - 1) : 0;
  const next: ConceptStat = {
    concept,
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
    wrong: prev.wrong + (correct ? 0 : 1),
    lastSeen: now,
    // En cas d'erreur, on reverra ce concept très vite (le lendemain).
    dueAt: now + (correct ? INTERVALS[streak] : INTERVALS[1]),
  };
  return { ...stats, [concept]: next };
}

/** Taux de maîtrise d'un concept (0..1). */
export function mastery(stat: ConceptStat): number {
  if (stat.seen === 0) return 0;
  return stat.correct / stat.seen;
}

/** Concepts les plus fragiles (taux de réussite le plus bas, vus au moins une fois). */
export function weakestConcepts(
  state: ProgressState,
  limit = 4,
): { concept: string; rate: number; wrong: number }[] {
  return Object.values(state.concepts)
    .filter((c) => c.seen > 0)
    .map((c) => ({ concept: c.concept, rate: mastery(c), wrong: c.wrong }))
    .filter((c) => c.rate < 0.75 || c.wrong > 0)
    .sort((a, b) => a.rate - b.rate || b.wrong - a.wrong)
    .slice(0, limit);
}

/** Concepts dus à révision (répétition espacée). */
export function dueConcepts(state: ProgressState, now = Date.now()): string[] {
  return Object.values(state.concepts)
    .filter((c) => c.seen > 0 && c.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt)
    .map((c) => c.concept);
}

/**
 * Réordonne un lot de questions : on remonte d'abord les questions touchant
 * des concepts fragiles ou dus à révision. Rend les sessions adaptatives.
 */
export function prioritizeQuestions(
  questions: Question[],
  state: ProgressState,
  now = Date.now(),
): Question[] {
  const due = new Set(dueConcepts(state, now));
  const weak = new Set(weakestConcepts(state, 8).map((c) => c.concept));
  const score = (q: Question) =>
    (weak.has(q.concept) ? 2 : 0) + (due.has(q.concept) ? 1 : 0);
  return [...questions].sort((a, b) => score(b) - score(a));
}
