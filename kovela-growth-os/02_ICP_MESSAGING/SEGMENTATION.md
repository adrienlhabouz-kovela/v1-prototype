# SEGMENTATION — Segments chirurgiens (3 tiers)

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Trois segments pilotés par le score : **Tier 1 stratégiques** (ABM personnalisé
prioritaire), **Tier 2 premium** (approche structurée multi-touch), **Tier 3
éligibles** (nurturing léger par contenu). La segmentation dicte l'intensité et
le type d'approche, et se cale directement sur `../03_CRM/SCORING_MODEL.md`.

## Objectif

Concentrer l'effort commercial sur les comptes à plus forte valeur et adapter
l'approche au potentiel de chaque chirurgien.

## Action attendue

Chaque chirurgien est classé en tier (via le score) et reçoit l'approche
correspondante. L'effort se déporte vers Tier 1 + Tier 2.

## KPI

- % de l'effort concentré sur Tier 1 + Tier 2.
- Taux de signature par tier.
- Délai moyen identifié → signé par tier.

## Process — Les 3 segments

| | **Tier 1 — Stratégiques** | **Tier 2 — Premium** | **Tier 3 — Éligibles** |
|---|---|---|---|
| **Score** | 70–100 | 50–69 | 30–49 |
| **Profil** | Fit ICP fort + intent élevé : gros volume post-op, clinique/cabinet premium, spécialité prioritaire, zone cible, signaux d'intérêt. | Bon fit ICP, intent modéré. Premium mais à mûrir. | Fit correct mais incomplet (volume moyen, hors zone, spécialité secondaire) ou intent faible. |
| **Taille estimée** | Étroit — quelques comptes à la fois (qualité > quantité). | Cœur du pipeline travaillé activement. | Large — réservoir de nurturing. |
| **Priorité** | Maximale. | Haute. | Basse / opportuniste. |
| **Approche** | **ABM personnalisé** : recherche du compte, message sur-mesure, multi-touch, séquence longue, déclenchée par signal. | **Approche structurée multi-touch** : séquences semi-personnalisées, contenu ciblé, RDV. | **Nurturing** : contenu, newsletter, présence LinkedIn, réveil au signal. Pas d'effort 1:1 lourd. |
| **Owner** | Adrien / Growth Ops senior. | Growth Ops. | Automatisé / contenu + IA. |
| **Objectif** | Signer. | Faire monter en intent → Tier 1 → signer. | Qualifier le moment où l'intent monte. |

## Règles de mouvement entre tiers

- Un Tier 3 qui émet un **signal d'achat** (RDV demandé, expansion, referral) →
  recalculer le score → peut basculer Tier 2/1.
- Un Tier 1 sans interaction > 30 j perd des points d'intent → revoir l'approche
  avant de le laisser refroidir.
- Le **jugement humain peut surclasser** un compte stratégique malgré un score
  moyen (à documenter dans `notes`).

## Lien scoring

La segmentation **est** le mapping score → tier de `../03_CRM/SCORING_MODEL.md`.
Seuil « Qualifié » du pipeline : score ≥ 50 (Tier 1 ou 2). En dessous →
nurturing. Toute évolution des seuils se fait dans le SCORING_MODEL, pas ici.

## TODO

- [ ] Fixer un volume cible de comptes Tier 1 actifs simultanément (capacité ABM).
- [ ] Définir la cadence de revue des tiers (hebdo via `../03_CRM/WEEKLY_CRM_ROUTINE.md`).
- [ ] Brancher l'IA scoring pour le reclassement automatique.

## Auto-audit

- Est-ce actionnable ? **Oui** — chaque tier a une approche claire.
- Est-ce utile au Growth Ops ? **Oui** — il sait où mettre l'effort.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — priorise les comptes à valeur.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — 3 segments.
- Peut-on supprimer quelque chose ? Fusionner Tier 2/3 si le pipeline est petit au début.
- Prochaine amélioration recommandée : ajouter le taux de conversion réel par tier une fois les données disponibles.
