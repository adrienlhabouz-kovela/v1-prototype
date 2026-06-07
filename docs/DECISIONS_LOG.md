# KOVELA — Décisions validées · journée 2026-06-01

> **Statut** : canonique. Source unique de vérité pour les décisions produit et messaging
> arrêtées le 2026-06-01. Cette page consolide les arbitrages issus des passes successives
> de la journée. Les autres documents (`README.md`, `PRODUCT_SCOPE.md`, `AI_REQUIREMENTS.md`,
> `README_DEMO.md`) sont alignés sur ce fichier.
>
> **Branche de référence** : `claude/eloquent-darwin-wwVME`
> **Dernier commit produit** : `3c9bf22`

---

## 1. Landing V1 validée

**Statut** : **Landing KOVELA V1 validée**. Commit de référence : `3c9bf22`.

### Positionnement validé
- Service opéré premium
- Suivi post-opératoire structuré
- Supervision humaine
- Référentiel cabinet
- Comptes-rendus factuels
- IA assistive
- Chirurgien garde la main
- KOVELA organise le flux

### Phrases canoniques (à ne pas modifier sans décision explicite)
- **H1** : « Votre suivi post-opératoire, structuré et opéré. »
- **Sous-titre** : « Supervision humaine, référentiel cabinet, comptes-rendus factuels et IA assistive. Le chirurgien garde la main, KOVELA organise le flux. »
- **Tagline IA** : « L'IA prépare. L'humain valide. Le chirurgien décide. »
- **Baseline terrain** : « 60 à 90 minutes de travail humain par patient, sur 3 à 15 jours selon l'intervention. »
- **Mention prudente baseline** : « Aucun gain chiffré n'est promis à ce stade. »
- **Cadre sécurité** : « Architecture cible — aucune certification revendiquée à ce stade. »

### Règle de gel
La landing ne doit plus être modifiée, sauf :
- bug ;
- correction légale ;
- ajout de preuve sociale réelle (vérifiable) ;
- ajout d'un slot Calendly ;
- amélioration mineure explicitement validée.

---

## 2. Pricing landing validé

### Pricing KOVELA — référence unique

```
690 € HT / mois
  = accès mensuel au service opéré KOVELA
  = facturé le 1er du mois

+

80 € HT / patient activé
  = part variable d'usage
  = facturée en fin de mois selon les patients réellement suivis
```

**Définition canonique** : *Patient activé = onboarding validé + suivi lancé.*

### Règles d'écriture (à appliquer partout)
- **Ne jamais utiliser** 50 € / patient (ancienne hypothèse).
- **Ne pas parler** d'abonnement SaaS.
- **Ne pas parler** de forfait illimité.
- **Ne pas parler** de patients illimités.
- **Ne pas présenter** le fixe comme un simple abonnement logiciel.
- Le **fixe** donne accès au service. Le **variable** suit l'usage réel.

### Angle pricing validé
- **H2 section tarif** : « Moins qu'un mi-temps. Plus qu'un outil. »
- **Sous-titre** : KOVELA donne accès à une organisation post-opératoire structurée, sans créer un poste supplémentaire dans le cabinet.
- **Phrase clé (pied de card)** : « Le fixe donne accès au service. Le variable suit l'usage réel. »

### Justification
KOVELA est une alternative opérationnelle plus rationnelle qu'un poste interne dédié, car le cabinet accède à :
- une méthode ;
- une équipe ;
- une interface ;
- un référentiel ;
- des messages programmés ;
- des transmissions cabinet ;
- des comptes-rendus factuels ;
- une continuité de service ;
- une facturation alignée sur l'usage réel.

### Arguments de conversion
Le cabinet évite :
- la création d'un poste dédié ;
- la recherche de profil ;
- le recrutement ;
- l'intégration / montée en compétence d'une ressource interne dédiée ;
- la gestion congés / absences / remplacements ;
- le management quotidien ;
- une charge fixe indépendante du volume patient.

### Nuance importante
KOVELA **ne forme pas** le staff du cabinet. KOVELA permet au cabinet **d'éviter de devoir recruter, intégrer, former et manager une ressource interne dédiée au suivi post-opératoire**.

---

## 3. Wording validé / wording interdit

### Wording interdit (à ne plus utiliser, vérifié au grep en V1)

**Économique / commercial**
- « réputation maîtrisée », « image maîtrisée »
- « 5 à 7 minutes » (onboarding)
- « 50 € / patient »
- « abonnement SaaS »
- « forfait illimité »
- « patients illimités »
- « sur devis » (section pricing)
- « gratuit » (lié au pricing)
- « KOVELA remplace l'assistante »
- « KOVELA remplace le cabinet »

