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
- **H1** : « Le suivi post-opératoire, opéré pour votre cabinet. »
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
