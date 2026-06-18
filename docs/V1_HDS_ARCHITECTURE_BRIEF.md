# KOVELA V1 — Brief architecture cible HDS

> **Dernière mise à jour** : 2026-06-01 · **Référence décisions** : [`DECISIONS_LOG.md`](./DECISIONS_LOG.md).
>
> **Audience** : Émilien (lead dev V1), DPO, avocat e-santé (Aumans).
> **Statut** : architecture **cible**, à valider juridiquement et techniquement avant build.
> **Pas une promesse, pas un engagement réglementaire — un plan de travail.**

---

## 1. Principe directeur

KOVELA V1 = **service opéré** hébergé en **France**, conforme **HDS**, respectant le **RGPD**
et les **principes CNIL**. Le patient n'interagit jamais directement avec une IA. La supervision
humaine est la couche de responsabilité ; l'IA assistive est un outil interne.

### Périmètre des données sensibles
- Données patient : identité, contact, intervention déclarée, messages, photos, audios, CR,
  consentements, historique.
- Données chirurgien : identité, cabinet, préférences de fonctionnement, mandat de prélèvement,
  CR transmis.
- **Aucune donnée patient sur le site public**.
- **Aucune donnée patient dans le CRM** (qui ne traite que la prospection commerciale cabinet).

---

## 2. Schéma d'architecture cible

```
┌─────────────────────────────────────────────────────────────────┐
│ INTERNET                                                        │
└────────────┬───────────────────────────────────────┬───────────┘
             │                                       │
       ┌─────▼─────┐                          ┌──────▼──────┐
       │ Site      │                          │ App métier  │
       │ public    │                          │ (HDS)       │
       │ (hors HDS)│                          │             │
       │ Vercel /  │                          │ Vercel pro  │
       │ Netlify   │                          │ proxy → API │
       │           │                          │ ou Cloud HDS│
       └───────────┘                          └──────┬──────┘
       Aucune donnée patient                         │
                                                     │ HTTPS / mTLS
                                              ┌──────▼──────────┐
                                              │  API Gateway    │
                                              │  (Caddy / NGINX │
                                              │   + WAF)        │
                                              └──────┬──────────┘
                                                     │
                                ┌────────────────────┼────────────────────┐
                                │                    │                    │
                          ┌─────▼─────┐       ┌──────▼──────┐      ┌──────▼──────┐
                          │ Backend   │       │ IA Gateway  │      │ Auth Service│
                          │ NestJS /  │       │ Server-side │      │ Clerk /     │
                          │ Hono      │       │ proxy + log │      │ Auth.js     │
                          └─────┬─────┘       └──────┬──────┘      └─────────────┘
                                │                    │
                  ┌─────────────┼─────────────┐      │
                  │             │             │      │
            ┌─────▼────┐ ┌──────▼─────┐ ┌────▼─────┐│
            │PostgreSQL│ │ Object     │ │ Audit log││
            │ HDS-cert │ │ storage    │ │ append-  ││
            │ Multi-AZ │ │ HDS-cert   │ │ only WORM││
            │ Backup   │ │ SSE-KMS    │ │          ││
            └──────────┘ └────────────┘ └──────────┘│
                                                    │
                                            ┌───────▼─────────┐
                                            │ LLM provider    │
                                            │ (Anthropic UE / │
                                            │  Mistral / etc.)│
                                            │ contrat HDS     │
                                            │ ou cloisonnement│
                                            └─────────────────┘
```

---

## 3. Backend

### Choix recommandé
- **NestJS + TypeScript** : rigueur DI, modules métier alignés sur les zones produit, support
  natif des décorateurs (autorisation, audit log, validation).
- **Alternative** : Hono / Fastify + Prisma pour un démarrage plus léger, à condition de
  poser une discipline d'autorisation et d'audit dès le départ.

### Modules métier (proposition)
- `auth` — authentification, MFA, sessions.
- `users` — admin, head of care, sales, superviseur, chirurgien, assistante, patient.
- `crm` — prospects, sales owners, pipeline, performance.
- `cabinet` — chirurgien, configuration cabinet (CabinetConfig), assistantes, mandats.
- `planning` — entrées planning, import, modifications.
- `patient` — patients, onboarding, consentements, préférences.
- `messaging` — messages, pièces jointes (photos / audios).
- `supervision` — inbox superviseur, attribution, charge, qualité.
- `quality` — revue qualité (conversations à relire, CR à contrôler), suggestions terrain.
- `formation` — modules de formation superviseur, quiz, badges.
- `ia` — appel IA gateway, journalisation décisions, kill-switch par fonction.
- `reports` — CR (gating brouillon / validé interne / disponible chirurgien).
- `escalation` — compilations factuelles, transmissions au chirurgien.
- `billing` — abonnement, GoCardless, facturation.
- `audit` — logs immuables, accès aux logs (admin Head of Care uniquement).
- `notifications` — email transactionnel, SMS (signature, urgence, lien onboarding).

