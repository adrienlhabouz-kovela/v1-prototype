# ABM — Account-Based Marketing chirurgical

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

L'ABM concentre l'effort sur un **petit nombre de chirurgiens Tier 1** traités
chacun comme un compte unique : recherche approfondie, message ultra-personnalisé,
séquence multi-touch sur plusieurs canaux. On ne cherche pas le volume — on
cherche à **signer les comptes qui comptent**. C'est le moteur principal au stade
des premiers signés.

## Objectif

Faire entrer et avancer dans le pipeline les chirurgiens à plus forte valeur
(Tier 1, score ≥ 70 — voir `03_CRM/SCORING_MODEL.md`) par une approche dont la
personnalisation justifie l'investissement.

## Action attendue

Le Growth Ops sélectionne 10–20 comptes Tier 1, les documente, et exécute une
séquence multi-touch personnalisée par compte, suivie dans le CRM.

## KPI

- Taux de réponse des comptes Tier 1 (cible : > 30 %).
- Taux de RDV obtenus par compte travaillé.
- Durée *Contacté → RDV* sur les comptes ABM.

## Process

### 1. Sélection des comptes Tier 1

Critères (cumulatifs) :

- [ ] Volume post-op estimé élevé.
- [ ] Structure premium (clinique privée, cabinet à fort flux).
- [ ] Spécialité prioritaire (voir `02_ICP_MESSAGING/`).
- [ ] Zone géographique cible.
- [ ] Score ≥ 70 dans le CRM.

> Plafond recommandé : **15–20 comptes actifs simultanément**. Au-delà, la
> personnalisation s'effondre et l'ABM devient du mailing de masse déguisé.

### 2. Recherche par compte (avant tout contact)

Pour chaque compte, documenter dans le CRM (`notes`) :

- Structure, spécialité, volume d'activité visible.
- Signe de tension post-op (saturation cabinet, délais, équipe réduite).
- Présence en ligne (publications, interviews, participation à des congrès).
- Point d'entrée humain (pair commun, referral possible).
- **Angle personnalisé** : la phrase qui prouve qu'on a fait le travail.

### 3. Séquence multi-touch personnalisée (≈ 3 semaines)

| Jour | Canal | Contenu |
|---|---|---|
| J0 | LinkedIn | Connexion sans pitch, note courte et personnalisée |
| J3 | LinkedIn | Message d'ouverture : angle compte + message central (*« Le post-op ne doit plus saturer votre cabinet »*) |
| J6 | Email | Email court, valeur concrète, sans claim médical, CTA RDV |
| J10 | LinkedIn / Email | Preuve / cas d'usage pertinent pour sa structure |
| J14 | Email | Relance + proposition de créneau précis |
| J21 | Canal de son réseau | Touche via referral / pair si disponible |

Règles de fond :

- Toujours partir de **son contexte**, jamais de la fonctionnalité.
- Positionner KOVELA comme **extension opérationnelle du cabinet**, pas comme un
  outil. Jamais de promesse médicale.
- Un seul CTA par message : **obtenir un RDV**.

### 4. Mesure et arbitrage

- Suivre chaque compte dans le pipeline (`03_CRM/PIPELINE_STAGES.md`).
- Après la séquence : *Engagé* → continuer ; *pas de réponse* → `Nurturing` avec
  date de réveil ; *refus* → `raison_perte`.
- Revue ABM hebdomadaire : avancement par compte + prochaine touche datée.

## TODO

- [ ] Établir la première liste de 15 comptes Tier 1.
- [ ] Créer un template de fiche-compte ABM dans le CRM.
- [ ] Rédiger les variantes de séquence par spécialité prioritaire.
- [ ] Brancher l'IA interne pour préparer la recherche compte (`06_AI/`).

## Auto-audit

- Est-ce actionnable ? **Oui** — séquence et critères prêts à l'emploi.
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — sur les comptes à plus forte valeur.
- Est-ce que cela simplifie le pilotage ? **Oui** — peu de comptes, suivi serré.
- Est-ce trop complexe ? **Non** si on respecte le plafond de comptes.
- Peut-on supprimer quelque chose ? Réduire la séquence à 4 touches si le taux de réponse reste élevé.
- Prochaine amélioration recommandée : créer des séquences par spécialité une fois l'angle gagnant identifié.
