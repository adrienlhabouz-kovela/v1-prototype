# KOVELA — Scripts de démonstration (4 audiences)

> **Statut** : guide opérationnel pour celui qui présente le prototype. À garder ouvert
> pendant la démo.
> **Audiences couvertes** : Émilien (lead dev V1) · Chirurgien (futur client) · Investisseur
> healthtech · Aumans (avocat e-santé).
> **Cross-référence** : `docs/README_DEMO.md` (résumé) · `docs/PRODUCT_SCOPE.md` (périmètre) ·
> `docs/TECHNICAL_NOTES.md` (technique) · `docs/V1_HDS_ARCHITECTURE_BRIEF.md` (architecture
> cible) · `docs/AI_REQUIREMENTS.md` (IA) · `docs/REGULATORY_REVIEW_NOTES.md` (juridique).

---

## Comment utiliser ce document

1. **Choisir le script selon l'audience.** Ne pas faire un mix-and-match. Chaque script est
   calibré pour son interlocuteur — ton, vocabulaire, parcours, pièges.
2. **Ouvrir la preview** avant l'arrivée de l'interlocuteur :
   `https://v1-prototype-git-claude-eloquent-darw-bcb977-adrien-s-projects6.vercel.app`.
3. **Vérifier le build** dans le bandeau en haut de l'app — il doit afficher le SHA du
   dernier commit poussé.
4. **Hard refresh** (Cmd/Ctrl+Shift+R) sur chaque route avant la démo, pour purger tout
   cache navigateur ou CDN.
5. **Ne jamais improviser** sur les sujets juridiques, HDS, RGPD, CNIL ou IA. Toujours
   utiliser les formulations prudentes du script. En cas de doute, dire *« je note la
   question, on y répond après vérification »*.
6. **Noter les questions et objections** à la fin (cf. section *« Après chaque démo »*).
   Reporter dans le suivi commercial / produit.

> **Préférer** : *« architecture cible »*, *« pensé pour »*, *« principes CNIL »*,
> *« service opéré »*.
> **Éviter** : *« certifié HDS »*, *« validé CNIL »*, *« logiciel »*, *« on garantit »*,
> *« on automatise le suivi patient »*.

---

## Pré-vol commun

- **URL** : `https://v1-prototype-git-claude-eloquent-darw-bcb977-adrien-s-projects6.vercel.app`
- **Vérifier** le badge `build <SHA>` en haut de toute page d'application.
- **Hard refresh** si le SHA ne correspond pas au dernier commit poussé.
- **État volatile** : la démo se déroule **sans recharger la page** (refresh = reset des
  données mockées).
- **Sélecteur de rôle** disponible en haut (pills) ou via `/login`. Le rôle bascule aussi
  **automatiquement d'après l'URL** (admin / superviseur / chirurgien / patient).

---

# 1. Démo Émilien (lead dev V1)

**Audience** : développeur senior qui devra cadrer puis livrer la V1 HDS.
**Tonalité** : technique, factuelle, transparente sur ce qui est jetable vs réutilisable.
**Objectif** : qu'il reparte avec une vision claire de l'effort V1, des lots techniques, et
des décisions à trancher.

## 1.A — Version courte (8 min)

