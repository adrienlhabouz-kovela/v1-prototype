import type { Badge, ProgressState } from "@/lib/types";

export const BADGES: Badge[] = [
  {
    id: "premier-bord",
    name: "Premier bord",
    description: "Tu as validé ta toute première leçon.",
    glyph: "⛵",
    hint: "Termine une leçon.",
  },
  {
    id: "ami-du-vent",
    name: "Ami du vent",
    description: "Tu lis le vent réel et le vent apparent.",
    glyph: "🌬️",
    hint: "Termine le module Vent.",
  },
  {
    id: "roi-du-pres",
    name: "Roi du près",
    description: "Tu maîtrises les allures de près.",
    glyph: "📐",
    hint: "Termine le module Allures.",
  },
  {
    id: "mouillage-propre",
    name: "Mouillage propre",
    description: "Tu poses une ancre qui tient.",
    glyph: "⚓",
    hint: "Termine le module Mouillage & croisière.",
  },
  {
    id: "go-nogo",
    name: "Go / No-Go maîtrisé",
    description: "Tu décides de partir… ou pas.",
    glyph: "🚦",
    hint: "Réussis un scénario météo go/no-go.",
  },
  {
    id: "equipier-utile",
    name: "Équipier utile",
    description: "Tu participes aux manœuvres sans te tromper.",
    glyph: "🤝",
    hint: "Termine le module Manœuvres.",
  },
  {
    id: "regatier-lucide",
    name: "Régatier lucide",
    description: "Tu fais les bons choix tactiques en régate.",
    glyph: "🏁",
    hint: "Gagne une place en régate.",
  },
  {
    id: "futur-skipper",
    name: "Futur skipper",
    description: "Tu atteins le niveau Skipper Méditerranée.",
    glyph: "🧭",
    hint: "Atteins 1750 XP.",
  },
  {
    id: "serie-3",
    name: "Dans le rythme",
    description: "3 jours de suite à bord.",
    glyph: "🔥",
    hint: "Garde une série de 3 jours.",
  },
];

export function badgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

/** Renvoie les ids de badges nouvellement débloqués selon l'état courant. */
export function evaluateBadges(
  state: ProgressState,
  ctx: {
    completedModuleIds: string[];
    goNoGoSuccess?: boolean;
    regattaPlaceGained?: boolean;
  },
): string[] {
  const unlocked = new Set(state.badges);
  const toAdd: string[] = [];
  const give = (id: string) => {
    if (!unlocked.has(id)) {
      unlocked.add(id);
      toAdd.push(id);
    }
  };

  if (state.completedLessons.length >= 1) give("premier-bord");
  if (ctx.completedModuleIds.includes("vent")) give("ami-du-vent");
  if (ctx.completedModuleIds.includes("allures")) give("roi-du-pres");
  if (ctx.completedModuleIds.includes("mouillage")) give("mouillage-propre");
  if (ctx.completedModuleIds.includes("manoeuvres")) give("equipier-utile");
  if (ctx.goNoGoSuccess) give("go-nogo");
  if (ctx.regattaPlaceGained) give("regatier-lucide");
  if (state.xp >= 1750) give("futur-skipper");
  if (state.streak >= 3) give("serie-3");

  return toAdd;
}