**Médical / clinique** (interdit partout)
- diagnostic
- avis médical
- analyse médicale
- interprétation clinique
- validation médicale
- décision médicale
- tri clinique
- surveillance médicale
- IA autonome

### Wording validé (à privilégier)
- « Le cabinet absorbe le bruit »
- « Sollicitations dispersées / non structurées »
- « Transmission cabinet »
- « Validation humaine »
- « CR factuel »
- « Disponible chirurgien »
- « Qualité perçue du suivi »
- « Expérience patient mieux structurée »
- « Le fixe donne accès au service. Le variable suit l'usage réel. »
- « Le chirurgien garde la main »
- « KOVELA organise le flux »

---

## 4. Onboarding chirurgien réaligné

### Décision temps annoncé
- **15 min** · mise en place initiale (page `/chirurgien/onboarding`).
- **30–60 min** · référentiel essentiel accompagné par KOVELA.
- Démarrage sur **2 ou 3 interventions prioritaires**.

### Objectif
Être honnête sur l'effort demandé au chirurgien et éviter toute promesse « 5 minutes » incohérente.

### Positionnement
- Mise en place accompagnée.
- Pas de logiciel à configurer seul.
- KOVELA aide à formaliser le fonctionnement cabinet.

---

## 5. Référentiel chirurgien sécurisé

### Rôle
Le référentiel sert à transformer la manière de travailler du chirurgien en règles opérationnelles simples pour l'équipe KOVELA.

### Décisions
- Il est généralement complété **avec KOVELA**.
- Il démarre sur **2 ou 3 interventions prioritaires**.
- Il est **relu avant tout usage opérationnel**.
- Rien ne doit être utilisé opérationnellement sans relecture KOVELA.

### Statuts référentiel (chaîne validée)
```
Brouillon → À relire avec KOVELA → Validé KOVELA → Actif
```

### Garde-fous wording (`MedicalGuard` sur 10 textareas sensibles)
- Encart de cadrage permanent : « À renseigner sous forme de règles opérationnelles. Ne pas saisir de prescription, diagnostic, conseil médical personnalisé ou interprétation clinique. KOVELA relit ce référentiel avant usage. »
- Warning soft (amber) si mots-clés détectés : prescription, ordonnance, antibiotique, dose, diagnostic, infection, complication, urgence médicale, traitement, médicament, arrêter, commencer, modifier.
- L'utilisateur n'est **jamais bloqué** — la relecture KOVELA reste obligatoire.

### Interdits dans le référentiel
- Pas de prescription.
- Pas de diagnostic.
- Pas de conseil médical personnalisé.
- Pas d'interprétation clinique.

---

## 6. Workflow CR validé

### Chaîne canonique
```
IA prépare / préremplit le brouillon
  → superviseuse relit
  → superviseuse corrige si nécessaire
  → superviseuse valide
  → CR disponible côté chirurgien
```

### États / wording validés
- Aucun CR préparé
- Brouillon IA préparé
- À relire
- À corriger
- Validé KOVELA
- Disponible chirurgien
- CR en retard de validation
- CR en file de validation

### Règles d'écriture
- **Ne pas dire** « CR en retard » seul.
- **Dire** « CR en retard de validation » ou « CR non disponible dans le délai attendu ».
- **Ne pas parler** de « validation médicale ».
- Le chirurgien **consulte** un CR factuel.
- KOVELA **ne donne pas** d'avis médical.

---

## 7. Modale brouillon CR

### Doctrine UX
La modale « Préparation du brouillon de CR » doit montrer que :
1. L'IA prépare une synthèse factuelle structurée.
2. La superviseuse relit.
3. La superviseuse vérifie les points clés.
4. La superviseuse valide.
5. Le CR devient disponible chirurgien.

### Structure validée
- A. Résumé patient (patient, intervention, période, chirurgien, statut CR)
- B. Brouillon CR factuel structuré, en sections :
  - Messages principaux
  - Relances effectuées
  - Actions KOVELA
  - Transmission cabinet
  - Statut final
- C. Checklist avant validation (5 items)
- D. Rappel doctrine (encart amber)

### Boutons validés
- **Primary** : « Relire et valider »
- **Secondary** : « Modifier le brouillon »
- **Ghost** : « Rejeter »

### Wording à éviter dans cette modale
- « Accepter » (préférer « Relire et valider »)
- « escalade » visible côté utilisateur
- « Continuité post-opératoire assurée »

---

## 8. Messages programmés patient

### Objectif
Prévoir les messages de suivi récurrents pour structurer le contact patient. **Aucun envoi réel** en production dans le prototype.

### Types de messages
- Début de suivi
- Point de suivi
- Photo attendue
- Relance patient silencieux
- Pré-clôture
- Clôture

