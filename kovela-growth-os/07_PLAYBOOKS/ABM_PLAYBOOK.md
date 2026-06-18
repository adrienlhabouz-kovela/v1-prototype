# ABM_PLAYBOOK — Procédure ABM pas-à-pas (comptes Tier 1)

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Mode opératoire concret pour exécuter l'ABM défini dans `04_ACQUISITION/ABM.md` :
sélectionner 10–20 comptes Tier 1, les documenter, dérouler une séquence
multi-touch personnalisée sur ~3 semaines, et tout suivre dans le CRM (`03_CRM/`).
On ne cherche pas le volume — on cherche à signer les comptes qui comptent.

## Objectif

Faire avancer dans le pipeline les chirurgiens à plus forte valeur (Tier 1,
score ≥ 70) par une personnalisation qui justifie l'investissement.

## Action attendue

Le Growth Ops maintient en permanence 10–20 comptes Tier 1 actifs, chacun avec une
fiche-compte documentée, une séquence en cours et une prochaine touche datée.

## KPI

- Taux de réponse des comptes Tier 1 (cible : > 30 %).
- Taux de RDV obtenus par compte travaillé.
- Durée *Contacté → RDV* sur les comptes ABM.
- Nb de comptes Tier 1 actifs simultanément (plafond 15–20).

## Process

### Étape 0 — Pré-requis

- CRM opérationnel avec scoring actif (`03_CRM/SCORING_MODEL.md`).
- Plafond strict : **15–20 comptes actifs**. Au-delà, la personnalisation s'effondre.

### Étape 1 — Sélection des comptes Tier 1

Retenir un compte uniquement si tous les critères sont réunis :

- [ ] Score ≥ 70 dans le CRM (Tier 1).
- [ ] Volume post-op estimé élevé.
- [ ] Structure premium (clinique privée / cabinet à fort flux).
- [ ] Spécialité prioritaire (`02_ICP_MESSAGING/`).
- [ ] Zone géographique cible.

→ Marquer la `source` = `ABM` dans le CRM.

### Étape 2 — Recherche par compte (AVANT tout contact)

Documenter dans `notes` de la fiche CRM :

| Élément | Ce qu'on cherche |
|---|---|
| Structure & spécialité | Type, taille, volume d'activité visible |
| Tension post-op | Saturation cabinet, délais, équipe réduite |
| Présence en ligne | Publications, interviews, congrès |
| Point d'entrée humain | Pair commun, referral possible |
| **Angle personnalisé** | LA phrase qui prouve qu'on a fait le travail |

> L'IA interne peut préparer cette recherche (`06_AI/SURGEON_ENRICHMENT_PROMPT.md`),
> mais l'angle final est validé humainement.

### Étape 3 — Séquence multi-touch personnalisée (≈ 3 semaines)

| Jour | Canal | Contenu | Stage CRM après envoi |
|---|---|---|---|
| J0 | LinkedIn | Connexion sans pitch, note courte personnalisée | `Contacté` |
| J3 | LinkedIn | Message d'ouverture : angle compte + message central | `Contacté` |
| J6 | Email | Email court, valeur concrète, sans claim médical, CTA RDV | `Contacté` |
| J10 | LinkedIn / Email | Preuve / cas d'usage pertinent pour sa structure | `Engagé` si réponse |
| J14 | Email | Relance + proposition de créneau précis | — |
| J21 | Réseau / referral | Touche via pair si disponible | — |

Règles de fond :
- Toujours partir de SON contexte, jamais de la fonctionnalité.
- Positionner KOVELA comme extension opérationnelle du cabinet. Jamais de promesse médicale.
- **Un seul CTA par message : obtenir un RDV.**

### Étape 4 — Suivi CRM

- Chaque touche → `derniere_interaction` mise à jour + `prochaine_action` datée.
- Progression pipeline (`03_CRM/PIPELINE_STAGES.md`) :
  réponse → `Engagé` ; RDV planifié → `RDV / Démo`.
- Capturer toute objection dans `objections` (alimente `02_ICP_MESSAGING/OBJECTIONS.md`).

### Étape 5 — Arbitrage de fin de séquence

| Issue | Action |
|---|---|
| Engagé / RDV obtenu | Continuer le process commercial |
| Pas de réponse après J21 | `Nurturing` avec date de réveil |
| Refus | `Perdu` + `raison_perte` (apprentissage) |

### Étape 6 — Revue ABM hebdomadaire

- Passer en revue chaque compte actif : où en est-il, prochaine touche datée ?
- Remplacer les comptes sortis (perdus / nurturing) pour rester à 15–20 actifs.
- Reporter dans `08_KPIS/WEEKLY_REPORT.md`.

## TODO

- [ ] Établir la première liste de 15 comptes Tier 1.
- [ ] Créer le template de fiche-compte ABM dans le CRM.
- [ ] Rédiger les variantes de séquence par spécialité prioritaire.
- [ ] Brancher l'IA interne pour la recherche compte (`06_AI/`).

## Auto-audit

- Est-ce actionnable ? **Oui** — séquence datée + critères + arbitrage.
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — sur les comptes à plus forte valeur.
- Est-ce que cela simplifie le pilotage ? **Oui** — peu de comptes, suivi serré.
- Est-ce trop complexe ? **Non** si on respecte le plafond.
- Peut-on supprimer quelque chose ? Réduire la séquence à 4 touches si le taux de réponse reste élevé.
- Prochaine amélioration recommandée : créer des séquences par spécialité une fois l'angle gagnant identifié.
