# SEO_PLAYBOOK — Procédure de production SEO

**Valeur stratégique :** ★★★★☆
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Procédure pas-à-pas pour produire du contenu organique qui capte les chirurgiens
en recherche active : recherche de mots-clés par intention, brief de contenu
réutilisable, publication, maillage interne, et suivi des positions/conversions.
Stratégie de fond : `05_CONTENT/SEO_STRATEGY.md` (2 piliers + satellites).

## Objectif

Faire entrer des chirurgiens qualifiés dans le pipeline à coût marginal nul après
publication, en répondant aux requêtes proches de la décision d'achat.

## Action attendue

Le Growth Ops produit X contenus/mois selon le brief type, les maille vers la
landing, et suit positions + RDV attribués SEO dans le CRM.

## KPI

- Requêtes cibles en top 10 (cible : 5 sur le trimestre).
- Sessions organiques qualifiées / mois.
- Taux de clic landing → RDV.
- RDV attribués au SEO dans le CRM (source `seo`).

## Process

### 1. Recherche de mots-clés (par intention, pas par volume brut)

1. Partir des **5 intentions** de `SEO_STRATEGY.md` (mesurer / structurer /
   déléguer / comparer / se rassurer).
2. Pour chaque intention, lister les requêtes réelles (outil : Search Console,
   suggestions Google, forums de praticiens).
3. Remplir le tableau de priorisation :

| Requête | Intention | Volume estimé | Difficulté | Proximité décision | Priorité (1-3) |
|---|---|---|---|---|---|
|  |  |  |  | haute / moyenne | |

> Règle de priorité : **proximité de la décision > volume**. Une requête « externaliser
> le suivi post-op » à faible volume bat « santé post-opératoire » à fort volume.

### 2. Brief de contenu (modèle réutilisable, à remplir avant rédaction)

```
Titre de travail :
Requête cible principale :
Requêtes secondaires :
Intention / maturité :
Angle (douleur du chirurgien adressée) :
Pilier de rattachement (Pilier 1 / Pilier 2) :
Plan (H2/H3) :
Preuves / chiffres à intégrer :
CTA (toujours : prendre RDV) :
Liens internes à poser (vers pilier + landing) :
Vérif doctrine (aucun mot interdit, aucune promesse médicale) : OK / KO
```

### 3. Publication (checklist)

- [ ] Requête cible dans le titre, le H1 et l'URL.
- [ ] Méta-description orientée bénéfice (réduire le bruit post-op).
- [ ] CTA contextuel en milieu ET en fin de contenu.
- [ ] Au moins 1 lien sortant interne vers le pilier, 1 vers la landing.
- [ ] Tag de source `seo` posé sur la landing pour traçabilité CRM.
- [ ] Relecture doctrine : ton premium, opérationnel, zéro claim médical.

### 4. Maillage interne (à chaque publication)

- Chaque **satellite** pointe vers SON pilier.
- Chaque **pilier** pointe vers la **landing** de conversion.
- Mettre à jour les piliers existants pour qu'ils pointent vers le nouveau satellite.

```
Satellites ──► Pilier 1 / Pilier 2 ──► Landing ──► RDV (CRM, source seo)
```

### 5. Suivi positions / conversions (mensuel)

| Requête | Position M-1 | Position M | Sessions | Clics landing | RDV (CRM) |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

- Une page en page 2 (positions 11-20) depuis > 2 mois → la retravailler (contenu,
  maillage, intention).
- Reporter le contenu qui convertit dans `08_KPIS/WEEKLY_REPORT.md` (Q6).

## TODO

- [ ] Lister 10 requêtes cibles prioritaires (tableau intention).
- [ ] Publier Pilier 1 et Pilier 2 (voir `SEO_STRATEGY.md`).
- [ ] Produire 4 satellites par pilier sur le trimestre.
- [ ] Mettre en place le suivi positions mensuel.
- [ ] Brancher l'IA interne pour accélérer les briefs (`06_AI/`).

## Auto-audit

- Est-ce actionnable ? **Oui** — brief et checklists prêts à l'emploi.
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — inbound qualifié.
- Est-ce que cela simplifie le pilotage ? **Oui** — suivi mensuel tabulé.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Démarrer avec 1 pilier seul si ressources limitées.
- Prochaine amélioration recommandée : ajouter un cluster « cas par spécialité » une fois l'ICP affiné.