### Principes
- Pas d'envoi réel externe dans le prototype.
- Validation humaine / action superviseuse.
- Messages sobres, humains, non médicaux.
- Rappel 15 / 112 **uniquement** en cas de situation urgente ou inquiétante, selon le wording validé.
- Pas de diagnostic.
- Pas d'interprétation médicale.
- Pas de conseil médical.

---

## 9. Interface superviseur — décisions UX

### Pages concernées
- `/superviseur` (inbox)
- `/superviseur/patient/[id]` (fiche)

### Décisions validées
- Inbox **action-first**.
- Statuts opérationnels par groupes d'action.
- Prochaine action visible sur chaque carte patient.
- J+ visible.
- Délai / retard visible.
- Référentiel applicable visible dans la fiche patient.
- CR factuel visible dans la fiche.
- IA repliée par défaut.
- Notes et logs repliés.
- Transmission cabinet moins visible sauf action en cours.
- Messages programmés ajoutés.
- Badge « Retard Xh / Xj ».
- Wording « CR en file de validation » / « CR en retard de validation ».

### Statuts / groupes superviseur (chaîne validée)
1. À traiter maintenant
2. À relancer
3. CR & transmissions cabinet
4. En attente cabinet
5. Suivi habituel
6. Clôture à préparer

### Doctrine superviseur
KOVELA documente, transmet, **ne décide pas médicalement**.

---

## 10. Interface Head of Care / Supervision Care

### Architecture produit
| Route | Rôle |
|---|---|
| `/admin` | Cockpit CEO / investisseur |
| `/admin/supervision` | Vue Head of Care / Supervision Care |
| `/superviseur` | Poste de travail superviseuse |
| `/chirurgien` | Interface cabinet / chirurgien |

### Rôle Head of Care (responsabilités opérationnelles)
- Piloter les superviseuses.
- Suivre la charge.
- Suivre les CR en file de validation.
- Suivre les retards de validation.
- Suivre les transmissions cabinet.
- Contrôler la qualité.
- Rééquilibrer la charge.
- Identifier les besoins de formation / amélioration continue.
- Superviser les référentiels à relire.

### Décision architecture
**Ne pas créer une nouvelle route maintenant.** Transformer / renforcer `/admin/supervision` comme vue Head of Care.

---

## 11. Admin / cockpit / unit economics

### Architecture
`/admin` = cockpit CEO / investisseur.

### Volumes (3 niveaux distincts)
- **Volume actuel prototype** = données seed.
- **Proof case 5 × 20** = palier opérationnel (100 patients/mois).
- **Simulation scale 45 × 25** = potentiel mature (1125 patients/mois).

