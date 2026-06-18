# ADR-0001 — Séparer Produit et Growth dans deux repositories distincts

**Statut :** Accepted
**Owner :** Adrien
**Date :** 2026-06-18
**Décideurs :** Adrien (fondateur), Growth Architect

---

## Contexte

Le KOVELA Growth OS a été initialement produit comme un sous-dossier
(`kovela-growth-os/`) à l'intérieur du repository produit `v1-prototype`, qui
contient le prototype Next.js de l'application. Deux actifs de nature et de cycle
de vie très différents cohabitaient donc dans le même dépôt :

- le **Produit** (code applicatif, déploiements, versionnage technique) ;
- le **Growth OS** (stratégie d'acquisition, CRM, RevOps, IA, playbooks, KPI).

Cette cohabitation crée du bruit, mélange les historiques de commits, complique
les droits d'accès, et empêcherait un futur Growth Ops de travailler sans
naviguer dans le code produit.

## Décision

> Nous décidons de faire de `kovela-growth-os` un **repository GitHub autonome
> et dédié**, séparé du repository produit `v1-prototype`. Ce repository devient
> la **source de vérité unique** de toute la machine de croissance : stratégie,
> ICP, CRM, acquisition, contenu, IA, playbooks, KPI, Growth Ops, roadmap et
> décisions (ADR).

Le contenu existant est reconstruit proprement et versionné indépendamment du
produit.

## Alternatives considérées

- **Option A — Racine de la branche de travail dans `v1-prototype`.** Mettre le
  Growth OS à la racine en retirant le prototype de cette branche. Écartée :
  pollue le repo produit et mélange toujours les deux actifs au niveau du dépôt.
- **Option B — Conserver le sous-dossier `kovela-growth-os/` dans `v1-prototype`.**
  Non destructif mais non autonome : Produit et Growth restent couplés, mêmes
  droits, même historique. Écartée.
- **Option retenue — Repository GitHub dédié `kovela-growth-os`.** Sépare
  totalement Produit et Growth, permet un versionnage indépendant et un accès
  Growth Ops sans contact avec le code produit.

## Conséquences

**Positives**
- Séparation nette Produit / Growth : deux cycles de vie, deux historiques.
- Source de vérité unique et lisible pour toute la croissance.
- Le futur Growth Ops travaille sans jamais toucher au code produit.
- Droits d'accès gérables indépendamment (un actif stratégique confidentiel).

**Négatives / contreparties acceptées**
- Deux dépôts à maintenir au lieu d'un.
- Les liens éventuels entre produit et growth (ex. : données d'usage) devront
  être explicités, pas implicites.

**À surveiller**
- Éviter la duplication d'information entre les deux repos. Le Growth OS référence
  le produit, il ne le re-documente pas.

## Suivi

- [ ] **Nommage :** le dépôt actuellement créé s'appelle `-kovela-growth-os`
      (tiret initial), ce qui casse de nombreux outils CLI. Le recréer/renommer
      en `kovela-growth-os` (sans tiret initial) avant tout usage opérationnel.
- [ ] **Transfert :** migrer le contenu reconstruit (dossier `kovela-growth-os/`
      de la branche `claude/zealous-johnson-aqwz1u` de `v1-prototype`) vers la
      **racine** du repository dédié.
- [ ] **Nettoyage :** une fois le transfert validé, retirer le dossier
      `kovela-growth-os/` de `v1-prototype` pour ne laisser que le produit.
- [ ] **Accès :** accorder l'accès du repo dédié aux futurs membres growth.

> Note d'exécution : la session de travail actuelle est techniquement restreinte
> au repository `v1-prototype` et ne peut pas écrire dans le repo dédié. La
> reconstruction a donc été réalisée dans `v1-prototype` comme **zone de transfert
> prête à l'emploi**, en attendant le push vers `kovela-growth-os`.
