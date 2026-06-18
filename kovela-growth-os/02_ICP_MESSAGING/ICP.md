# ICP — Profil client idéal (chirurgien)

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Le client idéal de KOVELA est un **chirurgien à fort volume post-opératoire,
exerçant en clinique privée ou cabinet premium**, dans une spécialité où le suivi
post-op est lourd et anxiogène (esthétique/plastique en tête), sensible à
l'expérience patient et saturé par le bruit post-op. Spécialités, volume,
structure et zone définissent le Fit.

## Objectif

Définir précisément qui KOVELA cible pour concentrer l'effort et alimenter le
scoring (Fit ICP).

## Action attendue

Qualifier ou disqualifier un chirurgien en quelques critères, et nourrir le
calcul du `score` dans `../03_CRM/SCORING_MODEL.md`.

## KPI

- % de prospects conformes à l'ICP dans le pipeline.
- Taux de signature des prospects « Fit élevé » vs « Fit faible ».

## Process — Critères de l'ICP

### 1. Spécialités prioritaires

| Priorité | Spécialités | Pourquoi |
|---|---|---|
| **Prioritaire** | Chirurgie esthétique / plastique | Volume post-op élevé, forte anxiété patient, exigence d'expérience premium, activité libérale. |
| **Prioritaire** | Chirurgie bariatrique | Suivi post-op long et structuré, fort besoin de coordination et de remontée d'informations. |
| **Secondaire** | Chirurgie orthopédique (libérale) | Volume important, suivi de récupération, mais cadre souvent plus institutionnel. |
| **Secondaire** | Chirurgie dermatologique / dentaire-maxillo, ophtalmo (réfractive) | Post-op cadré, patientèle premium, volumes variables. |
| **Hors cible (pour l'instant)** | Chirurgie d'urgence, oncologie lourde, secteur 100 % hospitalier public | Cadre médical/urgentiste hors positionnement KOVELA. |

> Règle doctrine : KOVELA opère **autour** de l'acte (coordination, bruit), jamais
> sur l'urgence ou la décision médicale.

### 2. Volume post-opératoire

- **Élevé** (cible idéale) : flux post-op soutenu et régulier → saturation réelle
  du cabinet → ROI évident de la coordination opérée.
- **Moyen** : éligible, à qualifier sur la douleur ressentie.
- **Faible** : rarement prioritaire (problème peu aigu).

### 3. Type de structure

- **Clinique privée premium** (idéal) : exigence d'expérience patient, moyens,
  décision rapide.
- **Cabinet libéral** (idéal) : douleur directe de la saturation, décideur unique.
- **Hôpital / public** : peu prioritaire (cycle long, cadre institutionnel,
  décision diffuse).

### 4. Zone géographique

- **Cible :** grandes métropoles françaises à forte densité de chirurgie
  esthétique/privée (Paris, Lyon, Marseille, Bordeaux, Nice, Lille, Toulouse).
- Hors zone → éligible mais priorité moindre tant que l'opération n'est pas
  scalée géographiquement.

### 5. Signaux de fit qualitatif

- Sensible à l'**expérience patient** et à la réputation.
- Cabinet déjà **saturé** par les sollicitations post-op.
- Cherche à **récupérer du temps** sans embaucher.
- Exigeant sur la **traçabilité** et le sérieux.

## Anti-ICP (à disqualifier)

- Recherche une IA médicale / un outil de diagnostic autonome.
- Veut un service d'urgence ou de surveillance médicale.
- Faible volume post-op et aucune douleur ressentie.
- Refus de toute coordination externe par principe.

## Lien scoring

Ces critères alimentent le **Fit ICP (0–60 pts)** de `../03_CRM/SCORING_MODEL.md` :
volume post-op, type de structure, spécialité prioritaire, zone géographique.

## TODO

- [ ] Confirmer le classement des spécialités après les 20 premières signatures.
- [ ] Affiner les zones géo selon la capacité opérationnelle réelle.
- [ ] Documenter 3 profils types (persona) issus du terrain.

## Auto-audit

- Est-ce actionnable ? **Oui** — qualifie/disqualifie en quelques critères.
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — vise les bons.
- Est-ce que cela simplifie le pilotage ? **Oui** — branché sur le scoring.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Fusionner secondaire/dermato si bruité.
- Prochaine amélioration recommandée : remplacer les hypothèses de spécialité par des données de signature réelles.
