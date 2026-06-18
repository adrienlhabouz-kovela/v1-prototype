# ACQUISITION_SYSTEM — Le système global d'acquisition

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

L'acquisition KOVELA repose sur **10 moteurs** qui ne tournent pas isolément :
ils se renforcent. Deux logiques structurent tout — **créer la demande**
(contenu, présence, réputation) et **capter la demande** (ABM, signaux, referral,
landing). Tout converge vers le CRM et le pipeline. Au stade actuel (premiers
10–20 signés), on privilégie les moteurs à **haute intention et faible coût** :
LinkedIn Adrien, ABM, signaux, referral.

## Objectif

Décrire le système d'acquisition complet, l'articulation des moteurs et la façon
dont ils nourrissent le pipeline — pour que le Growth Ops sache quoi activer,
dans quel ordre, et pourquoi.

## Action attendue

Le Growth Ops choisit le bon moteur selon l'objectif (remplir le haut de pipeline
vs accélérer un compte Tier 1) et s'assure que chaque moteur déverse dans le CRM.

## KPI

- Comptes *Identifiés* entrés par moteur / semaine.
- Comptes *Qualifiés* par moteur (qualité, pas seulement volume).
- RDV obtenus par moteur.
- Mix d'acquisition (part de chaque moteur dans les signatures).

## Process — Les 10 moteurs

### Logique 1 — Créer la demande (long terme, capital de marque)

| # | Moteur | Ce qu'il produit | Alimente |
|---|---|---|---|
| 1 | **SEO** | Trafic qualifié de chirurgiens cherchant à structurer leur post-op | Landing → CRM (*Identifié*) |
| 2 | **LinkedIn Adrien** | Autorité fondateur, conversations entrantes, DM chauds | CRM (*Contacté / Engagé*) |
| 3 | **LinkedIn KOVELA** | Preuve institutionnelle, réassurance, recyclage de contenu | Retargeting + crédibilité ABM |
| 4 | **Community / Events** | Réseau chirurgien-à-chirurgien, congrès, webinaires courts | Referral + comptes Tier 1 |

### Logique 2 — Capter la demande (court terme, haute intention)

| # | Moteur | Ce qu'il produit | Alimente |
|---|---|---|---|
| 5 | **ABM** | Approche personnalisée des comptes Tier 1 sélectionnés | CRM (*Contacté* ciblé) |
| 6 | **Signal-based** | Approche déclenchée au bon moment (nouveau cabinet, recrutement…) | CRM (*Contacté* opportun) |
| 7 | **Landing / Conversion** | Transformation de l'attention en RDV | CRM (*Engagé / RDV*) |
| 8 | **Ads / Retargeting** | Réactivation d'audiences déjà exposées (après validation message) | Landing → CRM |
| 9 | **Partenariats** | Accès groupé via cliniques, réseaux, prescripteurs | CRM (*Identifié / Qualifié* par lots) |
| 10 | **Referral** | Recommandation par un chirurgien satisfait (le plus fort levier) | CRM (*Qualifié* à forte intention) |

## Comment ça s'articule

1. **Le contenu (1–4) crée la surface de confiance.** Un chirurgien approché en
   ABM qui a déjà vu Adrien sur LinkedIn répond mieux. La demande créée
   **réduit le coût de la captation**.
2. **La captation (5–10) transforme l'attention en pipeline.** ABM et signaux
   ciblent ; landing et referral convertissent.
3. **Tout déverse dans le CRM** avec `source_acquisition` renseignée, puis suit
   le pipeline (`03_CRM/PIPELINE_STAGES.md`) et le scoring
   (`03_CRM/SCORING_MODEL.md`).

```text
        CRÉER LA DEMANDE                    CAPTER LA DEMANDE
   SEO ─ LinkedIn ─ Community ─ Events     ABM ─ Signaux ─ Referral ─ Partenariats
            │   (réputation)                          │   (intention)
            └──────────────┐          ┌───────────────┘
                           ▼          ▼
                      Landing / Conversion  ◄── Ads / Retargeting
                                │
                                ▼
                    03_CRM — compte + source + score + stage
                                │
                                ▼
            Identifié → Qualifié → Contacté → Engagé → RDV → Proposition → Signé
```

## Priorités par stade

| Stade business | Moteurs prioritaires |
|---|---|
| 10–20 premiers signés | Referral, ABM, Signaux, LinkedIn Adrien (faible coût, haute intention) |
| 50 | + SEO, Community/Events, Partenariats |
| 100+ | + LinkedIn KOVELA structuré, Ads/Retargeting (message validé) |

## Règles

- **Un moteur sans mesure est suspendu.** Si on ne sait pas combien de comptes il
  produit, on l'arrête ou on l'instrumente.
- **Pas d'Ads avant validation du message** (voir `ADS_RETARGETING.md`).
- **Le referral prime** : c'est le moteur au meilleur coût d'acquisition et à la
  meilleure conversion. Le travailler systématiquement après chaque signature.

## TODO

- [ ] Lister les moteurs réellement actifs aujourd'hui (vs théoriques).
- [ ] Désigner le moteur prioritaire du trimestre (à reporter dans `NOW.md`).
- [ ] Brancher `source_acquisition` à chaque moteur dans le CRM.
- [ ] Mettre en place un suivi hebdo du mix d'acquisition (`08_KPIS/`).

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — il voit le système entier.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — priorise les moteurs rentables.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — 10 moteurs, 2 logiques.
- Peut-on supprimer quelque chose ? Fusionner LinkedIn KOVELA et LinkedIn Adrien si la marque n'est pas encore prête.
- Prochaine amélioration recommandée : chiffrer le coût et la conversion par moteur après les 20 premières signatures.
