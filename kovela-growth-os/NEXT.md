# NEXT — Prochaines actions concrètes

**Valeur stratégique :** ★★★★
**Owner :** Adrien
**Statut :** Active
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

La file d'attente d'exécution : prochaines actions concrètes, qui les fait, pour
quand, leurs dépendances et le livrable attendu. `NOW.md` = maintenant ;
`NEXT.md` = juste après. Une action qui n'a ni owner ni date n'a rien à faire ici.

## Objectif

Donner une liste d'actions priorisées, sans ambiguïté, prêtes à être exécutées.

## Action attendue

Que n'importe qui (Adrien aujourd'hui, le Growth Ops demain) puisse prendre la
prochaine action en haut de la liste et l'exécuter sans réunion.

## KPI

- % d'actions livrées dans les délais.
- Délai moyen entre « créée » et « livrée ».

## Process

Format de chaque ligne : **Action — Owner — Échéance — Dépendance — Livrable.**
Quand une action est faite, la cocher et la déplacer en bas (archive) ou la supprimer.

## Backlog priorisé

### Priorité 1 — Infrastructure (semaine en cours)

- [ ] **Choisir et configurer le CRM** — Adrien — 2026-06-22 — Dép : aucune — Livrable : CRM avec schéma de `03_CRM/CRM_SCHEMA.md`.
- [ ] **Importer les chirurgiens connus** — Adrien — 2026-06-24 — Dép : CRM choisi — Livrable : pipeline rempli + scoring initial.
- [ ] **Valider ICP Tier 1 + message central** — Adrien — 2026-06-23 — Dép : aucune — Livrable : `02_ICP_MESSAGING/ICP.md` validé.

### Priorité 2 — Acquisition (15 prochains jours)

- [ ] **Lancer la cadence LinkedIn Adrien** — Adrien — 2026-06-30 — Dép : messaging validé — Livrable : 3 posts publiés + plan éditorial.
- [ ] **Construire la première liste ABM Tier 1** — Adrien — 2026-07-02 — Dép : ICP validé — Livrable : 25 comptes chirurgicaux qualifiés.
- [ ] **Rédiger les séquences d'approche** — Adrien — 2026-07-04 — Dép : messaging + objections — Livrable : templates email + LinkedIn.

### Priorité 3 — Préparation Growth Ops (30 jours)

- [ ] **Finaliser `09_GROWTH_OPS/`** — Adrien — 2026-07-10 — Dép : V0 stable — Livrable : fiche de poste + onboarding 30/60/90.
- [ ] **Rédiger la fiche de poste et lancer le sourcing** — Adrien — 2026-07-15 — Dép : ROLE_DESCRIPTION — Livrable : annonce publiée.

## TODO (méta)

- [ ] Revoir ce fichier chaque vendredi.
- [ ] Déplacer les idées non datées vers `IDEAS.md`.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui**
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Supprimer les actions livrées au fil de l'eau.
- Prochaine amélioration recommandée : lier chaque action à son fichier source.
