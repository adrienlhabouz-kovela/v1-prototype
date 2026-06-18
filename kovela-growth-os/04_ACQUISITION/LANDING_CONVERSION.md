# LANDING_CONVERSION — Landing d'acquisition & conversion

**Valeur stratégique :** ★★★★☆
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

La landing a **un seul job** : transformer l'attention d'un chirurgien en **RDV
réservé**. Message central clair, preuve crédible, réassurance sans aucun claim
médical, un CTA unique. Pas de page institutionnelle bavarde — une page de
conversion. C'est le point d'atterrissage commun de SEO, LinkedIn, ads et
referral.

## Objectif

Convertir les chirurgiens exposés (par tous les moteurs) en RDV qualifiés entrant
dans le pipeline à l'étape *Engagé / RDV* (`03_CRM/PIPELINE_STAGES.md`).

## Action attendue

Le Growth Ops dispose d'une structure de landing prête, peut la mettre à jour, et
chaque réservation de RDV crée automatiquement un compte CRM avec
`source_acquisition`.

## KPI

- Taux de conversion visiteur → RDV (cible initiale : 3–6 %).
- Taux de no-show post-réservation.
- Conversion par source de trafic (quel moteur amène les meilleurs RDV).

## Process — Structure de la landing

| Bloc | Contenu | Règle |
|---|---|---|
| **1. Hero** | Titre = message central : *« Le post-op ne doit plus saturer votre cabinet. »* Sous-titre = positionnement. CTA visible. | Compréhensible en 5 secondes |
| **2. Le problème** | Le bruit post-op : appels, messages, relances qui saturent le cabinet et l'équipe. | Parler de son quotidien, pas de la techno |
| **3. La solution (KOVELA)** | Extension opérationnelle premium, opérée humainement et augmentée par IA interne, qui structure le suivi post-opératoire **sans se substituer au chirurgien**. | Doctrine stricte |
| **4. Comment ça marche** | 3 étapes simples : protocole du chirurgien → coordination opérée → remontée d'informations structurée. | Concret, sans jargon |
| **5. Preuve** | Témoignages chirurgiens, chiffres de réduction du bruit post-op, logos de structures (si autorisés). | Vérifiable, jamais inventé |
| **6. Réassurance** | Supervision humaine, traçabilité, vigilance opérationnelle, respect du protocole et de la responsabilité médicale du chirurgien. | Voir interdits ci-dessous |
| **7. CTA final** | *« Réserver un échange de 20 min »* → Calendly. | Un seul CTA, répété |

### Message central et angle

- Accroche : **« Le post-op ne doit plus saturer votre cabinet. »**
- Promesse : **réduction du bruit post-op**, expérience patient structurée,
  cabinet déchargé de la coordination.
- Jamais : promesse de résultat médical, de surveillance médicale, de diagnostic.

### Éléments de réassurance (sans claim médical)

- [ ] « Vos protocoles, votre cadre médical — nous opérons la coordination. »
- [ ] « Supervision humaine, augmentée par notre IA **interne** (jamais à la place du chirurgien). »
- [ ] « Traçabilité complète et remontée d'informations structurée. »
- [ ] Mentions de conformité / confidentialité des données.

> Interdits sur la page (rappel `CLAUDE.md`) : « diagnostic IA », « IA médicale
> autonome », « chatbot patient », « télésurveillance médicale », « service
> d'urgence », « automatisation médicale ». Toute formulation suggérant que
> KOVELA pose un acte médical est bannie.

### Conversion

- **Un seul objectif** : réserver un RDV (intégration Calendly).
- CTA répété : hero, milieu, fin.
- Friction minimale : pas de formulaire long ; le RDV qualifie.
- Page rapide, lisible mobile.
- Tracking de la source pour alimenter `source_acquisition` au CRM.

## TODO

- [ ] Rédiger la version 1 de chaque bloc.
- [ ] Brancher le Calendly et la création automatique de compte CRM.
- [ ] Installer le tracking de source de trafic.
- [ ] A/B tester le titre du hero une fois le trafic suffisant.
- [ ] Faire valider la conformité des claims (réassurance) avant publication.

## Auto-audit

- Est-ce actionnable ? **Oui** — structure bloc par bloc.
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — convertit l'attention en RDV.
- Est-ce que cela simplifie le pilotage ? **Oui** — un objectif unique.
- Est-ce trop complexe ? **Non** — 7 blocs, 1 CTA.
- Peut-on supprimer quelque chose ? Fusionner « problème » et « solution » si la page est trop longue.
- Prochaine amélioration recommandée : page dédiée par spécialité une fois le message validé.
