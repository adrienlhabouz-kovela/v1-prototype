# KOVELA — Notes techniques (prototype)

> **Public visé** : lead dev qui doit transformer ce prototype en V1 production HDS.
> **Objectif** : comprendre ce qui est réutilisable, ce qui est jetable, et où poser les bonnes
> questions d'architecture.

---

## 1. Stack actuelle

| Couche | Choix prototype | Justification |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Routing par fichiers, RSC, déploiement Vercel zéro-conf. |
| Langage | **TypeScript** strict | Types métiers explicites, refactor sûr. |
| UI | **Tailwind CSS 3** | Design system par tokens, pas de CSS-in-JS. |
| Police | `next/font/google` (Inter + Fraunces) | Auto-hébergement au build, pas de tracking. |
| État | **React Context** (Provider unique en mémoire) | Suffisant pour démontrer le flux ; **jetable en V1**. |
| Données | Mocks dans `lib/mock-data.ts` | 100 % fictives ; **jetable en V1**. |
| IA | Fonctions pures dans `lib/ai.ts` | Sorties déterministes ; **à remplacer par un gateway serveur**. |
| Tests | Aucun | Choix prototype. **À combler en V1** (Vitest + Playwright). |
| CI | Vercel auto-deploy par PR | À conserver pour la prod. |

---

## 2. Architecture actuelle

