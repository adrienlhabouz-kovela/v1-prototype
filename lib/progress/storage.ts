// ─────────────────────────────────────────────────────────────────────────
// Persistance LocalStorage — une clé par profil.
//
// Migration mono-profil → multi-profils : l'ancienne clé `cap-au-vent:v1`
// (format mono-profil) est COPIÉE vers le profil Adrien la première fois, puis
// CONSERVÉE telle quelle en backup (jamais supprimée). La copie est idempotente
// (elle ne se déclenche que si la clé profil Adrien est absente), donc un reset
// du profil ne ré-importe jamais l'ancienne progression.
// ─────────────────────────────────────────────────────────────────────────

import type { ProgressState } from "@/lib/types";
import { DEFAULT_PROFILE_ID, isProfileId, type ProfileId } from "@/lib/profiles/profiles";

export const STATE_VERSION = 2;

const PREFIX = "cap-au-vent:";
/** Ancienne clé mono-profil (conservée en backup après migration). */
export const LEGACY_KEY = `${PREFIX}v1`;
/** Pointeur vers le profil actif. */
export const ACTIVE_KEY = `${PREFIX}active-profile`;
/** Nombre max d'entrées conservées dans l'historique d'entraînement. */
export const HISTORY_LIMIT = 80;

export function profileKey(id: ProfileId): string {
  return `${PREFIX}profile:${id}`;
}

export function emptyState(): ProgressState {
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
    trainingHistory: [],
  };
}

/** Normalise/migre n'importe quel objet stocké vers le format courant (v2). */
export function migrateState(raw: unknown): ProgressState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<ProgressState>;
  return {
    ...base,
    ...r,
    version: STATE_VERSION,
    completedLessons: Array.isArray(r.completedLessons) ? r.completedLessons : [],
    lessonScores: r.lessonScores ?? {},
    badges: Array.isArray(r.badges) ? r.badges : [],
    concepts: r.concepts ?? {},
    scores: { ...base.scores, ...(r.scores ?? {}) },
    trainingHistory: Array.isArray(r.trainingHistory)
      ? r.trainingHistory.slice(-HISTORY_LIMIT)
      : [],
  };
}

function safeGet(key: string): unknown | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Charge la progression d'un profil. Pour le profil par défaut (Adrien),
 * effectue au besoin la migration non destructive depuis l'ancienne clé.
 */
export function loadProfileState(id: ProfileId): ProgressState {
  const existing = safeGet(profileKey(id));
  if (existing) return migrateState(existing);

  // Migration mono → multi : uniquement si le profil n'existe pas encore.
  if (id === DEFAULT_PROFILE_ID) {
    const legacy = safeGet(LEGACY_KEY);
    if (legacy) {
      const migrated = migrateState(legacy);
      saveProfileState(id, migrated); // copie ; LEGACY_KEY laissé intact (backup)
      return migrated;
    }
  }
  return emptyState();
}

export function saveProfileState(id: ProfileId, state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(profileKey(id), JSON.stringify(state));
  } catch {
    /* quota / mode privé : on ignore silencieusement */
  }
}

export function loadActiveProfile(): ProfileId | null {
  if (typeof window === "undefined") return null;
  // Le pointeur est stocké en chaîne brute (pas en JSON) — relire à l'identique.
  let v: string | null = null;
  try {
    v = localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
  return isProfileId(v) ? v : null;
}

export function saveActiveProfile(id: ProfileId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    /* ignore */
  }
}

export function clearActiveProfile(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
}
