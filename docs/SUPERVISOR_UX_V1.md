# KOVELA — UX Superviseur V1 Prototype

> **Statut** : version validée comme base UX superviseur V1 prototype après commit `7ff14f2`.
> **Locked** : ne plus refondre dans cette V1 sans décision explicite produit.
> **Référence canonique** : [`DECISIONS_LOG.md`](DECISIONS_LOG.md) § 13nonies.

---

## 1. Routes concernées

| Route | Rôle |
|---|---|
| `/superviseur` | Cockpit opérationnel (vue dashboard du workspace). |
| `/superviseur/patient/[id]` | Fiche patient (vue conversation du workspace). Patient de démo : `/superviseur/patient/p25`. |
| `components/SupervisorQueueRail.tsx` | Rail patient permanent **partagé** entre les deux routes ci-dessus. |

Composant clé : `QueueRail` (311 lignes). Ne pas dupliquer le code de file patient : importer depuis ce composant.

---

## 2. Principe UX validé

Le paradigme retenu est un **workspace superviseur unifié** inspiré des outils support client de référence (Front, Intercom, Help Scout), adapté au contexte KOVELA post-opératoire.

**Règle fondamentale.** La superviseuse ne doit **pas** naviguer en aller-retour entre dashboard et fiche patient. Elle travaille depuis un espace continu avec :

- rail patient permanent ;
- dashboard cockpit ;
- fiche patient en poste de travail ;
- conversation centrale ;
- panneau d'action hiérarchisé.

**Justification opérationnelle.** Suivi KOVELA = 3 à 12 jours · cible ~1h humaine par patient sur l'ensemble du suivi · 60-120 patients/superviseuse sur la plage 8h-20h. Toute navigation page-à-page détruit la marge opérationnelle.

---

## 3. Architecture générale

### Sur `/superviseur`

```
┌──────────┬─────────────────────────────────────────────────┐
│ Rail     │ Pane cockpit                                    │
│ patient  │                                                 │
│ 264px    │ 1. Header (titre · date · charge · service)     │
│ sticky   │ 2. Bandeau KPIs (pills compactes secondaires)   │
│          │ 3. HERO « À traiter maintenant » (priorité)     │
│ filtres  │ 4. Barre filtres (compacte, après le HERO)      │
│ recherche│ 5. Files prioritaires Tier 1 (3 cards)          │
│ liste    │ 6. Files secondaires Tier 2 (3 cards)           │
│ scrolla- │ 7. Bloc IA & qualité (collapsed)                │
│ ble      │ 8. Bloc Suggestions terrain                     │
└──────────┴─────────────────────────────────────────────────┘
```

**Tier 1** (prioritaire, grille 3 cols) : Transmissions cabinet · Patients sans réponse · CR factuels.
**Tier 2** (secondaire, grille 3 cols) : Retours cabinet attendus · Suivis du jour · Clôtures à finaliser.

### Sur `/superviseur/patient/[id]`

```
┌──────────┬─────────────────────────────────────────────────┐
│ Rail     │ Pane fiche                                      │
│ patient  │                                                 │
│ 264px    │ Header patient sticky (avatar · nom · J+ ·     │
│ sticky   │ intervention · cabinet · statuts · action +    │
│          │ boutons Primary + Contacter cabinet + Autres ▾)│
│ filtres  │                                                 │
│ recherche│ Grid 3/6/3 (lg) ou 2/7/3 (2xl) :               │
│ liste    │  ┌─────────┬─────────────────┬───────────┐     │
│ scrolla- │  │ Contexte│ Conversation     │ Actions   │     │
│ ble      │  │ stable  │ centrale + comp. │ hiérarch. │     │
│          │  └─────────┴─────────────────┴───────────┘     │
└──────────┴─────────────────────────────────────────────────┘
```

**Colonne gauche — Contexte stable, scannable** (3 blocs ultra-compacts) :
- Référentiel actif (version + contact prioritaire).
- Dossier (date intervention · protocole · canal · dernier contact).
- Fenêtre suivi (dates + barre de progression).

Pas de redondance avec le header sticky (nom, intervention, J+, chirurgien, cabinet, fenêtre J0→J+N sont déjà dans le header).

**Colonne centre — Conversation patient dominante** :
- Timeline color-coded par type (patient ambre / KOVELA teal / note interne navy / cabinet navy fort / CR teal).
- Quick-actions inline sur chaque message patient : Marquer documenté · → Transmission cabinet · + Note interne · + CR factuel.
- Composer refondu : eyebrow « Réponse patient · prototype » + textarea 4 rangs + boutons compacts (Modèles · Reformuler IA interne · Résumer) + groupe primary droit (Copier + Envoyer · prototype).
- Rappels doctrine + 15/112 sous le composer, 2 lignes sobres.

