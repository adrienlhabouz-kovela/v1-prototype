# KPI_DASHBOARD — Tableau de bord de pilotage

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

La photo de la machine en une page : KPI nord (chirurgiens actifs), santé du
pipeline par étape, taux de conversion à chaque jonction, CAC, et performance par
canal. Tableaux prêts à remplir depuis le CRM (`03_CRM/`). Lu en 1 minute, il dit
si on avance et où ça coince.

## Objectif

Donner une vue d'ensemble chiffrée et actionnable, mise à jour chaque semaine,
pour décider où mettre l'effort.

## Action attendue

Le Growth Ops met à jour ces tableaux chaque vendredi (avant le `WEEKLY_REPORT.md`)
à partir du CRM, et lit chaque écart comme un signal d'action.

## KPI

- KPI nord : chirurgiens actifs (vs objectif de palier).
- Conversions par jonction (identifié → contacté → RDV → signé).
- CAC global et par canal.

## Process — Le dashboard

### 1. KPI nord — Chirurgiens actifs

| Indicateur | Valeur actuelle | Objectif palier | Écart |
|---|---|---|---|
| Chirurgiens actifs (signés) |  | (10–20 / 50 / 100 / 200 / 500) |  |
| Nouveaux signés ce mois |  |  |  |
| Churn (sorties) ce mois |  |  |  |

### 2. Santé du pipeline par étape

Source : `03_CRM/PIPELINE_STAGES.md`.

| Étape | Nb de comptes | Valeur potentielle | Durée moy. dans l'étape | Alerte |
|---|---|---|---|---|
| 1. Identifié |  |  |  |  |
| 2. Qualifié |  |  |  |  |
| 3. Contacté |  |  |  |  |
| 4. Engagé |  |  |  |  |
| 5. RDV / Démo |  |  |  |  |
| 6. Proposition |  |  |  |  |
| 7. Signé |  |  |  |  |
| Nurturing |  |  |  |  |
| Perdu (ce mois) |  | — |  |  |

> Alerte si : un goulot s'accumule, ou une durée d'étape explose.

### 3. Taux de conversion par jonction

| Jonction | Numérateur / Dénominateur | Taux actuel | Cible | Écart |
|---|---|---|---|---|
| Identifié → Contacté | contactés / identifiés |  |  |  |
| Contacté → RDV | RDV / contactés |  |  |  |
| RDV → Signé | signés / RDV |  |  |  |
| **Global** Identifié → Signé | signés / identifiés |  |  |  |

> La jonction au taux le plus faible = le blocage prioritaire de la semaine.

### 4. CAC (coût d'acquisition)

| Indicateur | Valeur | Cible |
|---|---|---|
| Dépense totale acquisition (période) |  |  |
| Nb de chirurgiens signés (période) |  |  |
| **CAC global** = dépense / signés |  |  |

### 5. Performance par canal

Source : champ `source` du CRM (`03_CRM/CRM_SCHEMA.md`).

| Canal | Identifiés | Contactés | RDV | Signés | Coût | CAC canal |
|---|---|---|---|---|---|---|
| LinkedIn (Adrien) |  |  |  |  |  |  |
| LinkedIn (KOVELA) |  |  |  |  |  |  |
| SEO |  |  |  |  |  |  |
| ABM |  |  |  |  |  |  |
| Referral |  |  |  |  |  |  |
| Event |  |  |  |  |  |  |
| Inbound |  |  |  |  |  |  |
| **Total** |  |  |  |  |  |  |

> Lecture : on réalloue l'effort vers les canaux au meilleur ratio RDV/coût, on
> coupe ou retravaille ceux qui ne convertissent pas.

## TODO

- [ ] Brancher chaque tableau sur une vue CRM filtrée.
- [ ] Fixer les cibles de conversion par jonction.
- [ ] Définir le mode de calcul du coût par canal (temps + dépenses).
- [ ] Mettre à jour le dashboard chaque vendredi avant le rapport hebdo.

## Auto-audit

- Est-ce actionnable ? **Oui** — chaque tableau mène à une décision.
- Est-ce utile au Growth Ops ? **Oui** — sa vue d'ensemble.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — révèle le blocage prioritaire.
- Est-ce que cela simplifie le pilotage ? **Oui** — 5 tableaux, 1 page.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Le CAC par canal au tout début si les volumes sont trop faibles.
- Prochaine amélioration recommandée : ajouter une tendance (flèche vs semaine précédente) sur chaque KPI.