### Préparation
- Avoir un second onglet ouvert sur le repo GitHub (PR #1) et sur `docs/TECHNICAL_NOTES.md`.

### Parcours (5 routes)
1. **`/`** *(30 s)* — *« Landing publique, hors HDS, aucune donnée patient. Le badge en haut
   affiche le SHA déployé. Tout l'état est en React Context — un refresh remet à zéro. »*
2. **`/admin`** *(1,5 min)* — *« Aucune fetch, store en mémoire. Cette page sera reconstruite
   par-dessus l'API V1. Les types métier dans `lib/types.ts` sont la base du schéma DB. »*
   Montrer Actions prioritaires + Qualité & délais + Charge superviseur.
3. **`/superviseur/patient/p11`** *(2 min)* — *« Fiche critique. L'IA est simulée localement
   dans `lib/ai.ts` ; en V1 elle passe par un gateway serveur (redaction PII, kill-switch,
   audit log). Cf. AI_REQUIREMENTS.md. »* Cliquer **Résumer** → badge *Estimation prototype —
   temps gagné*. Puis **Préparer le CR** → Accepter → **Valider en interne** → **Rendre
   disponible**. Insister sur le gating 3 états.
4. **`/chirurgien/patient/p11`** *(45 s)* — *« Côté chirurgien : uniquement les CR publiés
   et les escalades transmises. Contenu normalisé à la publication. »*
5. **`/logs`** *(45 s)* — *« 30+ types de logs typés. En V1 : append-only avec hash
   chaining. Filtres IA / CR / Escalade / Qualité / CRM. »* Filtrer **IA** puis **Qualité**.

### Messages clés à dire (8 min)
- *« Réutilisable : design system `components/ui.tsx`, types `lib/types.ts`, wording,
  structure des wizards, gating CR. »*
- *« Jetable : store en mémoire, IA simulée locale, sélecteur de rôle fictif, GoCardless
  fictif. »*
- *« Le découpage V1 en 8 lots est documenté §22 du brief HDS — c'est ton point de départ. »*
- *« 16 questions techniques §12 attendent ta décision (hébergeur HDS, auth, framework
  backend, LLM provider…). »*

### Pièges à éviter (commun aux deux versions)
- ❌ **Ne jamais parler de budget / coûts / chiffrage** — la doc est volontairement neutre.
  *« Le chiffrage relève d'un cadrage d'équipe ultérieur. »*
- ❌ Ne pas promettre que l'auth / RBAC sera trivial : c'est le **lot 2** critique HDS.
- ❌ Ne pas dire *« on copie-colle le front »* — on garde les composants, le data flow
  change (store → API).
- ❌ Si la preview affiche un ancien build : c'est du cache, hard refresh.

## 1.B — Version complète recommandée (15-20 min)

> Reprend le parcours court, plus 3 deep-dives techniques de ~4 min chacun. Objectif :
> qu'Émilien reparte avec **les lots V1, les décisions techniques, et la logique HDS / RBAC
> / DB / IA gateway** parfaitement en tête.

### Étape 1 : Parcours produit (~8 min, identique à 1.A)
Dérouler la version courte ci-dessus.

### Étape 2 : Deep-dive « Réutilisable vs jetable vs à reconstruire » (~4 min)
Sur la base de `docs/TECHNICAL_NOTES.md` §7-8 :

- **À garder tel quel** : ouvrir `components/ui.tsx`, `components/Shell.tsx`,
  `lib/types.ts`, `lib/format.ts`, `lib/templates.ts`. *« C'est le socle. Design system,
  modèle métier, lexique, templates de réponse — tout ça est solide. »*
- **À adapter** : `app/**` (les pages restent, le data flow change : store → API + tRPC ou
  REST + TanStack Query).
- **À jeter intégralement** : `lib/store.tsx` (store en mémoire), `lib/mock-data.ts`
  (seeds), `lib/ai.ts` (fonctions IA simulées) — remplacés par API, base de données,
  IA gateway.

**Mention importante** : *« Le modèle `Patient` du prototype mélange identité, planning,
suivi, compilation. En V1 il faut séparer en `Patient` / `Intervention` / `FollowUp` —
c'est documenté `V1_HDS_ARCHITECTURE_BRIEF.md` §20. »*

### Étape 3 : Deep-dive « Les 8 lots V1 » (~5 min)
Ouvrir `docs/V1_HDS_ARCHITECTURE_BRIEF.md` §22 et parcourir chaque lot avec un
positionnement clair :

| Lot | Périmètre | Complexité | Dépendances |
|---|---|---|---|
| **1. Socle technique** | Repo + CI/CD + design system migré + linter wording | Moyenne | Choix hébergeur HDS, framework backend |
| **2. Auth / RBAC** | Clerk ou Auth.js + matrice permissions + MFA + magic link patient | Moyenne | Lot 1 |
| **3. Patients / messages / fichiers** | Patient/Intervention/FollowUp + stockage HDS + chiffrement + antivirus | **Élevée** | Lots 1, 2 |
| **4. Supervision / CR / logs** | Inbox + gating CR + compilation dissociée + audit trail hash chaining | **Élevée** | Lots 1, 2, 3 |
| **5. IA assistive** | IA Gateway + redaction PII + kill-switch + 4 fonctions + HITL | **Élevée** | Lots 1, 2, 3, 4 |
| **6. Automatisations** | Lien onboarding patient + relances + parser CSV + détections | Moyenne | Lots 2, 3, 4 |
| **7. GoCardless / facturation** | Mandats SEPA + webhooks + facturation automatique | Moyenne | Lots 1, 2 |
| **8. Sécurité / HDS / monitoring** | Pen test + Sentry + sauvegardes + tests restauration | Moyenne (critique) | Tous |

*« L'ordre, la parallélisation et la profondeur de chaque lot V1 sont à arbitrer en
équipe selon ressources et délais. »*

### Étape 4 : Deep-dive « HDS / RBAC / DB / IA gateway » (~4 min)
Ouvrir `docs/V1_HDS_ARCHITECTURE_BRIEF.md` §2 (schéma) puis §3-9 :

- **Backend** : NestJS recommandé (rigueur DI, modules métier, décorateurs autorisation /
  audit / validation) ou alternative Hono / Fastify + Prisma.
- **Auth** : Clerk (SOC2, MFA, magic link) ou Auth.js. MFA obligatoire Admin / HoC /
  Superviseur.
- **RBAC** : matrice 12 permissions × 7 rôles dans §5. Cloisonnement par tenant (cabinet)
  + RLS PostgreSQL ou filtrage applicatif systématique.
- **DB** : PostgreSQL HDS-certifié, Prisma ou Drizzle. **Schéma cible** : 23 entités
  documentées §20 (User, Role, Cabinet, Surgeon, Patient, Intervention, FollowUp, Message,
  Attachment, Report, Escalation, Supervisor, QualityReview, TrainingProgress,
  ProductSuggestion, Prospect, SalesOwner, PaymentMandate, InvoiceLine, Notification,
  AuditLog, AiLog).
- **Stockage fichiers** : Scaleway Object Storage HDS, SSE-KMS, URLs présignées,
  antivirus à l'upload.
- **Audit trail** : table dédiée, append-only, **hash chaining** pour intégrité.
- **IA Gateway** : cf. `AI_REQUIREMENTS.md` §5. Aucun appel direct client → LLM. Toutes
  les requêtes passent par le proxy interne (redaction PII, prompt versioning,
  kill-switch, logging immuable).

### Closing (~30 s)
*« Tu as 6 documents dans `/docs`. Lis dans l'ordre : README_DEMO → PRODUCT_SCOPE →
TECHNICAL_NOTES → V1_HDS_ARCHITECTURE_BRIEF → AI_REQUIREMENTS. Garde REGULATORY_REVIEW_NOTES
pour le RDV Aumans. Tes prochaines décisions : les 16 questions techniques §12 et les 8
décisions ouvertes §18 du brief HDS. »*

---

# 2. Démo chirurgien (futur client)

**Audience** : chirurgien libéral premium (esthétique / plastique ou autre verticale).
**Tonalité** : rassurante, métier, sobre.
**Objectif** : qu'il pense *« ça soulage mon cabinet et je garde la main »*.
**Durée** : 6 min.

### Préparation
- Basculer en rôle **Chirurgien** (pill en haut ou `/login` → Chirurgien).
- Vérifier que le rôle affiché en sidebar est *« Dr. Camille Aragon »* (pas *Admin*).

### Parcours (4 routes)
1. **`/`** *(45 s)* — *« KOVELA est un service opéré, pas un logiciel de plus. Une équipe
   humaine spécialisée organise le suivi post-opératoire de vos patients pour que votre
   cabinet respire. »* Pointer la bande sous le hero. Scroller jusqu'à la section *Pour le
   chirurgien*.
2. **`/chirurgien`** *(2 min)* — *« Voici ce que vous voyez tous les jours. Vos
   interventions à venir, vos patients en suivi actif, et surtout — vos CR factuels
   disponibles et vos escalades transmises avec contexte. Vous gardez la main, KOVELA
   structure et trace. »* Montrer les 5 StatCards, la mention *« Vous ne recevez pas du
   bruit »*, le bloc **Service cabinet** (statut activé, documents validés, mandat actif)
   et le bandeau **Référentiel de suivi à compléter** (post-activation). Montrer le Cadre
   cible (HDS / RGPD / CNIL).
3. **`/chirurgien/planning`** *(1,5 min)* — *« Votre planning opératoire. Votre assistante
   peut le transmettre à KOVELA, en saisie manuelle ou en import. La durée de suivi est
   pré-remplie selon le type d'intervention indiqué dans le référentiel cabinet. C'est
   ajustable patient par patient. »* Cliquer **Ajouter un patient** → changer le type d'intervention
   → montrer la durée qui change. Fermer.
4. **`/chirurgien/patient/p18`** *(1,5 min)* — *« Voici un CR rendu disponible par l'équipe
   KOVELA. Il est factuel, lisible, exploitable. Vous le recevez quand l'équipe a vérifié
   et publié — jamais avant. »* Lire les 2-3 premières lignes du CR.

### Messages clés à dire
- *« Le post-opératoire est souvent le moment qui marque le plus l'expérience patient. Une
  organisation plus claire peut contribuer à une meilleure perception. »* (jamais
  *« garantir »*)
- *« Vous gardez la main médicale. KOVELA prépare, vous décidez. »*
- *« Votre cabinet ne reçoit plus 30 messages dispersés sur 5 canaux. L'équipe centralise,
  classe, relance, documente. »*
- *« Les durées de suivi par type d'intervention restent vos préférences — KOVELA ne vous
  impose rien. »*

### Pièges à éviter
- ❌ **Jamais promettre** : réduction des complications, meilleurs avis Google,
  satisfaction garantie, réputation garantie.
- ❌ Ne pas dire *« certifié HDS »* — dire *« architecture cible pensée pour HDS, à valider »*.
- ❌ Ne pas montrer la mécanique IA (gating, etc.) à un chirurgien qui n'a pas demandé —
  ça crée des questions qui n'ont pas lieu d'être.
- ❌ Ne pas dire *« vous configurez le logiciel »* — dire *« l'équipe KOVELA met en place
  le service avec votre cabinet »*.

### Closing
*« Concrètement : votre assistante transmet votre planning, KOVELA prépare l'onboarding
patient, l'équipe assure le suivi, et vous recevez un compte-rendu factuel à la fin. Si
une situation mérite votre attention, l'équipe vous transmet une compilation
contextualisée — c'est vous qui décidez médicalement. »*

---

# 3. Démo investisseur

**Audience** : investisseur healthtech (Seed à Série A).
**Tonalité** : ambition + différenciation + scale.
**Objectif** : qu'il voie un service opéré scalable avec IA encadrée et un modèle
économique clair.
**Durée** : 9 min.

### Préparation
- Démarrer landing en plein écran. Préparer mentalement le funnel commercial.

### Parcours (6 routes)
1. **`/`** *(1,5 min)* — *« KOVELA est un service opéré de coordination post-opératoire —
   pas un logiciel de plus. La plateforme métier soutient une équipe humaine spécialisée,
   augmentée par une IA assistive interne. »* Insister sur le bandeau *« service opéré,
   pas logiciel »*. Scroller jusqu'à la section *Expérience patient & réputation cabinet*.
2. **`/admin/crm`** *(1,5 min)* — *« L'acquisition cabinet est intégrée : 9 stages de
   pipeline, 14 prospects fictifs assignés à 4 sales, performance par sales, taux
   démo → onboarding. Aucune donnée patient ici — séparation stricte commerciale /
   opérationnelle. »* Montrer la table *Performance par sales*.
3. **`/admin`** *(1,5 min)* — *« Côté opérationnel, le Head of Care pilote la charge en 30
   secondes : Actions prioritaires, Qualité & délais, charge par superviseur avec
   saturation, verticales servies. »* Montrer le mini-bloc Qualité & délais + la carte
   verticales.
4. **`/admin/supervision`** *(2 min)* — *« Voilà la promesse de scalabilité humaine + IA :
   ~2 h 40 estimées gagnées par mois par l'IA assistive, sur 18 acceptations / 6
   modifications / 2 refus. Chaque action IA est human-in-the-loop, loggée, jamais
   autonome. Conversations à relire, CR à contrôler, retours terrain superviseurs — la
   qualité se pilote. »*
5. **`/superviseur/patient/p11`** *(1,5 min)* — *« Le cœur opérationnel. L'IA prépare,
   l'humain valide, le chirurgien décide. Trois niveaux de responsabilité, traçabilité
   complète. Le CR est gating 3 états — c'est ce qui sécurise juridiquement le service. »*
6. **`/chirurgien`** *(1 min)* — *« Le chirurgien — notre client payant — voit un
   dashboard ultra-simple. Modèle économique : abonnement mensuel par chirurgien +
   variable par patient activé. Prélèvement GoCardless automatisé. »* Pointer le bloc
   *Abonnement*.

### Messages clés à dire
- *« Le post-op est un angle mort de l'expérience cabinet aujourd'hui. KOVELA est le
  premier service opéré sur ce moment-clé. »*
- *« Différenciation : service opéré (pas SaaS), supervision humaine spécialisée (pas IA
  autonome), traçabilité complète (pas boîte noire). »*
- *« On démarre par la verticale esthétique / plastique, mais la plateforme est
  multi-verticales : ORL / maxillo, ortho ambulatoire, ophtalmologie, urologie,
  gynécologie. »*
- *« Le scale qualitatif est explicitement pensé : formation superviseur, indicateurs
  opérationnels (non punitifs), revue qualité, retours terrain. »*

### Pièges à éviter
- ❌ **Jamais dire** *« on est certifié HDS »* — *« architecture cible »*.
- ❌ Ne pas chiffrer le TAM ou le pricing à la volée — référer aux documents commerciaux
  non techniques (hors `/docs`).
- ❌ Ne pas vendre l'IA comme un produit en soi — c'est un **outil interne** de l'équipe.
- ❌ Ne pas comparer à un *« Doctolib pour le post-op »* (raccourci dangereux : Doctolib
  gère du dossier médical, KOVELA non).
- ❌ Ne pas montrer `/sales` si l'investisseur s'y connaît en CRM — il aura envie de
  discuter Salesforce vs HubSpot et tu perds 5 min.

### Closing
*« Le prototype démontre les flux. La V1 HDS est documentée en 8 lots techniques. Le cadre
juridique est cadré par notre avocat e-santé. Le service opéré humain + IA encadré, c'est
ce qui rend KOVELA unique. »*

---

# 4. Démo Aumans (avocat e-santé)

**Audience** : avocat spécialisé e-santé.
**Tonalité** : rigoureuse, factuelle, transparente sur les zones grises.
**Objectif** : qu'il valide la doctrine ET identifie les points à clarifier juridiquement.
**Objectif secondaire** : récupérer un retour structuré sur 6 thèmes.

## 4.A — Version courte (7 min)

### Préparation
- Avoir `docs/REGULATORY_REVIEW_NOTES.md` ouvert dans un second onglet (notamment §11
  questions et §13 checklist).

### Parcours (5 routes)
1. **`/`** *(1 min)* — *« Site public, hors HDS, aucune donnée patient. CTA en mailto, pas
   de formulaire. Doctrine affichée. »* Scroller jusqu'à la section *Sécurité, données &
   cadre* — pointer le double bloc Site public hors HDS / Application métier cible et la
   mention *« Architecture cible — éléments à valider juridiquement. Aucune certification
   revendiquée à ce stade. »*
2. **`/patient/onboarding`** *(1,5 min, en vue mobile)* — *« Onboarding patient
   mobile-first, 5 étapes, consentement fictif horodaté, préférences explicites, écran
   final 'Mon suivi en bref'. »* Insister sur la bannière 15 / 112 permanente et la mention
   *« Vos messages sont traités par une équipe humaine. Aucune réponse automatique par
   IA. »*
3. **`/superviseur/patient/p11`** *(2 min)* — *« Voici comment l'IA est encadrée. Chaque
   sortie passe par Accepter / Modifier / Refuser. Disclaimer obligatoire 'Suggestion IA —
   à valider par un humain'. Logs doubles. »* Cliquer **Résumer** → montrer le panneau IA.
   Fermer pour montrer **Refuser** fonctionne. Puis montrer la carte *Compilation factuelle
   d'escalade* : *« Préparer ne déclenche pas la transmission. La transmission au
   chirurgien est une action humaine explicite. C'est le point critique de
   non-substitution. »*
4. **`/chirurgien/patient/p11`** *(1 min)* — *« Côté chirurgien, on ne voit que le CR
   explicitement 'disponible' et l'escalade 'transmise'. Le contenu est normalisé à la
   publication. »* Montrer le wording final : *« Compte-rendu factuel préparé et rendu
   disponible par l'équipe KOVELA. »*
5. **`/logs`** *(1,5 min)* — *« Traçabilité complète. 30+ types de logs typés, dont logs
   IA dédiés avec décision humaine et version de prompt. En V1, audit trail append-only
   avec hash chaining. »* Filtrer sur **IA** puis sur **Qualité**.

### Messages clés à dire
- *« KOVELA ne décide pas médicalement. Doctrine tenue partout dans l'interface. »*
- *« L'IA est assistive, interne, loggée, désactivable, human-in-the-loop. Jamais autonome
  côté patient. »*
- *« Service opéré — c'est notre clé de qualification juridique. L'équipe humaine porte la
  responsabilité opérationnelle, le chirurgien garde la responsabilité médicale. »*
- *« Wording prudent partout : 'architecture cible', 'pensé pour', 'principes CNIL'. Aucune
  certification revendiquée. »*
- *« 0 mot interdit dans toute l'interface — scan automatisable par grep, listé dans
  `REGULATORY_REVIEW_NOTES.md`. »*

### Pièges à éviter (commun aux deux versions)
- ❌ **Ne jamais dire** *« certifié HDS / CNIL / ISO »*, même verbalement.
- ❌ Ne pas affirmer que tout est résolu juridiquement — au contraire, **dire qu'il y a
  des questions ouvertes** (statut RGPD, AIPD, AI Act, transferts hors UE…).
- ❌ Ne pas montrer le CRM Sales en premier — risque de faire croire qu'on traite des
  données patient en commercial. Si nécessaire, montrer la mention *« Aucune donnée patient
  n'est collectée ici »*.
- ❌ Ne pas dire que l'IA *« peut détecter »* / *« analyse »* / *« qualifie »* — formuler
  systématiquement *« aide à structurer, à documenter, à compiler »*.
- ❌ Ne pas afficher *« diagnostic »* / *« tri médical »* même en négation orale —
  préférer *« non-substitution médicale »*.

## 4.B — Version complète recommandée (15 min)

> Reprend le parcours court (~7 min) **et y ajoute ~8 min de discussion structurée**
> autour de 6 thèmes. Objectif : que la démo ne soit pas seulement une présentation mais
> qu'elle **génère un retour juridique exploitable** sur chacun des 6 axes.

### Étape 1 : Parcours produit (~7 min, identique à 4.A)
Dérouler la version courte ci-dessus, puis **annoncer explicitement** : *« Je voudrais
maintenant ton retour sur 6 thèmes — ça nous permettra de structurer le travail à venir. »*

### Étape 2 : Discussion structurée autour de 6 thèmes (~8 min)

> Pour chaque thème : poser la question, écouter, noter. **Pas de débat, pas de défense.**
> L'objectif est de récupérer la position d'Aumans, pas de la convaincre.

#### Thème 1 — Qualification du service (~1 min 30)
- *« Est-ce que la qualification 'service opéré de coordination post-opératoire' est
  suffisante pour clarifier notre périmètre vis-à-vis du Code de la santé publique ? »*
- *« Confirmes-tu que KOVELA n'est pas un dispositif médical au sens de la réglementation
  européenne ? Comment le formaliser dans les CGV ? »*
- *« Quel statut RGPD : sous-traitant du chirurgien, responsable conjoint, ou autre ? »*

#### Thème 2 — IA assistive (~1 min 30)
- *« Le périmètre IA (résumer / préparer CR / reformuler / compiler) est-il acceptable
  comme 'IA assistive non décisionnelle' ? »*
- *« Une AIPD est-elle obligatoire vu le caractère santé + IA ? Faut-il la transmettre à
  la CNIL ? »*
- *« Faut-il informer explicitement le patient de l'usage d'une IA en interne (art. 13/14
  RGPD + AI Act) ? Sous quelle forme ? »*
- *« Catégorisation AI Act : risque limité ou autre ? »*

#### Thème 3 — HDS / RGPD / CNIL (~1 min 30)
- *« Le wording actuel ('architecture cible pensée pour HDS', 'principes CNIL', 'aucune
  certification revendiquée à ce stade') est-il suffisant pour ne pas constituer une
  revendication trompeuse ? »*
- *« Quand pourrons-nous basculer du wording 'pensé pour HDS' vers 'hébergé HDS'
  (certification fournisseur acquise vs certification propre) ? »*
- *« Faut-il consulter la CNIL avant la mise en production ? Déclaration, consultation
  préalable, AIPD à transmettre ? »*

#### Thème 4 — Consentement / information patient (~1 min)
- *« Forme suffisante du consentement : case à cocher + horodatage + log, ou faut-il un
  PDF téléchargeable / signature électronique ? »*
- *« L'information préalable (qui voit quoi, durée de conservation, droits) est-elle
  complète ? Modèle à fournir ? »*
- *« Cas particuliers : mineurs, majeurs protégés — à cadrer en V1 ? »*

#### Thème 5 — Responsabilité KOVELA / chirurgien (~1 min 30)
- *« Le wording de transmission (CR 'disponible', compilation 'transmise' par action
  humaine explicite) suffit-il à clarifier la non-substitution au chirurgien ? »*
- *« Faut-il un avertissement permanent au chirurgien rappelant sa responsabilité médicale
  exclusive ? »*
- *« Modèle de contrat type avec les cabinets : clauses sous-traitance, responsabilités,
  SLA — quelle structure recommandes-tu ? »*
- *« Articulation avec l'assurance RC du chirurgien (qui couvre quoi en cas d'incident
  opérationnel KOVELA) ? »*

#### Thème 6 — Wording commercial (~1 min)
- *« La section 'Expérience patient & réputation cabinet' avec le wording 'peut contribuer
  à' + disclaimer 'KOVELA ne garantit pas la satisfaction patient ni la réputation' — est
  cela suffisant pour ne pas tomber dans la publicité trompeuse ? »*
- *« Y a-t-il des termes du lexique autorisé que tu recommandes de retirer ? Inversement,
  des termes bannis que nous pourrions utiliser sans risque ? »*
- *« Notification d'incident de sécurité : procédure CNIL, délais, communication patient
  recommandée ? »*

### Closing (~30 s)
*« On a préparé une checklist de 14 thèmes et 23 questions ouvertes dans
`REGULATORY_REVIEW_NOTES.md` §13. C'est notre support de travail. Je te transmets ce
document après la démo avec les captures d'écran clés et les fichiers annexes
(`AI_REQUIREMENTS.md`, `V1_HDS_ARCHITECTURE_BRIEF.md`, `lib/types.ts`). Tes prochains
livrables idéaux : une note écrite organisée par les 6 thèmes que nous venons de
parcourir. »*

---

## Récap des 4 scripts

| Audience | Versions | Routes clés | Objectif |
|---|---|---|---|
| **Émilien (dev)** | Courte 8 min · **Complète 15-20 min** | `/admin` · `/superviseur/patient/p11` · `/chirurgien/patient/p11` · `/logs` (+ deep-dive lots V1 + décisions techniques + HDS/RBAC/DB/IA) | Comprendre jetable vs réutilisable, les 8 lots V1, les 16 décisions à trancher, l'archi HDS / RBAC / DB / IA gateway |
| **Chirurgien** | 6 min | `/` · `/chirurgien` · `/chirurgien/planning` · `/chirurgien/patient/p18` | *« Mon cabinet respire, je garde la main »* |
| **Investisseur** | 9 min | `/` · `/admin/crm` · `/admin` · `/admin/supervision` · `/superviseur/patient/p11` · `/chirurgien` | Différenciation service opéré, scale qualitatif, modèle économique |
| **Aumans** | Courte 7 min · **Complète 15 min** | `/` · `/patient/onboarding` · `/superviseur/patient/p11` · `/chirurgien/patient/p11` · `/logs` (+ discussion 6 thèmes) | Doctrine respectée, IA encadrée, **retour juridique structuré sur 6 thèmes** |

---

## Après chaque démo

> À remplir **immédiatement** après la fin de la démo, tant que tout est frais. Reporter
> ensuite dans le bon canal (Notion / Slack / CRM / suivi produit).

### Questions reçues
- Lister chaque question posée par l'interlocuteur, avec si possible : moment de la démo
  (route concernée), question textuelle, réponse donnée, points laissés en suspens.

### Objections
- Lister chaque objection ou réticence exprimée, même implicite (silence, hésitation,
  changement de sujet). Mentionner : nature de l'objection, niveau de gravité (mineure /
  importante / bloquante), réponse apportée.

