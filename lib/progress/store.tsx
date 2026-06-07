"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ProgressState } from "@/lib/types";
import { recordConcept } from "@/lib/engine/adaptive";
import { evaluateBadges } from "@/lib/content/badges";
import { MODULES, lessonById } from "@/lib/content/modules";
import { levelForXp } from "@/lib/content/levels";

const STORAGE_KEY = "cap-au-vent:v1";
const STATE_VERSION = 1;

function emptyState(): ProgressState {
  return {
    version: STATE_VERSION,
    xp: 0,
    completedLessons: [],
    lessonScores: {},
    badges: [],
    streak: 0,
    lastActiveDay: null,
    concepts: {},
    scores: { securite: 0, regate: 0, meteo: 0, manoeuvres: 0 },
  };
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (24 * 60 * 60 * 1000),
  );
}

/** Liste des modules entièrement complétés. */
function completedModuleIds(state: ProgressState): string[] {
  return MODULES.filter((m) =>
    m.lessons.every((l) => state.completedLessons.includes(l.id)),
  ).map((m) => m.id);
}

interface CompleteLessonResult {
  xpGained: number;
  newBadges: string[];
  leveledUp: boolean;
}

interface ProgressContextValue {
  state: ProgressState;
  ready: boolean;
  /** Enregistre la réussite/échec d'un concept (tests). */
  answerConcept: (concept: string, correct: boolean) => void;
  /** Valide une leçon avec un score 0..1 et marque la journée active. */
  completeLesson: (lessonId: string, score: number) => CompleteLessonResult;
  /** Ajoute des points à un score thématique (0..100, borné). */
  bumpScore: (
    key: keyof ProgressState["scores"],
    delta: number,
  ) => void;
  /** Débloque un badge par condition contextuelle (simulateurs). */
  flagAchievement: (ctx: {
    goNoGoSuccess?: boolean;
    regattaPlaceGained?: boolean;
  }) => string[];
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyState);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  // Chargement initial depuis LocalStorage + mise à jour du streak.
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let next = raw ? (JSON.parse(raw) as ProgressState) : emptyState();
      if (!next || next.version !== STATE_VERSION) next = emptyState();

      // Gestion du streak à l'ouverture.
      const today = todayKey();
      if (next.lastActiveDay) {
        const diff = dayDiff(next.lastActiveDay, today);
        if (diff >= 2) next.streak = 0; // série rompue
      }
      setState(next);
    } catch {
      setState(emptyState());
    } finally {
      setReady(true);
    }
  }, []);

  // Persistance.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / mode privé : on ignore silencieusement */
    }
  }, [state, ready]);

  const answerConcept = useCallback((concept: string, correct: boolean) => {
    setState((s) => ({
      ...s,
      concepts: recordConcept(s.concepts, concept, correct),
    }));
  }, []);

  const completeLesson = useCallback<ProgressContextValue["completeLesson"]>(
    (lessonId, score) => {
      let result: CompleteLessonResult = {
        xpGained: 0,
        newBadges: [],
        leveledUp: false,
      };

      setState((s) => {
        const lesson = lessonById(lessonId);
        const baseXp = lesson?.xp ?? 50;
        const already = s.completedLessons.includes(lessonId);
        const prevBest = s.lessonScores[lessonId] ?? 0;

        // XP : plein la première fois, sinon bonus de révision si on s'améliore.
        const xpGained = already
          ? Math.round(baseXp * 0.25 * Math.max(0, score - prevBest))
          : Math.round(baseXp * (0.5 + 0.5 * score));

        const beforeLevel = levelForXp(s.xp).id;
        const xp = s.xp + xpGained;
        const afterLevel = levelForXp(xp).id;

        // Streak.
        const today = todayKey();
        let streak = s.streak;
        if (s.lastActiveDay !== today) {
          const diff = s.lastActiveDay ? dayDiff(s.lastActiveDay, today) : 99;
          streak = diff === 1 ? s.streak + 1 : 1;
        }
        if (streak === 0) streak = 1;

        const next: ProgressState = {
          ...s,
          xp,
          streak,
          lastActiveDay: today,
          completedLessons: already
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
          lessonScores: {
            ...s.lessonScores,
            [lessonId]: Math.max(prevBest, score),
          },
        };

        const newBadges = evaluateBadges(next, {
          completedModuleIds: completedModuleIds(next),
        });
        next.badges = [...next.badges, ...newBadges];

        result = {
          xpGained,
          newBadges,
          leveledUp: afterLevel > beforeLevel,
        };
        return next;
      });

      return result;
    },
    [],
  );

  const bumpScore = useCallback<ProgressContextValue["bumpScore"]>(
    (key, delta) => {
      setState((s) => ({
        ...s,
        scores: {
          ...s.scores,
          [key]: Math.max(0, Math.min(100, s.scores[key] + delta)),
        },
        lastActiveDay: todayKey(),
      }));
    },
    [],
  );

  const flagAchievement = useCallback<ProgressContextValue["flagAchievement"]>(
    (ctx) => {
      let added: string[] = [];
      setState((s) => {
        const newBadges = evaluateBadges(s, {
          completedModuleIds: completedModuleIds(s),
          ...ctx,
        });
        added = newBadges;
        if (newBadges.length === 0) return s;
        return { ...s, badges: [...s.badges, ...newBadges] };
      });
      return added;
    },
    [],
  );

  const reset = useCallback(() => setState(emptyState()), []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      answerConcept,
      completeLesson,
      bumpScore,
      flagAchievement,
      reset,
    }),
    [state, ready, answerConcept, completeLesson, bumpScore, flagAchievement, reset],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress doit être utilisé dans ProgressProvider");
  return ctx;
}
