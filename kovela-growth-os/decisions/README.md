# Decisions — ADR (Architecture Decision Records)

**Valeur stratégique :** ★★★★★
**Owner :** Adrien
**Statut :** Active
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Ce dossier est la **mémoire stratégique** de KOVELA Growth OS. Chaque décision
importante (structurelle, stratégique, outillage, organisation) y est consignée
sous forme d'**ADR** : un fichier court, daté, immuable une fois accepté. On ne
réécrit pas l'histoire — si une décision change, on crée un nouvel ADR qui
remplace le précédent (statut `Superseded`).

## Pourquoi des ADR

Une entreprise IA-native exécute vite. Sans trace écrite des décisions, on
re-débat les mêmes sujets tous les 3 mois et on perd la logique d'origine. Un ADR
répond en 2 minutes à : *« Pourquoi on a fait ce choix ? Quelles alternatives ?
Qu'est-ce qu'on a accepté comme contrepartie ? »*

Le futur Growth Ops doit pouvoir lire ce dossier et comprendre **comment la
machine a été pensée**, pas seulement comment elle fonctionne.

## Règles

1. **Un ADR = une décision.** Numéroté, daté, à portée claire.
2. **Immuable.** Une fois `Accepted`, on ne modifie pas le fond. Pour revenir
   dessus, on crée un nouvel ADR et on passe l'ancien en `Superseded by 00XX`.
3. **Court.** 1 page. Si c'est plus long, c'est probablement plusieurs décisions.
4. **Honnête sur les contreparties.** La section « Conséquences » liste aussi le
   négatif. Un ADR sans inconvénient est suspect.
5. **On consigne ce qui coûterait cher à re-débattre.** Pas les micro-choix.

## Quand créer un ADR

Crée un ADR si la décision :

- change la **structure** du repo ou de la machine ;
- engage l'**outillage** (CRM, plateforme IA, automation) ;
- fixe un **principe** d'acquisition ou de pricing ;
- a un **impact organisationnel** (rôle, recrutement, périmètre) ;
- serait **coûteuse à inverser**.

Sinon : une ligne dans `NEXT.md` ou `IDEAS.md` suffit.

## Process

1. Copier `_TEMPLATE.md` → `00XX-titre-court.md` (numéro suivant, kebab-case).
2. Remplir. Statut initial : `Proposed`.
3. Valider avec Adrien → statut `Accepted`.
4. Ajouter la ligne à l'index ci-dessous.

## Index des décisions

| # | Décision | Statut | Date |
|---|---|---|---|
| [0001](0001-separation-produit-growth.md) | Séparer Produit et Growth dans deux repositories distincts | Accepted | 2026-06-18 |

## TODO

- [ ] Migrer le contenu vers le repository dédié `kovela-growth-os` (voir ADR-0001).
- [ ] Créer un ADR pour le choix de l'outil CRM dès qu'il est tranché.

## Auto-audit

- Est-ce actionnable ? **Oui** — cadre clair pour consigner les décisions.
- Est-ce utile au Growth Ops ? **Oui** — il comprend le « pourquoi » de la machine.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — indirectement, en évitant les revirements coûteux.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Non.
- Prochaine amélioration recommandée : un ADR par décision d'outillage majeure (CRM, plateforme IA).
