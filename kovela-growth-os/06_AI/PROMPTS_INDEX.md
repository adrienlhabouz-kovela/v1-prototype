# PROMPTS_INDEX — Index des prompts IA

**Valeur stratégique :** ★★★★☆
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

La table de tous les prompts du dossier `06_AI`. Pour chaque prompt : l'agent
associé, l'usage, où brancher la sortie, et le statut. Point d'entrée unique
quand on cherche « quel prompt pour quelle tâche ».

## Objectif

Permettre au Growth Ops de trouver en 5 secondes le bon prompt et son point de
branchement.

## Action attendue

Ouvrir cet index, repérer le prompt, cliquer, copier-coller, exécuter.

## KPI

- Tous les prompts du dossier listés ici (aucun orphelin).
- % de prompts au statut « Validé ».

## Process — Table des prompts

| Prompt | Agent | Usage | Sortie branchée dans | Statut |
|---|---|---|---|---|
| [`CALL_SUMMARY_PROMPT.md`](./CALL_SUMMARY_PROMPT.md) | IA résumé de call | Résumer un call commercial chirurgien | `03_CRM/CRM_SCHEMA.md` → `Interaction` | Draft |
| [`SURGEON_ENRICHMENT_PROMPT.md`](./SURGEON_ENRICHMENT_PROMPT.md) | IA CRM / enrichissement + IA scoring | Enrichir une fiche + proposer score/tier | `03_CRM/CRM_SCHEMA.md`, `03_CRM/SCORING_MODEL.md` | Draft |
| [`CONTENT_RECYCLING_PROMPT.md`](./CONTENT_RECYCLING_PROMPT.md) | IA contenu (recyclage) | Décliner un actif en 5 formats | `04_ACQUISITION/` | Draft |
| [`OBJECTION_EXTRACTION_PROMPT.md`](./OBJECTION_EXTRACTION_PROMPT.md) | IA objections (extraction) | Extraire et catégoriser les objections | `02_ICP_MESSAGING/OBJECTIONS.md` | Draft |

## Règles d'usage

- Avant tout prompt : relire `AI_DOCTRINE.md` (interdits + humain dans la boucle).
- Toute sortie est **relue par un humain** avant d'être poussée ou publiée.
- Mettre le statut à jour ici dès qu'un prompt est validé en conditions réelles.

## TODO

- [ ] Passer chaque prompt de « Draft » à « Validé » après test.
- [ ] Ajouter une colonne « dernier test » si le volume augmente.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — point d'entrée unique.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — indirectement, par la vitesse.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Non, c'est déjà minimal.
- Prochaine amélioration recommandée : automatiser la génération de cet index si le nombre de prompts dépasse 10.
