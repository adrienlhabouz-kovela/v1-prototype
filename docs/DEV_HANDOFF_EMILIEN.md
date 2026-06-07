# KOVELA — Dev Handoff Émilien — Prototype V1

> **Audience** : équipe dev Émilien.
> **Objectif** : source de vérité claire sur l'état actuel du prototype KOVELA, les décisions UX validées, la doctrine produit, les routes concernées et ce qu'il **ne faut pas casser** dans les prochaines itérations.
> **Commit stable superviseur de référence** : `7ff14f2`.

---

## 1. Contexte produit

### Ce que KOVELA est

- Une **infrastructure opérationnelle** post-opératoire.
- Un **service supervisé humainement** (équipe coordination terrain).
- Un **outil de coordination** entre patient et cabinet.
- Un **système de traçabilité** (journal d'action + logs IA).
- Une **interface de transmission cabinet** (compilation factuelle).
- Une **IA assistive interne uniquement**.

### Ce que KOVELA n'est PAS

- ❌ Un service d'urgence.
- ❌ Un outil de diagnostic.
- ❌ Un outil de prescription.
- ❌ Un outil de décision médicale.
- ❌ Une IA autonome côté patient.

### Wedge initial

Chirurgie esthétique libérale. Suivi post-opératoire structuré sur 3 à 12 jours selon l'intervention. Cible humaine ~1h/patient sur l'ensemble du suivi.

---

## 2. Pricing à ne pas modifier

| Élément | Valeur |
|---|---|
| Abonnement cabinet | **690 € HT / mois / chirurgien** |
| Patient activé | **80 € HT / patient activé** |
| Définition patient activé | onboarding validé + suivi lancé |

**Ne pas modifier sans validation produit explicite.**

Référence canonique : [`DECISIONS_LOG.md`](DECISIONS_LOG.md) § 2.

---

## 3. Routes principales

| Route | État | Doit-on toucher ? |
|---|---|---|
| `/` | Landing institutionnelle (crédibilité) | ❌ Ne pas remplacer sans demande explicite |
| `/chirurgiens-esthetiques` | Landing courte acquisition (conversion ciblée) | ⚠ Améliorations OK (variantes A/B, branchement CRM) ; ne pas casser la structure validée |
| `/login` | Accès prototype (sélecteur de rôle) | ⚠ Toucher uniquement si bug |
| `/superviseur` | Cockpit superviseur **validé** | ❌ Locked V1 prototype |
| `/superviseur/patient/[id]` | Fiche patient superviseur **validée** | ❌ Locked V1 prototype |
| `/chirurgien` | Espace chirurgien existant | ⚠ Améliorations OK avec validation |
| `/chirurgien/patient/[id]` | Fiche patient chirurgien | ⚠ Améliorations OK avec validation |
| `/chirurgien/referentiel` | Référentiel chirurgien | ⚠ Améliorations OK avec validation |
| `/chirurgien/onboarding` | Mise en place cabinet | ⚠ Améliorations OK avec validation |
| `/chirurgien/activation/[token]` | Lien personnalisé d'activation | ❌ Locked (parcours validé) |
| `/patient/onboarding` | Onboarding patient mobile | ❌ Ne pas modifier sans demande |
| `/patient/messages` | Messagerie patient mobile | ❌ Ne pas modifier sans demande |
| `/admin`, `/admin/crm`, `/admin/supervision`, `/sales` | Espaces internes admin | ⚠ Améliorations OK avec validation |
| `/logs` | Logs opérationnels + IA | ⚠ Améliorations OK avec validation |

---

## 4. Périmètre validé à ne pas casser

### UX superviseur V1 prototype (commit `7ff14f2`)

- Workspace superviseur unifié.
- Rail patient permanent (`components/SupervisorQueueRail.tsx`).
- Dashboard orienté « À traiter maintenant » (HERO en table avant filtres / files secondaires).
- Fiche patient conversationnelle (header sticky + grid 3/6/3 sur lg, 2/7/3 sur 2xl).
- Conversation patient centrale et dominante.
- Panneau d'action vertical hiérarchisé (6 cards : Action principale · Cabinet · CR · Suivi · Journal · Notes).
- Transmission cabinet (modale structurée + pipeline 3 étapes + WhatsApp prototype).
- CR factuel (workflow brouillon → validé → transmis chirurgien).
- Journal d'action séparé (card autonome).
- Notes internes (style délibérément distinct des messages patient).
- Doctrine non médicale partout.
- Wording sécurisé (voir [`WORDING_DOCTRINE.md`](WORDING_DOCTRINE.md)).

Voir [`SUPERVISOR_UX_V1.md`](SUPERVISOR_UX_V1.md) pour le détail complet.

### Doctrine produit

- KOVELA ne diagnostique pas, ne prescrit pas, ne décide pas médicalement.
- KOVELA ne prend pas en charge les urgences.
- L'IA est interne et assistive, jamais autonome côté patient.

### Pricing

- 690 € HT / mois + 80 € HT / patient activé.
- **Ne jamais afficher** ce pricing sur la page `/chirurgiens-esthetiques` (landing acquisition). La page de conversion ne mentionne pas de tarif — c'est volontaire pour préserver la qualification commerciale.

### Doctrine HDS / RGPD

- « Architecture cible HDS / RGPD » et « aucune certification revendiquée à ce stade ».
- Ne **jamais** écrire « certifié HDS », « conforme HDS », « 100 % conforme RGPD », « validé CNIL », « sécurité garantie ».

---

## 5. Périmètre à éviter sans validation produit

- ❌ Refonte landing.
- ❌ Changement pricing.
- ❌ Changement doctrine médicale.
- ❌ Ajout d'IA côté patient.
- ❌ Ajout de promesse H24 (le service est sur la plage 8h-20h, voir [`DECISIONS_LOG.md`](DECISIONS_LOG.md) § 13quater).
- ❌ Ajout de diagnostic / prescription / décision médicale.
- ❌ Transformation de WhatsApp en canal V1 définitif (prototype uniquement).
- ❌ Refonte espace chirurgien sauf demande explicite.
- ❌ Refonte espace patient sauf demande explicite.
- ❌ Promesse de « preuve juridique garantie » ou « bouclier médico-légal ».

---

## 6. Priorités dev futures probables

À documenter comme **backlog**, **pas comme tâche immédiate**. À reprioriser au lancement V1 production.

1. **Rendre le rail patient collapsible** (toggle icons-only / expanded).
2. **Rendre le panneau contexte/action compressible** pour maximiser la conversation sur laptop standard.
3. **Ajouter de vrais états de données persistants** (le prototype est en mémoire via React Context).
4. **Structurer les rôles utilisateur** côté backend (RBAC : superviseur / chirurgien / admin / patient).
5. **Brancher backend / base de données** réels (actuellement mock-data.ts).
6. **Remplacer les données fictives par modèles typés** branchés au backend.
7. **Préparer audit trail réel** (le journal d'action prototype doit devenir un vrai audit trail signé).
8. **Préparer export PDF V1 réel** (CR factuel actuellement export désactivé).
9. **Préparer architecture HDS / RGPD** (cf. [`V1_HDS_ARCHITECTURE_BRIEF.md`](V1_HDS_ARCHITECTURE_BRIEF.md)).
10. **Préparer gestion permissions** superviseur / chirurgien / admin (lecture / écriture / transmission).
11. **Implémenter la demande d'avis Google en fin de suivi** (annoncée sur la landing acquisition, non implémentée côté code). Déclenchement en fin de fenêtre de suivi · message patient neutre · lien Google du cabinet validé à l'activation · journal d'action `demande_avis_envoyee` · **aucun filtrage / review gating / incentive**. Cadre complet : [`DECISIONS_LOG.md`](DECISIONS_LOG.md) § 13duodecies.

---

## 7. Règle de travail générale

Toute modification future doit préserver :

- **clarté opérationnelle** — l'UX superviseur doit rester un poste de travail rapide ;
- **sécurité wording** — aucun mot du lexique interdit (voir [`WORDING_DOCTRINE.md`](WORDING_DOCTRINE.md)) ;
- **non-substitution médicale** — KOVELA ne décide jamais à la place du chirurgien ;
- **séparation conversation / notes / transmission / CR / journal** — aucun risque de confusion ;
- **priorité à l'action superviseur** — pas de bloc décoratif qui retarde l'action ;
- **cohérence prototype vs V1 réelle** — toute fonctionnalité non encore réelle doit être marquée « prototype » ou « prévu en V1 ».

---

## 8. Stack technique en bref

| Élément | Détail |
|---|---|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| UI | React 18 + Tailwind CSS 3 |
| State | React Context (`lib/store.tsx`) — pas de backend |
| Données | 100 % mockées en mémoire (`lib/mock-data.ts`) |
| Build | `npm run build` → `npm run start` |
| Dev | `npm run dev` → http://localhost:3000 |
| Déploiement | Vercel (preview branche + production) |

---

## 9. Documentation source de vérité

| Document | Contenu |
|---|---|
| [`DECISIONS_LOG.md`](DECISIONS_LOG.md) | **Source unique** des arbitrages produit, messaging, pricing, UX validés. |
| [`SUPERVISOR_UX_V1.md`](SUPERVISOR_UX_V1.md) | Détail architecture UX superviseur V1 validée. |
| [`WORDING_DOCTRINE.md`](WORDING_DOCTRINE.md) | Lexique autorisé / interdit + formulations validées. |
| [`PRODUCT_SCOPE.md`](PRODUCT_SCOPE.md) | Périmètre produit, doctrine, ce qui est dans / hors scope. |
| [`AI_REQUIREMENTS.md`](AI_REQUIREMENTS.md) | Cahier des charges IA (interne, assistive, loggée). |
| [`TECHNICAL_NOTES.md`](TECHNICAL_NOTES.md) | Notes techniques (capacité superviseuse, workflow CR, etc.). |
| [`V1_HDS_ARCHITECTURE_BRIEF.md`](V1_HDS_ARCHITECTURE_BRIEF.md) | Brief architecture cible HDS / RGPD pour V1. |
| [`CABINET_ACTIVATION_FLOW.md`](CABINET_ACTIVATION_FLOW.md) | Parcours activation cabinet (lien personnalisé, pas d'inscription libre). |
| [`REGULATORY_REVIEW_NOTES.md`](REGULATORY_REVIEW_NOTES.md) | Notes de revue réglementaire. |
| [`SUPERVISOR_RECRUITMENT_SCORECARD.md`](SUPERVISOR_RECRUITMENT_SCORECARD.md) | Scorecard de recrutement superviseur (profil terrain senior). |
| [`DEMO_SCRIPTS.md`](DEMO_SCRIPTS.md) | Scripts de démo (pitch + parcours). |
| [`README.md`](../README.md) | README projet (installation, déploiement, état actuel). |

---

## 10. Contact

Pour toute question UX ou produit avant modification du périmètre validé : **demander validation explicite produit** avant de toucher.
