# WEEKLY_CRM_ROUTINE — Routine CRM hebdomadaire

**Valeur stratégique :** ★★★★★
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Le lundi matin, en **45 minutes**, le Growth Ops remet le pipeline d'aplomb :
nettoyage, scores à jour, comptes sans prochaine action, comptes en stagnation,
relances déclenchées, reporting envoyé. Sans cette routine, le CRM pourrit et des
chirurgiens se perdent silencieusement.

## Objectif

Garantir un pipeline propre, à jour et actionnable chaque semaine, pour qu'aucun
chirurgien ne reste sans suite et que la priorisation reste juste.

## Action attendue

Exécuter la checklist du lundi matin et clôturer par un reporting court.

## KPI

- 0 compte actif sans prochaine action datée (après routine).
- 0 compte en stagnation non traité.
- Temps de routine ≤ 45 min.
- Nombre de relances déclenchées / semaine.

## Process — Checklist du lundi matin

### 1. Nettoyage du pipeline (10 min)
- [ ] Supprimer / fusionner les doublons.
- [ ] Corriger les champs manquants ou non conformes (`CRM_SCHEMA.md`).
- [ ] Archiver les comptes « Hors cible » (score < 30) avec date de réveil éventuelle.

### 2. Mise à jour des scores (5 min)
- [ ] Recalculer le score des comptes ayant eu une interaction marquante (`SCORING_MODEL.md`).
- [ ] Réajuster les tiers en conséquence.

### 3. Comptes sans prochaine action (10 min)
- [ ] Filtrer les comptes en « Engagé / RDV / Proposition » sans `prochaine_action` datée.
- [ ] Leur en attribuer une, datée, immédiatement. **C'est l'étape non négociable.**

### 4. Comptes en stagnation (10 min)
- [ ] Repérer les comptes sans mouvement depuis > 14 jours (Tier 1/2) ou > 30 jours (Tier 3).
- [ ] Décider : relancer, requalifier, passer en nurturing, ou marquer « Perdu » (avec `raison_perte`).

### 5. Relances (5 min)
- [ ] Déclencher les relances prévues cette semaine (playbooks `07_PLAYBOOKS/`).
- [ ] Programmer les messages de réveil des comptes en nurturing arrivés à échéance.

### 6. Reporting (5 min)
- [ ] Mettre à jour le compteur par étape (santé du pipeline).
- [ ] Noter les conversions de la semaine et les pertes (avec raisons).
- [ ] Envoyer le résumé court (lien `08_KPIS/WEEKLY_REPORT.md`).

### Ordre de priorité si le temps manque

> Étapes **3 et 4** d'abord (sans action / stagnation) : ce sont elles qui
> empêchent de perdre des chirurgiens. Le reste peut attendre.

## TODO

- [ ] Créer les vues / filtres CRM correspondant à chaque étape.
- [ ] Caler un créneau récurrent le lundi 9h–9h45.
- [ ] Définir les seuils exacts de stagnation par tier.
- [ ] Relier au gabarit de reporting `08_KPIS/WEEKLY_REPORT.md`.

## Auto-audit

- Est-ce actionnable ? **Oui** — c'est une checklist directe.
- Est-ce utile au Growth Ops ? **Oui** — son rituel hebdo.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — aucun compte oublié.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — 6 étapes en 45 min.
- Peut-on supprimer quelque chose ? Fusionner nettoyage et scoring si l'outil automatise.
- Prochaine amélioration recommandée : automatiser les alertes « sans action » et « stagnation » pour réduire la routine manuelle.