```
┌─────────────────────────────────────────────────────────────────┐
│ Browser (client-only après hydratation Next.js)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ React Context: KovelaProvider (lib/store.tsx)            │  │
│  │   ├ patients (33)      ├ aiLogs (seeded ~50)             │  │
│  │   ├ surgeons (5)       ├ logs (opérationnels)            │  │
│  │   ├ supervisors (4)    ├ qualityConversations/CRs/Comments│  │
│  │   ├ assistants (3+)    ├ suggestions (5)                  │  │
│  │   ├ reports / escalations  ├ prospects (14)              │  │
│  │   ├ salesOwners (4)                                       │  │
│  │   └ + actions (assignSupervisor, sendMessage, …)         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─ app/ (routes Next.js App Router) ────────────────────┐    │
│  │  / (landing — SSG)                                     │    │
│  │  /admin /admin/crm /admin/supervision                  │    │
│  │  /sales                                                 │    │
│  │  /superviseur /superviseur/formation                   │    │
│  │  /superviseur/patient/[id]                             │    │
│  │  /chirurgien /chirurgien/onboarding /chirurgien/planning│   │
│  │  /chirurgien/patient/[id]                              │    │
│  │  /patient/onboarding /patient/messages                 │    │
│  │  /logs /login                                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ components/ ─────────────────────────────────────────┐    │
│  │  Shell (sidebar + topbar + nav mobile + bandeau proto) │    │
│  │  ui.tsx (Button, Card, Badge, Modal, StatCard, etc.)   │    │
│  │  Brand (Wordmark, BrandMark — logo SVG)                │    │
│  │  UrgencyBanner                                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─ lib/ ───────────────────────────────────────────────┐    │
│  │  types.ts (modèle métier)                              │    │
│  │  mock-data.ts (seeds)                                   │    │
│  │  store.tsx (state + actions)                            │    │
│  │  format.ts (labels + styles + helpers)                  │    │
│  │  ai.ts (4 fonctions IA simulées + estimations temps)    │    │
│  │  templates.ts (templates de réponse superviseur)        │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

**Caractéristiques importantes** :

- **Pas de SSR métier** : les pages métiers sont des Client Components qui lisent du store en
  mémoire. Le SSR rend du HTML neutre (zéro donnée). À l'hydratation, le Context fournit les
  données seedées.
- **Aucune fetch** vers une API externe à l'exception des polices Google (build-time uniquement).
- **Aucune persistance** : tout est réinitialisé à chaque rafraîchissement de la page.

---

## 3. Routes (16)

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing publique. |
| `/login` | Client | Sélecteur de rôle. |
| `/admin` | Client | Dashboard Head of Care. |
| `/admin/crm` | Client | CRM Chirurgiens (pipeline + table + perf commerciale). |
| `/admin/supervision` | Client | Supervision & qualité. |
| `/sales` | Client | Mon portefeuille chirurgiens (vue sales). |
| `/superviseur` | Client | Inbox opérationnelle + Mes indicateurs + Améliorations terrain. |
| `/superviseur/formation` | Client | Formation superviseur. |
| `/superviseur/patient/[id]` | Dynamic | Fiche patient superviseur (IA + CR + escalade + logs). |
| `/chirurgien` | Client | Dashboard chirurgien. |
| `/chirurgien/onboarding` | Client | Wizard mise en place cabinet. |
| `/chirurgien/planning` | Client | Planning opératoire. |
| `/chirurgien/patient/[id]` | Dynamic | Dossier patient côté chirurgien (CR / escalade transmise). |
| `/patient/onboarding` | Client | Onboarding patient (mobile-first). |
| `/patient/messages` | Client | Messagerie patient. |
| `/logs` | Client | Logs opérationnels + IA. |

> Les routes `Dynamic` utilisent `[id]` et lisent depuis le Context. En V1, elles deviendront
> des routes serveur avec data fetching.

---

## 4. Composants principaux

### `components/Shell.tsx`
- Layout commun à toutes les routes app (sidebar navy + topbar + nav mobile + bandeau prototype).
- **Bascule automatique du rôle d'après l'URL** (évite le flash *« Admin KOVELA »* sur
  `/chirurgien` etc.).
- Le rôle / utilisateur affichés sont **dérivés du pathname**, pas du state (SSR cohérent).
- Affiche le **badge build SHA** (`process.env.BUILD_SHA`).

### `components/ui.tsx` (design system minimal)
- `Button` (variants : primary, secondary, ghost, danger, subtle).
- `Card`, `CardHeader`.
- `Badge` (palette sobre : navy, teal, amber, charcoal).
- `StatCard` (label, value, hint, accent, hover lift).
- `Modal` (overlay, focus container, max-w lg/2xl).
- `AiSuggestion` (encadré disclaimer obligatoire + Accept/Modify/Refuse + temps estimé).
- `DoctrineNote` (rappel doctrine).
- `PageHeader` (bandeau navy avec eyebrow + serif title + subtitle + slot actions).
- `SectionTitle` (titre de section avec hint optionnel).

### `components/Brand.tsx`
- `Wordmark` (KOVELA + monogramme).
- `BrandMark` (monogramme K seul).

### `components/UrgencyBanner.tsx`
- Rappel 15 / 112 sobre, non anxiogène.

**Tous ces composants sont réutilisables en V1.**

---

## 5. Store en mémoire (`lib/store.tsx`)

### Structure
```ts
KovelaProvider
└─ useKovela() retourne :
   {
     role, setRole, currentUser,
     patients, escalations, reports, logs, aiLogs,
     surgeons, assistants, supervisors, prospects, salesOwners, pricing,
     suggestions,
     qualityConversations, qualityCRs, qualityComments,
     // + 30+ actions (assignSupervisor, sendMessage, prepareCompilation, …)
     // + helpers (surgeonName, supervisorName, reportFor, escalationFor, …)
   }
