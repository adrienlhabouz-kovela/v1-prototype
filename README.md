# KOVELA — Prototype V1 (démonstration)

> **Avertissement.** Ce dépôt est un **prototype front-end de démonstration**.
> Ce n'est **pas** une plateforme de production HDS. Il ne contient **aucune donnée réelle** :
> toutes les données (patients, chirurgiens, messages, CR, transmissions cabinet) sont **fictives et mockées localement**.
> Il sert à **visualiser, tester et démontrer** les parcours clés avant développement industriel.

**Doctrine produit (rappelée dans toute l'UI) :**
KOVELA ne décide pas médicalement. KOVELA **organise les échanges, documente le suivi et transmet au cabinet selon les règles définies**.
L'IA est **uniquement assistive, interne, loggée, désactivable et human-in-the-loop**.
Elle ne répond jamais seule au patient, ne diagnostique jamais, ne qualifie jamais un symptôme,
n'analyse jamais médicalement les photos et ne décide jamais de transmission cabinet sans validation humaine.

> **Décisions canoniques** : voir [`docs/DECISIONS_LOG.md`](docs/DECISIONS_LOG.md) — source de vérité unique des arbitrages produit, messaging et pricing validés (mise à jour 2026-06-01).

---

## 1. Installation

Prérequis : **Node.js ≥ 18** (testé sur Node 22).

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:3000
```

Build / production locale :

```bash
npm run build
npm run start    # http://localhost:3000
```

Aucune variable d'environnement, aucun backend, aucune base de données, aucune clé API ne sont nécessaires.

---

## 1bis. Déploiement sur Vercel (preview partageable)

Objectif : obtenir une **URL de preview** pour tester visuellement le prototype **sans installation locale**.
Next.js est détecté automatiquement par Vercel ; le dépôt contient déjà un `vercel.json` minimal.

> **Aucun secret, aucune clé API, aucune variable d'environnement** n'est nécessaire.
> Laissez la liste des variables d'environnement **vide** dans Vercel. Données 100 % fictives.

### Option A — Import via le dashboard Vercel (recommandé, zéro installation)

1. Connectez-vous sur [vercel.com](https://vercel.com) avec votre compte GitHub.
2. **Add New… → Project** puis importez le dépôt `adrienlhabouz-kovela/v1-prototype`.
3. Vercel détecte **Next.js** automatiquement :
   - Framework Preset : `Next.js`
   - Build Command : `next build` (par défaut)
   - Install Command : `npm install` (par défaut)
   - Output : géré automatiquement
4. Ne renseignez **aucune** variable d'environnement.
5. **Deploy**.

Une fois le dépôt connecté, Vercel crée **automatiquement une preview pour chaque branche et chaque
Pull Request** : un push sur `claude/eloquent-darwin-wwVME` (ou sur la PR) génère une URL de preview
dédiée, idéale pour la revue visuelle.

### Option B — CLI Vercel (depuis une machine locale)

```bash
npm i -g vercel
vercel        # déploiement de preview → renvoie une URL *.vercel.app
vercel --prod # déploiement de production (optionnel)
```

### Vérifier la preview
Ouvrez l'URL `*.vercel.app` fournie par Vercel, puis déroulez les parcours :
`/` → `/login` → `/admin` → `/superviseur` → fiche patient → `/chirurgien` → `/patient/onboarding` →
`/patient/messages` → `/logs`. L'espace patient est pensé **mobile-first** (testez en largeur réduite).

> Rappel : l'état est **en mémoire** (volatile). Un rafraîchissement réinitialise les données mockées.
> C'est volontaire pour un prototype : aucune donnée n'est persistée.

---

## 2. Stack

| Choix | Détail |
|---|---|
| **Next.js 14 (App Router)** | Routing par dossiers, rendu rapide, pas de backend lourd |
| **React 18 + TypeScript** | Composants typés |
| **Tailwind CSS 3** | Design system premium santé (navy / teal / off-white) |
| Données | 100 % **mockées en mémoire** (`lib/mock-data.ts`) via un **store React Context** |

> **Pas de Shadcn CLI** : un petit set de primitives maison (`components/ui.tsx`) suffit pour un
> prototype et évite une dépendance d'init. C'est volontaire et facilement remplaçable par Shadcn en V1.

---

## 3. Architecture des fichiers

```
app/
  layout.tsx                         # Provider global (store) + métadonnées
  page.tsx                           # Landing premium
  login/page.tsx                     # Sélecteur de rôle fictif
  admin/page.tsx                     # Dashboard Admin KOVELA
  superviseur/page.tsx               # Inbox opérationnelle (cœur du proto)
  superviseur/patient/[id]/page.tsx  # Fiche patient superviseur + IA + CR + escalade
  chirurgien/page.tsx                # Dashboard chirurgien
  chirurgien/patient/[id]/page.tsx   # Dossier patient / CR côté chirurgien
  patient/onboarding/page.tsx        # Onboarding mobile-first + consentement
  patient/messages/page.tsx          # Messagerie patient mobile-first
  logs/page.tsx                      # Logs opérationnels + logs IA

components/
  Shell.tsx                          # Layout (sidebar, nav par rôle, switch de rôle)
  ui.tsx                             # Button, Card, Badge, StatCard, Modal, AiSuggestion, DoctrineNote
  UrgencyBanner.tsx                  # Rappel urgence 15/112 permanent

lib/
  types.ts                           # Types métier
  mock-data.ts                       # Données fictives (5 chir., 3 assist., 4 superv., 30 patients)
  store.tsx                          # Store React Context (état + actions en mémoire)
  ai.ts                              # Couche IA SIMULÉE (résumé, CR, reformulation, compilation)
  templates.ts                       # Bibliothèque de templates superviseur
  format.ts                          # Helpers de date + libellés/styles de statut
```

---

## 4. Données mockées (`lib/mock-data.ts`)

- **5 chirurgiens**, **3 assistantes**, **4 superviseurs**.
- **30 patients fictifs** avec une distribution déterministe de statuts :
  - 4 onboarding incomplet, 5 silencieux, 3 escalade ouverte, 5 CR en attente, 3 clôturés, 10 actifs ;
  - ~4 patients **sans superviseur** (à attribuer côté admin).
- Messages, **photos/audios placeholders**, notes internes, escalades, CR.
- Pricing landing validé : **690 € HT / mois + 80 € HT / patient activé** (offre pilote).
  *Patient activé = onboarding validé + suivi lancé.* Référence canonique :
  [`docs/DECISIONS_LOG.md`](docs/DECISIONS_LOG.md) § 2.

---

## 5. Composants clés

- **`KovelaProvider` / `useKovela`** (`lib/store.tsx`) — source unique de vérité en mémoire.
  Porte tout l'état (patients, escalades, CR, logs, logs IA) et **toutes les actions** (attribuer,
  envoyer un message, valider/publier un CR, ouvrir/transmettre une escalade, logger l'IA…).
  Les écrans sont réactifs : une action sur la fiche patient se reflète immédiatement sur le dashboard admin.
- **`Shell`** — layout commun, navigation par rôle, **sélecteur de rôle** (pills en haut + page `/login`).
- **`AiSuggestion`** — encadré de sortie IA imposant le disclaimer *« Suggestion IA — à valider par un humain »*
  et les 3 actions humaines **Accepter / Modifier / Refuser**.
- **`DoctrineNote`** / **`UrgencyBanner`** — rappels permanents du périmètre non médical et de l'urgence 15/112.

---

## 6. Décisions produit prises

1. **Store en mémoire (Context)** plutôt qu'un backend : interactivité réelle pour la démo, zéro infra.
2. **Vocabulaire juridique strict** appliqué dans tout le code et l'UI (lexique autorisé / banni respecté) :
   *coordination, continuité post-opératoire, classement opérationnel, message non traité, patient silencieux,
   CR en attente, compilation factuelle, transmission au chirurgien…* — jamais *diagnostic, tri médical, gravité,
   urgence détectée, patient à risque, recommandation médicale*, etc.
3. **IA jamais autonome** : aucune fonction IA ne s'exécute sans clic humain ; toute sortie passe par
   Accepter / Modifier / Refuser et est **journalisée** (fonction, version de prompt, date, utilisateur, décision).
4. **Pas de chatbot patient** : côté patient, la messagerie indique explicitement « traité par une équipe humaine,
   aucune réponse automatique par IA ».
5. **CR = brouillon par défaut** (« Brouillon de CR à valider ») ; le chirurgien ne voit **que** les CR
   **validés ou rendus disponibles**, jamais les brouillons.
6. **Escalade = compilation factuelle** : chronologie + pièces jointes + actions faites ; le chirurgien ne reçoit
   la compilation **que lorsqu'elle est transmise**.
7. **Classement opérationnel uniquement** dans l'inbox (non-lu, ancienneté, silencieux, CR en attente,
   escalade ouverte, onboarding incomplet) — **aucun** tri par gravité/risque.
8. **Sélecteur de rôle global** pour démontrer les 4 espaces en 5 minutes sans logout.

---

## 7. Fonctions simulées (aucun appel réel)

| Fonction | Où | Effet simulé |
|---|---|---|
| **Résumer la conversation** | Fiche patient superviseur | Synthèse opérationnelle factuelle (`aiSummarize`) |
| **Préparer le CR** | Fiche patient superviseur | Brouillon de CR factuel à valider (`aiPrepareReport`) |
| **Reformuler** | Zone de réponse | Reformulation de forme, non médicale (`aiReformulate`) |
| **Préparer compilation d'escalade** | Fiche patient superviseur | Chronologie factuelle pour le chirurgien (`aiCompileEscalation`) |
| Détection opérationnelle | Badges | message non traité / silencieux / CR en attente / onboarding incomplet |
| Attribution / réattribution | Admin | met à jour le superviseur + log |
| Validation / publication CR | Superviseur | brouillon → validé → disponible (+ logs) |
| Transmission d'escalade | Superviseur → Chirurgien | rend la compilation visible au chirurgien (+ log) |
| Onboarding patient | Patient | marque le patient comme **activé** (impacte la facturation) |
| Paiement / mandat GoCardless | Admin & Chirurgien | **affichage uniquement**, aucun paiement réel |

Chaque usage IA crée une entrée dans **`/logs` → onglet « Logs IA »** (fonction, prompt `v1.2`, date, utilisateur, décision).

---

## 8. Parcours de démonstration (≈ 5 min)

1. `/login` → **Admin** : stats, **charge par superviseur**, table patients, **attribuer** un patient sans superviseur.
2. **Superviseur** (`/superviseur`) : inbox opérationnelle → ouvrir une **fiche patient** (ex. un patient en escalade).
3. Sur la fiche : **Résumer** (IA) → Accepter ; **Préparer le CR** (IA) → Accepter (brouillon) → **Valider** → **Rendre disponible**.
4. **Préparer compilation d'escalade** (IA) → Accepter → **Transmettre au chirurgien**.
5. Bascule **Chirurgien** : le CR et la compilation factuelle apparaissent côté chirurgien.
6. Bascule **Patient** : onboarding + messagerie (photo/audio placeholders, rappel urgence permanent).
7. `/logs` : traçabilité opérationnelle + logs IA (accepté/modifié/refusé).

---

## 9. Points à valider AVANT une vraie V1 / production HDS

- **Hébergement HDS certifié** (données de santé) — obligatoire, non couvert ici.
- **Authentification & autorisation réelles** (MFA, RBAC, séparation stricte des rôles, audit des accès).
- **Chiffrement** au repos et en transit, gestion des secrets, cloisonnement des données par chirurgien.
- **Conformité RGPD / cadre médical** : base légale, consentement réel et traçable, durées de conservation,
  registre des traitements, DPO, information patient, droit d'accès/effacement.
- **Cadre juridique de l'acte** : statut exact de la coordination, responsabilités, contrats chirurgiens, CGU/CGV.
- **Gouvernance de l'IA** : versionnage et revue des prompts, garde-fous, **kill-switch** réel, logs immuables,
  évaluation, politique d'usage (jamais de diagnostic / qualification de symptôme / analyse photo médicale).
- **Pièces jointes réelles** (photos/audios) : stockage chiffré HDS, antivirus, durée de vie, accès tracé.
- **Persistance & intégrité** : base de données, sauvegardes, journal d'audit inaltérable, traçabilité légale.
- **Paiement réel** (GoCardless/SEPA) : mandats, facturation, gestion des impayés, comptabilité.
- **Disponibilité & support** : SLA, astreinte, **rappel permanent que KOVELA n'est pas un service d'urgence**.
- **Accessibilité** (RGAA/WCAG) et tests sur mobile réel pour l'espace patient.

---

## 10. Du prototype à une vraie V1 — recommandations

1. **Backend** : API (Next API routes / NestJS) + **PostgreSQL** ; remplacer le store en mémoire par des
   appels serveur. Le store actuel est volontairement isolé pour faciliter ce remplacement.
2. **Auth** : NextAuth / Clerk / fournisseur conforme + RBAC par rôle (admin / superviseur / chirurgien / patient).
3. **IA** : passer la couche `lib/ai.ts` derrière un service serveur (avec garde-fous, prompts versionnés,
   logs immuables, kill-switch). Conserver strictement le **human-in-the-loop** et le périmètre non médical.
4. **Stockage médias** : bucket chiffré chez l'hébergeur HDS, URLs signées, durée de vie limitée.
5. **Journalisation** : logs d'audit append-only (immuables) pour les accès, l'IA, les CR et les escalades.
6. **UI** : migrer les primitives maison vers Shadcn/UI si besoin ; ajouter tests E2E (Playwright) sur les parcours clés.
7. **Conformité** : intégrer très tôt juridique + DPO + hébergeur HDS dans la roadmap de développement industriel.

---

*KOVELA — prototype de démonstration. Données fictives. Pas une plateforme de production HDS.*
