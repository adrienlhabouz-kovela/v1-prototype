import type { PointOfSail } from "@/lib/types";

export interface PointOfSailInfo {
  id: PointOfSail;
  name: string;
  /** Plage d'angle au vent (degrés, 0 = nez au vent, 180 = vent arrière). */
  range: [number, number];
  speed: "nulle" | "faible" | "moyenne" | "bonne" | "max" | "réduite";
  /** Voile / réglage recommandé. */
  sails: string;
  /** Erreur fréquente à cette allure. */
  commonError: string;
  /** Posture / conseil barreur. */
  helm: string;
  /** Couleur d'accent (token Tailwind). */
  color: string;
}

/**
 * Référentiel des allures. Les angles sont des repères pédagogiques usuels
 * (un voilier de croisière remonte rarement sous ~40-45°).
 */
export const POINTS_OF_SAIL: PointOfSailInfo[] = [
  {
    id: "noGo",
    name: "Zone interdite",
    range: [0, 35],
    speed: "nulle",
    sails: "Aucune ne porte — le bateau fasseye.",
    commonError: "Vouloir remonter droit au vent : on s'arrête.",
    helm: "Abats pour reprendre de la vitesse.",
    color: "coral",
  },
  {
    id: "pres-serre",
    name: "Près serré",
    range: [35, 50],
    speed: "réduite",
    sails: "GV + foc bordés au maximum, plats.",
    commonError: "Trop lofer : les voiles faseyent et on cale.",
    helm: "Cherche le bon angle, surveille les penons.",
    color: "lagoon",
  },
  {
    id: "bon-plein",
    name: "Bon plein",
    range: [50, 70],
    speed: "bonne",
    sails: "GV + génois légèrement choqués.",
    commonError: "Border comme au près serré : on bride la vitesse.",
    helm: "Allure confortable et rapide pour avancer au vent.",
    color: "lagoon",
  },
  {
    id: "travers",
    name: "Travers",
    range: [70, 100],
    speed: "max",
    sails: "GV + génois à mi-largage, bien creusées.",
    commonError: "Garder les voiles bordées : on perd de la puissance.",
    helm: "Vent de côté : souvent l'allure la plus rapide.",
    color: "spray",
  },
  {
    id: "largue",
    name: "Largue",
    range: [100, 135],
    speed: "bonne",
    sails: "Voiles choquées, spi / gennaker possible.",
    commonError: "Spi mal réglé qui ramène le bateau au lof.",
    helm: "Allure rapide et confortable, peu de gîte.",
    color: "spray",
  },
  {
    id: "grand-largue",
    name: "Grand largue",
    range: [135, 165],
    speed: "bonne",
    sails: "Spi / gennaker, génois en ciseaux possible.",
    commonError: "Risque d'empannage involontaire si on abat trop.",
    helm: "Surveille la bôme, prépare la balancine.",
    color: "sun",
  },
  {
    id: "vent-arriere",
    name: "Vent arrière",
    range: [165, 180],
    speed: "moyenne",
    sails: "Spi symétrique ou voiles en ciseaux.",
    commonError: "Allure instable, empannage sauvage si on dévie.",
    helm: "Garde un cap stable, attention au roulis.",
    color: "sun",
  },
];

/** Renvoie l'allure correspondant à un angle au vent (0..180°, valeur absolue). */
export function pointOfSailForAngle(angle: number): PointOfSailInfo {
  const a = Math.min(180, Math.abs(angle));
  for (const p of POINTS_OF_SAIL) {
    if (a >= p.range[0] && a < p.range[1]) return p;
  }
  return POINTS_OF_SAIL[POINTS_OF_SAIL.length - 1];
}

export function pointOfSailById(id: PointOfSail): PointOfSailInfo {
  return POINTS_OF_SAIL.find((p) => p.id === id) ?? POINTS_OF_SAIL[0];
}