### Sécurité applicative
- **Validation** des inputs via Zod / class-validator sur chaque endpoint.
- **Autorisation déclarative** : chaque endpoint déclare la permission requise.
- **Rate limiting** différencié par rôle.
- **CSRF protection** sur les actions sensibles.
- **CORS** restreint aux domaines KOVELA.

---

## 4. Authentification

### Options recommandées
- **Clerk** (recommandé) : SOC2 Type II, MFA out-of-the-box, magic link patient,
  intégration Next.js native.
- **Auth.js / NextAuth** : open-source, plus de travail mais 100 % sous contrôle.

### Patterns par rôle
| Rôle | Méthode |
|---|---|
| Admin / Head of Care / Sales | Email + mot de passe + **MFA obligatoire** |
| Superviseur | Email + mot de passe + **MFA obligatoire** |
| Chirurgien | Email + mot de passe + **MFA fortement recommandée**, alternative passkey |
| Assistante | Email + mot de passe + MFA |
| Patient | **Lien magique** (magic link) ou OTP par SMS / email, **pas de mot de passe** |

### Sessions
- JWT signés courte durée (15 min) + refresh token rotatif.
- Stockage : `httpOnly`, `Secure`, `SameSite=Strict`.
- Logout instantané sur déconnexion ; révocation des refresh tokens en base.

---

## 5. Rôles / RBAC

### Permissions clés (extrait)
| Permission | Admin | HoC | Superviseur | Chirurgien | Assistante | Patient | Sales |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `cabinet:configure` | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| `planning:add` | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| `inbox:read` | ✅ | ✅ | ✅ assigné | ❌ | ❌ | ❌ | ❌ |
| `cr:prepare` | ❌ | ❌ | ✅ assigné | ❌ | ❌ | ❌ | ❌ |
| `cr:validate` | ❌ | ❌ | ✅ assigné | ❌ | ❌ | ❌ | ❌ |
| `cr:publish` | ❌ | ✅ | ✅ assigné | ❌ | ❌ | ❌ | ❌ |
| `escalation:transmit` | ❌ | ✅ | ✅ assigné | ❌ | ❌ | ❌ | ❌ |
| `quality:review` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `crm:read` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ propres |
| `crm:assign` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `message:send` | ❌ | ❌ | ✅ assigné | ❌ | ❌ | ✅ propre | ❌ |
| `audit:read` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Cloisonnement
- **Tenant principal = chirurgien (ou cabinet)**. Un patient appartient à un cabinet, un
  superviseur peut être multi-cabinet.
- **Row-level security** PostgreSQL ou filtrage applicatif systématique sur `cabinetId` /
  `surgeonId` / `patientId`.

---

## 6. Base de données

### PostgreSQL HDS
- Schéma : Prisma ou Drizzle (TypeScript first).
- Migrations versionnées, **review obligatoire** sur PR.
- Indexes prioritaires : `patient.surgeonId`, `patient.supervisorId`, `message.patientId`,
  `aiLog.patientId`, `report.patientId`, `prospect.salesOwnerId`.
- Soft-delete par défaut (champ `deletedAt`), pour conformité droit à l'effacement.
- **Encryption at rest** : assurée par l'hébergeur HDS.

### Sauvegardes
- **Snapshots quotidiens** + WAL streaming pour PITR.
- **Rétention** : 30 jours minimum (à valider DPO).
- **Tests de restauration** trimestriels.
- Sauvegardes **chiffrées** + stockées dans une seconde zone HDS.

---

## 7. Stockage fichiers (photos / audios patient)

### Object storage HDS-compatible
- **Scaleway Object Storage** (zone FR, HDS-certifié) ou équivalent.
- **Bucket par tenant** (un bucket par cabinet, ou prefix par cabinet).
- **SSE-KMS** (chiffrement géré par hébergeur HDS) ou client-side encryption si exigence
  juridique le justifie.
