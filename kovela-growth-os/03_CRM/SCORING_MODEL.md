# SCORING_MODEL — Modèle de scoring chirurgien

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Un score sur 100 qui combine **Fit** (correspond-il à l'ICP ?) et **Intent**
(montre-t-il des signaux d'intérêt ?). Le score détermine le `tier` et la
priorité d'approche. Simple, transparent, recalculable à la main si besoin.

## Objectif

Prioriser l'effort commercial sur les chirurgiens les plus susceptibles de
signer et d'avoir de la valeur — au lieu de traiter tout le monde pareil.

## Action attendue

Chaque chirurgien reçoit un `score` et un `tier`, qui pilotent l'ordre des actions.

## KPI

- Taux de signature par tranche de score (le modèle prédit-il bien ?).
- % de l'effort concentré sur Tier 1 + Tier 2.

## Process — Calcul du score (0–100)

### A. Fit ICP (0–60 pts)

| Critère | Points max | Barème |
|---|---|---|
| Volume post-op estimé | 20 | élevé 20 / moyen 12 / faible 4 |
| Type de structure | 15 | clinique privée 15 / cabinet 12 / hôpital 6 |
| Spécialité prioritaire | 15 | prioritaire 15 / secondaire 8 / hors cible 0 |
| Zone géographique cible | 10 | cible 10 / hors cible 3 |

### B. Intent / signaux (0–40 pts)

| Signal | Points |
|---|---|
| A répondu à une approche | +10 |
| A consulté contenu / landing | +8 |
| Recommandé par un pair (referral) | +12 |
| Signal d'expansion (nouveau cabinet, recrutement, croissance) | +6 |
| A demandé un RDV / inbound | +14 |
| Aucune interaction récente (> 30 j) | −5 |

> Score total = Fit + Intent, plafonné à 100.

## Mapping score → tier → action

| Score | Tier | Libellé | Action |
|---|---|---|---|
| 70–100 | **Tier 1** | Chirurgiens stratégiques | Approche ABM personnalisée prioritaire |
| 50–69 | **Tier 2** | Chirurgiens premium | Approche structurée, multi-touch |
| 30–49 | **Tier 3** | Chirurgiens éligibles | Nurturing / contenu, approche légère |
| < 30 | — | Hors cible (pour l'instant) | Archive / réveil futur |

**Seuil « Qualifié » du pipeline :** score ≥ 50 (Tier 1 ou 2). En dessous → nurturing.

## Règles

- Le score est un **outil de priorisation, pas une vérité absolue** : un jugement
  humain peut surclasser un chirurgien stratégique.
- Recalculer le score à chaque interaction marquante.
- Documenter tout ajustement manuel dans `notes`.

## TODO

- [ ] Valider les barèmes avec les données réelles des chirurgiens déjà signés.
- [ ] Définir les spécialités « prioritaires » (lien `02_ICP_MESSAGING/ICP.md`).
- [ ] Automatiser le calcul dans le CRM.
- [ ] Brancher l'IA scoring (`06_AI/AI_AGENTS.md`).

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — il sait quoi faire en premier.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — concentre l'effort.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — deux dimensions seulement.
- Peut-on supprimer quelque chose ? Simplifier l'Intent à 3 signaux si bruité.
- Prochaine amélioration recommandée : calibrer les poids après 20+ signatures réelles.
