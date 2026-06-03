# KOVELA — Périmètre produit (prototype) et trajectoire V1 / V2

> **Lecture** : chaque module liste son **état dans le prototype**, son **destin V1**
> (à conserver / à reconstruire), et ce qui est **reporté en V2**.
>
> **Décisions canoniques** : [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) (mise à jour 2026-06-01).
> Tous les arbitrages messaging, pricing, workflow CR et priorités produit y figurent.
>
> **Prochaine priorité produit (suite à l'audit du 2026-06-01)** : **inbox superviseur scalable**
> (recherche, filtres statut / retard / J+, tri par urgence opérationnelle, séparation CR
> brouillon IA / à relire / à rendre disponible, capacité 60–80–120 patients par
> superviseuse). Cf. `DECISIONS_LOG.md` § 13.

---

## Vue d'ensemble

KOVELA est un **service opéré** de coordination post-opératoire. Le périmètre se découpe
en 4 grandes zones :

1. **Acquisition cabinet** (CRM Chirurgiens + Sales).
2. **Opération du service** (Admin / Head of Care + Superviseurs + IA assistive + Logs).
3. **Utilisation cabinet** (Chirurgien + onboarding cabinet + planning + assistante).
4. **Expérience patient** (onboarding + messagerie + urgence).

---

## 1. CRM Chirurgiens — `/admin/crm`

### Prototype
- Pipeline 9 stages : à contacter, contacté, call prévu, démo faite, en réflexion,
  accord verbal, onboarding cabinet, actif, perdu / dormant.
- Fiche prospect : identité, potentiel (volume / mois estimé, typologie cabinet, intérêt,
  priorité), suivi commercial (statut, dernier contact, prochaine action, relance), activation
  (onboarding lancé, cabinet configuré, assistante ajoutée, mandat GoCardless).
- Actions : ajouter prospect, modifier statut, ajouter note, marquer démo faite, programmer
  relance, **générer / partager le lien d'activation cabinet** (modale dédiée avec URL
  copiable, timeline statut, 4 LogKinds activation), transformer en chirurgien actif.
- 14 prospects fictifs seedés. Logs CRM dédiés (11 types depuis 2026-06-03 : ajout
  `activation_link_generated`, `activation_link_copied`, `activation_link_opened`,
  `activation_onboarding_lance`).
- **Activation cabinet** : pas d'inscription libre. Parcours canonique CRM → call → accord
  verbal → lien d'activation personnalisé (`/chirurgien/activation/[token]`) → onboarding
  accompagné. Spec : [`CABINET_ACTIVATION_FLOW.md`](./CABINET_ACTIVATION_FLOW.md).
- **Aucune donnée patient**.

### V1
- À reconstruire en backend (Postgres + API). Le schéma `Prospect` est solide et réutilisable.
- Ajouter : import CSV réel, historique d'événements (audit trail), assignation multi-sales,
  recherche full-text.

### V2
- Intégration HubSpot / Pipedrive (optionnelle).
- Scoring engagement (pas de scoring punitif).
- Email tracking, séquences de relance automatisées.

---

## 2. Sales — `/sales`

### Prototype
- Vue *« Mon portefeuille chirurgiens »* avec **sélecteur « Vu en tant que »** (Adrien /
  Sarah / Maxime / Lina).
- 4 profils sales fictifs assignés aux 14 prospects.
- 8 KPI personnels (relances dues, démos prévues, prospects chauds, accords verbaux,
  onboardings, actifs, volume patients, CA potentiel).
- Table filtrable + modal d'actions rapides.
- *Performance par sales* sur `/admin/crm` (vue Head of Care).

### V1
- Authentification réelle par sales (un compte = un sales).
- RBAC : un sales voit uniquement ses prospects ; l'admin / fondateur voit tout.
- Conserver le schéma `SalesOwner` et la relation `Prospect.salesOwnerId`.

### V2
- Objectifs commerciaux personnels (non punitifs, pilotables par le Head of Care).
- Tableaux de bord temporels (jour / semaine / mois).
- Intégration calendrier (sync prochaine action / relance).

