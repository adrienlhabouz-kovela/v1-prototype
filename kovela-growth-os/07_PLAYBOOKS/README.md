# 07_PLAYBOOKS — Transformer la stratégie en procédures exécutables

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Ce dossier prend la stratégie (dossiers `02` à `06`) et la transforme en
**procédures concrètes, exécutables sans réfléchir**. Un playbook = une routine
reproductible : quand le faire, quoi faire, dans quel ordre, et comment le tracer
dans le CRM. Si le Growth Ops doit improviser, c'est que le playbook est
incomplet.

## Objectif

Donner au Growth Ops des modes opératoires pas-à-pas pour chaque canal, afin que
l'exécution soit constante, mesurable et indépendante de la personne en poste.

## Action attendue

À la lecture d'un playbook, le Growth Ops sait exactement quoi faire aujourd'hui,
sur quel canal, avec quel message, et où le consigner. Chaque action remonte dans
le CRM (`03_CRM/`).

## KPI

- % d'actions exécutées conformément au playbook (vs improvisation).
- Délai entre lecture du playbook et première action concrète (< 1 jour).
- Contribution de chaque playbook au pipeline (voir `08_KPIS/`).

## Process — Les playbooks du dossier

| Fichier | Canal / objet | Sert à |
|---|---|---|
| `LINKEDIN_PLAYBOOK.md` | LinkedIn (Adrien + page KOVELA) | Routine de publication, engagement et DM d'approche |
| `SEO_PLAYBOOK.md` | Contenu organique | Recherche de mots-clés → brief → publication → suivi |
| `ABM_PLAYBOOK.md` | Comptes Tier 1 | Séquence multi-touch personnalisée pas-à-pas |
| `EVENT_PLAYBOOK.md` | Congrès / événements | Avant / pendant / après un événement |
| `CRM_PLAYBOOK.md` | CRM au quotidien | Créer, scorer, faire avancer, prochaine action |

### Comment les playbooks s'articulent

1. `CRM_PLAYBOOK.md` est le **socle** : tous les autres y déversent leurs contacts.
2. `LINKEDIN_PLAYBOOK.md`, `SEO_PLAYBOOK.md`, `ABM_PLAYBOOK.md`, `EVENT_PLAYBOOK.md`
   sont les **moteurs** qui font entrer des chirurgiens.
3. Chaque action est mesurée dans `08_KPIS/` (dashboard + rapport hebdo).

### Règles communes à tous les playbooks

- **Aucune action sans trace CRM.** Si ce n'est pas dans le CRM, ça n'existe pas.
- **Un seul CTA par interaction :** obtenir un RDV.
- **Toujours partir du contexte du chirurgien**, jamais de la fonctionnalité.
- **Doctrine non négociable :** KOVELA = extension opérationnelle du cabinet,
  supervision humaine augmentée par IA interne. Jamais de promesse médicale, jamais
  de vocabulaire interdit (voir `CLAUDE.md`).
- **Message central partout :** *« Le post-op ne doit plus saturer votre cabinet. »*

## TODO

- [ ] Valider les 5 playbooks avec Adrien.
- [ ] Définir le playbook prioritaire du trimestre dans `NOW.md`.
- [ ] Relier chaque playbook au KPI correspondant dans `08_KPIS/`.

## Auto-audit

- Est-ce actionnable ? **Oui** — c'est l'index opérationnel.
- Est-ce utile au Growth Ops ? **Oui** — sa boîte à outils quotidienne.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — exécution constante.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — 5 playbooks lisibles.
- Peut-on supprimer quelque chose ? Non, c'est l'index.
- Prochaine amélioration recommandée : ajouter un playbook « referral chirurgien-à-chirurgien » une fois 10 signés.
