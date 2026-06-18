# SIGNAL_BASED_SELLING — Vente basée sur les signaux

**Valeur stratégique :** ★★★★☆
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

On approche un chirurgien **au moment où il est le plus réceptif**, déclenché par
un signal observable (nouveau cabinet, recrutement, croissance, contenu consommé,
referral). Le bon message au mauvais moment échoue ; le même message sur signal
convertit. Ce moteur transforme le timing en avantage et alimente le score Intent
du CRM.

## Objectif

Détecter les signaux qui indiquent qu'un chirurgien est susceptible de ressentir
la saturation post-op, et déclencher l'approche dans la fenêtre d'opportunité.

## Action attendue

Le Growth Ops capte les signaux, met à jour le score Intent
(`03_CRM/SCORING_MODEL.md`) et déclenche une approche contextualisée dans les
**48 h** suivant le signal fort.

## KPI

- Délai signal → premier contact (cible : < 48 h pour les signaux forts).
- Taux de réponse des approches déclenchées par signal vs approches « froides ».
- Nombre de signaux captés / semaine.

## Process

### 1. Les signaux à surveiller

| Signal | Force | Ce qu'il indique | Source |
|---|---|---|---|
| **Nouveau cabinet / installation** | Fort | Réorganisation, besoin de structurer le post-op dès le départ | LinkedIn, presse locale, annuaires |
| **Recrutement** (secrétariat, assistant, coordinateur) | Fort | Charge opérationnelle qui déborde — le post-op sature | Offres d'emploi, LinkedIn |
| **Croissance / agrandissement / 2e site** | Moyen | Volume en hausse, friction post-op qui grandit | LinkedIn, site, presse |
| **Contenu KOVELA consommé** (landing, post, webinaire) | Moyen→Fort | Intérêt manifesté, sujet déjà présent à l'esprit | CRM, analytics landing |
| **Referral / mention par un pair** | Très fort | Confiance préexistante, intention élevée | Réseau, chirurgiens signés |
| **Prise de parole publique sur le suivi patient** | Moyen | Sensibilité au sujet | Congrès, interviews, publications |

### 2. Capter les signaux

- **Veille LinkedIn** : suivre les comptes Tier 1/2, surveiller annonces et posts.
- **Veille recrutement** : alertes sur les offres d'emploi des structures cibles.
- **Analytics landing** : qui consulte (`source_acquisition`, retargeting list).
- **Boucle referral** : demander systématiquement après chaque signature.
- Centraliser dans le CRM : champ `signal_detecte` + date.

### 3. Déclencher au bon moment

| Signal | Déclencheur d'approche |
|---|---|
| Recrutement / nouveau cabinet | Message contextualisé sous 48 h, angle « structurer le post-op sans alourdir l'équipe » |
| Contenu consommé | Relance personnalisée tant que le sujet est chaud (< 72 h) |
| Referral | Mise en relation directe, mention du pair dès le premier message |
| Croissance | Approche sur l'angle « le volume monte, le bruit post-op aussi » |

Le message reste fidèle à la doctrine : extension opérationnelle, supervision
humaine, **aucun claim médical**.

### 4. Mesurer

- Comparer le taux de réponse des approches sur signal vs froides.
- Identifier le **signal le plus convertissant** et y concentrer la veille.
- Recalculer le score Intent à chaque signal (voir barème `SCORING_MODEL.md`).

## TODO

- [ ] Configurer les alertes (LinkedIn, recrutement) sur les comptes cibles.
- [ ] Ajouter le champ `signal_detecte` au CRM.
- [ ] Définir le SLA de réaction (48 h sur signal fort).
- [ ] Évaluer un agent IA interne de veille de signaux (`06_AI/`).

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — il sait quoi guetter et quand agir.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — meilleur timing = meilleur taux de réponse.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** si on limite à 3–4 signaux suivis activement.
- Peut-on supprimer quelque chose ? Concentrer d'abord sur 2 signaux (recrutement + referral) avant d'élargir.
- Prochaine amélioration recommandée : automatiser la captation des signaux les plus prédictifs via l'IA interne.
