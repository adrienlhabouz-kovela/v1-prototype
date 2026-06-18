# 04_ACQUISITION — Vue d'ensemble des moteurs d'acquisition

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Ce dossier contient **tous les moteurs qui font entrer des chirurgiens dans le
pipeline**. Chaque moteur produit des comptes identifiés ou des signaux ; tout
converge vers le CRM (`03_CRM/`) et l'étape *Identifié* du pipeline
(`03_CRM/PIPELINE_STAGES.md`). Un seul principe : aucun moteur ne tourne dans le
vide — chacun alimente le pipeline et se mesure.

## Objectif

Donner au Growth Ops une carte claire des moteurs d'acquisition, de leur rôle et
de la façon dont ils nourrissent le CRM, pour décider **où mettre l'effort** sans
se disperser.

## Action attendue

À la lecture de ce dossier, le Growth Ops sait : quels moteurs sont actifs,
lequel ouvrir en premier, et comment chaque contact entrant atterrit dans le CRM
avec un `stage_pipeline` et une `prochaine_action`.

## KPI

- Nombre de chirurgiens *Identifiés* entrés par moteur / semaine.
- Coût et temps par compte entré (effort vs rendement).
- Part du pipeline attribuable à chaque moteur (mix d'acquisition).

## Process — Comment lire ce dossier

| Fichier | Rôle |
|---|---|
| `ACQUISITION_SYSTEM.md` | Le système global : tous les moteurs et leur articulation. À lire en premier. |
| `ABM.md` | Approche personnalisée des comptes Tier 1. |
| `SIGNAL_BASED_SELLING.md` | Déclencher l'approche au bon moment, sur signal. |
| `LANDING_CONVERSION.md` | Convertir l'attention en RDV. |
| `ADS_RETARGETING.md` | Amplifier après validation du message. |
| `PARTNERSHIPS.md` | Cliniques, réseaux, prescripteurs. |
| `COMMUNITY_EVENTS.md` | Congrès, webinaires, referral chirurgien-à-chirurgien. |

## Comment les moteurs alimentent le CRM

```text
Moteurs (SEO, LinkedIn, ABM, signaux, landing, ads,
partenariats, community, referral)
        │
        ▼
  Compte créé / enrichi dans 03_CRM/CRM_SCHEMA.md
        │
        ▼
  Scoring (03_CRM/SCORING_MODEL.md) → tier
        │
        ▼
  Pipeline (03_CRM/PIPELINE_STAGES.md) : Identifié → Qualifié → …
```

Règle : **tout contact entrant devient un compte CRM dans les 24 h**, avec source
renseignée (`source_acquisition`) pour pouvoir mesurer le mix.

## TODO

- [ ] Valider quels moteurs sont actifs au stade actuel (10–20 premiers signés).
- [ ] Renseigner le champ `source_acquisition` dans le CRM pour chaque entrée.
- [ ] Définir le moteur prioritaire du trimestre dans `NOW.md`.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — c'est sa carte d'orientation.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — concentre l'effort sur ce qui remplit le pipeline.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Non à ce stade.
- Prochaine amélioration recommandée : ajouter un tableau de contribution par moteur une fois les premières données disponibles.