---

## 3. Admin / Head of Care — `/admin`

### Prototype
- Actions prioritaires (5 cartes : sans superviseur, messages non traités, CR à faire,
  escalades, silencieux) avec *Voir → filtre table + scroll*.
- **Qualité & délais** (mini-bloc 4 indicateurs : délai moyen, CR à contrôler, conversations
  à relire, formations en cours) + CTA vers `/admin/supervision`.
- Indicateurs globaux (8 stats).
- **Charge par superviseur** avec badge saturation (Charge maîtrisée / À surveiller / Élevée).
- Carte verticales (répartition + tags chirurgiens).
- Table patients filtrable (6 filtres dont *Messages non traités*, *Silencieux*) + attribution
  / réattribution.
- Facturation simulée (abonnement, mandat GoCardless, agrégation du mois ; montants portés
  par le code, hors documentation).

### V1
- Conserver les widgets et les calculs (charge superviseur, délai moyen, KPI). À reconstruire
  côté API avec les vraies données.
- Persister les attributions superviseur → patient en base.

### V2
- Alertes proactives (saturation, retards).
- Filtres avancés (par chirurgien, par période).
- Export PDF du dashboard pour audit.

---

## 4. Supervision & qualité — `/admin/supervision`

### Prototype
- **14 KPI globaux** : superviseurs actifs, patients actifs, messages traités / non traités,
  délai moyen de traitement, CR finalisés / en retard, escalades transmises, IA acceptées /
  modifiées / refusées, **temps estimé gagné par l'IA** (étiqueté *Estimation prototype*),
  conversations à relire, CR à contrôler.
- Tableau superviseurs avec statut formation, qualité, charge.
- **Conversations à relire** (4 items seedés) — bouton *Ouvrir la fiche patient*, **commentaire
  Head of Care éditable**, boutons *OK / À revoir*.
- **CR à contrôler** (4 items seedés) — mêmes affordances.
- **Retours terrain superviseurs** : liste des suggestions, statut (nouveau / à revoir /
  retenu / traité), actions Head of Care.
- **Socle qualité KOVELA** : 9 blocs (procédures, formation, logs, revue qualité, contrôle
  CR, gestion incidents, traçabilité, amélioration continue, documentation interne).
  Wording prudent — **aucune certification revendiquée**.

### V1
- Reconstruire le tableau superviseurs avec données serveur.
- Persister statuts qualité + commentaires Head of Care en base, avec historique.
- Calculer le temps estimé gagné depuis des logs IA serveur réels.

### V2
- Workflow complet d'assignation de revue qualité.
- Calibration inter-superviseurs.
- Module qualité formelle (ISO 9001 inspiration, sans claim).

---

## 5. Superviseur — `/superviseur`, `/superviseur/patient/[id]`

### Prototype
- Inbox 6 sections (messages non traités, silencieux, escalades, CR à faire, suivis du jour,
  clôtures à faire) avec aperçu dernier message + délai + badges.
- **Mes indicateurs** : 9 indicateurs personnels.
- **Améliorations terrain** : modal pour proposer une suggestion (type, écran, description,
  impact, priorité) → log.
- Fiche patient : timeline, notes internes, IA assistive (4 boutons), CR, compilation
  factuelle, escalade, logs liés, templates, actions (répondre, reformuler, marquer traité,
  relancer, clôturer).

### V1
- Vrai routage par superviseur (auth + RBAC).
- Persister messages, notes, attribution.
- Inbox triable / filtrable serveur.

### V2
- Notifications temps réel (WebSocket / SSE).
- Inbox partagée avec mention `@autre superviseur`.

---

## 6. Formation superviseur — `/superviseur/formation`

### Prototype
- Checklist démarrage (8 items).
- Règles KOVELA (5 règles).
- Lexique autorisé en badges.
- 7 familles de templates listées.
- **4 cas pratiques non cliniques** (silencieux, transmission cabinet, cycle de vie CR,
  préparer ≠ transmettre).
- Mini quiz 4 questions process / wording → badge *Prêt à suivre des patients*.

