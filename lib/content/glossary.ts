// Glossaire : termes anglais / techniques avec une glose courte en français.
// Règle produit : on garde le terme, on ajoute une explication entre parenthèses.

export const GLOSSARY: Record<string, string> = {
  xp: "points d'expérience",
  streak: "série de jours",
  "wind trainer": "entraîneur de vent",
  "smart wind trainer": "entraîneur de vent intelligent",
  layline: "ligne optimale vers la bouée",
  "vent apparent": "vent ressenti à bord",
  "vent sale": "air dévené par un autre bateau",
  spi: "spinnaker, voile de portant",
  ris: "réduction de la surface de voile",
  lof: "se rapprocher du vent",
  abattre: "s'éloigner du vent",
};

export function glossFor(term: string): string | undefined {
  return GLOSSARY[term.trim().toLowerCase()];
}
