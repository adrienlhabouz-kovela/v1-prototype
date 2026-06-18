# LINKEDIN_PLAYBOOK — Procédure LinkedIn (Adrien + KOVELA)

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Procédure opérationnelle pour faire tourner LinkedIn comme un moteur d'acquisition :
routine quotidienne (20 min) + routine hebdo (publication + ciblage), méthode de
création de post, engagement ciblé, séquence de DM d'approche, et mesure dans le
CRM. Sources éditoriales : `05_CONTENT/LINKEDIN_ADRIEN.md` et `LINKEDIN_KOVELA.md`.

## Objectif

Transformer l'autorité d'Adrien en conversations qualifiées et en RDV, sans jamais
« pitcher », en exécutant une routine constante plutôt que des pics irréguliers.

## Action attendue

Le Growth Ops (ou Adrien) exécute la routine quotidienne et hebdo, ouvre X DM
d'approche par semaine, et trace chaque conversation dans le CRM avec source
`linkedin_adrien` ou `linkedin_kovela`.

## KPI

- Conversations DM ouvertes / semaine (cible de départ : 10).
- Taux de réponse aux DM d'approche (cible : > 25 %).
- RDV générés depuis LinkedIn / mois.
- Abonnés qualifiés gagnés / semaine (chirurgiens, direction cabinet/clinique).

## Process

### 1. Routine QUOTIDIENNE (≈ 20 min, du lundi au vendredi)

| Bloc | Durée | Action |
|---|---|---|
| Veille | 5 min | Lire le fil, repérer 5 chirurgiens/cabinets cibles qui ont publié |
| Engagement | 8 min | Commenter 3–5 posts de cibles (commentaire de valeur, pas « 👏 ») |
| Réponses | 5 min | Répondre à TOUS les commentaires et DM reçus < 24 h |
| Tracking | 2 min | Créer/mettre à jour les fiches CRM des nouvelles conversations |

> Un commentaire de valeur = il apporte un angle terrain, une nuance, une question
> ouverte. Jamais d'auto-promotion en commentaire.

### 2. Routine HEBDOMADAIRE (lundi planification, publication L/Me/V)

- **Lundi (30 min)** : planifier les 3 posts de la semaine selon les 4 piliers
  (`05_CONTENT/LINKEDIN_ADRIEN.md`), choisir 15–20 nouvelles cibles à engager.
- **Lun / Mer / Ven** : publier 1 post (cf. méthode ci-dessous), puis rester actif
  30 min après publication pour répondre aux premiers commentaires (boost portée).
- **Vendredi (15 min)** : remplir la ligne LinkedIn du `08_KPIS/WEEKLY_REPORT.md`.

### 3. Méthode de création de post (modèle réutilisable)

1. **Pilier** : choisir parmi Problème / Méthode / Coulisses / Patient & cabinet.
2. **Accroche (ligne 1)** : une tension concrète, pas un titre. Ex. *« Un chirurgien
   m'a dit cette semaine qu'il prend 30 appels post-op par jour. »*
3. **Corps** : 1 idée, scènes vécues ou chiffres, phrases courtes, aération.
4. **Angle KOVELA** : positionner comme extension opérationnelle du cabinet,
   supervision humaine + IA interne. Jamais de claim médical.
5. **CTA** : discret, 1 post sur 4 max. Ex. *« Si vous gérez ce sujet, j'échange ma
   méthode — écrivez-moi. »*
6. **Vérification doctrine** : aucun mot interdit (cf. `CLAUDE.md`).

> Checklist avant publication : 1 idée unique ? accroche tient sans « voir suite » ?
> ton opérateur (pas vendeur) ? CTA cohérent ? source CRM prête à tracer les DM ?

### 4. Engagement ciblé (warm-up avant DM)

Avant tout DM d'approche, **réchauffer** la cible sur 3–5 jours :

- J1 : suivre le profil + commenter un de ses posts récents.
- J3 : réagir/commenter un 2e contenu.
- J5 : envoyer la demande de connexion (note courte, personnalisée, sans pitch).

### 5. Séquence de DM d'approche (après connexion acceptée)

| Jour | Message | Règle |
|---|---|---|
| J0 | Remerciement + observation personnalisée sur SON contexte (pas de pitch) | Ouvrir la conversation |
| J2 | Apporter de la valeur : un angle terrain sur le post-op, sans vendre | Crédibilité |
| J5 | Message d'ouverture : message central + question (« comment gérez-vous le post-op aujourd'hui ? ») | Faire parler |
| J9 | Si réponse → proposer un échange de 20 min (créneau précis). Si silence → 1 relance unique de valeur | 1 seul CTA : RDV |
| J14 | Si toujours silence → passer en `Nurturing` avec date de réveil | Pas d'acharnement |

> Toujours : un seul CTA = RDV. Jamais de promesse médicale. Toujours partir de son
> contexte.

### 6. Mesure et traçabilité

- Chaque conversation entrante OU initiée → fiche CRM dans les 24 h
  (`03_CRM/CRM_SCHEMA.md`), source `linkedin_adrien` / `linkedin_kovela`.
- `stage_pipeline` mis à jour : DM envoyé = `Contacté` ; réponse = `Engagé` ;
  RDV planifié = `RDV / Démo`.
- Reporter chaque semaine dans `08_KPIS/WEEKLY_REPORT.md` (canal + contenu qui marche).

## TODO

- [ ] Définir la cible hebdo de DM d'approche (10 pour démarrer).
- [ ] Préparer 3 notes de connexion types (par spécialité).
- [ ] Créer le filtre/recherche LinkedIn des cibles ICP.
- [ ] Brancher l'IA interne pour préparer l'angle personnalisé (`06_AI/SURGEON_ENRICHMENT_PROMPT.md`).

## Auto-audit

- Est-ce actionnable ? **Oui** — routines minutées + séquence prête.
- Est-ce utile au Growth Ops ? **Oui** — il sait quoi faire chaque jour.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — DM → RDV.
- Est-ce que cela simplifie le pilotage ? **Oui** — 20 min/jour, mesuré.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Fusionner J2 et J5 de la séquence DM si le cycle est rapide.
- Prochaine amélioration recommandée : créer des variantes de séquence DM par spécialité une fois l'angle gagnant identifié.
