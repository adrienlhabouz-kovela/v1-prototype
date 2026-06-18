# KOVELA Growth OS

**Valeur stratégique :** ★★★★★
**Owner :** Adrien
**Statut :** Active
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Ce repository est le **cockpit d'exécution growth de KOVELA**. Il n'est pas une
documentation marketing : c'est un système opérationnel qui doit aider KOVELA à
**signer plus de chirurgiens**, à **piloter son acquisition** et à **préparer
l'arrivée d'un Growth Ops Manager**. Simple en surface, puissant dessous,
lisible en 30 secondes, exploitable immédiatement.

## Pourquoi ce repository existe

KOVELA est une infrastructure opérationnelle premium de coordination
post-opératoire pour chirurgiens. L'objectif business est clair :

`10–20 chirurgiens signés → 50 → 100 → 200 → (ambition) 500 chirurgiens actifs.`

Atteindre cet objectif demande une **machine d'acquisition** reproductible, pas
des efforts ponctuels. Ce repo encode cette machine.

## Comment lire ce repo (ordre recommandé)

1. **`CLAUDE.md`** — la constitution : doctrine, règles d'écriture, interdits.
2. **`KGOS.md`** — le document maître : vision, moteurs, stratégie complète.
3. **`NOW.md`** — où on en est cette semaine (priorités, blocages, KPI).
4. **`NEXT.md`** — les prochaines actions concrètes.
5. **`09_GROWTH_OPS/`** — si tu es le futur Growth Ops, commence ici.
6. **`decisions/`** — la mémoire stratégique : pourquoi la machine est faite ainsi (ADR).

## Architecture

```text
kovela-growth-os/
├── README.md              # Ce fichier — point d'entrée
├── CLAUDE.md              # Constitution / doctrine
├── NOW.md                 # Priorités & blocages du moment (mis à jour souvent)
├── NEXT.md                # Prochaines actions concrètes
├── IDEAS.md               # Idées non prioritaires (backlog)
├── KGOS.md                # Document maître (KOVELA Growth Operating System)
├── 01_STRATEGY/           # Stratégie, thèse marché, principes
├── 02_ICP_MESSAGING/      # ICP, segmentation, messaging, objections
├── 03_CRM/                # Schéma CRM, pipeline, scoring, routine
├── 04_ACQUISITION/        # Tous les moteurs d'acquisition
├── 05_CONTENT/            # SEO, LinkedIn, calendrier éditorial, recyclage
├── 06_AI/                 # Doctrine IA, agents, prompts opérationnels
├── 07_PLAYBOOKS/          # Procédures concrètes (LinkedIn, SEO, ABM, event, CRM)
├── 08_KPIS/               # Dashboard, weekly report, monthly review
├── 09_GROWTH_OPS/         # Préparation du recrutement Growth Ops Manager
├── 10_ROADMAP/            # Roadmap 30 / 60 / 90 jours / 12 mois
└── decisions/             # ADR — mémoire stratégique des décisions importantes
```

## Règles de contribution

1. **Chaque document existe pour produire une action.** Avant de créer un
   fichier, demande-toi : *« Est-ce que cette page aidera réellement à signer
   plus de chirurgiens ou à mieux piloter la machine dans 6 mois ? »* Si non, ne
   le crée pas.
2. **Respecter le template** (voir `CLAUDE.md`) : header + TL;DR + Objectif +
   Action attendue + KPI + Process + TODO.
3. **Noter la valeur stratégique** de chaque fichier important (★ à ★★★★★).
4. **Pas de bullshit marketing.** Ton clair, direct, opérationnel, premium.
5. **Pas de claim médical risqué** (voir interdits dans `CLAUDE.md`).
6. **Versionner** : commits clairs, atomiques, en français.

## Comment le Growth Ops doit l'utiliser

Le repo doit permettre de répondre **chaque semaine** à 10 questions de pilotage
(voir `08_KPIS/WEEKLY_REPORT.md`). En résumé : *où en est le pipeline, qu'est-ce
qui marche, quel est le prochain blocage, que fait-on lundi ?*

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — c'est sa porte d'entrée.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — indirectement, en structurant l'exécution.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Non à ce stade.
- Prochaine amélioration recommandée : ajouter un schéma visuel de la machine d'acquisition une fois les moteurs validés.