### V1
- Persister la progression de formation par superviseur.
- Versionner les contenus (rules, templates) pour traçabilité.

### V2
- Modules vidéo, certification interne, recertification périodique.
- Évaluation pratique en duo (revue qualité d'apprentissage).

---

## 7. Chirurgien / cabinet — `/chirurgien`

### Prototype
- Stats (Interventions à venir, Onboardings à compléter, Patients actifs, CR disponibles,
  Escalades transmises).
- CTA *Transmettre / modifier mon planning opératoire*.
- *Patients suivis* : liste filtrée (onboarding complété, hors annulés).
- **Mise en place cabinet** (config en lecture + boutons *Mettre en place / Voir-modifier*).
- Abonnement (mandat GoCardless en clair, agrégation du mois).
- **Durées de suivi par type d'intervention** (récap éditable depuis l'onboarding).
- **Cadre cible** (HDS / RGPD / principes CNIL — wording prudent).

### V1
- Auth chirurgien (un compte). Multi-cabinet si pertinent.
- Persister la `CabinetConfig` ; assistantes en table relationnelle.

### V2
- Espace assistante distinct avec permissions différenciées.
- Multi-site avec préférences par site.

---

## 8. Onboarding cabinet — `/chirurgien/onboarding`

### Prototype
- Wizard 6 étapes :
  1. Identité (chirurgien, cabinet, **spécialisation**, **verticale KOVELA**).
  2. Lieux d'intervention (jusqu'à 3).
  3. Préférences de suivi (durée défaut, **durées par type d'intervention** éditables,
     typologie standard / renforcé / premium, fréquence CR, canal transmission, contact
     transmission cabinet, horaires, préférences patient, message d'accueil).
  4. Assistantes autorisées.
  5. Facturation & prélèvement GoCardless fictif (envoyer le lien / simuler mandat actif).
  6. Validation doctrine → enregistrement + redirection planning.

### V1
- Schéma `CabinetConfig` réutilisable tel quel.
- Persistance via API. Validation côté serveur.
- Vraie invitation assistante (email).

### V2
- Signature électronique des CGV / mandat.
- Onboarding multi-spécialité (un chirurgien peut couvrir plusieurs spécialités).

---

## 9. Planning opératoire — `/chirurgien/planning`

### Prototype
- Bande de flux (5 étapes).
- Table planning : patient, intervention, date + heure, lieu, suivi, onboarding,
  superviseur, statut KOVELA, dernière MAJ, actions.
- Actions : ajouter, importer (simulé via *Charger un exemple*), modifier, reporter,
  annuler, renvoyer lien, voir dossier.
- **Pré-remplissage automatique** de la durée selon le type d'intervention (config cabinet).

### V1
- Vrai parser CSV / Excel pour l'import.
- Persistance en base ; intégration calendrier (Google / Outlook) en V1.5 ou V2.
- Validation des données (email, téléphone, date).

### V2
- Sync bidirectionnelle agenda.
- Détection de doublons à l'import.
- Vue calendrier hebdomadaire.

---

## 10. Patient — `/patient/onboarding`, `/patient/messages`

### Prototype
- Onboarding 5 étapes : bienvenue, confirmation informations, limites du service +
  consentement, préférences (photo / audio / relances / notifications).
- Écran final **« Mon suivi en bref »** (chirurgien, intervention, durée, prochaine étape,
  rappel 15 / 112).
- Messagerie texte / photo / audio (placeholders), historique, confirmation après envoi,
  rappel urgence permanent.
- **Aucune IA visible côté patient** ; mention explicite *« aucune réponse automatique par IA »*.

### V1
- Auth patient sécurisée (lien magique ou OTP).
- Stockage chiffré HDS des pièces jointes (S3-compatible avec SSE-KMS).
- Consentement RGPD horodaté et téléchargeable par le patient.

### V2
- Notifications push web / app.
- Espace patient web app installable (PWA).
- Réponses asynchrones avec accusé de lecture.

---

## 11. IA assistive — `lib/ai.ts`

### Prototype
- 4 fonctions simulées localement (sorties déterministes) :
  - **Résumé conversation** (~1.5 min gagnées estimées par appel).
  - **Préparation CR** (~7 min).
  - **Reformulation** (~45 sec).
  - **Compilation factuelle d'escalade** (~6 min).
- Disclaimer obligatoire affiché : *« Suggestion IA — à valider par un humain »*.
- Modale brouillon CR (workflow validé) : structure A. Résumé patient · B. Brouillon CR
  factuel structuré · C. Checklist avant validation · D. Rappel doctrine.
- Boutons modale brouillon CR : **Relire et valider** · **Modifier le brouillon** · **Rejeter**
  → log dédié (`ia_utilisee` + `ia_suggestion`).
- Prompt versionné fictif `v1.2`.
- **Jamais autonome côté patient. Jamais d'analyse photo. Jamais de transmission cabinet
  sans validation humaine. Aucun scoring.**

> Workflow CR canonique : `IA prépare → superviseuse relit → corrige si besoin → valide →
> CR disponible chirurgien`. Cf. [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) § 6 et § 7.

### V1
- Vraie IA derrière un **gateway serveur** : redaction PII en entrée, redaction en sortie,
  rate limiting, kill-switch, logs immutables.
- Modèle versionné, prompt versionné, métriques (latence, usage, taux d'acceptation).
- Conformité : pas d'envoi de données patient à un fournisseur hors UE / hors HDS sans
  contrat adapté (cf. avis Aumans).

### V2
- Fine-tuning sur templates KOVELA validés.
- Détection automatique de wording risqué (linter IA en interne).
- IA spécialisée par verticale.

---

## 12. Compte-rendu (CR) — workflow IA → superviseuse → chirurgien

### Prototype
- **Chaîne canonique** : *IA prépare / préremplit le brouillon → superviseuse relit →
  corrige si nécessaire → valide → CR disponible chirurgien*.
- **États / wording validés** : `Aucun CR préparé` · `Brouillon IA — à relire et valider` ·
  `CR validé KOVELA` · `CR disponible chirurgien`. Côté agrégats : `CR en file de validation`
  et `CR en retard de validation` (jamais « CR en retard » seul).
- États techniques `ClinicalReport` (`lib/types.ts`) : `brouillon` → `valide` → `disponible`.
- Le contenu est **normalisé à la publication** (les mentions *« Brouillon / à valider par
  un humain »* sont retirées et remplacées par *« Compte-rendu factuel préparé et rendu
  disponible par l'équipe KOVELA. »*).
- Côté chirurgien : **uniquement les CR `disponible`** s'affichent.

> Référence canonique : [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) § 6.

### V1
- Schéma `ClinicalReport` à conserver. Persistance + historique (un CR peut être modifié,
  garder les versions).
- Génération PDF (pour transmission externe).

### V2
- Signature électronique du CR par le superviseur en charge.
- Templates de CR par verticale.

---

## 13. Logs — `/logs`

### Prototype
- 30+ types de logs opérationnels (`patient_attribue`, `message_envoye`, `cr_prepare`,
  `cr_valide`, `cr_disponible`, `compilation_preparee`, `escalade_transmise`,
  `onboarding_complete`, `onboarding_envoye`, `patient_relance`, `suivi_cloture`,
  `note_interne`, `planning_ajout/modifie/reporte/annule/import`, `cabinet_configure`,
  `mandat_gocardless`, `assistante_invitee`, `crm_prospect_cree/statut/note/demo/relance/onboarding_lance/active/assignation`,
  `qualite_revue`, `qualite_commentaire`, `suggestion_cree/statut`, `formation_completee`,
  `consentement_patient`, `signalement_cabinet`).
- Logs IA séparés avec décision (propose / accepte / modifie / refuse) et version de prompt.
- **8 filtres** : Tous, IA, CR, Escalade, Patient, Attribution, Cabinet, CRM, Qualité.

### V1
- **Audit trail immuable** (append-only, hashage en chaîne ou WORM storage).
- Conservation conforme aux obligations légales (à valider avec DPO / Aumans).
- Export / API admin pour audit externe.

### V2
- Recherche full-text dans les logs.
- Alertes automatiques sur patterns suspects.

---

## 14. GoCardless fictif

### Prototype
- 4 statuts de mandat : `a_creer`, `lien_envoye`, `mandat_actif`, `prelevement_pret`.
- Actions fictives dans le wizard cabinet : *Envoyer le lien GoCardless* / *Simuler mandat
  actif*.
- Affichage en clair sur le dashboard chirurgien et dans la fiche prospect CRM.
- **Aucune donnée bancaire, aucun paiement réel, aucune clé API.**

### Pricing landing validé (référence canonique)
> Voir [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) § 2 pour le détail et les règles d'écriture.

- **690 € HT / mois** — accès mensuel au service opéré KOVELA, facturé le 1er du mois.
- **+ 80 € HT / patient activé** — part variable d'usage, facturée en fin de mois selon les
  patients réellement suivis.
- **Définition canonique** : *Patient activé = onboarding validé + suivi lancé.*
- **Angle pricing** : « Moins qu'un mi-temps. Plus qu'un outil. »
- **Phrase clé** : « Le fixe donne accès au service. Le variable suit l'usage réel. »

**Wording interdit** : 50 € / patient (ancienne hypothèse), abonnement SaaS, forfait illimité,
patients illimités, sur devis (section pricing), gratuit lié au pricing.

### V1
- Vraie intégration GoCardless (mandat SEPA, webhooks, réconciliation).
- Facturation automatisée alignée sur le pricing canonique ci-dessus. Le détail des montants
  est porté par le code (`lib/mock-data.ts` constante `PRICING`) et par les CGV cabinet, pas
  par cette documentation technique.
- Gestion des échecs de prélèvement, relances, suspension.

### V2
- Multi-devise (export international).
- Tarification dégressive par volume.

---

## 15. HDS / RGPD / CNIL — architecture cible

### Prototype
- Wording **prudent** partout : *« architecture cible »*, *« pensé pour »*, *« principes
  CNIL »*, *« à valider juridiquement »*.
- Section dédiée sur la landing avec double bloc *Site public (hors HDS) / Application
  métier cible (pensée pour HDS, RGPD, principes CNIL)*.
- Bloc *Cadre cible* sur le dashboard chirurgien.
- **Aucune certification revendiquée à ce stade.**

### V1
- Hébergement HDS certifié (OVH HDS, Outscale, Scaleway HDS, AWS Health pour international).
- RGPD : DPO désigné, registre des traitements, base légale documentée, durée de conservation,
  droit à l'effacement opérationnel.
- CNIL : déclaration / consultation préalable selon classification.

### V2
- Certification HDS / ISO 27001 du fournisseur (audit annuel).
- Audit RGPD externe annuel.

---

## 16. Ce qui est V1 / V2 — synthèse

| Module | V1 | V2 |
|---|---|---|
| Landing + site public | ✅ | i18n, blog, ressources |
| Auth + RBAC | ✅ | SSO entreprise |
| CRM Chirurgiens | ✅ | Intégrations HubSpot/Pipedrive |
| Sales (RBAC) | ✅ | Objectifs / coaching |
| Admin Head of Care | ✅ | Alertes proactives |
| Supervision qualité (lecture) | ✅ | Workflow assignation |
| Superviseur (inbox + fiche) | ✅ | Temps réel / WebSocket |
| Formation superviseur | ✅ | Vidéos / certification |
| Chirurgien | ✅ | Multi-cabinet |
| Onboarding cabinet | ✅ | Signature électronique |
| Planning opératoire | ✅ | Sync agenda bidirectionnelle |
| Patient onboarding + messagerie | ✅ | Push / PWA |
| IA assistive (4 fonctions) | ✅ avec gateway | Fine-tuning par verticale |
| CR avec gating | ✅ | Versioning + signature |
| Logs (audit trail immuable) | ✅ | Recherche full-text |
| GoCardless | ✅ | Multi-devise |
| HDS / RGPD / CNIL | ✅ certifié | ISO 27001 |
| Suggestions superviseurs | ✅ persistance | Tags, priorisation auto |

---

## 17. Ce qu'il **ne faut pas** mettre en V1

- Scoring patient (banni par la doctrine).
- Réponse autonome IA au patient (bannie).
- Analyse photo médicale (bannie).
- Tri médical / décision clinique automatique (banni).
- Chatbot patient autonome (banni).
- Classement punitif des superviseurs (banni).
- Toute revendication ISO / HDS / CNIL non acquise.

---

## 18. Couverture du brief tech initial

> Tableau de couverture du brief tech KOVELA. Sert de référence pour vérifier que la V1
> traite l'ensemble du périmètre métier prévu, et identifier ce qui est reporté en V2.

| Élément du brief | Couvert | Partiel | Non couvert | À faire V1 | À reporter V2 | Commentaire |
|---|:-:|:-:|:-:|:-:|:-:|---|
| Site public hors HDS | ✅ | | | | | Landing publique, aucune donnée patient, CTA mailto. |
| Application métier cible HDS | | ✅ | | ✅ | | Wording prudent dans le prototype ; vraie certification HDS en V1. |
| Rôle Admin | ✅ | | | ✅ | | Vue + actions ; à brancher sur auth + RBAC réels. |
| Rôle Head of Care | ✅ | | | ✅ | | `/admin/supervision` ; mêmes permissions que Admin en V1. |
| Rôle Chirurgien | ✅ | | | ✅ | | Espace `/chirurgien` complet. |
| Rôle Assistante / secrétariat | | ✅ | | ✅ | | Mockée dans CabinetConfig ; espace dédié en V1. |
| Rôle Superviseur | ✅ | | | ✅ | | Inbox + fiche + formation. |
| Rôle Patient | ✅ | | | ✅ | | Onboarding mobile-first + messagerie. |
| Rôle Sales | ✅ | | | ✅ | | `/sales` avec sélecteur de persona. |
| Onboarding chirurgien / cabinet | ✅ | | | ✅ | | Wizard 6 étapes. |
| Planning opératoire | ✅ | | | ✅ | | Ajout, import simulé, modif, report, annulation, renvoi lien. |
| Onboarding patient | ✅ | | | ✅ | | 5 étapes + écran « Mon suivi en bref ». |
| Messagerie patient texte / photo / audio | ✅ | | | ✅ | | Placeholders en prototype, stockage HDS en V1. |
| Supervision humaine | ✅ | | | ✅ | | Inbox 6 sections + attribution + traçabilité. |
| IA assistive (4 fonctions) | ✅ | | | ✅ | | Voir `docs/AI_REQUIREMENTS.md`. |
| Compte-rendu factuel | ✅ | | | ✅ | | Gating 3 états (brouillon / validé interne / disponible). |
| Compilation factuelle | ✅ | | | ✅ | | Dissociation préparation ≠ transmission. |
| Escalade / transmission au chirurgien | ✅ | | | ✅ | | Action humaine explicite, log dédié. |
| Logs / audit trail | | ✅ | | ✅ | | Logs typés en prototype ; immuables (hash chaining) en V1. |
| CRM Chirurgiens | ✅ | | | ✅ | | Pipeline 9 stages, 14 prospects. |
| Dashboard sales | ✅ | | | ✅ | | `/sales` avec KPI + table. |
| GoCardless fictif | ✅ | | | ✅ | | Statuts mandat, actions Envoyer lien / Simuler actif. |
| Formation superviseur | ✅ | | | ✅ | | Checklist + règles + lexique + templates + 4 cas + quiz + badge. |
| Qualité / performance | ✅ | | | ✅ | | KPI IA seedés, conv à relire, CR à contrôler, retours terrain. |
| Retours terrain superviseurs | ✅ | | | ✅ | | Bloc dédié, modal de proposition, vue Head of Care. |
| Sécurité / rôles / permissions | | ✅ | | ✅ | | Sélecteur fictif en prototype ; auth + RBAC complets en V1. |
| Notifications réelles (email/SMS) | | | ✅ | ✅ | | Aucune notification dans le prototype, V1 via Postmark/Twilio. |
| Stockage HDS pour photos / audios | | | ✅ | ✅ | | Placeholders en prototype, V1 sur S3 HDS-compatible. |
| Tests E2E | | | ✅ | ✅ | | Playwright recommandé V1 (cf. TECHNICAL_NOTES.md). |
| i18n | | | ✅ | | ✅ | FR uniquement en V1, EN en V2. |
| App mobile native | | | ✅ | | ✅ | Web responsive en V1, PWA / native éventuel en V2. |

### Synthèse de couverture
- **Métier couvert à 100 %** dans le prototype pour la démonstration des flux.
- **Architecture cible** documentée pour la V1 (cf. `V1_HDS_ARCHITECTURE_BRIEF.md`).
- **Briques techniques** à construire en V1 : auth, DB, API, IA gateway, stockage HDS,
  notifications réelles, GoCardless réel, audit trail immuable.

---

## 19. Synthèse Prototype / V1 / V2

### 🧪 Prototype (état actuel — démonstration uniquement)
- Front Next.js 14 (App Router) + TypeScript + Tailwind.
- Données mockées dans `lib/mock-data.ts`.
- État en mémoire (React Context) — **volatile, un refresh = reset**.
- **Pas de vraie auth** (sélecteur de rôle uniquement).
- **Pas de DB** (tout in-memory).
- **Pas de HDS réel** (déclaratif, wording prudent).
- **Pas de notifications réelles** (logs internes simulés).
- **IA simulée** localement (sorties déterministes, `lib/ai.ts`).
- **GoCardless fictif** (4 statuts, actions simulées).
- **CRM fictif** avec 14 prospects seedés et 4 sales owners.

### 🚀 V1 (production HDS — ~10 mois, équipe 3-4 personnes)
- Backend (NestJS recommandé) + PostgreSQL HDS-certifié.
- **Auth + RBAC** (Clerk recommandé ou Auth.js).
- **API** typée (tRPC pour Next.js, ou REST/GraphQL).
- **Stockage fichiers HDS** (Scaleway Object Storage HDS) chiffré, URLs présignées,
  antivirus.
- **Logs immuables** (audit trail append-only + hash chaining).
- **Notifications réelles** (Postmark / Twilio, DPA UE).
- **IA assistive serveur** via IA Gateway (redaction PII, kill-switch, logging immuable).
- **GoCardless réel** (mandats SEPA + webhooks + relances).
- **CRM Chirurgiens** opérationnel + RBAC sales.
- **Supervision qualité lean** (lecture + commentaire + statut).
- **Formation superviseur lean** (checklist + cas + quiz + badge persisté).
- **Hébergement HDS** (OVH HDS ou Scaleway HDS).
- **Tests E2E** (Playwright sur 4 parcours critiques).
- **Monitoring** (Sentry, Datadog, alertes).

### 🔭 V2 (au-delà de V1 — itérations selon besoin)
- **Intégrations avancées** : sync calendrier bidirectionnelle, HubSpot/Pipedrive (optionnel),
  WhatsApp Business si conformité validée.
- **Analytics** : tableaux de bord temporels (jour/semaine/mois), exports PDF audit.
- **Workflow qualité complet** : assignation revues, historique, calibration inter-superviseurs.
- **Formation avancée** : modules vidéo, certification interne, recertification périodique.
- **Démarche ISO** à étudier : ISO 9001 organisation qualité, ISO 27001 sécurité.
- **Multi-cabinet avancé** : un chirurgien sur plusieurs sites, gestion fine des permissions.
- **IA plus contextualisée** : fine-tuning sur templates KOVELA, spécialisation par
  verticale.
- **App mobile** : PWA installable ou native (iOS / Android) — décision V2.
- **i18n** : EN dans un premier temps, puis ES / IT / DE selon expansion.
- **Multi-devise** pour expansion internationale.
- **Alertes proactives** Head of Care (saturation, retards, refus IA atypiques).
- **Espace assistante dédié** avec permissions différenciées.

