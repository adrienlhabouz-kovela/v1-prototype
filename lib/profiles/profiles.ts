// ─────────────────────────────────────────────────────────────────────────
// Profils utilisateurs locaux — Cap au Vent
//
// V1 : deux profils locaux (Adrien, adulte / Andy, enfant). Le contenu voile
// est STRICTEMENT le même pour tous les profils — on ne maintient qu'une seule
// formation. Seule la PRÉSENTATION s'adapte (ton, densité, feedback) via le
// `ProfileTuning`. Le vocabulaire de progression (XP, niveaux, grades) est
// identique pour tout le monde, volontairement (pas de jargon enfantin).
//
// Architecture pensée pour un futur mode « Défis Père/Fils » : chaque profil
// possède sa progression complète et indépendante, lisible sans le profil
// actif (cf. lib/progress/storage.ts → loadProfileState + summarize ci-dessous),
// ce qui permettra plus tard de comparer deux profils sans rien casser ici.
// ─────────────────────────────────────────────────────────────────────────

import type { ProgressState } from "@/lib/types";
import { levelForXp } from "@/lib/content/levels";
import { ALL_LESSONS } from "@/lib/content/modules";

export type ProfileId = "adrien" | "andy";
export type ProfileKind = "adult" | "kid";

export interface ProfileMeta {
  id: ProfileId;
  name: string;
  kind: ProfileKind;
  /** Emoji d'avatar. */
  avatar: string;
  /** Token de couleur d'accent (cf. primitives / Tailwind). */
  accent: "spray" | "sun" | "lagoon" | "coral";
  tagline: string;
}

/** Registre des profils (extensible : ajouter une entrée suffit). */
export const PROFILES: ProfileMeta[] = [
  {
    id: "adrien",
    name: "Adrien",
    kind: "adult",
    avatar: "🧭",
    accent: "spray",
    tagline: "Croisière & régate",
  },
  {
    id: "andy",
    name: "Andy",
    kind: "kid",
    avatar: "🐬",
    accent: "sun",
    tagline: "Apprends en t'amusant",
  },
];

/** Profil cible de la migration mono-profil → multi-profils. */
export const DEFAULT_PROFILE_ID: ProfileId = "adrien";

export function profileById(id: string | null | undefined): ProfileMeta | undefined {
  return PROFILES.find((p) => p.id === id);
}

export function isProfileId(id: string | null | undefined): id is ProfileId {
  return !!id && PROFILES.some((p) => p.id === id);
}

// ── Tuning de présentation (jamais de contenu) ───────────────────────────

export interface ProfileTuning {
  /** Ton plus ludique (accueil, libellés). */
  playful: boolean;
  /** Affiche la leçon un bloc à la fois (moins de texte par écran). */
  paginateLessons: boolean;
  /** Feedback plus chaleureux / célébration renforcée dans les quiz. */
  extraPositiveFeedback: boolean;
  /** Masque le jargon technique (ex. « répétition espacée »). */
  hideJargon: boolean;
}

const TUNING: Record<ProfileKind, ProfileTuning> = {
  adult: {
    playful: false,
    paginateLessons: false,
    extraPositiveFeedback: false,
    hideJargon: false,
  },
  kid: {
    playful: true,
    paginateLessons: true,
    extraPositiveFeedback: true,
    hideJargon: true,
  },
};

export function tuningFor(kind: ProfileKind | undefined): ProfileTuning {
  return TUNING[kind ?? "adult"];
}

// ── Résumé comparable d'un profil (picker + futurs « Défis Père/Fils ») ───

export interface ProfileSummary {
  xp: number;
  level: number;
  levelName: string;
  completedLessons: number;
  totalLessons: number;
  badges: number;
  streak: number;
}

/** Dérive des métriques comparables à partir d'un état de progression. */
export function summarize(state: ProgressState): ProfileSummary {
  const level = levelForXp(state.xp);
  return {
    xp: state.xp,
    level: level.id,
    levelName: level.name,
    completedLessons: state.completedLessons.length,
    totalLessons: ALL_LESSONS.length,
    badges: state.badges.length,
    streak: state.streak,
  };
}
