// ─────────────────────────────────────────────────────────────────────────
// Coach personnel — recommande quoi faire ensuite selon la progression.
// Transforme le dashboard en coach : 1 action principale, 2 secondaires, le
// « pourquoi maintenant », l'objectif du jour, les points faibles et une phrase
// motivante adaptée au profil (Adrien adulte / Andy enfant).
// ─────────────────────────────────────────────────────────────────────────

import type { ProgressState } from "@/lib/types";
import { ALL_LESSONS, moduleById, conceptLabel } from "@/lib/content/modules";
import { weakestConcepts } from "@/lib/engine/adaptive";
import type { ProfileKind } from "@/lib/profiles/profiles";

export interface CoachAction {
  glyph: string;
  title: string;
  sub: string;
  href: string;
}

export interface CoachWeakPoint {
  concept: string;
  label: string;
  href: string;
  rate: number;
}

export interface CoachPlan {
  motivation: string;
  objective: string;
  primary: CoachAction;
  primaryWhy: string;
  secondary: CoachAction[];
  weakPoints: CoachWeakPoint[];
  /** Sessions guidées : courte (~5 min) / normale (~15 min). */
  sessions: { short: CoachAction; normal: CoachAction };
  dailyChallenge: CoachAction;
  parcoursDone: boolean;
}

// Concept → première leçon qui le traite (pour « revois ce point »).
const CONCEPT_LESSON: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const l of ALL_LESSONS) {
    for (const q of l.questions) {
      if (!(q.concept in map)) map[q.concept] = l.id;
    }
  }
  return map;
})();

export function lessonForConcept(concept: string): string | null {
  return CONCEPT_LESSON[concept] ?? null;
}

function dayIndex(): number {
  return Math.floor(Date.now() / 86_400_000);
}

function pickByDay<T>(arr: T[]): T {
  return arr[dayIndex() % arr.length];
}

const MOTIVATION: Record<ProfileKind, string[]> = {
  adult: [
    "Un cap se tient un jour après l'autre.",
    "Chaque leçon te rapproche du poste de skipper.",
    "La régularité fait le marin, pas la météo.",
    "On consolide aujourd'hui ce qui servira en mer demain.",
  ],
  kid: [
    "Prêt à devenir un vrai loup de mer ? 🐬",
    "Encore une aventure sur l'eau aujourd'hui ! 🌊",
    "Cap sur de nouveaux exploits, moussaillon ! ⛵",
    "Allez, on hisse les voiles et on apprend en s'amusant ! 🎉",
  ],
};

function isToday(day: string | null): boolean {
  return !!day && day === new Date().toISOString().slice(0, 10);
}

