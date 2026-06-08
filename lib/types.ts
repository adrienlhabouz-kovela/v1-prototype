// ─────────────────────────────────────────────────────────────────────────
// Modèle de données — Cap au Vent
// Tout le contenu pédagogique et l'état de progression sont typés ici.
// ─────────────────────────────────────────────────────────────────────────

/** Allures de navigation, du plus près du vent au vent arrière. */
export type PointOfSail =
  | "noGo"
  | "pres-serre"
  | "bon-plein"
  | "travers"
  | "largue"
  | "grand-largue"
  | "vent-arriere";

/** Niveaux de progression (communs à tous les profils). */
export interface Level {
  id: number;
  name: string;
  tagline: string;
  minXp: number;
}

/** Une carte mémoire (flashcard). */
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
}

/** Type d'interaction d'un test. */
export type TestKind =
  | "qcm"
  | "trueFalse"
  | "clickZone"
  | "windAngle"
  | "chooseSail"
  | "chooseManeuver"
  | "goNoGo"
  | "orderSteps";

/** Une question / un exercice. */
export interface Question {
  id: string;
  kind: TestKind;
  prompt: string;
  /** Réponses possibles (QCM, choix voile, etc.). */
  options?: string[];
  /** Index de la / des bonne(s) réponse(s) dans `options`. */
  correct?: number | number[];
  /** Vrai/faux. */
  answer?: boolean;
  /** Pour clickZone / windAngle : cible attendue (id de zone ou angle). */
  target?: string | number;
  /** Tolérance pour les réponses numériques (degrés). */
  tolerance?: number;
  /** Étapes à remettre dans l'ordre (orderSteps). */
  steps?: string[];
  /** Explication affichée après réponse. */
  explanation: string;
  /** Notion rattachée — sert au moteur adaptatif. */
  concept: string;
  /** Indices d'aide progressifs (optionnels) — repli générique sinon. */
  hints?: string[];
}

/** Bloc de contenu d'une leçon (avant les tests). */
export interface LessonBlock {
  id: string;
  /** Type de visuel/interaction du bloc. */
  kind:
    | "text"
    | "flashcards"
    | "boatDiagram"
    | "windRose"
    | "pointsOfSail"
    | "sailTrim"
    | "maneuverTimeline"
    | "callout";
  title?: string;
  body?: string;
  flashcards?: Flashcard[];
  /** Données libres consommées par le composant visuel du bloc. */
  data?: Record<string, unknown>;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  goal: string;
  /** Minutes estimées. */
  minutes: number;
  xp: number;
  blocks: LessonBlock[];
  questions: Question[];
}

export interface Module {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  goal: string;
  /** Emoji / glyphe d'accent. */
  glyph: string;
  /** Couleur d'accent Tailwind (token). */
  accent: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  glyph: string;
  /** Condition lisible (affichée si non débloqué). */
  hint: string;
}

// ── État de progression persistant (LocalStorage) ────────────────────────

/** Suivi par concept pour le moteur adaptatif (répétition espacée simple). */
export interface ConceptStat {
  concept: string;
  seen: number;
  correct: number;
  wrong: number;
  /** Timestamp ms de la dernière révision. */
  lastSeen: number;
  /** Timestamp ms de la prochaine révision due. */
  dueAt: number;
}

/** Type d'activité enregistrée dans l'historique d'entraînement. */
export type TrainingKind = "lesson" | "cruise" | "regatta" | "wind";

/** Une entrée de l'historique d'entraînement (par profil). */
export interface TrainingSession {
  /** Timestamp ms. */
  at: number;
  /** Jour (YYYY-MM-DD). */
  day: string;
  kind: TrainingKind;
  /** Id de la leçon / du scénario concerné, si applicable. */
  ref?: string;
  /** Libellé lisible affiché dans l'historique. */
  label: string;
  /** Score 0..1 quand pertinent. */
  score?: number;
  /** XP gagné lors de cette session, si applicable. */
  xpGained?: number;
}

export interface ProgressState {
  version: number;
  xp: number;
  /** Leçons complétées (ids). */
  completedLessons: string[];
  /** Meilleur score par leçon (0..1). */
  lessonScores: Record<string, number>;
  /** Badges débloqués (ids). */
  badges: string[];
  /** Streak en jours. */
  streak: number;
  /** Date (YYYY-MM-DD) de la dernière session. */
  lastActiveDay: string | null;
  /** Stats par concept. */
  concepts: Record<string, ConceptStat>;
  /** Scores thématiques cumulés (0..100). */
  scores: {
    securite: number;
    regate: number;
    meteo: number;
    manoeuvres: number;
  };
  /** Historique des sessions d'entraînement (les plus récentes en fin de tableau). */
  trainingHistory: TrainingSession[];
  /** Nombre de demandes d'aide par concept (identifie les notions difficiles). */
  helpUsage: Record<string, number>;
}
