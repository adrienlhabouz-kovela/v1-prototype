# KOVELA — Notes de revue réglementaire

> **Audience** : Adrien (fondateur), Aumans (avocat e-santé), DPO interne.
> **Statut** : notes préparatoires à la revue Aumans. **Pas un avis juridique**.
> Ces notes capturent la doctrine produit, les choix de wording prudents et la liste des
> questions ouvertes.

---

## 1. Doctrine produit KOVELA

### Phrase doctrinale tenue partout dans le prototype
> *« KOVELA ne décide pas médicalement. KOVELA structure, trace, priorise opérationnellement
> et escalade. L'IA est assistive, interne, loggée et human-in-the-loop. »*

### Conséquences produit
- KOVELA **structure, documente, trace** — KOVELA **ne diagnostique pas**, ne qualifie pas,
  ne décide pas médicalement.
- KOVELA **organise un flux opérationnel** entre patient, équipe de coordination, et chirurgien.
- KOVELA **n'est pas un dispositif médical** (a priori — à formaliser avec Aumans).
- KOVELA **ne se substitue jamais** au chirurgien. Le chirurgien garde la main, KOVELA prépare.

---

## 2. Positionnement service opéré (non logiciel)

### Pourquoi ce positionnement
- Limite l'attente d'autonomie patient (« je peux discuter directement avec le logiciel »).
- Place la **responsabilité métier** dans la chaîne humaine (équipe KOVELA + chirurgien).
- Permet de positionner l'IA comme **outil interne** de l'équipe, et non comme service
  rendu au patient.

### Mentions présentes dans le prototype
- *« Un service opéré, pas un logiciel de plus. »*
- *« KOVELA n'est pas un logiciel que le chirurgien doit gérer. C'est un service opéré qui
  structure le suivi post-opératoire pour son cabinet, avec une équipe de supervision humaine
  spécialisée et une IA assistive interne. »*
- *« KOVELA met en place le service avec le cabinet. »*
- *« L'équipe KOVELA organise le flux. »*

### À valider avec Aumans
- La qualification juridique de « service opéré » est-elle suffisante pour clarifier le
  périmètre de responsabilité ?
- Faut-il mentionner explicitement « **non-dispositif médical** » quelque part dans les CGV /
  l'onboarding patient ?

---

## 3. Non-substitution au chirurgien

