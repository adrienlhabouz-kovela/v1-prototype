# 06_AI — Assistance IA interne du Growth OS

**Valeur stratégique :** ★★★★★
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Ce dossier regroupe les **outils IA internes** qui accélèrent l'exécution growth
de KOVELA. L'IA est ici un **assistant d'exécution interne** (CRM, scoring,
résumés, contenu, objections) — jamais la promesse vendue au chirurgien.
5 agents de démarrage, chacun adossé à un prompt réel, copiable-collable.
Toujours un humain dans la boucle.

## Objectif

Donner au Growth Ops une boîte à outils IA simple pour faire plus vite et mieux
ce qu'il fait déjà à la main : enrichir, prioriser, résumer, produire, écouter.

## Action attendue

Le Growth Ops ouvre le prompt dont il a besoin, colle ses entrées, obtient une
sortie directement exploitable dans le CRM ou les autres dossiers du repo.

## KPI

- % d'actions growth assistées par un prompt du dossier.
- Temps gagné par tâche (résumé de call, enrichissement, recyclage contenu).
- Qualité des sorties (taux de réutilisation sans correction lourde).

## Process — Contenu du dossier

| Fichier | Rôle |
|---|---|
| `AI_DOCTRINE.md` | Doctrine IA : interne, humain dans la boucle, interdits, confidentialité. |
| `AI_AGENTS.md` | Description des 5 agents (rôle, entrées, sorties, branchement, KPI). |
| `PROMPTS_INDEX.md` | Index de tous les prompts (lien, usage, statut). |
| `CALL_SUMMARY_PROMPT.md` | Résumé structuré d'un call commercial chirurgien. |
| `SURGEON_ENRICHMENT_PROMPT.md` | Enrichissement + scoring d'une fiche chirurgien. |
| `CONTENT_RECYCLING_PROMPT.md` | Recyclage d'un actif en plusieurs formats. |
| `OBJECTION_EXTRACTION_PROMPT.md` | Extraction et catégorisation des objections. |

### Les 5 agents de démarrage

1. **IA CRM / enrichissement** — complète et qualifie les fiches chirurgien.
2. **IA scoring** — propose un score et un tier cohérents avec `03_CRM/SCORING_MODEL.md`.
3. **IA résumé de call** — transforme un call en entité `Interaction` exploitable.
4. **IA contenu (recyclage)** — décline un actif en plusieurs formats premium.
5. **IA objections (extraction)** — alimente `02_ICP_MESSAGING/OBJECTIONS.md`.

> On démarre avec **5 agents seulement**. On n'en ajoute un que s'il déclenche
> une action growth mesurable.

## TODO

- [ ] Choisir le poste de travail IA (Claude / outil interne).
- [ ] Tester chaque prompt sur un cas réel.
- [ ] Brancher les sorties dans le CRM.
- [ ] Mesurer le temps gagné après 2 semaines.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — c'est sa boîte à outils.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — plus de vitesse d'exécution.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — 5 agents, pas 20.
- Peut-on supprimer quelque chose ? Non, le socle est minimal.
- Prochaine amélioration recommandée : ajouter un 6e agent (relance) seulement si le besoin est prouvé.
