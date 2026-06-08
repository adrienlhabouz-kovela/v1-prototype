import type { Level } from "@/lib/types";

/** Paliers de progression. minXp = XP cumulé requis pour atteindre le niveau. */
export const LEVELS: Level[] = [
  { id: 1, name: "Moussaillon", tagline: "Tu montes à bord.", minXp: 0 },
  { id: 2, name: "Équipier", tagline: "Tu te rends utile.", minXp: 250 },
  {
    id: 3,
    name: "Équipier confirmé",
    tagline: "Tu anticipes les manœuvres.",
    minXp: 600,
  },
  {
    id: 4,
    name: "Chef de bord côtier",
    tagline: "Tu décides go / no-go.",
    minXp: 1100,
  },
  {
    id: 5,
    name: "Skipper Méditerranée",
    tagline: "Tu mènes la croisière.",
    minXp: 1750,
  },
  {
    id: 6,
    name: "Équipier régate",
    tagline: "Tu lis le plan d'eau.",
    minXp: 2500,
  },
];

export function levelForXp(xp: number): Level {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) current = lvl;
  }
  return current;
}

export function nextLevelFor(xp: number): Level | null {
  return LEVELS.find((l) => l.minXp > xp) ?? null;
}

/** Progression 0..1 dans le niveau courant. */
export function levelProgress(xp: number): number {
  const current = levelForXp(xp);
  const next = nextLevelFor(xp);
  if (!next) return 1;
  return (xp - current.minXp) / (next.minXp - current.minXp);
}