### Mise en œuvre prototype
- Le chirurgien reçoit uniquement :
  - des **CR factuels** explicitement mis à disposition par un humain (gating à 3 états :
    brouillon → validé en interne → disponible pour le chirurgien).
  - des **escalades transmises** explicitement par un humain (jamais d'escalade ouverte
    automatiquement par l'IA).
- L'IA ne décide jamais d'escalader. L'IA prépare une compilation factuelle ; un humain
  transmet.
- Le chirurgien voit en permanence : *« Vous ne recevez pas du bruit : un historique clair et
  exploitable. Vous gardez la main. »*

### À valider avec Aumans
- Le wording de transmission CR / compilation suffit-il à clarifier la non-substitution ?
- Faut-il un avertissement permanent au chirurgien rappelant qu'il reste seul responsable
  médicalement ?

---

## 4. IA assistive — encadrement

### Doctrine IA tenue dans le prototype
L'IA KOVELA **n'a jamais** :
- de réponse autonome au patient ;
- d'avis médical ;
- d'interprétation des photos ;
- de décision d'escalade ;
- d'évaluation chiffrée du patient.

L'IA KOVELA **aide à** :
- résumer les échanges ;
- préparer les comptes-rendus factuels ;
- reformuler des réponses non médicales (forme uniquement) ;
- compiler factuellement une transmission ;
- signaler des tâches opérationnelles.

### Implémentation
- Chaque sortie IA passe par **Accepter / Modifier / Refuser** humain.
- Disclaimer affiché : *« Suggestion IA — à valider par un humain »*.
- **Logs IA dédiés** (`ia_utilisee`, `ia_suggestion` + décision : propose / accepte / modifie
  / refuse) avec version de prompt.
- **Temps estimé gagné** affiché comme estimation prototype, jamais comme garantie.

### Points sensibles
- L'IA est appelée sur des **contenus patient** (messages, métadonnées de pièces jointes).
  → Le **gateway IA V1** devra réaliser une **redaction PII** systématique.
- Le **prompt est versionné** (`v1.2` en prototype). En V1, chaque version de prompt sera
  archivée en base.
- Un **kill-switch par fonction** est prévu (cf. brief architecture V1).

### À valider avec Aumans
- Faut-il informer explicitement le patient de l'usage d'une IA en interne KOVELA
  (transparency obligation art. 13/14 RGPD + AI Act) ?
- Faut-il une **AIPD** (Analyse d'impact à la protection des données) — probablement oui,
  vu le caractère de santé + IA à grande échelle ?
- Choix du fournisseur LLM : DPA RGPD obligatoire, transferts hors UE à clarifier.
- Quelle position prendre vis-à-vis de l'**AI Act européen** (catégorisation à confirmer ;
  a priori pas système IA à haut risque puisque non médical / non décisionnel, mais à
  formaliser) ?

---

## 5. Patient — onboarding, consentement, limites

### Mises en œuvre prototype
- **Onboarding patient mobile-first** en 5 étapes :
  1. Bienvenue.
  2. Confirmation des informations (chirurgien, intervention, date, durée) + *Signaler une
     erreur au cabinet*.
  3. Limites du service (UrgencyBanner 15 / 112 permanent + 4 puces : pas de remplacement de
     consultation, pas d'avis médical, coordination par équipe humaine).
  4. Consentement fictif (case à cocher) + rappel d'urgence pris en connaissance.
  5. Préférences (autoriser photo, autoriser audio, accepter relances, accepter notifications).
- Écran final **« Mon suivi en bref »** rappelant : chirurgien, intervention, durée, prochaine
  étape, rappel 15 / 112.
- **Bannière urgence permanente** dans la messagerie patient : *« KOVELA n'est pas un service
  d'urgence. En cas d'urgence, contactez le 15 / 112 ou suivez les consignes de votre
  chirurgien. »*
- Mention explicite *« Vos messages sont traités par une équipe humaine de coordination.
  Aucune réponse automatique par IA. »*

### À valider avec Aumans
- **Forme du consentement** : la case à cocher avec horodatage et journalisation est-elle
  suffisante ? Faut-il un PDF téléchargeable / signature électronique ?
- **Information préalable** : la liste des informations communiquées au patient avant
  onboarding est-elle complète (qui voit quoi, durée de conservation, droits) ?
- **Rappel d'urgence** : le wording 15 / 112 est-il acceptable ? Faut-il préciser des
  numéros internationaux pour des patients hors France ?
- **Mineurs / majeurs protégés** : prototype ne traite pas ces cas — à cadrer en V1.

---

## 6. HDS / RGPD / CNIL — wording prudent

### Mentions présentes
Sur la landing publique, section *Sécurité, données & cadre* :
- *« KOVELA est conçu pour s'inscrire dans un cadre HDS, RGPD et CNIL, avec une séparation
  claire entre site public et application métier, une logique de minimisation des données,
  des accès par rôle et une traçabilité des actions. »*
- Double bloc explicite : **Site public — hors HDS, aucune donnée patient** / **Application
  métier cible — pensée pour HDS, RGPD, principes CNIL**.
- *« Architecture cible — éléments à valider juridiquement avant un déploiement en
  production. Ce site est un démonstrateur : aucune donnée patient n'y est collectée.
  Aucune certification revendiquée à ce stade. »*

Sur le dashboard chirurgien, bloc **Cadre cible** :
- HDS pour l'application métier.
- RGPD.
- Principes CNIL (minimisation, traçabilité, droits).
- Accès par rôle.
- Traçabilité des actions humaines et IA.
- Aucune donnée patient dans le CRM ou la landing.
- *« Architecture cible — éléments à valider juridiquement avant un déploiement en
  production. »*

### Choix lexicaux délibérés
- **« pensé pour »**, **« architecture cible »**, **« principes CNIL »** → reconnaît l'intention
  sans revendiquer la certification.
- **« à valider juridiquement »** → assume l'incomplétude.
- **« Aucune certification revendiquée à ce stade »** → disclaimer explicite.

### À valider avec Aumans
- Le wording prudent est-il suffisant pour ne pas constituer une revendication trompeuse
  vis-à-vis du chirurgien ou du patient ?
- À quel moment précis (étape produit) faut-il basculer du wording « architecture cible »
  vers « hébergé HDS » (i.e. quand la certification fournisseur est-elle suffisante) ?
- Mention CNIL : faut-il consulter la CNIL avant la mise en production ? Sous quelle forme
  (déclaration, consultation préalable, AIPD à transmettre) ?

---

## 7. Lexique autorisé / interdit (rappel)

### Termes utilisés systématiquement (autorisés)
coordination · continuité post-opératoire · suivi structuré · supervision humaine · IA
assistive · compte-rendu factuel · synthèse opérationnelle · compilation factuelle ·
classement opérationnel · message non traité · patient silencieux · CR en attente ·
signal déclaré · transmission au chirurgien · compte-rendu factuel · indicateurs
opérationnels · qualité de traitement · revue qualité · complétude formation · délai de
traitement · usage IA assistive · temps estimé gagné · architecture cible · principes CNIL ·
données fictives · état non persistant · estimation prototype · service opéré · mise en
place · paramètres de service cabinet · préférences de fonctionnement.

### Termes bannis (vérifié partout — 0 occurrence dans le prototype)
diagnostic · tri médical · tri clinique · urgence détectée · patient à risque · gravité ·
complication probable · analyse médicale · analyse photo · analyse symptôme · recommandation
médicale · décision clinique · score de risque · IA médicale · chatbot patient autonome ·
télésurveillance médicale · surveillance médicale · prise en charge médicale · conformité
garantie · certifié HDS · certifié CNIL · validé CNIL · agréé ISO · certifié ISO · conforme
ISO · garantie réputation · améliore vos notes Google · sécurise médicalement · réduit les
complications · sanction · classement punitif · performance clinique · risque superviseur ·
score médical · score patient · protocole médical · protocole clinique.

### Mécanisme de garde
- Scan automatisable via `grep` dans la CI V1.
- Toute reformulation de négation de mot interdit est appliquée pour ne pas afficher le mot
  même en négation (ex. *« protocole médical imposé »* → *« décision opérationnelle du
  cabinet, jamais imposée par KOVELA »*).

### À valider avec Aumans
- Y a-t-il des termes que nous n'avons **pas anticipés** et qui devraient être bannis ?
- Y a-t-il des termes que nous bannissons **par excès de précaution** alors qu'ils
  pourraient être utilisés ?

---

## 8. Réputation cabinet / expérience patient — wording vendeur prudent

### Mentions présentes (landing, section *Expérience patient & réputation cabinet*)
- *« Une meilleure expérience post-op, c'est aussi une réputation mieux maîtrisée. »*
- *« Le post-opératoire est souvent l'un des moments qui marque le plus l'expérience patient. »*
- *« Une organisation plus claire du post-op peut aider le cabinet à préserver son image, sa
  réputation et la qualité perçue de son accompagnement. »*

### Disclaimer explicite (landing, même section)
- *« KOVELA ne garantit pas la satisfaction patient ni la réputation du chirurgien. KOVELA
  organise et trace le suivi post-opératoire pour aider le cabinet à mieux maîtriser son
  image post-opératoire. »*

### À valider avec Aumans
- Le wording « peut contribuer à » + le disclaimer explicite suffisent-ils pour ne pas tomber
  dans la publicité trompeuse ?
- Y a-t-il des éléments à éviter dans la communication marketing autour de la « réputation »
  qu'on pourrait reformuler ?

---

## 9. CRM Chirurgiens / Sales — pas de données patient

### Garantie produit
- Le **type `Prospect`** ne contient **aucune référence aux données patient** (pas de message,
  pas de photo, pas de CR, pas d'historique médical).
- Les **seules liaisons** entre le CRM et le suivi sont des **statuts agrégés cabinet**
  (onboarding lancé, cabinet configuré, mandat actif).
- Mentions explicites dans l'UI :
  - *« CRM Chirurgiens — Prospection, démos, onboarding cabinet et activation des
    chirurgiens. Aucune donnée patient. »*
  - *« Données 100 % fictives. AUCUNE donnée patient n'est collectée ici. »*
  - *« Aucune donnée patient ne transite par le CRM. »*

### À valider avec Aumans
- Confirmation que le CRM est un traitement **distinct** des données patient (finalité
  commerciale, base légale : intérêt légitime de KOVELA).
- Mention RGPD à fournir aux prospects chirurgiens (information, droits, opt-out).

---

## 10. Logs / audit trail / traçabilité

### Mise en œuvre prototype
- **30+ types de logs** documentent chaque action humaine et chaque interaction IA.
- Logs IA spécifiques avec la décision humaine (propose / accepte / modifie / refuse) +
  version de prompt.
- **Filtres** par type : IA, CR, Escalade, Patient, Attribution, Cabinet, CRM, Qualité.

### Engagement V1
- **Audit trail immuable** (append-only avec hash chaining).
- Conservation conforme aux obligations légales (à confirmer DPO / Aumans).
- Export pour audit externe / autorités compétentes.

### À valider avec Aumans
- Durée de conservation des logs (proposition : aligné sur la durée du suivi post-op + N
  années pour les CR, mais 10 ans pour les logs comptables / GoCardless).
- Modalités de purge / anonymisation après expiration.
- Accès aux logs : limité à `audit:read` (Admin / Head of Care) — à confirmer.

---

## 11. Questions à poser à Aumans

### Cadre juridique global
1. **Statut RGPD** de KOVELA : sous-traitant du chirurgien (privilégié), responsable
   conjoint, ou autre ?
2. **Statut « dispositif médical »** : confirmer la non-qualification (a priori KOVELA n'est
   pas un DM puisque non médical / non décisionnel — mais à formaliser).
3. **AI Act** : catégorisation de KOVELA (a priori IA à risque limité / minimal puisque non
   décisionnelle ; à confirmer).
4. **Contrats cabinet** : modèle de contrat type, clauses sous-traitance, SLA, responsabilités
   en cas d'incident.

### Données et consentement patient
5. Forme suffisante du **consentement** patient au prototype (case à cocher + horodatage).
6. Information préalable patient : modèle à fournir.
7. Cas particuliers (mineurs, majeurs protégés, urgences) à anticiper.
8. **Durée de conservation** des messages, photos, audios, CR par catégorie.
9. **Droit à l'effacement** : modalités opérationnelles (effacement physique vs anonymisation).
10. **Droit à la portabilité** : format d'export à prévoir.

### IA
11. **AIPD** (Analyse d'impact) : nécessaire ou non ? Si oui, à transmettre à la CNIL ?
12. **Information patient** sur l'usage d'une IA en interne (transparency).
13. Choix du fournisseur LLM : DPA, transferts hors UE, BCR.
14. **Encadrement humain** : la chaîne *propose → accepte/modifie/refuse* est-elle suffisante
    pour considérer l'IA comme « assistive » et non « décisionnelle » ?
15. **Logs IA** : durée de conservation, accessibilité aux autorités, droit du patient de
    consulter les sorties IA le concernant.

### Cadre commercial
16. Wording **« peut contribuer à la réputation »** : suffisant pour ne pas constituer une
    publicité trompeuse ?
17. Modalités d'annonce d'une certification HDS (quand elle sera acquise) et calendrier de
    communication.
18. Mentions obligatoires sur le site public (mentions légales, CGU, politique de
    confidentialité, cookies).

### Cas spécifiques
19. **Incident de sécurité** : procédure CNIL, délais, formulaires, communication patient.
20. **Refus du patient** (consentement non donné) : que faire opérationnellement ?
21. **Sortie du service** (chirurgien résilie son abonnement) : devenir des données patient
    historiques, archivage légal, droit à l'effacement.

### Spécifique au prototype actuel
22. Le prototype actuel (hors HDS, hors auth, données fictives) **peut-il être montré** à des
    chirurgiens en démo ? À des investisseurs ? À des prospects sans risque juridique ?
23. Faut-il un **NDA** systématique avec les chirurgiens à qui on montre le prototype ?

---

## 12. Annexes recommandées pour Aumans

À fournir à Aumans en pièce jointe de la note :
- Liste des routes du prototype (cf. `README_DEMO.md`).
- Liste des types métier (cf. `lib/types.ts` du repo).
- Schéma d'architecture cible V1 HDS (cf. `V1_HDS_ARCHITECTURE_BRIEF.md`).
- Capture d'écran de la page sécurité / cadre de la landing.
- Capture d'écran de l'onboarding patient (étapes 1 à 5).
- Capture d'écran de la fiche superviseur avec l'IA assistive en évidence.
- Capture d'écran de la mention CRM « Aucune donnée patient ».

---

## 13. Checklist juridique synthèse pour validation Aumans

> Synthèse opérationnelle des thèmes à valider lors de la revue Aumans. Complète la liste
> détaillée de la section 11.

### 13.1 Qualification du service
- [ ] Statut juridique de KOVELA (service de coordination opérationnelle non médical).
- [ ] **Absence de dispositif médical** (à formaliser).
- [ ] Position vis-à-vis du Code de la santé publique (article L4111-1 et suivants).

### 13.2 IA assistive
- [ ] **Limites de l'IA assistive** : valider que le périmètre (résumer / préparer CR /
      reformuler / compiler) reste hors champ médical.
- [ ] **AIPD (Analyse d'impact à la protection des données)** obligatoire ou non ?
- [ ] **Information patient** explicite sur l'usage d'une IA en interne.
- [ ] **AI Act européen** : catégorisation de KOVELA (a priori risque limité).
- [ ] Choix du LLM provider : DPA, transferts hors UE, BCR.

### 13.3 Wording commercial
- [ ] Validation du wording **« peut contribuer à »** pour la réputation cabinet.
- [ ] Validation du wording **« architecture cible »** / **« pensé pour »** sur HDS/RGPD/CNIL.
- [ ] Mentions interdites en communication (cf. section 7 ci-dessus).

### 13.4 Onboarding patient
- [ ] Forme suffisante du **consentement** (case à cocher + horodatage + log).
- [ ] **Information préalable** : modèle à fournir au patient.
- [ ] **Cas particuliers** : mineurs, majeurs protégés, urgences.

### 13.5 Consentements / information
- [ ] Format des consentements (catalogue : utilisation messages, photos, audios, relances,
      notifications, IA interne).
- [ ] Modalités de retrait du consentement.
- [ ] **Droit à l'effacement** : effacement physique vs anonymisation.
- [ ] **Droit à la portabilité** : format d'export.

### 13.6 HDS / RGPD / Principes CNIL
- [ ] Choix de l'hébergeur HDS et calendrier de certification fournisseur.
- [ ] Calendrier d'annonce publique du « hébergé HDS » (passage du wording prudent au wording
      affirmatif).
- [ ] Déclaration / consultation préalable CNIL si nécessaire.

### 13.7 Sous-traitants
- [ ] **DPA** signés avec : LLM provider, hébergeur HDS, Postmark / Twilio, GoCardless,
      Sentry / Datadog, Clerk si retenu.
- [ ] **Transferts hors UE** : encadrés par clauses contractuelles type ou BCR.

### 13.8 Canaux de communication
- [ ] **WhatsApp** : faisable RGPD ? (a priori non sans contrat Business + DPA).
- [ ] **SMS** : prestataire UE retenu, contenu minimisé (pas de contenu patient dans le SMS).
- [ ] **Email** : prestataire UE retenu, DPA en place.

### 13.9 Conservation des données
- [ ] Durée de conservation : **messages, photos, audios, CR, logs IA, audit log**.
- [ ] **Logs comptables / GoCardless** : 10 ans (obligation légale).
- [ ] Modalités d'archivage / purge / anonymisation après expiration.

### 13.10 Responsabilités
- [ ] **Chirurgien** : responsable médical, décisionnaire ; KOVELA prépare et trace.
- [ ] **KOVELA** : responsable de la coordination organisationnelle, de la qualité du service
      opéré, de la traçabilité.
- [ ] **Rôle superviseur** : limites strictement organisationnelles, jamais médicales.
- [ ] **Patient** : information complète, consentement éclairé, urgence relevant du 15 / 112.

### 13.11 Spécificités opérationnelles
- [ ] **Formation superviseur** : pas de revendication de certification médicale (wording
      « complétude formation interne »).
- [ ] **Compte-rendu factuel** : qualifier juridiquement la nature du document (≠ rapport
      médical, ≠ courrier confraternel).
- [ ] **Transmission au chirurgien** : matérialiser la responsabilité (notification reçue,
      lue, action).
- [ ] **Patients silencieux** : modalités de relance et de clôture, durée maximale de
      « silence opérationnel » sans escalade.

### 13.12 Photos / audios patient
- [ ] Périmètre des photos autorisées (parties opérées, pansements ; pas de photos
      d'identification, pas de captures écran).
- [ ] **Anonymisation des métadonnées EXIF** à l'upload.
- [ ] **Pas d'analyse photo** (rappel doctrine) : confirmation que ce point doit être
      explicitement écrit dans les CGU patient.

### 13.13 Logs / audit trail
- [ ] **Caractère probant** : un log immuable avec hash chaining a-t-il valeur probatoire
      auprès des autorités ?
- [ ] **Accès patient** à ses propres logs : oui / non / sur demande RGPD ?
- [ ] **Conservation** des logs après résiliation du service par le cabinet.

### 13.14 Assurance
- [ ] Assurance **RC professionnelle** KOVELA (responsabilité civile en cas d'erreur
      opérationnelle de la coordination).
- [ ] **Cyber-assurance** (incident de sécurité, fuite de données).
- [ ] **Articulation** avec l'assurance RC du chirurgien (qui couvre quoi).

### Annexes à fournir à Aumans
- Liste des routes du prototype (`docs/README_DEMO.md`).
- Liste des types métier (`lib/types.ts` du repo).
- Schéma d'architecture cible V1 HDS (`docs/V1_HDS_ARCHITECTURE_BRIEF.md`).
- Spécification IA assistive (`docs/AI_REQUIREMENTS.md`).
- Captures d'écran clés (à produire — landing sécurité, onboarding patient, fiche
  superviseur avec IA, mention CRM « Aucune donnée patient »).

