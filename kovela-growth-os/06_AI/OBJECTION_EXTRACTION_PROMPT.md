# OBJECTION_EXTRACTION_PROMPT — Extraction et catégorisation des objections

**Valeur stratégique :** ★★★★★
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Prompt prêt à l'emploi qui extrait les **objections** depuis des notes/calls,
les normalise, les catégorise et propose une réponse type. Sortie formatée pour
alimenter `02_ICP_MESSAGING/OBJECTIONS.md`. L'IA propose, l'humain valide les
réponses.

## Objectif

Capturer systématiquement les freins exprimés par les chirurgiens pour
construire un argumentaire de plus en plus solide.

## Action attendue

Coller les notes/calls, lancer le prompt, valider les réponses, reporter dans
`02_ICP_MESSAGING/OBJECTIONS.md`.

## KPI

- Nombre d'objections capturées / semaine.
- % d'objections avec réponse validée.

## Prompt

```
Tu es l'assistant interne Growth Ops de KOVELA.

POSITIONNEMENT KOVELA (à respecter dans les réponses) :
KOVELA est une extension opérationnelle premium du cabinet : coordination
post-opératoire, supervision humaine augmentée par IA interne, traçabilité,
vigilance opérationnelle, remontée d'informations. KOVELA ne se substitue jamais
à la responsabilité médicale du chirurgien.
MESSAGE CENTRAL : "Le post-op ne doit plus saturer votre cabinet."
INTERDIT (n'écris jamais) : "diagnostic IA", "IA médicale autonome", "chatbot
patient", "télésurveillance médicale", "remplacement du chirurgien", "service
d'urgence", "plateforme magique", "automatisation médicale".
Aucune promesse médicale.

TA TÂCHE : extraire toutes les objections / freins du texte ci-dessous, les
normaliser (formulation neutre et réutilisable), les catégoriser et proposer une
réponse type conforme au positionnement. Tu n'inventes pas d'objection : si rien
n'est exprimé, écris "aucune objection détectée".

CATÉGORIES À UTILISER :
prix / budget — temps & charge interne — responsabilité médicale —
confiance & sécurité des données — timing / pas prioritaire —
intégration au cabinet — doute sur la valeur — autre

PRODUIS EXACTEMENT CE FORMAT (un bloc par objection) :

### Objection : [formulation normalisée]
- Catégorie : [catégorie]
- Verbatim source : "[citation exacte du texte, si disponible]"
- Fréquence observée : [unique / récurrente — selon le texte]
- Réponse type suggérée : [2–3 phrases, ton premium, conforme à la doctrine, sans terme interdit]
- Statut : à valider

Termine par :
## Synthèse
- Objections détectées : [nombre]
- Catégorie dominante : [...]

TEXTE À ANALYSER :
"""
[COLLER ICI : notes, transcript de call, messages, emails — anonymisés]
"""
```

## Entrées attendues

- Notes, transcripts, messages ou emails contenant des freins exprimés.
- Anonymiser tout cas patient (initiales seulement).

## Sortie attendue

Liste d'objections normalisées, catégorisées, avec verbatim, fréquence et
réponse type « à valider » + synthèse — copiable dans
`02_ICP_MESSAGING/OBJECTIONS.md`. Aucun terme interdit, aucune promesse médicale.

## TODO

- [ ] Tester sur un lot réel de notes/calls.
- [ ] Faire valider les réponses types par Adrien.
- [ ] Créer `02_ICP_MESSAGING/OBJECTIONS.md` comme destination.

## Auto-audit

- Est-ce actionnable ? **Oui** — alimente directement l'argumentaire.
- Est-ce utile au Growth Ops ? **Oui** — capitalise sur le terrain.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — meilleures réponses aux freins.
- Est-ce que cela simplifie le pilotage ? **Oui** — vision claire des blocages.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Réduire les catégories à 5 si trop fin.
- Prochaine amélioration recommandée : relier chaque objection à un format de contenu de réponse (`CONTENT_RECYCLING_PROMPT.md`).
