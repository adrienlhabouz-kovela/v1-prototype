# 03_CRM — Pilotage du pipeline chirurgiens

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Ce dossier définit comment on **organise, score et fait avancer** les chirurgiens
dans le pipeline. C'est le système nerveux de l'acquisition : structure des
données, étapes, priorisation, routine hebdomadaire. Objectif : passer de
10–20 chirurgiens signés à 50, 100, 200, 500 — sans perdre un compte en route.

## Objectif

Donner au Growth Ops un système CRM lisible et reproductible pour savoir, à tout
moment, où en est chaque chirurgien et quelle est la prochaine action.

## Action attendue

Chaque chirurgien du CRM a : des données conformes au schéma, un score, une étape
de pipeline, et une prochaine action datée.

## KPI

- % de comptes conformes au schéma.
- % de comptes avec prochaine action datée.
- Taux de conversion entre étapes.
- Comptes en stagnation (sans mouvement > X jours).

## Process — Les fichiers du dossier

| Fichier | Rôle |
|---|---|
| `CRM_SCHEMA.md` | Structure des données : champs, types, règles de saisie |
| `PIPELINE_STAGES.md` | Les 7 étapes du pipeline, critères d'entrée et de passage |
| `SCORING_MODEL.md` | Score Fit + Intent, mapping tier → action |
| `WEEKLY_CRM_ROUTINE.md` | Routine de nettoyage et de pilotage du lundi matin |

### Comment ils s'articulent

1. **`CRM_SCHEMA.md`** pose les fondations : sans données propres, rien ne marche.
2. **`SCORING_MODEL.md`** priorise : qui approcher en premier.
3. **`PIPELINE_STAGES.md`** fait avancer : où en est le compte, que faire ensuite.
4. **`WEEKLY_CRM_ROUTINE.md`** maintient le tout vivant et fiable chaque semaine.

## TODO

- [ ] Implémenter le schéma dans l'outil CRM.
- [ ] Activer le scoring et le mapping tier.
- [ ] Mettre en place les 7 étapes.
- [ ] Lancer la routine hebdomadaire du lundi.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — c'est l'index du dossier CRM.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — aucun compte perdu.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Non, c'est l'index.
- Prochaine amélioration recommandée : ajouter un schéma visuel du cycle de vie d'un compte.
