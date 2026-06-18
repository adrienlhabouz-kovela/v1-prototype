# KGOS — KOVELA Growth Operating System

**Valeur stratégique :** ★★★★★
**Owner :** Adrien
**Statut :** Active
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Document maître du système d'acquisition de KOVELA. Il décrit **la machine**
complète : vision, stratégie, moteurs d'acquisition, IA, CRM, contenu, ABM,
community, KPI, Growth Ops et roadmap. Les autres dossiers détaillent chaque
brique ; ce fichier donne la vue d'ensemble et les liens.

## Objectif

Donner une vision unifiée et reproductible de la façon dont KOVELA acquiert des
chirurgiens, pour que l'exécution ne dépende pas d'une personne.

## Action attendue

Permettre à Adrien aujourd'hui — et au Growth Ops demain — de comprendre la
machine entière en une lecture et de savoir quel levier activer pour passer au
palier suivant.

## KPI (santé globale du système)

- Nombre de chirurgiens **actifs** (KPI nord).
- Chirurgiens signés / mois.
- Pipeline qualifié (Tier 1 + Tier 2).
- Taux de conversion identifié → contacté → RDV → signé.
- Coût d'acquisition par chirurgien signé.

---

## 1. Vision

KOVELA devient l'**infrastructure opérationnelle de référence du post-opératoire
premium** pour chirurgiens. La trajectoire :

`10–20 → 50 → 100 → 200 → (ambition) 500 chirurgiens actifs.`

La croissance se fait par une **machine d'acquisition** systémique, pas par des
coups ponctuels.

## 2. Positionnement & message

- **Positionnement :** une extension opérationnelle premium du cabinet, opérée
  humainement et augmentée par IA interne, qui structure le suivi post-opératoire
  **sans se substituer au chirurgien.**
- **Message central :** *Le post-op ne doit plus saturer votre cabinet.*
- **Preuves à mobiliser :** réduction du bruit post-op, traçabilité, vigilance
  opérationnelle, expérience patient, temps cabinet récupéré.
- **Interdits de vocabulaire :** voir `CLAUDE.md` (pas de claim médical / IA
  autonome / urgence / diagnostic).

## 3. Stratégie growth

- **Compounding > one-shot :** privilégier les actifs qui se cumulent (SEO,
  contenu, CRM, playbooks).
- **Ciblage chirurgical précis** plutôt que volume large.
- **Cycle de vente assumé long et relationnel** → ABM + signal-based selling.
- **L'IA fait gagner du temps**, elle n'est jamais la promesse vendue au client.

Détails : `01_STRATEGY/GROWTH_STRATEGY.md`, `MARKET_THESIS.md`, `GROWTH_PRINCIPLES.md`.

## 4. Moteurs d'acquisition

La machine combine les moteurs suivants (détaillés dans `04_ACQUISITION/`) :

| Moteur | Rôle | Horizon | Fichier |
|---|---|---|---|
| SEO | Capter la demande latente | Long | `05_CONTENT/SEO_STRATEGY.md` |
| LinkedIn Adrien | Autorité fondateur | Court/moyen | `05_CONTENT/LINKEDIN_ADRIEN.md` |
| LinkedIn KOVELA | Marque & preuve | Moyen | `05_CONTENT/LINKEDIN_KOVELA.md` |
| Landing acquisition | Convertir l'intérêt | Court | `04_ACQUISITION/LANDING_CONVERSION.md` |
| ABM chirurgical | Cibler les comptes clés | Court/moyen | `04_ACQUISITION/ABM.md` |
| Signal-based selling | Timing d'approche | Court | `04_ACQUISITION/SIGNAL_BASED_SELLING.md` |
| Retargeting / ads | Rester présent | Court | `04_ACQUISITION/ADS_RETARGETING.md` |
| Partenariats | Accès & crédibilité | Moyen | `04_ACQUISITION/PARTNERSHIPS.md` |
| Community / events | Confiance & réseau | Moyen/long | `04_ACQUISITION/COMMUNITY_EVENTS.md` |
| Referral | Croissance organique | Moyen | `IDEAS.md` (à formaliser) |

Tous ces moteurs **alimentent le CRM** et sont pilotés via les **playbooks**.

## 5. IA (interne, au service de l'exécution)

L'IA accélère l'équipe growth. **5 agents au démarrage** (voir `06_AI/`) :

1. IA CRM / enrichissement
2. IA scoring
3. IA résumé de call
4. IA contenu (recyclage)
5. IA objections (extraction)

Doctrine complète : `06_AI/AI_DOCTRINE.md`. Index des prompts : `06_AI/PROMPTS_INDEX.md`.

## 6. CRM

Colonne vertébrale de la machine. Tout lead identifié y entre, est scoré et suit
un pipeline clair. Voir `03_CRM/` : `CRM_SCHEMA.md`, `PIPELINE_STAGES.md`,
`SCORING_MODEL.md`, `WEEKLY_CRM_ROUTINE.md`.

## 7. Contenu

SEO (demande latente) + LinkedIn Adrien (autorité) + LinkedIn KOVELA (marque),
le tout **recyclé** pour maximiser le rendement. Voir `05_CONTENT/`.

## 8. ABM & community

- **ABM :** sélection de comptes chirurgicaux Tier 1, approche personnalisée,
  multi-touch. Voir `04_ACQUISITION/ABM.md` + `07_PLAYBOOKS/ABM_PLAYBOOK.md`.
- **Community-led :** événements, présence congrès, réseau chirurgien. Voir
  `04_ACQUISITION/COMMUNITY_EVENTS.md`.

## 9. KPI & pilotage

Pilotage hebdomadaire en 10 questions (voir `08_KPIS/WEEKLY_REPORT.md`) :

1. Où en est le pipeline ?
2. Combien de chirurgiens identifiés ?
3. Combien contactés ?
4. Combien de RDV générés ?
5. Quel canal fonctionne ?
6. Quel contenu fonctionne ?
7. Quelles objections reviennent ?
8. Quelle IA fait gagner du temps ?
9. Quel est le prochain blocage ?
10. Que fait-on lundi ?

Dashboard : `08_KPIS/KPI_DASHBOARD.md`.

## 10. Growth Ops

Le repo est conçu pour qu'un Growth Ops Manager arrive et **exécute, améliore,
scale** — sans repartir de zéro. Voir `09_GROWTH_OPS/` (rôle, onboarding
30/60/90, routine, 10 premières tâches).

## 11. Roadmap

Vision → calendrier d'exécution : `10_ROADMAP/` (30 / 60 / 90 jours / 12 mois).
Le palier prioritaire actuel : **passer de 10–20 à 50 chirurgiens signés.**

## TODO

- [ ] Valider chaque moteur (actif / en test / à lancer) dans le tableau §4.
- [ ] Brancher les KPI réels une fois le CRM en place.
- [ ] Ajouter un schéma visuel de la machine.

## Auto-audit

- Est-ce actionnable ? **Oui** — chaque section pointe vers une brique opérationnelle.
- Est-ce utile au Growth Ops ? **Oui** — vue d'ensemble unique.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui**
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — c'est une carte, pas un manuel.
- Peut-on supprimer quelque chose ? Garder les moteurs non lancés en backlog si besoin.
- Prochaine amélioration recommandée : statut « actif/test/à lancer » par moteur + dernier chiffre clé.
