# 08_KPIS — Piloter la machine

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Ce dossier dit **comment piloter la machine** : quels chiffres regarder, à quelle
fréquence, et quelle décision en tirer. Un seul KPI nord (chirurgiens actifs), un
dashboard pour la vue d'ensemble, un rapport hebdo pour l'exécution, une revue
mensuelle pour les arbitrages. Si un KPI ne déclenche aucune décision, on le
supprime.

## Objectif

Donner au Growth Ops un système de pilotage léger : savoir en permanence si la
machine remplit le pipeline, où elle fuit, et quoi faire ensuite.

## Action attendue

Le Growth Ops tient le dashboard à jour, remplit le rapport chaque vendredi, et
conduit la revue chaque fin de mois — chaque chiffre menant à une décision.

## KPI

- % de semaines avec rapport hebdo complété.
- % de mois avec revue mensuelle tenue.
- Délai entre détection d'un blocage et décision (le pilotage doit être réactif).

## Process — Les fichiers du dossier

| Fichier | Fréquence | Rôle |
|---|---|---|
| `KPI_DASHBOARD.md` | Continu / hebdo | Vue d'ensemble : KPI nord, pipeline, conversions, CAC par canal |
| `WEEKLY_REPORT.md` | Chaque vendredi | Pilotage en 10 questions, template réutilisable |
| `MONTHLY_REVIEW.md` | Fin de mois | Bilan vs objectifs, réallocation, décisions |

### Comment ils s'articulent

1. **`KPI_DASHBOARD.md`** = la photo : où en est la machine maintenant.
2. **`WEEKLY_REPORT.md`** = le rythme : ce qui a bougé cette semaine, et lundi.
3. **`MONTHLY_REVIEW.md`** = le cap : ce qu'on réalloue et décide pour le mois suivant.

### Le KPI nord

> **Chirurgiens actifs.** Objectif business : 10–20 → 50 → 100 → 200 → 500.
> Tous les autres KPI existent pour expliquer le mouvement de ce chiffre.

### Règles de pilotage

- **Pas de vanity metric.** Un KPI doit déclencher une action ou disparaître.
- Les chiffres viennent du CRM (`03_CRM/`) — une seule source de vérité.
- Chaque blocage détecté a un responsable et une échéance.

## TODO

- [ ] Brancher le dashboard sur le CRM (source unique).
- [ ] Caler le rapport hebdo le vendredi dans l'agenda.
- [ ] Caler la revue mensuelle le dernier jour ouvré du mois.

## Auto-audit

- Est-ce actionnable ? **Oui** — c'est l'index de pilotage.
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — détecte les fuites tôt.
- Est-ce que cela simplifie le pilotage ? **Oui** — 1 nord, 3 outils.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Non, c'est l'index.
- Prochaine amélioration recommandée : automatiser le dashboard depuis le CRM pour éviter la saisie manuelle.
