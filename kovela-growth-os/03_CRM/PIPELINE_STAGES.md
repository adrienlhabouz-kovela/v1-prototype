# PIPELINE_STAGES — Étapes du pipeline

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Le pipeline de signature d'un chirurgien, en **7 étapes claires**, chacune avec
une définition d'entrée, une action attendue et un critère de passage. Objectif :
répondre en 5 secondes à *« où en est ce chirurgien et que fait-on ? »*.

## Objectif

Standardiser le parcours d'un chirurgien, de l'identification à la signature (et
au-delà), pour mesurer la conversion et savoir où ça bloque.

## Action attendue

Chaque chirurgien du CRM porte un `stage_pipeline` à jour et une `prochaine_action`.

## KPI

- Taux de conversion entre chaque étape.
- Durée moyenne par étape (détecter les goulots).
- Nombre de comptes par étape (santé du pipeline).

## Process — Les étapes

| # | Étape | Définition d'entrée | Action attendue | Critère de passage |
|---|---|---|---|---|
| 1 | **Identifié** | Chirurgien repéré et fit ICP plausible | Enrichir + scorer | Score calculé, tier assigné |
| 2 | **Qualifié** | Score ≥ seuil, fit confirmé | Choisir le canal d'approche | Décision d'approcher |
| 3 | **Contacté** | Premier message envoyé (DM / email / intro) | Obtenir une réponse | Réponse reçue |
| 4 | **Engagé** | Conversation active, intérêt manifesté | Proposer un RDV | RDV planifié |
| 5 | **RDV / Démo** | Rendez-vous tenu | Présenter, traiter les objections | Intérêt confirmé post-RDV |
| 6 | **Proposition** | Offre / pilote envoyé | Négocier, lever les freins | Accord verbal |
| 7 | **Signé** | Contrat / pilote signé | Onboarder | Chirurgien actif |

### Étapes de sortie

- **Perdu** — avec `raison_perte` (alimente les objections).
- **Nurturing** — pas maintenant, à recontacter (avec date de réveil).

## Règles

- Un chirurgien ne saute pas d'étape sans critère de passage rempli.
- « Perdu » exige toujours une **raison** (apprentissage).
- Tout compte en « Engagé / RDV / Proposition » a une prochaine action **datée**.
- Le pipeline se nettoie chaque semaine (voir `WEEKLY_CRM_ROUTINE.md`).

## Mapping vers l'acquisition

- Étapes 1–2 alimentées par : ABM, SEO, LinkedIn, signaux, referral.
- Étapes 3–4 pilotées par : playbooks d'approche (`07_PLAYBOOKS/`).
- Étapes 5–7 : process commercial Adrien → Growth Ops.

## TODO

- [ ] Implémenter ces 7 étapes dans le CRM.
- [ ] Définir le seuil de score pour passer « Qualifié » (voir `SCORING_MODEL.md`).
- [ ] Mettre en place le suivi des taux de conversion par étape.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — détecte les fuites.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — 7 étapes lisibles.
- Peut-on supprimer quelque chose ? Fusionner « Proposition » et « RDV » si le cycle est court.
- Prochaine amélioration recommandée : ajouter une cible de durée max par étape.
