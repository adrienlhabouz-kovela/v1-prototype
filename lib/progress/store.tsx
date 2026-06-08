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
import type { ProgressState, TrainingSession } from "@/lib/types";
import { recordConcept } from "@/lib/engine/adaptive";
import { evaluateBadges } from "@/lib/content/badges";
import { MODULES, lessonById } from "@/lib/content/modules";
import { levelForXp } from "@/lib/content/levels";
import {
  PROFILES,
  profileById,
  tuningFor,
  type ProfileId,
  type ProfileMeta,
  type ProfileTuning,
} from "@/lib/profiles/profiles";
import {
  HISTORY_LIMIT,
  clearActiveProfile,
  emptyState,
  loadActiveProfile,
  loadProfileState,
  saveActiveProfile,
  saveProfileState,
} from "@/lib/progress/storage";

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (24 * 60 * 60 * 1000),
  );
}

/** Charge un profil et remet à zéro le streak si la série est rompue. */
function loadWithStreak(id: ProfileId): ProgressState {
  const s = loadProfileState(id);
  if (s.lastActiveDay) {
    const diff = dayDiff(s.lastActiveDay, todayKey());
    if (diff >= 2) return { ...s, streak: 0 };
  }
  return s;
}

/** Liste des modules entièrement complétés. */
function completedModuleIds(state: ProgressState): string[] {
  return MODULES.filter((m) =>
    m.lessons.every((l) => state.completedLessons.includes(l.id)),
  ).map((m) => m.id);
}

function appendHistory(
  state: ProgressState,
  session: TrainingSession,
): TrainingSession[] {
  return [...state.trainingHistory, session].slice(-HISTORY_LIMIT);
}

interface CompleteLessonResult {
  xpGained: number;
  newBadges: string[];
  leveledUp: boolean;
}

/** Entrée d'historique fournie par l'appelant (date remplie automatiquement). */
type SessionInput = Omit<TrainingSession, "at" | "day">;

interface ProgressContextValue {
  state: ProgressState;
  ready: boolean;
  // ── Profils ────────────────────────────────────────────────────────────
  /** Profil actif, ou null tant qu'aucun profil n'est choisi. */
  activeId: ProfileId | null;
  profile: ProfileMeta | null;
  /** Tuning de présentation (toujours défini ; adulte par défaut). */
  tuning: ProfileTuning;
  profiles: ProfileMeta[];
  /** Sélectionne un profil (charge sa progression). */
  chooseProfile: (id: ProfileId) => void;
  /** Revient à l'écran « Qui apprend aujourd'hui ? ». */
  switchProfile: () => void;
  // ── Progression ──────────────────────────────────────────────────────────
  /** Enregistre la réussite/échec d'un concept (tests). */
  answerConcept: (concept: string, correct: boolean) => void;
  /** Valide une leçon avec un score 0..1 et marque la journée active. */
  completeLesson: (lessonId: string, score: number) => CompleteLessonResult;
  /** Ajoute des points à un score thématique (0..100, borné). */
  bumpScore: (key: keyof ProgressState["scores"], delta: number) => void;
  /** Débloque un badge par condition contextuelle (simulateurs). */
  flagAchievement: (ctx: {
    goNoGoSuccess?: boolean;
    regattaPlaceGained?: boolean;
  }) => string[];
  /** Ajoute une entrée à l'historique d'entraînement. */
  recordSession: (session: SessionInput) => void;
  /** Comptabilise une demande d'aide sur un concept (stats). */
  recordHelp: (concept: string) => void;
  /** Réinitialise la progression du profil actif. */
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyState);
  const [activeId, setActiveId] = useState<ProfileId | null>(null);
  const [ready, setReady] = useState(false);
  const mounted = useRef(false);

  // Chargement initial : profil actif + sa progression.
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    try {
      const id = loadActiveProfile();
      if (id) {
        // setActiveId + setState dans le même tick → pas d'état incohérent.
        setActiveId(id);
        setState(loadWithStreak(id));
      }
    } finally {
      setReady(true);
    }
  }, []);

  // Persistance : on n'écrit que pour le profil actif, jamais sans profil.
  useEffect(() => {
    if (!ready || !activeId) return;
    saveProfileState(activeId, state);
  }, [state, activeId, ready]);

  const chooseProfile = useCallback((id: ProfileId) => {
    saveActiveProfile(id);
    // Les deux setState sont groupés : l'état chargé correspond bien à `id`.
    setActiveId(id);
    setState(loadWithStreak(id));
  }, []);

  const switchProfile = useCallback(() => {
    clearActiveProfile();
    setActiveId(null);
  }, []);

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
          trainingHistory: appendHistory(s, {
            at: Date.now(),
            day: today,
            kind: "lesson",
            ref: lessonId,
            label: lesson?.title ?? "Leçon",
            score,
            xpGained,
          }),
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

  const recordSession = useCallback<ProgressContextValue["recordSession"]>(
    (session) => {
      const today = todayKey();
      setState((s) => ({
        ...s,
        lastActiveDay: today,
        trainingHistory: appendHistory(s, {
          ...session,
          at: Date.now(),
          day: today,
        }),
      }));
    },
    [],
  );

  const recordHelp = useCallback<ProgressContextValue["recordHelp"]>((concept) => {
    if (!concept) return;
    setState((s) => ({
      ...s,
      helpUsage: { ...s.helpUsage, [concept]: (s.helpUsage[concept] ?? 0) + 1 },
    }));
  }, []);

  const reset = useCallback(() => setState(emptyState()), []);

  const profile = useMemo(() => profileById(activeId) ?? null, [activeId]);
  const tuning = useMemo(() => tuningFor(profile?.kind), [profile]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      ready,
      activeId,
      profile,
      tuning,
      profiles: PROFILES,
      chooseProfile,
      switchProfile,
      answerConcept,
      completeLesson,
      bumpScore,
      flagAchievement,
      recordSession,
      recordHelp,
      reset,
    }),
    [
      state,
      ready,
      activeId,
      profile,
      tuning,
      chooseProfile,
      switchProfile,
      answerConcept,
      completeLesson,
      bumpScore,
      flagAchievement,
      recordSession,
      recordHelp,
      reset,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress doit être utilisé dans ProgressProvider");
  return ctx;
}

export function useProgress(): ProgressContextValue {
  return useProgressContext();
}

/** Accès ciblé au profil actif et au changement de profil. */
export function useProfile() {
  const {
    ready,
    activeId,
    profile,
    tuning,
    profiles,
    chooseProfile,
    switchProfile,
  } = useProgressContext();
  return { ready, activeId, profile, tuning, profiles, chooseProfile, switchProfile };
}