/** Construit le plan du coach pour un profil donné. */
export function buildCoachPlan(state: ProgressState, kind: ProfileKind): CoachPlan {
  const kid = kind === "kid";
  const nextLesson = ALL_LESSONS.find((l) => !state.completedLessons.includes(l.id)) ?? null;
  const nextModule = nextLesson ? moduleById(nextLesson.moduleId) : null;
  const parcoursDone = !nextLesson;

  const weak = weakestConcepts(state, 3).map((w) => ({
    concept: w.concept,
    label: conceptLabel(w.concept),
    href: lessonForConcept(w.concept)
      ? `/lesson/${lessonForConcept(w.concept)}`
      : "/learn",
    rate: w.rate,
  }));
  const topWeak = weak[0] ?? null;

  // ── Action principale ────────────────────────────────────────────────
  let primary: CoachAction;
  let primaryWhy: string;
  if (nextLesson && nextModule) {
    const doneInModule = nextModule.lessons.filter((l) =>
      state.completedLessons.includes(l.id),
    ).length;
    primary = {
      glyph: nextModule.glyph,
      title: nextLesson.title,
      sub: `Module ${nextModule.index} · ${nextModule.title} · ~${nextLesson.minutes} min · +${nextLesson.xp} XP`,
      href: `/lesson/${nextLesson.id}`,
    };
    if (doneInModule === 0 && nextModule.index === 1) {
      primaryWhy = kid
        ? "On commence par la base : connaître ton bateau. 🚤"
        : "On démarre par les fondations : le vocabulaire et le bateau.";
    } else if (doneInModule === 0) {
      primaryWhy = kid
        ? `Tu as fini l'étape d'avant, place au module « ${nextModule.title} » ! 🎉`
        : `Tu as validé le module précédent : place au module « ${nextModule.title} ».`;
    } else {
      primaryWhy = kid
        ? `Tu as déjà avancé dans « ${nextModule.title} », finis-le pour débloquer la suite ! 💪`
        : `Tu as commencé « ${nextModule.title} » : termine-le pour débloquer la suite.`;
    }
  } else if (topWeak) {
    primary = {
      glyph: "🛟",
      title: `Révision : ${topWeak.label}`,
      sub: "Consolide ton point le plus fragile",
      href: topWeak.href,
    };
    primaryWhy = kid
      ? "Tu as fini le parcours — on revoit ce qui coince un peu. 👏"
      : "Parcours terminé : on consolide tes points faibles pour ancrer les réflexes.";
  } else {
    primary = {
      glyph: "🏁",
      title: "Défi régate avec Bertrand",
      sub: "Entretiens tes acquis en situation",
      href: "/regatta-simulator",
    };
    primaryWhy = kid
      ? "Tout est validé, bravo ! On garde la forme avec un défi. 🏆"
      : "Parcours et points faibles au vert : entretiens tes acquis en simulateur.";
  }

  // ── Défi du jour (rotation déterministe) ─────────────────────────────
  const challenges: CoachAction[] = [
    { glyph: "⚓", title: "Défi croisière", sub: "Go / No-Go en Méditerranée", href: "/cruise-simulator" },
    { glyph: "🏁", title: "Défi régate", sub: "Tactique avec Bertrand", href: "/regatta-simulator" },
    { glyph: "🌬️", title: "Défi lecture du vent", sub: "Lis la situation comme un chef de bord", href: "/wind-trainer" },
  ];
  const dailyChallenge = pickByDay(challenges);

  // ── Révision intelligente ────────────────────────────────────────────
  const smartReview: CoachAction = topWeak
    ? {
        glyph: "🧠",
        title: "Révision intelligente",
        sub: `Reprends « ${topWeak.label} » en priorité`,
        href: topWeak.href,
      }
    : {
        glyph: "🧠",
        title: "Révision intelligente",
        sub: "Rejoue une leçon pour ancrer tes acquis",
        href: "/learn",
      };

  // ── 2 actions secondaires ────────────────────────────────────────────
  const secondary: CoachAction[] = [smartReview, dailyChallenge];

  // ── Sessions guidées ─────────────────────────────────────────────────
  const sessions = {
    short: topWeak
      ? { glyph: "⏱️", title: "Session courte", sub: "~5 min · révision express d'un point faible", href: topWeak.href }
      : { glyph: "⏱️", title: "Session courte", sub: "~5 min · une leçon ciblée", href: primary.href },
    normal: {
      glyph: "🕗",
      title: "Session normale",
      sub: "~15 min · une leçon + un défi",
      href: primary.href,
    },
  };

  // ── Objectif du jour ─────────────────────────────────────────────────
  let objective: string;
  if (isToday(state.lastActiveDay)) {
    objective = kid
      ? "Tu as déjà joué aujourd'hui — continue sur ta lancée ! 🔥"
      : "Tu as déjà travaillé aujourd'hui : un petit bonus pour garder le rythme ?";
  } else if (weak.length > 0) {
    objective = kid
      ? "Revoir 1 point + avancer d'1 leçon. 🎯"
      : "Revoir 1 point faible et avancer d'une leçon.";
  } else {
    objective = kid
      ? "Valider 1 leçon et garder ta série ! 🏅"
      : "Valider une leçon et entretenir ta série.";
  }

  return {
    motivation: pickByDay(MOTIVATION[kind]),
    objective,
    primary,
    primaryWhy,
    secondary,
    weakPoints: weak,
    sessions,
    dailyChallenge,
    parcoursDone,
  };
}
