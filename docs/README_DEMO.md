# KOVELA — Prototype de démonstration

> **Dernière mise à jour** : 2026-06-01 · **Référence décisions** : [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) ·
> **Commit landing V1** : `3c9bf22`.
>
> **Statut :** prototype front-end de démonstration — pas une plateforme de production HDS.
> **Données :** 100 % fictives, état non persistant (en mémoire).

---

## 1. Résumé KOVELA

KOVELA est un **service opéré** de coordination post-opératoire pour chirurgiens libéraux,
appuyé sur :

- une **plateforme métier** opérée par l'équipe KOVELA ;
- une **supervision humaine spécialisée** ;
- une **IA assistive interne**, human-in-the-loop, jamais autonome côté patient.

Le prototype démontre les flux clés du service avant la vraie V1.

---

## 2. Positionnement service opéré

KOVELA est présenté **partout** comme un service opéré, jamais comme un logiciel :

- *« Un service opéré, pas un logiciel de plus. »*
- *« KOVELA n'est pas un logiciel que le chirurgien doit gérer. C'est un service opéré qui
  structure le suivi post-opératoire pour son cabinet, avec une équipe de supervision humaine
  spécialisée et une IA assistive interne. »*

Le cabinet **transmet** son planning à KOVELA ; l'équipe KOVELA **met en place** le service,
**organise** le flux, **supervise** et **trace**. Le chirurgien garde la main.

---

## 3. Routes clés (16 routes)

### Site public (hors HDS, aucune donnée patient)
- `/` — landing premium B2B.
- `/login` — sélecteur de rôle de démonstration (aucune auth réelle).

### Espace Admin / Head of Care
- `/admin` — tableau de bord (Actions prioritaires, Qualité & délais, Charge, Indicateurs, Verticales, Patients).
- `/admin/crm` — CRM Chirurgiens : pipeline 9 stages, table filtrable, Performance commerciale, Performance par sales.
- `/admin/supervision` — Supervision & qualité : KPI IA, Tableau superviseurs, Conversations à relire, CR à contrôler, Retours terrain, Socle qualité.

### Espace Sales
- `/sales` — *Mon portefeuille chirurgiens* (sélecteur « Vu en tant que », KPI personnels, table + actions rapides).

### Espace Superviseur (cœur opérationnel)
- `/superviseur` — Inbox opérationnelle (6 sections), Mes indicateurs, Améliorations terrain.
- `/superviseur/patient/[id]` — fiche patient : timeline, IA assistive (4 fonctions), CR, compilation factuelle, escalade, logs liés.
- `/superviseur/formation` — Formation superviseur : checklist, règles, lexique, templates, 4 cas pratiques, mini quiz, badge *Prêt à suivre des patients*.

### Espace Chirurgien / cabinet
- `/chirurgien` — Mes patients, Mise en place cabinet, Abonnement, Durées par type d'intervention, Cadre cible (HDS/RGPD/CNIL).
- `/chirurgien/onboarding` — wizard de mise en place du service (6 étapes : identité, lieux, préférences, assistantes, facturation, validation).
- `/chirurgien/planning` — planning opératoire : ajouter, importer (simulé), modifier, reporter, annuler, renvoyer lien onboarding.
- `/chirurgien/patient/[id]` — dossier patient côté chirurgien (CR disponible uniquement, escalade transmise uniquement).

### Espace Patient (mobile-first)
- `/patient/onboarding` — 5 étapes (bienvenue, confirmation infos, limites, consentement, préférences) + écran *Mon suivi en bref*.
- `/patient/messages` — messagerie texte / photo / audio (placeholders), rappel 15 / 112 permanent, aucune IA visible.

### Traçabilité
- `/logs` — logs opérationnels (filtres IA / CR / Escalade / Patient / Attribution / Cabinet / CRM / Qualité) + logs IA dédiés.

---

## 4. Rôles disponibles (de démonstration)

| Rôle | Utilisateur affiché | Espaces accessibles |
|---|---|---|
| **Admin** | Admin KOVELA | `/admin`, `/admin/crm`, `/admin/supervision`, `/sales`, `/logs` |
| **Superviseur** | Inès Carvalho | `/superviseur`, `/superviseur/formation`, `/logs` |
| **Chirurgien** | Dr. Camille Aragon | `/chirurgien`, `/chirurgien/onboarding`, `/chirurgien/planning`, `/chirurgien/patient/[id]`, `/logs` |
| **Patient** | Camille Moreau | `/patient/onboarding`, `/patient/messages` |

Le rôle se bascule **automatiquement** d'après l'URL. Sélecteur manuel disponible via `/login`
et les pills en haut.

---

## 5. Parcours de démo en 7 à 10 minutes

> Enchaîner **sans recharger la page** (état volatile en mémoire).
>
> Pour des **scripts détaillés par audience** (Émilien lead dev, chirurgien, investisseur,
> cabinet Aumans — versions courtes et complètes), voir [`DEMO_SCRIPTS.md`](./DEMO_SCRIPTS.md).

1. **Landing V1 validée** (`/`) — *« Le suivi post-opératoire, opéré pour votre cabinet. »* Hero,
   constat cabinet, solution (5 piliers), ce qui change pour votre cabinet, baseline terrain
   (60 à 90 min / patient sur 3 à 15 jours), comment ça marche (5 étapes), IA assistive
   encadrée, supervision compacte, cadre clair, **tarification** (690 € HT/mois + 80 € HT/patient
   activé · « Moins qu'un mi-temps. Plus qu'un outil. »), CTA *Demander une démo* / *Discuter
   du pilote*. Référence canonique : [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) § 1.