- **Antivirus à l'upload** (ClamAV ou service tiers).
- **URLs présignées** courtes (TTL 5-15 min).
- **Pas d'accès public**, jamais.

### Métadonnées
- `kind` (photo / audio), `patientId`, `messageId`, `uploadedAt`, `uploadedBy`, `mimeType`,
  `sizeBytes`, `clamavScannedAt`, `clamavStatus`.

### Rétention
- **À arbitrer avec DPO / avocat santé avant V1 production.** Aucune durée définitive
  n'est fixée dans cette documentation. Si un exemple de travail (par ex. durée du suivi
  + N années) est utilisé en interne, le marquer explicitement comme **exemple non
  validé**, pas comme politique active.

---

## 8. Logs d'accès / audit trail

### Logs d'accès applicatifs
- Tout endpoint authentifié log : `userId`, `role`, `route`, `method`, `statusCode`, `at`,
  `ipMasked` (anonymisation partielle après N jours).
- Stockage : table `access_log` Postgres (rotation périodique) ou collecteur ELK / Loki.

### Audit trail métier
- **Immuable** (append-only) : table dédiée `audit_event` avec hash chaining (chaque event
  contient le hash de l'event précédent).
- Événements à tracer (a minima) : tous les `LogKind` du prototype + accès aux données
  patient sensibles, modification de CR, transmission d'escalade, changement de rôle.
- **Export auditable** pour DPO / autorités compétentes.

---

## 9. IA Gateway (priorité critique)

### Pourquoi un gateway
- Empêcher l'envoi direct de données patient à un fournisseur LLM hors HDS / hors UE.
- Permettre **redaction PII** automatique sur les entrées.
- Permettre **journalisation immuable** des requêtes / réponses.
- Permettre **kill-switch** par fonction (Résumé, CR, Reformulation, Compilation).
- Permettre **évaluation** continue (qualité, conformité wording).

### Architecture du gateway
```
Backend → IA Gateway → LLM provider (Anthropic / Mistral / etc.)
              │
              ├ minimisation / redaction PII en entrée (mécanisme à spécifier V1)
              ├ injection des templates / prompts versionnés
              ├ rate limiting global + par superviseur
              ├ logging immuable (requête, réponse, latence, usage)
              ├ minimisation / redaction PII en sortie (mécanisme à spécifier V1)
              ├ filtrage wording interdit (linter automatique)
              └ kill-switch on/off par fonction et par tenant
```

> **Exigence V1 à spécifier avec CTO / DPO** : mécanisme de minimisation / redaction PII
> avant usage IA (regex, ML, hybride — non figé à ce stade), **fallback si redaction
> insuffisante** (par exemple bloquer la requête LLM), **métriques de couverture à définir**
> (par ex. taux de PII détecté, taux de faux négatifs). Aucune solution n'est arrêtée dans
> cette documentation.

### Choix de fournisseur LLM
- **Anthropic Claude** via offre Bedrock (zone UE) ou directement Anthropic avec DPA RGPD.
- **Mistral** (hébergé en France, alignement souverain).
- **OpenAI** via Azure (région UE) **sous réserve d'accord juridique**.
- **Privilégier un fournisseur UE** pour limiter les risques de transfert hors UE.

### Versionnage
- Prompt versions stockées en base (`prompt_version` sur chaque log IA).
- A/B testing possible (deux versions de prompt actives en parallèle).

---

## 10. Notifications

### Canaux
- **Email transactionnel** : Postmark / Sendinblue / Mailjet (zone UE).
- **SMS** : OVH SMS / Twilio (avec DPA UE) — uniquement pour onboarding patient et urgence.
- Pas de WhatsApp (questions de conformité business + RGPD plus complexes).

### Types de notifications V1
- Lien magique de connexion patient.
- Lien onboarding patient (envoyé par le superviseur).
- Confirmation d'inscription cabinet.
- Mandat GoCardless envoyé.
- Alerte interne : CR à contrôler depuis > N heures (pour Head of Care).
- **Pas de notification IA-générée** vers le patient.

---

## 11. GoCardless

### Intégration V1
- Création de mandat SEPA via lien envoyé au chirurgien.
- Webhook GoCardless reçu côté backend → mise à jour du statut.
- Prélèvement automatique : **abonnement mensuel** le 1er du mois, **variable** indexée sur
  les patients activés le dernier jour du mois. Les montants sont portés par le code
  (`lib/mock-data.ts`, constante `PRICING`) et par les CGV cabinet — hors documentation
  technique.
- Gestion des échecs : relance, suspension du service après N tentatives.

### Logs financiers
- Table dédiée `billing_event` (création mandat, prélèvement réussi, échec, suspension).
- Conservation : 10 ans (obligation comptable légale française).

---

## 12. Hébergement HDS

### Critères de sélection
1. **Certification HDS** valide et publique.
2. **Données en France** (ou UE), pas de transfert hors UE sans contrat adapté.
3. **Disponibilité** ≥ 99,9 %.
4. **PRA / PCA** documenté.
5. **Support 24/7** ou astreinte.

### Options
- **OVH HDS** (référence française).
- **Outscale HDS** (Dassault, souverain).
- **Scaleway HDS** (Iliad, souverain).
- **AWS Health (Europe)** ou **Azure Health Data Services** — à valider compatibilité HDS
  française.

### Modèle recommandé pour V1
- Frontend public : Vercel (hors HDS, aucune donnée patient).
- Application métier + backend + base de données + storage : OVH HDS ou Scaleway HDS.

---

## 13. Sauvegardes

- **Quotidiennes** automatisées de la base + storage.
- **Chiffrement** des sauvegardes (chiffrement séparé de la production).
- **Off-site** : seconde zone HDS.
- **Rétention** : à confirmer avec DPO (proposition : 30 jours snapshots + 1 an archives
  trimestrielles).
- **Tests de restauration** trimestriels documentés.

---

## 14. Monitoring

- **Sentry** : erreurs front + backend.
- **Datadog / Grafana / Logflare** : métriques infrastructure + logs structurés JSON.
- **Uptime monitoring** : Statuspage / Better Stack.
- **Alertes** : taux d'erreur, latence p95, taux d'acceptation IA inhabituel, espace disque,
  santé des sauvegardes.

---

## 15. Sécurité

### Couches
- **TLS 1.3** partout, HSTS, certificats Let's Encrypt + renouvellement auto.
- **CSP** strict (default-src 'self' + nonces).
- **Headers sécurité** : X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy
  strict-origin-when-cross-origin.
- **Secrets management** : Vault / 1Password Connect / AWS Secrets Manager.
- **CI / CD** : SAST (Snyk, GitHub Advanced Security), dépendances (Dependabot, npm audit
  bloquant), images Docker scannées.
- **Pen test** annuel par tiers indépendant.
- **Bug bounty** (optionnel V1, V2 sinon).

### Pratiques code
- PR review obligatoire à 2 yeux pour le backend, 1 pour le front.
- Squash & merge, pas de rebase sur main.
- Tests E2E Playwright bloquants en CI sur les parcours critiques.
- Pas de secrets en clair, pas même en `.env.example`.

---

## 16. Points à valider avec DPO / Aumans

### Cadre juridique
- Statut de KOVELA en tant que service opéré (sous-traitant RGPD du chirurgien ? responsable
  conjoint ? autre ?).
- Contrat type avec les cabinets (clauses sous-traitance, responsabilités, SLA).
- Mention sur la non-substitution au chirurgien dans toute la documentation.

### Données personnelles / santé
- Classification précise des données (santé / non-santé) et obligations associées.
- Durée de conservation des messages, photos, CR, logs.
- Modalités du **droit à l'effacement** (effacement vs anonymisation).
- Modalités du **droit à la portabilité**.
- Notification d'incident de sécurité (délais, formulaire CNIL).

### IA
- Encadrement de l'IA assistive : doctrine documentée (jamais autonome, jamais médicale).
- Information patient sur l'usage d'une IA en interne (transparency obligation).
- Évaluation d'impact (AIPD) — nécessaire si traitement à grande échelle de données de santé
  avec IA.
- Choix du LLM provider : DPA RGPD, transferts hors UE éventuels.

### Certifications
- Calendrier HDS (timing certification fournisseur, audit propre KOVELA si pertinent).
- ISO 27001 (souhaitable V2).
- Réflexion sur **dispositif médical** (a priori non, KOVELA = service de coordination
  organisationnelle, pas un DM) — **à confirmer formellement Aumans**.

### Patient
- Format et délais du consentement.
- Information préalable (qui voit quoi, durée, droits).
- Cas particulier des photos : périmètre exact autorisé, anonymisation des métadonnées EXIF.

---

## 17. Timeline indicative V1

| Mois | Jalons |
|---|---|
| **M0** | Cadrage juridique Aumans + DPO ; choix hébergeur HDS ; choix LLM provider ; sélection équipe (lead dev + dev senior + designer). |
| **M1** | Setup infra HDS + CI/CD ; auth + RBAC + schéma DB ; design system migré. |
| **M2** | Cabinet : onboarding + planning + chirurgien dashboard. |
| **M3** | Patient : onboarding + messagerie sécurisée + stockage chiffré. |
| **M4** | Superviseur : inbox + fiche + CR (gating). |
| **M5** | IA Gateway + 4 fonctions IA assistives ; logs audit. |
| **M6** | Supervision & qualité Head of Care + facturation GoCardless. |
| **M7** | CRM Chirurgiens + Sales. |
| **M8** | Pen test + audit conformité + tests E2E exhaustifs. |
| **M9** | Bêta privée avec 2-3 cabinets pilotes. |
| **M10** | Itération sur retours + production GA. |

> Timeline indicative ~ 10 mois pour une V1 robuste avec une équipe de 3-4 personnes.
> Compressible à 6-8 mois si l'équipe est plus large et le scope V1 est plus serré
> (ex. : remettre CRM/Sales en V1.5).

---

## 18. Décisions ouvertes à trancher

1. **Hébergeur HDS** définitif (OVH / Outscale / Scaleway / autre).
2. **LLM provider** définitif (Anthropic / Mistral / OpenAI Azure).
3. **Auth** : Clerk vs Auth.js (rapidité vs contrôle).
4. **Framework backend** : NestJS (rigueur) vs Hono/Fastify (légèreté).
5. **Statut RGPD** de KOVELA : sous-traitant ou responsable conjoint ?
6. **Stratégie i18n** : démarrer V1 100 % FR ou prévoir EN dès le départ.
7. **Mobile** : web responsive uniquement, PWA, ou app native ?
8. **CRM** : interne (réutiliser le prototype) ou intégration externe (HubSpot / Pipedrive) ?

---

## 19. Automatisations cible V1

> Le prototype simule visuellement ces automatisations. Aucune notification réelle n'est
> envoyée. La V1 doit implémenter les automatisations ci-dessous, en respectant les
> contraintes RGPD / HDS dès qu'il y a une donnée patient.

### 19.1 Onboarding patient
- **Génération d'un lien sécurisé** unique par patient (UUID + signature).
- **Expiration** du lien (proposition : 14 jours, configurable cabinet).
- **Envoi** via email + SMS (ou WhatsApp, si validé juridiquement Aumans) — **canal final
  à arbitrer**.
- **Relances** programmées (proposition : J-7, J-3, J-1 avant intervention, paramètres
  ajustables Head of Care).
- **Log** de chaque envoi (canal, destinataire, résultat).
- **Statuts patient** : `lien_envoyé` / `relance_programmée` / `onboarding_complété` /
  `erreur_envoi`.

### 19.2 Planning opératoire
- **Import CSV / Excel** : parser robuste avec validation par colonne attendue.
- **Détection de doublons** (même patient + même date d'intervention).
- **Détection de champs manquants** (téléphone, email, type d'intervention, date) avec
  signalement à l'assistante avant validation.
- **Liaison automatique** cabinet → chirurgien → type d'intervention → durée de suivi.
- **Pré-remplissage de la durée** depuis `CabinetConfig.interventionDurations`.
- **Activation patient** au moment de la complétion de l'onboarding patient (statut bascule
  → patient activé, déclenche la facturation variable).

### 19.3 Supervision
- **Attribution superviseur** automatique par règle (charge, disponibilité, verticale) +
  réattribution manuelle Head of Care.
- **Détection patient silencieux** (règle : pas de message patient depuis N jours
  configurables).
- **Détection message non traité** (message patient sans réponse superviseur dans X heures).
- **Détection CR en attente** (suivi clôturé sans CR finalisé après N jours).
- **Transmission ouverte** : la préparation d'une compilation factuelle n'ouvre pas
  l'escalade — l'humain transmet explicitement (cf. `PRODUCT_SCOPE.md` §11).
- **Clôture de suivi** automatique après N jours de silence post-protocole (configurable).
- **Relances internes** : signalement Head of Care si délai moyen superviseur dépasse seuil.

### 19.4 Notifications

| Destinataire | Événement | Canal recommandé | Contrainte |
|---|---|---|---|
| **Patient** | Lien onboarding | Email + SMS | RGPD : minimisation, opt-out possible |
| Patient | Relances onboarding (J-7, J-3, J-1) | Email | À valider Aumans |
| Patient | Confirmation envoi message | UI (déjà fait) | Pas de canal externe |
| **Superviseur** | Message patient non traité depuis X h | UI + email digest | Pas en push (anti-stress) |
| Superviseur | CR à faire (suivi clôturé sans CR) | UI + email digest | — |
| **Chirurgien** | CR rendu disponible | Email avec lien sécurisé app | URL à expiration courte |
| Chirurgien | Compilation factuelle transmise | Email avec lien sécurisé app | URL à expiration courte |
| **Admin / HoC** | Charge superviseur élevée | UI + email digest | Pas d'alerte temps réel V1 |
| Admin / HoC | Qualité « à revoir » signalée | UI + email digest | — |
| **Sales** | Relance CRM due | UI + email digest matinal | — |

**Choix prestataires** :
- Email transactionnel : **Postmark** (UE), **Sendinblue**, **Mailjet** — DPA RGPD signé.
- SMS : **OVHcloud SMS**, **Twilio** (zone UE, DPA RGPD).
- WhatsApp Business : **uniquement après validation Aumans** (conformité RGPD + business
  rules Meta).

**Précisions importantes** :
- **Aucune notification réelle dans le prototype** — tout est simulé en log.
- **À développer en V1** avec services compatibles RGPD / HDS dès qu'il y a une donnée
  patient dans le contenu de la notification.
- **Métadonnées patient** dans les notifications externes : minimiser (pas de contenu de
  message dans l'email ; un lien sécurisé vers l'app pour consulter).

---

## 20. Schéma de données cible — entités V1

> Les types métier du prototype (`lib/types.ts`) servent de base. La V1 doit poser un schéma
> Prisma (ou Drizzle) explicite avec relations, indexes et soft-delete.

### Entités principales

| Entité | Issu du prototype | Notes V1 |
|---|---|---|
| **User** | `Role` + utilisateur démo | Auth + MFA + audit `last_login`, `password_changed_at` |
| **Role** | enum `Role` | Table de référence avec permissions associées |
| **Cabinet** | inféré de `Surgeon` / `CabinetConfig` | Entité à part : un cabinet peut avoir plusieurs chirurgiens |
| **Surgeon** | `Surgeon` | Rattaché à un ou plusieurs cabinets |
| **Assistant** | `Assistant` | Rattaché à un cabinet, permissions limitées |
| **Patient** | `Patient` (à séparer) | Voir note ci-dessous sur la séparation |
| **Intervention** | `Patient.intervention*` | Entité à part : un patient peut avoir N interventions |
| **FollowUp** | `Patient.status` + suivi | Entité dédiée par intervention, contient le protocole et le statut opérationnel |
| **Message** | `Message` | Rattaché au FollowUp |
| **Attachment** | `Attachment` | Stocké en object storage HDS, URL signée |
| **Report** (CR) | `ClinicalReport` | Versioning (chaque édition crée une nouvelle version) |
| **Escalation** | `Escalation` | Statuts `ouverte` / `transmise` / `cloturee` |
| **Supervisor** | `Supervisor` | Étend User avec formationStatus, qualityStatus, charge cible |
| **QualityReview** | `seedConversationsToReview` + `seedCRsToControl` | Persister statuts + commentaires + historique |
| **TrainingProgress** | quiz formation | Une ligne par superviseur, statut + score quiz + horodatage |
| **ProductSuggestion** | `SupervisorSuggestion` | Persister + statut + commentaires Head of Care |
| **Prospect** | `Prospect` | CRM, **aucune donnée patient** |
| **SalesOwner** | `SalesOwner` | Étend User avec rôle sales |
| **PaymentMandate** | `Surgeon.config.mandateStatus` | Vraie intégration GoCardless |
| **InvoiceLine** | facturation variable | Une ligne par patient activé du mois |
| **Notification** | logs internes simulés | Table de queue de notifications, statut envoi |
| **AuditLog** | `LogEntry` | **Append-only avec hash chaining**, jamais modifié |
| **AiLog** | `AiLog` | Append-only, chaîné, conservation à confirmer DPO |

### Note importante : séparation `Patient`

Dans le prototype, `Patient` mélange :
- identité,
- planning opératoire,
- suivi opérationnel (statut, messages, notes),
- préférences / consentements,
- compilation factuelle de l'escalade en cours.

**En V1** : séparer en au moins 3 entités :
- `Patient` (identité, coordonnées, consentements).
- `Intervention` (un patient peut avoir plusieurs interventions dans le temps).
- `FollowUp` (un suivi par intervention, contient les messages, statut, CR, escalade).

Cela permet de modéliser proprement les patients récurrents (chirurgie en plusieurs temps,
re-intervention, etc.) sans rétro-compatibilité douloureuse.

---

## 21. Formation, qualité et amélioration continue — trajectoire V1 / V2

### Périmètre V1 (lean, déjà couvert produit prototype)
- **Formation superviseur** persistée par utilisateur (TrainingProgress).
- **Checklist de démarrage**, **règles KOVELA**, **lexique autorisé / à éviter**, **templates**,
  **cas pratiques non cliniques**, **quiz process** → contenu versionné en base, modifiable
  par le Head of Care.
- **Statut formation** : `a_former` / `en_cours` / `pret` (table `TrainingProgress`).
- **Indicateurs opérationnels** par superviseur (lecture seule, déjà couvert).
- **CR à contrôler** + **Conversations à relire** : persistance des statuts (`ok`,
  `a_revoir`) + **commentaires Head of Care éditables** (déjà couvert produit).
- **Retours terrain superviseurs** (`ProductSuggestion`) : modal de proposition + vue Head
  of Care (déjà couvert produit).
- **Amélioration continue** : boucle implicite via les retours terrain + audit log + revue
  qualité.
- **Socle qualité KOVELA inspiré ISO 9001 / ISO 27001** documenté côté UI (sans revendication
  de certification).

### Wording obligatoire (rappel)
Ne **jamais** présenter cela comme :
- formation médicale ;
- certification médicale ;
- score clinique ;
- classement punitif.

Présenter comme :
- *« indicateurs opérationnels »* ;
- *« complétude formation »* ;
- *« revue qualité »* ;
- *« amélioration continue »*.

### Périmètre V2
- **Workflow qualité avancé** : assignation de revues, historique d'évaluations, calibration
  inter-superviseurs.
- **Historique formation** versionné, recertification périodique automatique.
- **Calibration** : croisement des décisions IA acceptées / modifiées / refusées avec les
  retours qualité pour identifier les besoins de formation.
- **Documentation qualité** structurée : politiques, procédures, instructions, enregistrements
  (modèle inspiré ISO 9001).
- **Audit externe** : démarche ISO 9001 (organisation qualité) et / ou ISO 27001 (sécurité
  information) **à étudier formellement** avec une société de conseil qualité avant
  engagement financier.


---

## 22. Lots techniques cible V1

> Découpage du build V1 en **8 lots**. Pas de chiffrage financier dans cette documentation —
> chaque lot est qualifié par **complexité relative**, **dépendances**, **risques** et
> **hypothèses de scope**. La priorisation et la parallélisation sont à arbitrer en équipe.

### Lot 1 — Socle technique
**Périmètre** : repo + CI/CD + infrastructure de base + design system migré + linter wording
en CI + observabilité de départ.
- **Complexité relative** : moyenne.
- **Dépendances** : choix hébergeur HDS, choix framework backend (cf. `TECHNICAL_NOTES.md`
  §12 Q3-4).
- **Risques** : délai de mise en place du compte hébergeur HDS, négociation DPA.
- **Hypothèses de scope** : un seul environnement (dev) au démarrage, prod en lot ultérieur.

### Lot 2 — Auth / RBAC
**Périmètre** : intégration Clerk ou Auth.js, schéma utilisateurs / rôles, RBAC déclaratif
sur les endpoints, MFA Admin/HoC/Superviseur, magic link patient.
- **Complexité relative** : moyenne.
- **Dépendances** : Lot 1.
- **Risques** : matrice RBAC complète à valider (cf. brief §5), DPA fournisseur auth si
  retenu.
- **Hypothèses de scope** : 7 rôles, pas de SSO entreprise V1.

### Lot 3 — Patients / messages / fichiers
**Périmètre** : entités Patient / Intervention / FollowUp / Message / Attachment, stockage
HDS chiffré, URLs présignées, antivirus à l'upload, messagerie texte / photo / audio,
consentements patient.
- **Complexité relative** : **élevée** (séparation Patient/Intervention/FollowUp à modéliser
  proprement, stockage HDS, antivirus).
- **Dépendances** : Lots 1 et 2.
- **Risques** : forme du consentement (validation Aumans), durée de conservation (validation
  DPO), métadonnées EXIF photos.
- **Hypothèses de scope** : pas de notifications push V1, pas d'i18n.

### Lot 4 — Supervision / CR / logs
**Périmètre** : inbox superviseur, attribution, fiche patient, templates de réponse, gating
CR (brouillon → validé interne → disponible), compilation factuelle dissociée, transmission
explicite, audit trail immuable (hash chaining).
- **Complexité relative** : **élevée** (logique de gating, journalisation immuable).
- **Dépendances** : Lots 1, 2, 3.
- **Risques** : implémentation correcte du hash chaining, performance des requêtes inbox
  sur gros volumes.
- **Hypothèses de scope** : pas de temps réel WebSocket V1 (V2), inbox lisible avec rafraîchissement
  manuel.

### Lot 5 — IA assistive
**Périmètre** : IA Gateway server-side, redaction PII en entrée/sortie, prompt versioning,
kill-switch par fonction, logging immuable IA, 4 fonctions assistives (résumé, CR, reformulation,
compilation), human-in-the-loop systématique.
- **Complexité relative** : **élevée** (gateway, redaction, conformité wording, choix LLM
  provider).
- **Dépendances** : Lots 1, 2, 3, 4.
- **Risques** : qualité variable des sorties LLM, transferts hors UE, AIPD obligatoire
  (Aumans), conformité AI Act, consommation à monitorer en interne.
- **Hypothèses de scope** : 4 fonctions assistives V1 (cf. `AI_REQUIREMENTS.md`), pas de
  fine-tuning V1.

### Lot 6 — Automatisations
**Périmètre** : lien sécurisé onboarding patient + expiration, relances programmées,
détection patient silencieux / message non traité / CR en retard, clôtures automatiques,
parser CSV/Excel planning, détection de doublons, pré-remplissage durées.
- **Complexité relative** : moyenne.
- **Dépendances** : Lots 2, 3, 4.
- **Risques** : règles de relance à valider Head of Care, fiabilité du parser CSV
  (variabilité des formats cabinet), conformité notifications externes (email/SMS).
- **Hypothèses de scope** : pas de sync calendrier bidirectionnelle V1 (V2).

### Lot 7 — GoCardless / facturation
**Périmètre** : intégration GoCardless mandats SEPA, webhooks, prélèvements automatiques
(abonnement + variable), gestion échecs, dashboard facturation Admin.
- **Complexité relative** : moyenne.
- **Dépendances** : Lots 1, 2.
- **Risques** : KYC GoCardless, conformité comptable, conservation 10 ans des logs financiers.
- **Hypothèses de scope** : EUR uniquement V1, multi-devise V2.

### Lot 8 — Sécurité / HDS / monitoring
**Périmètre** : durcissement infrastructure (headers, CSP, secrets management), pen test,
audit conformité HDS, monitoring (Sentry, Datadog, alerting), sauvegardes + tests de
restauration, documentation sécurité.
- **Complexité relative** : moyenne (mais critique en santé).
- **Dépendances** : tous les lots précédents (durcissement final).
- **Risques** : findings pen test bloquants pour la mise en prod, délais d'audit externe.
- **Hypothèses de scope** : pas de certification ISO V1 (V2), HDS certifié via hébergeur
  retenu.

### Cross-références
- Pour la matrice RBAC et l'auth : §4-5.
- Pour les entités DB : §20.
- Pour l'IA Gateway : §9 et `AI_REQUIREMENTS.md` §5.
- Pour les automatisations : §19.
- Pour la timeline indicative en mois (sans chiffrage) : §17.

### Décisions de cadrage à prendre avec Émilien
- **Ordre des lots** (séquentiel vs parallélisable) selon la taille et la séniorité de
  l'équipe.
- **Profondeur de chaque lot V1** (lean vs complet — cf. les hypothèses de scope ci-dessus).
- **MVP intermédiaire** (8 / 12 / 16 semaines) : quels lots réduits embarquer pour une bêta
  privée rapide ? (cf. `TECHNICAL_NOTES.md` §12 Q15).

