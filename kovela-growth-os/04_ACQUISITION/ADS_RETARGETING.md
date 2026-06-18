# ADS_RETARGETING — Publicité & retargeting

**Valeur stratégique :** ★★★☆☆
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Les ads ne **créent pas** la demande chez KOVELA : elles **amplifient un message
déjà validé** et réactivent des audiences déjà exposées. On ne lance rien tant
que le message n'a pas converti organiquement. Budget prudent, LinkedIn en
priorité (ciblage par spécialité/fonction), retargeting d'abord. C'est un moteur
d'accélération, pas de démarrage.

## Objectif

Augmenter le rendement des autres moteurs en réexposant les chirurgiens déjà en
contact avec KOVELA (visiteurs landing, audience LinkedIn) jusqu'au RDV.

## Action attendue

Le Growth Ops n'active les ads qu'**après validation du message**, avec un budget
test plafonné, et mesure le coût par RDV avant tout scaling.

## KPI

- Coût par RDV qualifié (CPL → CPRDV).
- Taux de conversion des audiences retargetées vs froides.
- ROAS opérationnel : signatures attribuables / budget engagé.

## Process

### 1. Condition d'activation (gate)

**Ne pas lancer d'ads tant que :**

- [ ] Le message central n'a pas converti en organique (landing ≥ seuil de conversion).
- [ ] La landing convertit (`LANDING_CONVERSION.md`).
- [ ] On peut tracker la source et le RDV dans le CRM.

> Tant que ces conditions ne sont pas remplies, dépenser en ads = acheter du
> trafic qui ne convertit pas. On attend.

### 2. Plateformes

| Plateforme | Usage | Priorité |
|---|---|---|
| **LinkedIn Ads** | Ciblage par fonction (chirurgien), spécialité, structure, zone | **Prioritaire** — l'audience B2B médicale est ici |
| **Retargeting (LinkedIn / web)** | Réexposer visiteurs landing et audience de contenu | Prioritaire — meilleur rendement |
| Google (search de marque) | Capter les recherches « KOVELA » + intentions précises | Secondaire |

On évite les plateformes grand public (pas de pertinence, risque de claim mal cadré).

### 3. Audiences

| Audience | Température | Message |
|---|---|---|
| **Retargeting landing** | Chaude | Rappel du bénéfice + CTA RDV |
| **Retargeting contenu** (vues posts/webinaire) | Tiède | Preuve + invitation à l'échange |
| **Lookalike de chirurgiens signés** | Froide | Message central, à activer après validation |
| **Ciblage froid par spécialité** | Froide | En dernier, budget limité, test only |

### 4. Budget prudent

- Démarrer en **budget test plafonné** (ex. petit budget hebdo), retargeting d'abord.
- Ne scaler **que** sur une audience dont le coût par RDV est sous le seuil cible.
- Couper toute audience non rentable sous 2 semaines.

### 5. Mesure & conformité

- Suivre coût par RDV par audience ; comparer au coût des moteurs organiques.
- Tout RDV issu d'ads entre au CRM avec `source_acquisition = ads/retargeting`.
- **Créatifs conformes à la doctrine** : message central, réassurance, **aucun
  claim médical** (mêmes interdits que `LANDING_CONVERSION.md`).

## TODO

- [ ] Vérifier que le gate d'activation est rempli avant tout budget.
- [ ] Installer le pixel / l'audience de retargeting LinkedIn.
- [ ] Définir le coût par RDV cible et le budget test plafond.
- [ ] Faire valider les créatifs (conformité claims).

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — il sait quand NE PAS dépenser.
- Est-ce que cela aide à signer plus de chirurgiens ? **Indirectement** — amplifie ce qui marche déjà.
- Est-ce que cela simplifie le pilotage ? **Oui** — un gate clair évite le gaspillage.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Oui — tant que le message n'est pas validé, ce moteur reste à l'arrêt.
- Prochaine amélioration recommandée : construire les lookalikes à partir des chirurgiens signés dès qu'on a une base suffisante.