**Règle** : ne jamais présenter 5 × 20 comme volume cible (c'est un palier de validation).

### Unit economics
- **Unit economics care = à valider en pilote.**
- La marge care dépend du temps humain / patient.
- **Baseline terrain V0** : 60–90 min / patient.
- Hypothèses à mesurer en pilote :
  - V1 interface outillée
  - V1 IA assistive
  - V2 optimisée

### Coûts care à renseigner par poste
- Superviseuses
- Lead / Head of Care
- QA care
- Coûts directs patients
- Outils care
- Messagerie / notifications / WhatsApp
- Back-up / remplacement si applicable

### Règle KPI executive
**Ne pas afficher** une marge négative proof case en executive headline.
Le KPI executive doit rester : **« Unit economics care — à valider. »**

---

## 12. Acquisition / RevOps / Malt

### Décision
Chercher sur Malt un expert RevOps / Growth B2B / Sales Ops. **Ne pas acheter une exécution** avant d'avoir testé l'approche.

### Objectif mission
Audit stratégique court (1 à 2 jours).

### Sujet
Construire le système : **lead chirurgien → qualification → RDV → call → onboarding cabinet → premiers patients actifs → rétention**.

### Critères de sélection
- Comprend le B2B santé premium.
- Ne propose pas du scraping massif.
- Parle de funnel lead → chirurgien actif.
- Parle de CRM, scoring, KPI.
- Parle d'activation cabinet et premiers patients.
- Comprend l'approche qualitative.
- Évite le cold email agressif.

### Budget envisagé
800 à 1 500 € selon profil et livrable.

### Posture
Demander leur approche en 5 points avant call. Pas d'audit gratuit complet exigé.

---

## 12bis. Activation cabinet — décision P0

**Statut** : intégrée prototype le 2026-06-03. Spec canonique :
[`CABINET_ACTIVATION_FLOW.md`](./CABINET_ACTIVATION_FLOW.md).

**Décision** : **pas d'inscription libre**. Tout chirurgien KOVELA doit passer par le
parcours canonique CRM → call → accord verbal → **lien d'activation cabinet
personnalisé** → onboarding accompagné → référentiel relu KOVELA → cabinet actif.

**Implémentation prototype** :
- Nouvelle route `/chirurgien/activation/[token]`.
- 4 LogKinds : `activation_link_generated`, `activation_link_copied`,
  `activation_link_opened`, `activation_onboarding_lance`.
- Sous-objet `Prospect.activation: ProspectActivation` portant la chronologie.
- Modale CRM « Lien d'activation cabinet généré » avec URL copiable + timeline statut.
- Banner « Mode démo » sur `/chirurgien/onboarding` si arrivée hors parcours activation.

**Wording validé** : Activer votre espace KOVELA · Finaliser votre accès cabinet ·
Démarrer la mise en place accompagnée · Compléter votre activation cabinet.
**Wording interdit** : s'inscrire · créer un compte gratuitement · essai gratuit ·
commencer seul · self-service.

**À rendre réel en V1 pilote** (cf. CABINET_ACTIVATION_FLOW.md § 5–6) : JWT signé,
TTL 7j, redemption unique, email transactionnel DPA, auth chirurgien Clerk/Auth.js,
audit trail BDD append-only, révocation manuelle, KPI conversion CRM.

---

## 13. Prochaines priorités produit

### Priorité immédiate · Inbox superviseur scalable
La landing est désormais figée. La prochaine vraie priorité produit est :

- Recherche patient / chirurgien / intervention.
- Filtres statut.
- Filtres retard.
- Filtres J+.
- Tri par urgence opérationnelle.
- Tri par prochaine action.
- Séparation CR brouillon IA / CR à relire / CR à rendre disponible.
- Capacité à gérer **60 / 80 / 120 patients par superviseuse**.

### Pourquoi
Cette brique soutient directement :
- la capacité superviseuse,
- le temps humain / patient,
- la marge care,
- la preuve de scalabilité.

### Priorité suivante
Renforcer `/admin/supervision` comme cockpit Head of Care.

---

## 13bis. Renforcement landing — Cadre opérationnel + Construit avec exigence

**Statut** : intégré landing le 2026-06-03 (suite à l'audit Hippocratic AI + réassurance).

**Décisions** :
- Section H « Un cadre clair » → renommée **« Cadre opérationnel KOVELA »**.
- Sous-titre : « Une architecture de confiance pensée pour structurer le suivi sans jamais
  se substituer au chirurgien. »
- **3 piliers visuels** : Humain · IA encadrée · Traçabilité (4 items chacun).
- Phrase doctrine : « KOVELA ne remplace pas le chirurgien. KOVELA structure, documente et
  transmet. »
- Cards Site public / Application métier cible conservées.

**Nouvelle section « Construit avec exigence »** (avant CTA final) — 4 piliers réassurance :
- **Fondateur** : Adrien Lhabouz, entrepreneur et cofondateur de Trecento Asset Management.
- **Chirurgiens** : conçu à partir de retours terrain de chirurgiens esthétiques privés.
- **Doctrine** : IA assistive, validation humaine, chirurgien décisionnaire.
- **Produit** : prototype complet, déjà démontrable.
- Bande **« Preuve d'exécution »** sobre en pied : activation cabinet · parcours chirurgien
  · espace superviseur · suivi patient · workflow CR · cockpit admin.

**Wording verrouillé** : pas de « Safety Layer » en H1 (préfère « Cadre opérationnel KOVELA »).
Pas d'« advisory board », pas de chiffre non vérifié, pas de « leader healthtech », pas de
« expert IA / médical », pas de claim « IA sûre » / « surveillance médicale » /
« certifié HDS ».

**Ajout 2026-06-03 (audit chirurgiens Gemini + ajustement ton)** :
- Bloc « Qui supervise ? » dans la section Cadre opérationnel KOVELA, formulation
  valorisée : **« Une équipe de coordination post-opératoire formée au cadre KOVELA »**
  (préféré à « superviseurs opérationnels » seul, qui peut sonner industriel). Suivi
  de : « Elle n'interprète pas. Elle applique un cadre, trace les échanges et prépare
  une information exploitable pour le cabinet. »
- Phrase accès patient dans la section Fonctionnement, version courte et confiante :
  **« Le patient accède au suivi via un lien sécurisé, sans application à télécharger. »**
- **Ton HDS / RGPD repositionné comme construction, pas comme excuse** :
  - **Badges hero (3 chips)** : « Service opéré · pas un logiciel » · « IA assistive ·
    jamais autonome » · « Construit avec des chirurgiens ». Les chips HDS / RGPD ont été
    retirés de la rangée (jugés noyés) et remplacés par un **bloc trust HDS + RGPD
    horizontal premium** situé sous les CTAs hero (fond white/[0.04] + border teal-400/25,
    « HDS + RGPD » en font-display 22 px, sous-ligne « Conçus dans l'architecture dès le
    premier jour. », explicatif court « Environnement santé, consentement patient,
    traçabilité des actions et rôles séparés. »). Pas de logo officiel, pas de tampon.
  - Bloc valeur (section Cadre opérationnel) : « **HDS / RGPD dès la conception.** KOVELA
    est construit dès le départ pour être opéré dans un environnement HDS, avec consentement
    patient, traçabilité des actions, séparation stricte des rôles et documentation RGPD. »
  - Note discrète en pied : « Prototype de démonstration — hébergement production,
    certification et documentation juridique finalisés avant tout usage réel. Ce site est
    un démonstrateur : aucune donnée patient n'y est collectée. »
- **Vocabulaire interdit conservé** : ne pas écrire « certifié HDS », « conforme HDS »,
  « HDS certifié », « 100 % conforme RGPD », « validé CNIL », « superviseur médical »,
  « soignant », « infirmier », « coordinateur médical », « rassure médicalement »,
  « tri médical », « opérateurs » (trop industriel pour le rôle équipe coordination).
- **Audit chirurgiens Gemini V2 (2026-06-03)** : les deux objections « qui sont les humains
  côté KOVELA ? » et « comment le patient accède au suivi ? » sont confirmées couvertes par
  les ajouts en place (bloc « Qui supervise ? » + phrase accès patient l. 374). Cible
  chirurgie esthétique privée conservée (pas d'ouverture orthopédie / ORL / ophtalmo).
- **Audit chirurgiens (2026-06-03 · suite)** : bloc « Qui supervise ? » enrichi avec un
  titre **« Une supervision issue du terrain. »** et une description des profils :
  « profils senior issus du bloc, du cabinet ou du suivi patient — aides opératoires
  expérimentées, infirmières ou coordinatrices de parcours — formés au référentiel KOVELA
  et aux limites non médicales du service. » Mention prudente : les profils listés sont
  des **exemples** de profils possibles, pas un standard obligatoire. Le rôle reste
  strictement non médical (« Ils ne diagnostiquent pas, ne prescrivent pas et
  n'interprètent pas »).

---

## 13ter. Renforcement parcours chirurgien (2026-06-03)

Suite à l'audit chirurgiens Gemini : passage d'un beau prototype de suivi à un prototype
qui montre la **tuyauterie opérationnelle d'un service post-opératoire réel**.

### Fiche patient chirurgien (`/chirurgien/patient/[id]`)
- **Référentiel actif** affiché en haut de fiche : intervention + nom chirurgien + badge
  « version validée KOVELA ». Montre que KOVELA applique le cadre du chirurgien.
- **Banner clôture** : si statut patient = `cloture`, banner sobre « Suivi KOVELA clôturé ·
  dossier archivé · Patient renvoyé vers son suivi habituel cabinet ».
- **Bouton export CR** désactivé avec label « Exporter le CR factuel (PDF prévu en V1) ».
- **Journal d'action** : nouvelle Card avec timeline horodatée des étapes opérationnelles :
  - Transmission cabinet préparée par KOVELA (réel · escalation.openedAt)
  - Transmission cabinet envoyée (réel · escalation.transmittedAt)
  - Transmission ouverte par le cabinet ou « En attente de lecture cabinet » (**mock simulé
    prototype** · marqué explicitement « Statut simulé · affichage opérationnel en V1 »)
  - CR factuel rendu disponible chirurgien (réel · report.updatedAt)
  - Suivi KOVELA clôturé · dossier archivé (réel si patient.status = cloture)
- Renommages : « Compilation factuelle d'escalade » → « **Transmission cabinet** » ;
  « CR disponible pour le chirurgien » → « **CR disponible chirurgien** ».

### Dashboard chirurgien (`/chirurgien`)
- **KPIs réordonnés** dans l'ordre utile chirurgien : Transmissions cabinet (accent) · CR
  factuels disponibles · Patients en suivi · Interventions à venir · Onboardings à compléter.
- **Liste patients** : badge « Escalade reçue » renommé en « **Transmission cabinet** » ;
  « CR disponible » → « **CR factuel disponible** ».

### Limites prototype assumées
- Statut « lecture cabinet » : **mock** dérivé d'un délai depuis transmittedAt (si > 1h →
  « ouvert » simulé +13 min, sinon « en attente »). Aucune vraie notification envoyée.
- Marqué explicitement « Statut simulé · affichage opérationnel en V1 » dans la timeline.
- Bouton export CR : désactivé avec mention « PDF prévu en V1 ».

### Wording ajouté
synthèse factuelle · CR factuel · transmission cabinet · information à revoir par le
cabinet · notification cabinet · référentiel actif · journal d'action · horodatage · suivi
clôturé · dossier archivé · retour au suivi habituel cabinet.

### Wording évité (0 occurrence)
synthèse clinique · patient à risque · tri médical · surveillance médicale · constantes ·
urgence validée · alerte critique · rapport médical · compte-rendu médical · bouclier
médico-légal · preuve juridique garantie · responsabilité couverte · décharge médicale ·
fin de surveillance médicale.

### À rendre réel en V1 (cf. TECHNICAL_NOTES.md § 0)
- Vraies notifications cabinet (email transactionnel + SMS si DPA validé).
- Audit trail BDD append-only avec accusé de lecture réel.
- Export PDF du CR factuel (template versionné).
- Logique de clôture du suivi avec archivage CRM.
- Accès rapide praticien sur iPad / mobile : passkeys (WebAuthn) / FaceID / TouchID si
  possible, OTP sécurisé en fallback, session persistante avec re-auth périodique.

---

## 13quater. Horaires du service V1 (2026-06-03)

### Décision opérationnelle
- **V1 KOVELA ne promet pas de H24.** Le service opéré est prévu sur une **plage
  quotidienne élargie**, typiquement **8h–19h ou 8h–20h**, à valider avec le cabinet.
- **Hors horaires** : les messages patient sont **conservés** et **repris à
  l'ouverture du service**. Les situations urgentes restent orientées vers les
  **contacts d'urgence définis par le chirurgien** + **15 / 112**.
- **V2** : option patient **payante** de suivi étendu / plus long / éventuellement H24
  sur certaines périodes — **à ne pas survendre en V1**.

### Wording validé
- « plage quotidienne élargie »
- « service opéré en journée élargie »
- « messages conservés hors horaires »
- « reprise à l'ouverture du service »
- « consignes urgence du chirurgien »
- « 15 / 112 / urgences selon le cadre défini »
- « option de suivi étendu en V2 »

### Wording interdit (audit grep landing + lib + components : 0 occurrence)
- « H24 » en promesse V1
- « 24/7 »
- « supervision nocturne », « supervision continue », « supervision permanente »
- « urgence validée » par KOVELA
- « tri médical » / « pré-analyse médicale » / « pré-qualification médicale »
- « urgence prise en charge par KOVELA »

### Intégrations produit
- **Landing** (`app/page.tsx`) · bloc « Qui supervise ? » de la section Cadre opérationnel
  KOVELA : ajout d'une note encadrée discrète « Horaires du service · KOVELA opère le
  suivi sur une plage quotidienne élargie, définie avec le cabinet — par exemple 8h–20h.
  Hors horaires, les messages sont conservés et repris à l'ouverture du service ; les
  situations urgentes restent orientées vers les contacts d'urgence définis par le
  chirurgien. »
- **Messagerie patient** (`app/patient/messages/page.tsx`) · sous le bloc « Quand
  utiliser ce canal vs le 15 / 112 ? » : ajout d'une ligne « Hors horaires KOVELA, votre
  message sera repris à l'ouverture du service. En cas d'urgence, contactez le 15 / 112
  ou les contacts d'urgence transmis par votre cabinet. »

### À ne pas complexifier maintenant
- Pas de logique technique de fermeture / ouverture du service en prototype.
- Pas de variantes V2 (« option étendue », « H24 ponctuel ») dans la landing tant que
  l'offre commerciale V1 n'est pas calée avec les premiers cabinets pilotes.

---

## 13quinquies. Renforcement UX superviseur — poste de travail opérationnel (2026-06-03)

Suite à l'audit terrain : la fiche superviseur était structurée en 3 colonnes mais
manquait 4 éléments d'orientation action.

### Fiche patient superviseur (`app/superviseur/patient/[id]/page.tsx`)
- **Référentiel actif** déplacé / dupliqué en zone gauche (haut), en encadré teal-50/40,
  avant le « Contexte patient » : « Référentiel actif · {intervention} · {chirurgien} ·
  {version} ». Le bloc « Référentiel applicable » à droite est conservé pour le détail.
- **Bouton « Contacter le cabinet »** ajouté dans la Card « Action recommandée » (zone
  droite), variant secondary, sous une fine bordure. Ouvre une nouvelle modale
  **« Transmission cabinet »**.
- **Modale « Transmission cabinet »** : destinataire (chirurgien + cabinet + contact
  prioritaire) + message factuel pré-rempli (patient en initiales, intervention, J+,
  3 derniers messages patient comme « Éléments déclarés », demande d'action neutre,
  signature « KOVELA — transmission factuelle, sans interprétation médicale »).
  Boutons : Copier le message + Ouvrir WhatsApp ↗ (lien `wa.me` prototype). Encart
  amber « Prototype · canal réel à valider en V1 selon cadre RGPD / HDS ».
- **Bloc doctrine « 15 / 112 / urgences clinique »** ajouté entre Action recommandée
  et Référentiel applicable, sobre amber. Rappelle que KOVELA ne prend pas en charge
  les urgences et que le patient doit contacter 15 / 112 / urgences clinique / cabinet.
- **Journal d'action (Logs)** : ouvert par défaut (`showLogs = true`) au lieu de replié.

### Inbox superviseur (`lib/supervisor.ts`)
Labels et hints des 6 groupes opérationnels alignés avec le brief :
- « À relancer » → « **Patients sans réponse** »
- « CR & transmissions cabinet » → « **CR & transmissions à traiter** »
- « Suivi habituel » → « **Suivis du jour** »
- « Clôture à préparer » → « **Clôtures à finaliser** »
- Hints reformulés en mode plus actionable.

### Wording verrouillé (0 occurrence dans app/superviseur + lib/supervisor.ts)
escalade médicale · tri médical · surveillance médicale · patient à risque · urgence
gérée par KOVELA · décision médicale · interprétation médicale · validation médicale ·
synthèse clinique. (« diagnostic » et « prescription » apparaissent uniquement dans
un commentaire interdisant l'usage et dans une liste de motifs de transmission
cabinet — situations patient, pas actes KOVELA.)

### WhatsApp / canal cabinet
Le bouton « Ouvrir WhatsApp ↗ » est marqué **(prototype)** et l'encart amber précise :
« canal réel à valider en V1 selon cadre RGPD / HDS et contrat de service ». WhatsApp
n'est jamais présenté comme le canal conforme définitif.

### À rendre réel en V1 (cf. TECHNICAL_NOTES.md § 0)
- Notifications cabinet réelles (email DPA UE, SMS Twilio).
- Audit trail BDD append-only (journal d'action signé).
- Intégration canal cabinet validée juridiquement (WhatsApp Business + DPA, ou autre).
- Confirmation de lecture cabinet (accusé réel, pas mock).

---

## 13sexies. Refonte UX/UI superviseur — poste de travail opérationnel (2026-06-06)

**Contexte.** Le commit `435a70d` puis la refonte `6fbaf0a` (architecture cockpit + grille 3/6/3) ont posé la structure. Cette passe rend la page réellement opérationnelle : densité décisionnelle, scan en 5 secondes, données opérationnelles métier (durée suivi 3-12j, cible humaine ~1h/patient).

**Données opérationnelles intégrées (visibles UI) :**

- Suivi KOVELA = 3 à 12 jours selon intervention → bandeau patient affiche `Fenêtre prévue J0 → J+N`.
- Cible humaine ~1h par patient sur l'ensemble du suivi → bandeau patient affiche `cible temps humain ~1h · consommé ~XX min (estimation prototype)`.
- Chaque minute perdue dans l'interface détruit la marge → priorisation 1 action / patient, action recommandée visible en 5s.

**Améliorations dashboard `/superviseur` :**

- `HeroPatientRow` : preview du dernier message patient sous forme de citation (`« ... »`) — la superviseuse sait quoi répondre sans ouvrir la fiche.
- `À traiter maintenant` reste la zone dominante, mais chaque ligne contient désormais : initiales · nom · J+ · intervention · chirurgien · raison de priorité · dernier événement (temps) · dernier message patient (citation) · action attendue · bouton Ouvrir.

**Améliorations fiche `/superviseur/patient/[id]` :**

- Bandeau patient : ajoute `Fenêtre prévue J0 → J+N · cible temps humain ~1h · consommé ~XX min (estimation prototype)`.
- Timeline conversation : chaque carte est désormais visuellement distinguée par type :
  - Message patient → fond ambre + eyebrow « Message patient ».
  - Réponse KOVELA → fond teal + eyebrow « Réponse KOVELA ».
  - Note interne → fond navy léger + eyebrow « Note interne ».
  - Transmission cabinet → fond navy fort + eyebrow « → Cabinet ».
  - Compilation préparée → fond ambre + eyebrow « Compilation préparée ».
  - CR brouillon / validé / publié → fond teal + eyebrow CR.
- Quick-actions sur les messages patient dans la timeline :
  - `→ Transmission cabinet` : ouvre la modale Transmission cabinet préchargée selon référentiel.
  - `Marquer documenté` : passe le message en traité sans réponse.
- Onglet CR : ajout d'un bouton désactivé `Export PDF prévu en V1` (signale la roadmap sans promettre).
- Onglet Journal : ajout d'un bandeau `Journal d'action prototype — audit trail réel prévu en V1` (cadre l'attente).
- Rappel `15 / 112 / urgences clinique` reste sous le composer, sobre, non invasif.

**Wording :**

- Aucune réintroduction du mot « escalade » en surface UI.
- Aucune formulation médicale risquée (tri médical / surveillance médicale / patient à risque / urgence gérée par KOVELA / synthèse clinique / rapport médical / preuve juridique / bouclier médico-légal — tous absents).
- Wording autorisé utilisé partout (transmission cabinet, éléments déclarés par le patient, CR factuel, journal d'action, à revoir selon référentiel, patient sans réponse selon référentiel).
- WhatsApp reste explicitement marqué `prototype` + bandeau `Aucun envoi réel — canal réel à valider en V1 selon cadre RGPD / HDS`.

**Pricing.** Intact (690 € HT / mois + 80 € HT / patient activé).

**Périmètre non touché.** Landing, deck, BP, CRM commercial, activation cabinet, espace chirurgien, interface patient.

---

## 13septies. Refonte structurelle colonne droite fiche patient (2026-06-07)

**Contexte.** Malgré les passes précédentes, la colonne droite restait organisée en 5 onglets de poids visuel égal (Actions · Transmissions · CR · Notes · Journal). La hiérarchie d'action n'était pas immédiatement visible — la superviseuse devait cliquer entre onglets pour voir l'état du dossier.

**Décision.** Supprimer les 5 onglets égaux. Remplacer par un **panneau d'action vertical hiérarchisé** en 5 blocs empilés selon la priorité opérationnelle :

1. **Action principale** — CTA dominant + délai + messages programmés (jusqu'à 2 + Voir tout).
2. **Cabinet** — Contacter le cabinet + pipeline statut 3 étapes (Préparée → Copiée → Envoyée (proto)) + boutons Préparer compilation / Transmettre + référentiel applicable (4 catégories) en details replié.
3. **CR factuel** — statut + brouillon + Relire/valider · Marquer prêt pour chirurgien · Copier · Export PDF prévu en V1 (désactivé).
4. **Suivi** — fenêtre + progression + Clôturer le suivi (modale confirm).
5. **Notes / Journal** — mini-tabs au pied du panneau (visuellement secondaires). Notes affichées avec **style très distinct** (fond navy léger, bord pointillé, tag ✦ Note interne) pour qu'elles ne soient jamais confondues avec une réponse patient.

**Bénéfices.**
- Hiérarchie d'action visible immédiatement — plus besoin de chercher dans un onglet.
- Pipeline transmission cabinet visible en permanence dans le bloc Cabinet.
- Notes internes visuellement distinctes des messages envoyés (sécurité d'usage).
- Journal d'action toujours accessible mais relégué au pied (visuellement secondaire).

**Dashboard /superviseur.** Le tier 1 (transmissions cabinet · sans réponse · retours cabinet) reste prioritaire visuellement. Le tier 2 (suivis habituels · clôtures) reste plus compact. État de charge calculé en temps réel dans le header.

**Wording.** Aucune réintroduction de terme interdit. Pipeline transmission affiche "Envoyée (proto)" pour préserver la mention prototype dans l'UI même condensée. WhatsApp toujours marqué prototype dans la modale + bandeau RGPD/HDS renforcé.

**Pricing intact** (690 € + 80 €). Périmètre landing / deck / BP / CRM / activation cabinet / chirurgien non touché.

---

## 14. Éléments locked (à ne plus toucher sans décision explicite)

- Landing V1
- H1 landing
- Pricing 690 € HT / mois + 80 € HT / patient activé
- Section modèle économique
- Tagline IA
- Baseline terrain
- Doctrine non médicale
- Wording « service opéré »
- Section IA assistive
- Cadre « architecture cible — aucune certification revendiquée à ce stade »
- Workflow CR : IA → humain → chirurgien
- Référentiel avec relecture KOVELA obligatoire
- Unit economics care = à valider en pilote
- Parcours activation cabinet (pas d'inscription libre · lien personnalisé après qualification) — cf. § 12bis et `CABINET_ACTIVATION_FLOW.md`

---

## Historique commits produit · journée 2026-06-01

| Commit | Apport |
|---|---|
| `66e2797` | Refonte premium landing · structure A → J |
| `1d634c6` | Micro-passe wording landing (réputation, escalade, désordonnées, fourchette) |
| `7d2bdf9` | Tarification premium « Moins qu'un mi-temps. Plus qu'un outil. » + 690 € / 80 € |
| `20d7e4b` | Finition wording pricing (formation initiale, congés/absences, mention prudente) |
| `3c9bf22` | P0/P1 audit landing : « cabinet absorbe le bruit » + supervision compacte + preuve terrain |

Antérieurs (mêmes thèmes, conservés pour traçabilité) :
- `bc30676` Parcours chirurgien : temps honnête + garde-fous référentiel + wording landing.
- `f02f33e` Modale brouillon CR refondue (structure A/B/C/D + boutons « Relire et valider »).
- `3e7bc33` CR wording : workflow IA → superviseuse → chirurgien.
