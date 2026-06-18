# CALL_SUMMARY_PROMPT — Résumé de call commercial chirurgien

**Valeur stratégique :** ★★★★★
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Prompt prêt à l'emploi qui transforme un call commercial chirurgien en résumé
structuré : points clés, objections, signaux, next step. Sortie formatée pour
être collée directement dans l'entité `Interaction` du CRM. Humain dans la
boucle : on relit avant de pousser.

## Objectif

Ne plus perdre l'information d'un call. Capturer en 2 minutes ce qui compte pour
faire avancer le chirurgien dans le pipeline.

## Action attendue

Coller les notes/transcript du call, lancer le prompt, copier la sortie dans
`03_CRM/CRM_SCHEMA.md` → entité `Interaction` (champs `resume`, `next_step`),
et reporter objections + signaux sur la fiche `Chirurgien`.

## KPI

- % de calls résumés et poussés au CRM sous 24 h.
- % de calls avec un `next_step` daté.

## Prompt

```
Tu es l'assistant interne Growth Ops de KOVELA.

CONTEXTE KOVELA (à respecter dans le ton et le vocabulaire) :
KOVELA est une extension opérationnelle premium du cabinet : un service opéré de
coordination post-opératoire, supervision humaine augmentée par IA interne,
traçabilité et remontée d'informations. KOVELA ne se substitue jamais à la
responsabilité médicale du chirurgien.
INTERDIT d'employer : "diagnostic IA", "IA médicale autonome", "chatbot patient",
"télésurveillance médicale", "remplacement du chirurgien", "service d'urgence",
"plateforme magique", "automatisation médicale".

TA TÂCHE : résumer le call commercial ci-dessous de façon factuelle et
actionnable. Tu n'inventes rien. Si une information manque, écris "non précisé".
Tu ne donnes aucun avis médical.

PRODUIS EXACTEMENT CE FORMAT :

## Résumé (3 lignes max)
[synthèse factuelle du call]

## Points clés
- [point 1]
- [point 2]
- [point 3]

## Objections / freins exprimés
- [objection] → catégorie probable (prix / temps / responsabilité / confiance / timing / autre)

## Signaux (intent / fit)
- [signal positif ou négatif observé]

## Contexte chirurgien (pour le CRM)
- Spécialité : [...]
- Type de structure : [...]
- Volume post-op évoqué : [...]
- Zone : [...]

## Next step (champ Interaction.next_step)
- Action : [action concrète]
- Échéance proposée : [date relative, ex. "sous 5 jours"]
- Responsable : [Growth Ops / Adrien]

## Mise à jour de stage suggérée
[étape du pipeline suggérée + justification courte — voir 03_CRM/PIPELINE_STAGES.md]

CALL À RÉSUMER :
"""
[COLLER ICI LES NOTES OU LA TRANSCRIPTION DU CALL]
"""
```

## Entrées attendues

- Notes ou transcription du call (anonymiser tout cas patient : initiales seulement).
- Idéalement : nom du chirurgien, date du call, contexte d'origine.

## Sortie attendue

Bloc structuré (résumé, points clés, objections catégorisées, signaux, contexte,
next step daté, suggestion de stage) — copiable dans l'entité `Interaction` du
CRM. Aucun terme interdit. Aucun avis médical.

## TODO

- [ ] Tester sur un vrai call.
- [ ] Valider le mapping vers les champs `Interaction`.
- [ ] Décider si on connecte un outil de transcription.

## Auto-audit

- Est-ce actionnable ? **Oui** — sortie directement collable dans le CRM.
- Est-ce utile au Growth Ops ? **Oui** — gain de temps massif post-call.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — aucun follow-up oublié.
- Est-ce que cela simplifie le pilotage ? **Oui** — historique propre.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? On peut retirer "mise à jour de stage" si trop lourd.
- Prochaine amélioration recommandée : export automatique vers le CRM via intégration.
