# KOVELA V1 — Brief architecture cible HDS

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
- À définir avec DPO : généralement aligné sur la durée légale du suivi médical (et donc
  des CR associés). Période proposée : durée du suivi + N années, à confirmer.

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
              ├ redaction PII en entrée (regex + ML léger)
              ├ injection des templates / prompts versionnés
              ├ rate limiting global + par superviseur
              ├ logging immuable (requête, réponse, latence, coût)
              ├ redaction PII en sortie
              ├ filtrage wording interdit (linter automatique)
              └ kill-switch on/off par fonction et par tenant
```

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
- Prélèvement automatique : **abonnement** (690 € HT) le 1er du mois, **variable** (50 € ×
  patients activés) le dernier jour du mois.
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