### Fonctionnalités demandées
- Lister chaque fonctionnalité demandée ou suggérée par l'interlocuteur. Préciser :
  périmètre, niveau de priorité ressenti, statut (déjà couvert / partiellement couvert /
  non couvert / hors scope).

### Risques remontés
- Lister chaque risque identifié par l'interlocuteur (juridique, technique, commercial,
  opérationnel). Préciser : nature du risque, sévérité, action recommandée pour le mitiger.

### Prochaines actions
- Lister les actions concrètes à mener suite à la démo, avec un responsable et un délai.
- Exemples : *« envoyer la note réglementaire à Aumans avant vendredi »*, *« relancer pour
  un second RDV »*, *« partager le brief HDS au lead dev candidat »*, *« ajouter une
  capture d'écran demandée à la note Aumans »*.

### Décision
Cocher la décision prise à l'issue de la démo :
- [ ] **Continuer** — la démo a tenu, on enchaîne sur la prochaine étape sans
      modification.
- [ ] **Retravailler le prototype** — des ajustements produit sont nécessaires (lister
      lesquels et pourquoi).
- [ ] **Valider** — l'interlocuteur a confirmé / signé / engagé (préciser sur quoi
      exactement).
- [ ] **Revoir juridiquement** — un blocage juridique nécessite une revue Aumans avant de
      continuer (préciser sur quel point).
- [ ] **Autre** — préciser librement.

### Cross-référence pour reporting
- Si retours produit : reporter dans le suivi backlog (et éventuellement dans
  `/superviseur` → bloc *Améliorations terrain* pour les retours superviseur).
- Si retours juridiques : reporter dans `docs/REGULATORY_REVIEW_NOTES.md` §11 (questions
  Aumans) ou §13 (checklist).
- Si retours techniques : reporter dans `docs/TECHNICAL_NOTES.md` §12 (questions
  Émilien).
- Si retours commerciaux : reporter dans le CRM (`/admin/crm` côté admin, `/sales` côté
  sales).