```

### Caractéristiques
- État volatile (un rafraîchissement = reset).
- **30+ actions** qui mutent le store et **journalisent dans `logs`** ou `aiLogs`.
- Toutes les actions sont **synchrones** (pas de Promise).
- Pas de validation aux frontières (les inputs sont supposés valides).

### Verdict
- **Jetable en V1** dans sa forme actuelle.
- **Mais** : les **signatures d'actions** et les **types métier** (lib/types.ts) sont solides
  et peuvent servir de référence pour l'API V1.

---

## 6. Données mockées (`lib/mock-data.ts`)

| Entité | Volume | Source |
|---|---|---|
| Patients | 30 + 3 planning à venir = 33 | `buildPatients()` |
| Chirurgiens | 5 (avec config complète) | `surgeons` const |
| Superviseurs | 4 (avec statut formation / qualité) | `supervisors` const |
| Assistantes | 3 | `assistants` const |
| Prospects CRM | 14 (assignés à 4 sales) | `seedProspects` const |
| Sales owners | 4 | `salesOwners` const |
| Suggestions terrain | 5 | `seedSupervisorSuggestions` const |
| Conversations à relire | 4 | `seedConversationsToReview` const |
| CR à contrôler | 4 | `seedCRsToControl` const |
| Logs initiaux | ~7 | `buildInitialLogs()` |
| Logs IA initiaux | ~50 | `buildInitialAiLogs()` (18 acceptées, 6 modifiées, 2 refusées) |
| Escalations | 0 (préparées via `compilationDraft`) | — |
| Reports | ~13 (cloture + s1 actifs) | `buildReports()` |

**Toutes les coordonnées sont fictives** (`@exemple.test`, `06 00 00 00 0X`).
**Tous les noms sont fictifs.**

---

## 7. Ce qui est réutilisable (à conserver pour V1)

### Forte réutilisation
- **Toutes les types** dans `lib/types.ts` (Patient, Surgeon, CabinetConfig, Supervisor,
  Prospect, SalesOwner, etc.) → schéma de base de données.
- **Le design system** (`components/ui.tsx`, palette Tailwind, polices).
- **Les libellés de statut** et **styles** dans `lib/format.ts`.
- **Les templates de réponse superviseur** (`lib/templates.ts`).
- **Le contenu des sorties IA simulées** (`lib/ai.ts`) — sert de référence pour les prompts
  V1.
- **La structure du wizard onboarding cabinet** (6 étapes).
- **Le gating CR** à 3 états (brouillon / validé interne / disponible).
- **La dissociation compilation factuelle / transmission**.
- **Les filtres et tris** de chaque page.
- **Le wording** (lexique autorisé / interdit) — précieux pour l'audit Aumans.

### Réutilisation moyenne (à adapter)
- La logique d'inbox 6 sections (à requeryer côté serveur).
- Les KPI calculs (à recalculer côté serveur sur données réelles).
- Le wording HDS / RGPD / CNIL prudent — à valider avec DPO.

---

## 8. Ce qui doit être refait (jetable prototype)

- **Store React Context** → API REST / GraphQL + tRPC ou TanStack Query.
- **Seeds mockés** → migrations + seeds de démonstration séparés.
- **IA simulée locale** → IA Gateway serveur (cf. `V1_HDS_ARCHITECTURE_BRIEF.md`).
- **Sélecteur de rôle fictif** → vraie authentification + RBAC.
- **GoCardless fictif** → vraie intégration GoCardless (mandats SEPA, webhooks).
- **Toutes les actions synchrones** → asynchrones avec gestion d'erreur.

---

## 9. Limites techniques actuelles

| Limite | Impact | À traiter en V1 |
|---|---|---|
| État volatile (en mémoire) | Refresh = reset | ✅ |
| Pas d'auth | Aucun cloisonnement | ✅ critique HDS |
| Pas de RBAC | Toutes les routes accessibles | ✅ critique HDS |
| Pas de validation des formulaires | Champs vides acceptés | ✅ |
| Pas d'accessibilité a11y | Pas de focus trap modales, pas d'aria-label | ✅ (RGAA) |
| Pas de tests | Refactor risqué | ✅ (Vitest + Playwright) |
| Pas de gestion d'erreur globale | Erreur runtime visible | ✅ (ErrorBoundary, Sentry) |
| Patient hardcodé p1 | Onboarding patient figé | ✅ (lien magique par patient) |
| Superviseur hardcodé sup1 | Idem | ✅ |
| Chirurgien hardcodé s1 | Idem | ✅ |
| Pas d'i18n | FR uniquement | V2 |
| Pas d'historique d'événements | Logs append-only mais pas immuables | ✅ critique audit |
| Modèle `Patient` surchargé | Suivi + planning + compilationDraft mélangés | ✅ séparer les entités |

---

## 10. Recommandations backend / auth / DB / HDS

### Backend
- **Node.js + TypeScript** (cohérent avec le front).
- Framework : **NestJS** (rigueur DI, modules, observable) **ou** **Hono / Fastify** + Prisma
  (plus léger). Privilégier NestJS pour un projet santé avec exigences d'audit.
- API : **tRPC** si front 100 % Next.js (typage end-to-end), sinon **REST** ou **GraphQL**.

### Auth
- **Clerk** (rapide, SOC2) **ou** **Auth.js / NextAuth** + provider santé approuvé.
- SSO entreprise pour les chirurgiens à terme.
- **MFA obligatoire** pour Admin, Sales, Superviseur, Chirurgien.

### RBAC
- 5 rôles minimum : `admin`, `head_of_care`, `superviseur`, `chirurgien`, `assistante`,
  `patient`, `sales`.
- Permissions granulaires par action (ex. `cr:publish`, `escalade:transmit`).
- Cloisonnement : un superviseur voit ses patients ; un chirurgien voit ses patients ;
  un sales voit ses prospects.

### Base de données
- **PostgreSQL** (Prisma ou Drizzle ORM).
- **Migrations versionnées**.
- Hébergement HDS-certifié obligatoire pour la base de données contenant des données patient.

### Stockage fichiers (photos / audios patient)
- **Object storage S3-compatible HDS** (Scaleway Object Storage HDS, OVH Object Storage HDS).
- **Chiffrement au repos** (SSE-KMS) + chiffrement en transit (TLS 1.3).
- URLs **présignées** avec expiration courte.
- Antivirus (ClamAV) ou service tiers à l'upload.

### Hébergement
- **OVH HDS**, **Outscale HDS**, ou **Scaleway HDS** (FR-based).
- Bonus : conformité RGPD + données restant en UE.
- Production : 3 zones de disponibilité minimum, RPO/RTO documentés.

### Monitoring
- **Sentry** (erreurs front + backend).
- **Datadog / Grafana** (métriques + logs structurés JSON).
- Alertes sur taux d'erreur, latence p95, taux d'acceptation IA inhabituel.

### Sécurité
- **Headers** : CSP strict, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff.
- **Secrets management** : Vault / 1Password / AWS Secrets Manager.
- **Dependency scanning** : Snyk / Dependabot.
- **SAST/DAST** sur la CI.

### IA (cf. brief V1 dédié)
- **Gateway serveur** entre l'app et le fournisseur IA (Anthropic / OpenAI / Mistral).
- **Redaction** PII en entrée et en sortie.
- **Logs immuables** des requêtes / réponses.
- **Kill-switch** par fonction.
- **Évaluation continue** des sorties (qualité, conformité wording).

### Logs / audit trail
- **Append-only**.
- **Hash chaining** ou stockage WORM (Write Once Read Many).
- Conservation conforme aux obligations (à valider Aumans + DPO).

---

## 11. Conseils pour Émilien / lead dev V1

1. **Garder la cohérence wording** : le lexique a été polish, ne pas réintroduire de
   vocabulaire médical. Un linter wording en CI peut aider (grep des mots interdits).
2. **Réutiliser le design system** tel quel (Tailwind config + composants `ui.tsx`). Pas
   besoin de Storybook au démarrage, le code est lisible.
3. **Reprendre les types `lib/types.ts`** comme base du schéma Prisma.
4. **Implémenter l'auth en premier**, avant même d'écrire une seule route métier.
5. **L'IA en dernier** : on peut très bien faire un MVP V1 sans IA en désactivant les
   boutons. Cela permet de valider l'usage humain pur d'abord.
6. **Pas de TODO `// fix later`** : la doctrine wording doit être tenue dès le code V1.
7. **Tests E2E avant V1** : Playwright sur les 4 parcours critiques (Admin Head of Care,
   Superviseur fiche patient, Cabinet onboarding, Patient messagerie).
8. **Bandeau de version** : conserver le badge `build <SHA>` en bas ou en haut, c'est très
   utile pour les utilisateurs de support.