2. **Admin** (`/admin`) — bloc *Qualité & délais* (30 s pour piloter), Actions prioritaires
   *Voir → Sans superviseur* → **Attribuer** un patient à un superviseur.
3. **CRM** (`/admin/crm`) — *Performance commerciale* (KPI globaux + table par sales) ; ouvrir
   une fiche prospect (statut, sales owner, note, démo, relance, *Envoyer le lien de mise en place*).
4. **Sales** (`/sales`) — *Vu en tant que Sarah* → 8 KPI personnels, table de portefeuille,
   relances dues. Basculer *Vu en tant que Maxime* pour montrer une autre verticale.
5. **Mise en place cabinet** (`/chirurgien/onboarding`) — wizard 6 étapes (**15 min** ·
   mise en place initiale, puis **30–60 min** · référentiel essentiel accompagné par KOVELA :
   Votre cabinet, Lieux, Contacts autorisés, Documents de service, Prélèvement, Validation).
   À l'étape *Documents de service*, ouvrir un doc → *Marquer comme lu* (répéter) → cocher
   les acceptations → *Valider les documents de service*. À l'étape *Prélèvement*, cliquer
   **Simuler mandat actif**. Étape *Validation* → *Valider la mise en place du service*
   (redirection vers `/chirurgien`).
6. **Référentiel post-activation** (`/chirurgien` → `/chirurgien/referentiel-suivi`) —
   bandeau *Référentiel de suivi cabinet à compléter* → *Compléter le référentiel de suivi*
   → ajuster durées par type d'intervention → *Valider le référentiel de suivi*.
7. **Planning** (`/chirurgien/planning`) — **Ajouter un patient** : la durée se pré-remplit
   selon le type d'intervention (référentiel cabinet). **Importer un planning** → *Charger
   un exemple* → *Valider l'import*.
7. **Superviseur** (`/superviseur`) — *Mes indicateurs* + *Améliorations terrain* + Inbox
   action-first par statut opérationnel. Ouvrir `/superviseur/patient/p11` (patient avec
   transmission cabinet en cours, compilation factuelle déjà préparée).
8. **IA assistive — workflow CR** — sur p11 : *Résumer la conversation* (suggestion IA
   générique, badge *~1,5 min gagnées*) → Accepter ; *Préparer brouillon IA* — la modale
   CR refondue s'ouvre (Résumé patient · Brouillon CR factuel en sections · Checklist avant
   validation · Rappel doctrine) → **Relire et valider** → **Rendre disponible chirurgien**.
   Insister sur la chaîne *IA prépare → superviseuse relit → corrige si besoin → valide
   → CR disponible chirurgien* (cf. `DECISIONS_LOG.md` § 6 et § 7).
9. **Compilation factuelle → transmission cabinet explicite** — sur p11 : la compilation
   est déjà préparée (brouillon interne). Cliquer **Transmettre au chirurgien** → la
   transmission cabinet est effective.
10. **Chirurgien** (`/chirurgien/patient/p11`) — la transmission cabinet apparaît avec son
    contexte factuel. Aller sur `/chirurgien/patient/p18` pour voir un CR disponible
    chirurgien.
11. **Patient mobile** (`/patient/onboarding` → `/patient/messages`, vue étroite) — 5 étapes,
    rappel 15 / 112 permanent, confirmation après envoi.
12. **Supervision & qualité** (`/admin/supervision`) — KPI IA seedés (~2 h 39 min estimées
    gagnées, 18 / 6 / 2), *Conversations à relire* (cliquer *Ouvrir la fiche patient*),
    *CR à contrôler*, *Retours terrain*, *Socle qualité KOVELA*.
13. **Logs** (`/logs`) — filtre *IA* puis *Qualité* puis *CRM* — chaque action de la démo
    est tracée.

---

## 6. Build / badge version

Le bandeau au-dessus de chaque page d'application affiche :

> `Prototype — build <SHA> — données fictives, état non persistant.`

Le **SHA court** est injecté au build via `next.config.mjs` (`VERCEL_GIT_COMMIT_SHA` sur Vercel,
`local` en build local). Permet de vérifier instantanément quelle version est servie.

---

## 7. Limites du prototype

- **État volatile** : un rafraîchissement réinitialise tout (store React Context en mémoire).
- **Identités figées** : un seul utilisateur par rôle (admin, sup1, s1, p1).
- **Aucune auth réelle** : sélecteur de rôle uniquement, aucun RBAC.
- **Aucun backend** : pas d'API, pas de base de données.
- **Aucune intégration réelle** : IA simulée localement (`lib/ai.ts`), GoCardless fictif,
  pas d'email/SMS/agenda, pas de notification.
- **Données 100 % fictives** : 30 patients + 3 entrées planning future, 5 chirurgiens,
  4 superviseurs, 3 assistantes, 14 prospects CRM, 4 sales owners, etc.
- **Aucune certification revendiquée** (ISO, HDS, CNIL) — architecture cible uniquement.
- **Pas d'isolation d'accès** : toutes les routes sont accessibles à toute personne ayant
  l'URL (prototype démonstratif).

---

## 8. Installation locale

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run start    # serveur de production locale
```

Aucune variable d'environnement requise. Aucune dépendance externe au runtime.
