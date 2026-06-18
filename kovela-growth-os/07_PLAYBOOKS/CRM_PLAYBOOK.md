# CRM_PLAYBOOK — Procédure d'utilisation du CRM au quotidien

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Mode opératoire concret pour utiliser le CRM chaque jour : créer une fiche
chirurgien, la scorer, la faire avancer dans le pipeline, et poser une prochaine
action datée. C'est l'application terrain de `03_CRM/` (schéma, scoring, étapes).
Règle d'or : **aucune fiche active sans prochaine action datée.**

## Objectif

Garantir qu'à tout moment le Growth Ops sait, en 5 secondes par compte, où en est
chaque chirurgien et que faire ensuite — sans jamais perdre un compte.

## Action attendue

Le Growth Ops exécute le geste « créer → scorer → avancer → prochaine action » sur
chaque chirurgien, et tient le pipeline propre via la routine hebdo.

## KPI

- % de fiches complètes (champs obligatoires renseignés).
- % de fiches actives avec prochaine action datée (cible : 100 %).
- Comptes en stagnation (aucun mouvement > 14 jours) : à zéro.
- Taux de conversion entre étapes (détecte les fuites).

## Process

### Geste 1 — Créer une fiche (dans les 24 h après tout contact)

Tout chirurgien identifié, quel que soit le canal, entre dans le CRM. Remplir les
champs obligatoires (`03_CRM/CRM_SCHEMA.md`) :

- [ ] `nom`, `specialite`, `ville_region`, `type_structure`
- [ ] `volume_post_op_estime`
- [ ] `source` (linkedin / seo / abm / referral / event / inbound)
- [ ] `owner`
- [ ] `stage_pipeline` = `Identifié`
- [ ] `derniere_interaction` = aujourd'hui

### Geste 2 — Scorer (immédiatement après création)

Appliquer `03_CRM/SCORING_MODEL.md` :

1. Calculer **Fit ICP** (0–60) : volume, structure, spécialité, géo.
2. Calculer **Intent** (0–40) : réponse, contenu consulté, referral, signaux, inbound.
3. `score` = Fit + Intent (max 100). Renseigner `tier` :

| Score | Tier | Action par défaut |
|---|---|---|
| 70–100 | Tier 1 | ABM personnalisé prioritaire (`ABM_PLAYBOOK.md`) |
| 50–69 | Tier 2 | Approche structurée multi-touch |
| 30–49 | Tier 3 | Nurturing / contenu |
| < 30 | — | Archive / réveil futur |

> Seuil « Qualifié » du pipeline : score ≥ 50. En dessous → `Nurturing`.

### Geste 3 — Faire avancer dans le pipeline

Respecter les 7 étapes (`03_CRM/PIPELINE_STAGES.md`). On ne saute pas d'étape sans
critère de passage rempli :

| Étape | Critère pour passer à la suivante |
|---|---|
| Identifié | Score calculé, tier assigné → `Qualifié` |
| Qualifié | Décision d'approcher → `Contacté` |
| Contacté | Réponse reçue → `Engagé` |
| Engagé | RDV planifié → `RDV / Démo` |
| RDV / Démo | Intérêt confirmé → `Proposition` |
| Proposition | Accord verbal → `Signé` |

Sorties : `Perdu` (avec `raison_perte`) ou `Nurturing` (avec date de réveil).

### Geste 4 — Poser la prochaine action (à CHAQUE interaction)

Après toute interaction, mettre à jour 3 champs, sans exception :

- [ ] `derniere_interaction` = aujourd'hui
- [ ] `prochaine_action` (verbe + objet : « envoyer cas d'usage clinique privée »)
- [ ] `prochaine_action_date` (jamais vide pour un compte actif)

Si une fiche n'a pas de prochaine action → soit on la définit, soit on bascule le
compte en `Nurturing` ou `Perdu`. Jamais de zone grise.

### Geste 5 — Routine de nettoyage (lundi, ~30 min)

1. Filtrer les comptes sans `prochaine_action_date` → corriger.
2. Filtrer les comptes actifs sans interaction > 14 j → relancer ou requalifier.
3. Vérifier que chaque `Perdu` a une `raison_perte`.
4. Recalculer les scores des comptes ayant eu une interaction marquante.
5. Faire remonter les `objections` collectées vers `02_ICP_MESSAGING/OBJECTIONS.md`.
6. Alimenter `08_KPIS/WEEKLY_REPORT.md` avec les chiffres du pipeline.

## TODO

- [ ] Configurer les vues CRM : « Sans prochaine action », « Stagnation > 14 j », « Tier 1 actifs ».
- [ ] Mettre en place le calcul de score (auto ou manuel).
- [ ] Caler la routine du lundi dans l'agenda.
- [ ] Relier le suivi des conversions à `08_KPIS/KPI_DASHBOARD.md`.

## Auto-audit

- Est-ce actionnable ? **Oui** — 5 gestes répétables.
- Est-ce utile au Growth Ops ? **Oui** — c'est son geste quotidien.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — aucun compte perdu.
- Est-ce que cela simplifie le pilotage ? **Oui** — pipeline toujours propre.
- Est-ce trop complexe ? **Non** — gestes courts.
- Peut-on supprimer quelque chose ? Fusionner Geste 1 et 2 si le CRM auto-score.
- Prochaine amélioration recommandée : automatiser les alertes « prochaine action en retard ».