**Colonne droite — Panneau d'action vertical hiérarchisé** (6 cards empilées) :
1. Action principale (CTA dominant + délai + messages programmés).
2. Cabinet (Contacter + pipeline 3 étapes Préparée → Copiée → Envoyée proto + boutons contextuels + référentiel applicable replié).
3. CR factuel (statut + brouillon + Relire et valider · Marquer prêt · Copier · Export PDF prévu en V1 désactivé).
4. Suivi (fenêtre + barre + Clôturer le suivi → modale confirm).
5. Journal d'action (card autonome compact + bandeau « audit trail réel prévu en V1 »).
6. Notes internes (style délibérément distinct : fond navy léger + bord pointillé + tag uppercase ✦ Note interne).

---

## 4. Objectif opérationnel

En **moins de 5 secondes**, la superviseuse doit comprendre :

1. quel patient traiter (rail trié par priorité + HERO en table) ;
2. pourquoi il est prioritaire (raison en ambre sur chaque rang) ;
3. quelle action effectuer (action recommandée + bouton primary visible) ;
4. ce que le patient a déclaré (citation du dernier message en preview rail + HERO + bandeau modale cabinet) ;
5. quel référentiel actif s'applique (card Référentiel visible) ;
6. ce qui a déjà été tracé (Journal autonome + pipeline transmission) ;
7. s'il faut répondre, transmettre au cabinet, préparer un CR factuel ou clôturer (panneau droit hiérarchisé).

---

## 5. Décisions UI validées

| Décision | Valeur |
|---|---|
| Largeur rail patient | 264px (vs 300px initial). |
| Sélection patient | Barre d'accent teal 2px à gauche (élégant, sans ring de carte). |
| Avatar rail | 32px (vs 36px initial). |
| Grid fiche adaptative | `lg:col-span-3 / 6 / 3` (laptop 1024-1536), `2xl:col-span-2 / 7 / 3` (grand écran 1536+). |
| Conversation | Élargie autant que possible sans casser la colonne contexte sur laptop standard. |
| Composer | 4 rangs · eyebrow `Réponse patient · prototype` · groupe primary droit (Copier + Envoyer). |
| Dashboard ordre | Header → KPIs pills → **HERO** → Filtres → Files Tier 1 → Files Tier 2 → Metrics IA en bas. |
| Wording CR | « Transmettre au chirurgien » validé. « Publier pour le chirurgien » supprimé de l'UI visible. |
| Wording cabinet | « Transmission cabinet » partout. « Escalade » réservé aux identifiants techniques internes. |

---

## 6. Largeurs calculées (responsive)

Calcul avec Shell sidebar 260px + padding 72px + rail 264px + gap 16px = 612px overhead.

| Largeur écran | Main pane | Grid | Contexte | Conversation | Actions |
|---|---|---|---|---|---|
| 1280px (xl) | 668px | 3/6/3 | 167px | 334px | 167px |
| **1366px (laptop standard)** | **754px** | **3/6/3** | **188px** | **377px** | **188px** |
| 1440px | 828px | 3/6/3 | 207px | 414px | 207px |
| 1536+ (2xl) | 924px+ | 2/7/3 | 154px | 539px+ | 231px+ |

---

## 7. Backlog non bloquant

Sur laptop standard, la conversation reste lisible mais relativement compacte (377px à 1366px). Pour une future **V1 production**, prévoir :

- **Rail collapsible** — toggle icons-only / expanded pour libérer la zone conversation à la demande.
- **Panneau contexte compressible** — collapse en strip latéral quand la superviseuse est en mode réponse intensive.
- **Panneau action compressible** — idem.
- **Conversation maximisée** — objectif ≥ 600px de largeur conversation sur laptop standard 1366px.

**Ne pas traiter maintenant sauf demande produit explicite.**

---

## 8. Éléments doctrinaux à préserver dans toute itération

- Conversation patient **centrale**, dominante en largeur.
- Pipeline transmission cabinet **toujours visible** (jamais caché derrière un onglet).
- Notes internes **visuellement distinctes** des réponses patient (fond navy léger + bord pointillé + tag ✦). Aucune ambiguïté possible.
- WhatsApp **toujours marqué prototype** + bandeau « canal réel à valider en V1 selon cadre RGPD / HDS ».
- 15/112 sobre sous le composer (non invasif, non anxiogène).
- IA assistive interne uniquement, jamais autonome côté patient.
- Aucun mot du lexique interdit (voir [`WORDING_DOCTRINE.md`](WORDING_DOCTRINE.md)).
