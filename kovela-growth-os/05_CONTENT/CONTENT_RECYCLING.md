# CONTENT_RECYCLING — Recyclage de contenu

**Valeur stratégique :** ★★★★☆
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Un actif validé doit produire **5 formats minimum**. Un bon post LinkedIn devient
article SEO, carrousel, script vidéo et newsletter. On ne réécrit pas à chaque
fois : on transforme. L'opération est cadrée par le prompt
`06_AI/CONTENT_RECYCLING_PROMPT.md` pour garder l'effort minimal et la doctrine
intacte.

## Objectif

Multiplier la portée et la durée de vie de chaque idée sans multiplier l'effort
de création, en réutilisant ce qui marche déjà.

## Action attendue

Tout actif performant passe par la chaîne de recyclage et ressort en plusieurs
formats programmés.

## KPI

- Nombre de formats produits par actif source (cible : ≥ 5).
- Part du calendrier alimentée par du recyclage (cible : ≥ 40 %).
- Performance des dérivés vs original.

## Process

### Le principe : 1 actif → N formats

On part de l'actif qui a le mieux marché (souvent un post LinkedIn d'Adrien), et
on le décline. L'ordre n'est pas figé, mais la chaîne de référence est :

```
Post LinkedIn (validé / performant)
        │
        ├──► Article SEO            (développe l'angle, vise une requête, maille vers landing)
        ├──► Carrousel LinkedIn     (méthode en étapes, visuel)
        ├──► Script vidéo court     (60–90 s, hook + 3 points + CTA)
        └──► Newsletter             (édito + lien vers l'article SEO)
```

### Chaîne détaillée

| Étape | Source | Sortie | Ce qu'on garde / change |
|---|---|---|---|
| 1 | Post LinkedIn performant | — | On repère l'angle qui a engagé |
| 2 | Post | **Article SEO** | On développe, on ajoute requête cible + maillage |
| 3 | Post / article | **Carrousel** | On structure en 5–8 slides, on visualise |
| 4 | Carrousel | **Script vidéo** | Hook + 3 points clés + CTA, format parlé |
| 5 | Article | **Newsletter** | Édito court + lien article, ton direct |

### Règles de recyclage

- On ne recycle que les actifs **validés doctrine** et idéalement **performants**.
- Chaque dérivé garde le message central et évite tout vocabulaire interdit.
- Chaque dérivé a son propre CTA adapté au canal.
- On espace les dérivés dans le temps (pas tout la même semaine).

### Lien avec l'IA interne

L'opération de transformation est standardisée par le prompt
[`06_AI/CONTENT_RECYCLING_PROMPT.md`](../06_AI/CONTENT_RECYCLING_PROMPT.md) :
on lui donne l'actif source + le format cible, il produit un premier jet
respectant la doctrine. La validation humaine reste obligatoire (étape 4 du
workflow de `EDITORIAL_CALENDAR.md`).

## TODO

- [ ] Rédiger le prompt `06_AI/CONTENT_RECYCLING_PROMPT.md`.
- [ ] Définir le critère « actif performant » (seuil d'engagement).
- [ ] Mettre une colonne « source recyclage » dans le tableau de planning.
- [ ] Recycler le premier post pilier d'Adrien comme test.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — divise l'effort de production.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — plus de portée à coût constant.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — une chaîne linéaire.
- Peut-on supprimer quelque chose ? Le script vidéo peut être retiré si la vidéo n'est pas un canal actif.
- Prochaine amélioration recommandée : ajouter un format « slide RDV » réutilisable en démo.
