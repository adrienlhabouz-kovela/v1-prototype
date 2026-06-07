import { pointOfSailForAngle, type PointOfSailInfo } from "./points-of-sail";

export interface WindAdvice {
  pos: PointOfSailInfo;
  /** Voile recommandée selon vent + allure. */
  sail: string;
  /** Réglage recommandé. */
  trim: string;
  /** Niveau de risque. */
  riskLevel: "calme" | "vigilance" | "musclé";
  risk: string;
  /** Action concrète. */
  action: string;
  /** Question adaptée posée à l'apprenant. */
  question: string;
}

/** Catégorie de force de vent (nœuds). */
export function windCategory(knots: number): "léger" | "établi" | "frais" | "fort" {
  if (knots < 8) return "léger";
  if (knots < 16) return "établi";
  if (knots < 25) return "frais";
  return "fort";
}

/**
 * Cœur du Smart Wind Trainer : à partir d'un angle au vent et d'une force,
 * produit une recommandation pédagogique complète.
 */
export function adviseWind(angle: number, knots: number): WindAdvice {
  const pos = pointOfSailForAngle(angle);
  const cat = windCategory(knots);
  const downwind = pos.id === "largue" || pos.id === "grand-largue" || pos.id === "vent-arriere";

  // ── Voile ────────────────────────────────────────────────
  let sail: string;
  if (pos.id === "noGo") {
    sail = "Aucune voile ne porte : il faut abattre.";
  } else if (downwind) {
    if (cat === "léger") sail = "Grand-voile + spi / gennaker pour avancer.";
    else if (cat === "établi") sail = "Grand-voile + spi, équipage attentif.";
    else if (cat === "frais") sail = "Grand-voile + génois (spi risqué).";
    else sail = "Grand-voile arisée + tourmentin, pas de spi.";
  } else {
    if (cat === "léger") sail = "Grand-voile + génois (grande surface).";
    else if (cat === "établi") sail = "Grand-voile + foc / génois.";
    else if (cat === "frais") sail = "Grand-voile (1 ris) + foc.";
    else sail = "Grand-voile à 2 ris + tourmentin.";
  }

  // ── Réglage ──────────────────────────────────────────────
  let trim: string;
  if (pos.id === "noGo") trim = "Abattre franchement pour relancer.";
  else if (pos.id === "pres-serre" || pos.id === "bon-plein")
    trim = "Voiles bordées et plates, chariot au vent.";
  else if (pos.id === "travers") trim = "Voiles à mi-largage, bien creusées.";
  else trim = "Voiles largement choquées, vrillage ouvert.";

  // ── Risque ───────────────────────────────────────────────
  let riskLevel: WindAdvice["riskLevel"] = "calme";
  let risk = "Conditions confortables, marge de manœuvre.";
  if (cat === "frais") {
    riskLevel = "vigilance";
    risk = downwind
      ? "Empannage involontaire et survitesse dans les rafales."
      : "Surpuissance et gîte excessive dans les rafales.";
  } else if (cat === "fort") {
    riskLevel = "musclé";
    risk = "Conditions musclées : réduire la toile, sécuriser l'équipage.";
  } else if (pos.id === "noGo") {
    riskLevel = "vigilance";
    risk = "Le bateau cale et perd sa manœuvrabilité.";
  }

  // ── Action ───────────────────────────────────────────────
  let action: string;
  if (pos.id === "noGo") action = "Abats jusqu'au près serré, regonfle les voiles.";
  else if (riskLevel === "musclé") action = "Prends un ris, vérifie le harnais et la VHF.";
  else if (riskLevel === "vigilance")
    action = downwind ? "Prépare la prise de ris, surveille la bôme." : "Surveille la gîte et la barre, prêt à choquer.";
  else action = "Optimise le réglage et garde le bateau à plat.";

  // ── Question adaptée ─────────────────────────────────────
  let question: string;
  if (pos.id === "noGo") question = "Le bateau s'arrête face au vent — que fais-tu ?";
  else if (riskLevel === "musclé") question = "Le vent dépasse 25 nœuds — quelle est ta priorité ?";
  else if (riskLevel === "vigilance" && !downwind) question = "Que fais-tu si le bateau gîte trop dans une rafale ?";
  else if (downwind) question = "Comment éviter un empannage involontaire à cette allure ?";
  else question = "Comment reconnais-tu que tes voiles sont bien réglées ?";

  return { pos, sail, trim, riskLevel, risk, action, question };
}
