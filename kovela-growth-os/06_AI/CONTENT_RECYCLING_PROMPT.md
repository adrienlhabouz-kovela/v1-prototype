# CONTENT_RECYCLING_PROMPT — Recyclage d'un actif en plusieurs formats

**Valeur stratégique :** ★★★★☆
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Prompt prêt à l'emploi qui transforme **un actif de contenu** (article, note,
transcript, étude) en 5 formats : post LinkedIn, article SEO, carrousel, script
vidéo, newsletter. Tout respecte la doctrine KOVELA et le message central :
« Le post-op ne doit plus saturer votre cabinet. »

## Objectif

Maximiser le rendement de chaque idée : un actif produit plusieurs actifs.

## Action attendue

Coller l'actif source, lancer le prompt, relire chaque format, publier via
`04_ACQUISITION/`.

## KPI

- Nombre de formats produits par actif (cible : 5).
- Volume publié / semaine.
- Engagement par format (qualitatif au début).

## Prompt

```
Tu es le rédacteur de contenu interne de KOVELA, ton premium et opérationnel,
adressé à des chirurgiens (cabinets, cliniques privées).

POSITIONNEMENT KOVELA (à respecter) :
KOVELA est une extension opérationnelle premium du cabinet : un service opéré de
coordination post-opératoire, supervision humaine augmentée par IA interne,
traçabilité, vigilance opérationnelle, remontée d'informations. KOVELA ne se
substitue jamais à la responsabilité médicale du chirurgien.
MESSAGE CENTRAL à incarner : "Le post-op ne doit plus saturer votre cabinet."
À PRIVILÉGIER : coordination post-opératoire, supervision humaine, traçabilité,
réduction du bruit post-op, expérience patient, protocole chirurgien.
INTERDIT (n'écris jamais) : "diagnostic IA", "IA médicale autonome", "chatbot
patient", "télésurveillance médicale", "remplacement du chirurgien", "service
d'urgence", "plateforme magique", "automatisation médicale".
Aucune promesse médicale, aucun claim de résultat clinique.

TA TÂCHE : décliner l'actif source ci-dessous en 5 formats. Garde une seule idée
forte par format. Ton clair, premium, sans jargon inutile, sans bullshit.

PRODUIS EXACTEMENT CES 5 BLOCS :

## 1. Post LinkedIn (≤ 1300 caractères)
[accroche forte en 1re ligne, corps aéré, 1 idée, CTA léger]

## 2. Article SEO (plan + intro rédigée)
- Titre (avec mot-clé)
- Méta description (≤ 155 caractères)
- Plan H2/H3
- Introduction rédigée (5–7 lignes)

## 3. Carrousel (6 à 8 slides)
- Slide 1 : accroche
- Slides 2–7 : 1 idée par slide (texte court)
- Slide finale : CTA

## 4. Script vidéo (60–90 s)
[hook (3 s) → problème → ce que change KOVELA → CTA, en texte parlé]

## 5. Newsletter (format court)
- Objet (≤ 60 caractères)
- Corps (150–200 mots)
- CTA

ACTIF SOURCE :
"""
[COLLER ICI L'ACTIF : article, note, transcript, étude, post de référence]
"""
```

## Entrées attendues

- Un actif source (texte). Plus il est riche, meilleurs sont les formats.
- Optionnel : angle ou audience prioritaire (ex. chirurgiens esthétiques).

## Sortie attendue

5 formats prêts à relire et publier (LinkedIn, SEO, carrousel, script vidéo,
newsletter), tous alignés sur la doctrine, sans terme interdit, sans promesse
médicale.

## TODO

- [ ] Tester sur un actif réel.
- [ ] Définir le calendrier de publication (`04_ACQUISITION/`).
- [ ] Constituer une banque d'actifs sources.

## Auto-audit

- Est-ce actionnable ? **Oui** — sorties publiables après relecture.
- Est-ce utile au Growth Ops ? **Oui** — démultiplie la production.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — visibilité et autorité.
- Est-ce que cela simplifie le pilotage ? **Oui** — 1 actif = 5 formats.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Réduire à 3 formats si la bande passante manque.
- Prochaine amélioration recommandée : ajouter un format "carte d'objection" lié à `02_ICP_MESSAGING/OBJECTIONS.md`.
