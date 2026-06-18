# KOVELA — Besoins IA assistive (V1 & cible)

> **Dernière mise à jour** : 2026-06-01 · **Référence décisions** : [`DECISIONS_LOG.md`](./DECISIONS_LOG.md) ·
> **Commit landing V1** : `3c9bf22`.
>
> **Public visé** : lead dev V1, DPO, avocat e-santé (Aumans), Head of Care.
> **Statut** : spécification fonctionnelle et architecturale de l'IA assistive — à valider
> juridiquement avant développement.
> **Doctrine produit (rappel)** : *« KOVELA ne décide pas médicalement. L'IA est assistive,
> interne, loggée et human-in-the-loop. »*
>
> **Note wording** : le mot « escalade » est conservé ici comme **terme technique interne**
> (enum `compilation_escalade`, logs IA). Côté UI utilisateur et côté démo, on parle de
> **« transmission cabinet »** ou **« compilation factuelle pour transmission cabinet »**.

---

## 1. Fonctions IA assistive V1

Les **5 fonctions** suivantes constituent le périmètre IA pour la V1. Toutes sont **internes**
à l'équipe KOVELA, **jamais exposées directement au patient**.

### 1.1 Résumé opérationnel des échanges
- **Entrée** : historique des messages d'un patient (texte + métadonnées d'attachements,
  jamais le contenu binaire).
- **Sortie attendue** : synthèse factuelle courte structurant les derniers échanges + les
  actions déjà réalisées + les pièces jointes disponibles.
- **Wording obligatoire** : *« Résumé opérationnel des échanges »* — **jamais** *« résumé
  clinique »*.
- **Usage** : aide au superviseur pour rappeler le contexte d'un patient en quelques
  secondes.
- **Temps estimé gagné** : ~1 min 30.

### 1.2 Préparation de compte-rendu factuel
- **Entrée** : messages principaux + relances + actions KOVELA réalisées sur la période.
- **Sortie attendue** : brouillon de CR structuré (patient, période, messages principaux,
  relances, actions KOVELA, **transmission cabinet**, statut final à compléter).
- **Wording obligatoire en sortie IA** : *« Brouillon IA — à relire, corriger si besoin, puis
  valider (KOVELA) »* — **jamais** *« Compte-rendu médical automatique »*.
- **Modale UX validée** (cf. `DECISIONS_LOG.md` § 7) :
  - **Structure** : A. Résumé patient · B. Brouillon CR factuel structuré (Messages
    principaux, Relances, Actions KOVELA, Transmission cabinet, Statut final) · C. Checklist
    avant validation · D. Rappel doctrine.
  - **Boutons** : **Relire et valider** (primary) · **Modifier le brouillon** (secondary) ·
    **Rejeter** (ghost). Pas de bouton « Accepter ». Pas de mention « escalade » côté UI.
- **Workflow canonique** : IA prépare → superviseuse relit → corrige si besoin → valide →
  CR disponible chirurgien. Cf. `DECISIONS_LOG.md` § 6.
- **Gating produit** : brouillon → validé KOVELA → disponible chirurgien (cf.
  PRODUCT_SCOPE.md §12).
- **Temps estimé gagné** : ~7 min.

### 1.3 Reformulation de réponse non médicale
- **Entrée** : message rédigé par un superviseur (forme).
- **Sortie attendue** : proposition de reformulation plus claire / plus professionnelle,
  **strictement non médicale**.
- **Wording obligatoire** : *« Proposition de reformulation (forme, non médicale) »*.
- **Usage** : aide à l'homogénéité du ton de la coordination.
- **Temps estimé gagné** : ~45 sec.

### 1.4 Compilation factuelle avant transmission au chirurgien
- **Entrée** : chronologie des derniers échanges + pièces jointes disponibles + actions déjà
  réalisées.
- **Sortie attendue** : **compilation strictement factuelle** prête à être transmise au
  chirurgien. Aucune interprétation, aucune qualification de symptôme, aucune recommandation.
- **Wording obligatoire** : *« Compilation factuelle »*. **Jamais** *« Recommandation
  d'escalade »*, **jamais** *« Urgence détectée »*.
- **Gating produit** : préparer ≠ transmettre. La transmission au chirurgien reste une action
  humaine explicite.
- **Temps estimé gagné** : ~6 min.

### 1.5 Aide à l'identification de tâches opérationnelles
- **Entrée** : état du suivi d'un patient (statut, dernier message, délai, onboarding,
  CR en attente).
- **Sortie attendue** : signalement opérationnel sous forme de **badges** :
  - message non traité ;
  - patient silencieux ;
  - CR en attente ;
  - onboarding incomplet.
- **Important** : cette fonction est implémentée comme un système de **règles déterministes**
  dans le prototype (pas un appel LLM). À conserver ainsi en V1 pour éviter tout risque
  d'interprétation médicale.

---

## 2. Interdits IA (absolus)

L'IA KOVELA **n'a jamais** :

1. **De réponse autonome au patient.** L'IA ne génère aucun message envoyé directement à un
   patient sans validation humaine préalable.
2. **D'avis médical.** Aucune sortie ne contient d'évaluation, de jugement ou de
   recommandation médicale.
3. **D'interprétation des photos.** Les photos ne sont jamais transmises à un LLM ; seules
   leurs métadonnées (existence, type, libellé) le sont.
4. **De qualification de symptôme.** Aucune analyse sémantique du contenu patient à des fins
   médicales.
5. **De décision de transmission.** L'IA ne décide jamais d'escalader ; elle peut préparer une
   compilation, c'est tout.
6. **De décision de non-transmission.** L'IA ne décide jamais qu'une situation ne mérite pas
   d'être transmise.
7. **De scoring patient.** Aucune note, aucun score, aucun ranking de patient.
8. **De décision clinique.** Le chirurgien décide. KOVELA prépare.

Ces interdits sont **vérifiés dans l'UI du prototype** : le lexique banni n'apparaît nulle
part (scan automatisable via `grep`).

---

## 3. Principes IA (obligatoires)

### 3.1 Assistive
L'IA **prépare, suggère, structure**. Elle ne décide pas, ne remplace pas, ne formule pas.

### 3.2 Human-in-the-loop
Chaque sortie IA doit faire l'objet d'une **décision humaine explicite** :
- **Accepter** (validation telle quelle).
- **Modifier** (l'humain édite avant validation).
- **Refuser** (l'humain rejette et fait à la main).

### 3.3 Loggée
Chaque interaction IA produit **deux logs distincts** :
- `ia_utilisee` (proposition générée) avec : fonction, version de prompt, utilisateur,
  patient lié, horodatage.
- `ia_suggestion` (décision humaine) avec : décision (accepte / modifie / refuse), durée
  estimée gagnée.

### 3.4 Désactivable
- **Kill-switch par fonction** : l'admin peut désactiver une fonction IA (résumé, CR,
  reformulation, compilation) sans toucher aux autres.
- **Kill-switch global** : un interrupteur master coupe toute IA.
- **Kill-switch par tenant** (cabinet ou patient) : en V2.

### 3.5 Versionnée
- Chaque prompt est **versionné** (`v1.2`, `v1.3`, …).
- Chaque log IA contient la version de prompt utilisée.
- Les versions de prompt sont **archivées** en base (jamais écrasées).
- A/B testing possible (deux versions actives en parallèle pour une même fonction).

---

## 4. Logs IA — schéma cible V1

### Champs obligatoires par log IA

| Champ | Type | Exemple |
|---|---|---|
| `id` | UUID | `ai-2026-05-28-…` |
| `userId` | UUID | référence vers `User` |
| `userRole` | enum | `superviseur` |
| `function` | enum | `resume_conversation` / `preparation_cr` / `reformulation` / `compilation_escalade` |
| `promptVersion` | string | `v1.2` |
| `patientId` | UUID (optionnel) | référence patient si applicable |
| `proposalContentHash` | string | hash SHA-256 de la sortie générée (intégrité) |
| `proposalContent` | text | sortie brute IA (stockée chiffrée si besoin) |
| `humanDecision` | enum | `propose` / `accepte` / `modifie` / `refuse` |
| `finalContent` | text (optionnel) | contenu final après décision humaine |
| `estimatedMinutesSaved` | number | estimation prototype (1.5 / 7 / 0.75 / 6) |
| `latencyMs` | number | temps de réponse du LLM |
| `usageUnits` | number (optionnel) | unités de consommation par appel (suivi interne, hors documentation technique) |
| `at` | timestamp | horodatage |

### Conservation
- Logs IA **append-only**, jamais modifiés.
- Durée de conservation à confirmer DPO (proposition : alignée sur la conservation des CR).
- Hash chaining pour intégrité (chaque log contient le hash du précédent).

### Accès
- Lecture : Admin / Head of Care uniquement (permission `audit:read`).
- Pas d'accès patient à ses propres logs IA — sauf demande RGPD formalisée (à confirmer
  Aumans : droit d'accès vs secret métier).

---

## 5. Architecture IA cible V1

```
┌──────────────────────────────────────────────────────────────────┐
│ Frontend KOVELA (Next.js)                                        │
│  L'utilisateur clique « Préparer le CR »                         │
└──────────────┬───────────────────────────────────────────────────┘
               │ HTTPS authentifié (JWT)
               │
┌──────────────▼───────────────────────────────────────────────────┐
│ Backend KOVELA (NestJS)                                          │
│  Permission check : superviseur a accès au patient ?             │
│  Récupère le contexte (messages, métadonnées attachements)       │
└──────────────┬───────────────────────────────────────────────────┘
               │ Appel interne (jamais d'appel direct front → LLM)
               │
┌──────────────▼───────────────────────────────────────────────────┐
│ IA Gateway (service KOVELA)                                      │
│  1. Vérification du kill-switch (fonction + global + tenant)     │
│  2. Redaction PII en entrée (regex + ML léger)                   │
│  3. Injection du prompt versionné (v1.x)                         │
│  4. Rate limiting (par superviseur + global)                     │
│  5. Logging immuable de la requête                               │
│  6. Appel LLM (mTLS, contrat DPA en place)                       │
│  7. Redaction PII en sortie                                      │
│  8. Linter wording interdit (rejette si terme banni détecté)     │
│  9. Logging immuable de la réponse + hash chaining               │
│ 10. Monitoring : latence, usage, taux d'erreur                   │
└──────────────┬───────────────────────────────────────────────────┘
               │
┌──────────────▼───────────────────────────────────────────────────┐
│ LLM provider (UE prioritaire)                                    │
│  Anthropic Claude (Bedrock UE) / Mistral (FR) / Azure OpenAI UE  │
│  Contrat DPA RGPD signé                                          │
│  Transferts hors UE encadrés (BCR / clauses contractuelles type) │
└──────────────────────────────────────────────────────────────────┘
```

### Principes architecturaux

1. **Appels IA côté serveur uniquement.** Le front n'a jamais de clé API LLM. Toute requête
   passe par le gateway.
2. **Aucun appel direct client → fournisseur IA.** Le gateway est la frontière de sécurité,
   de loggage et de conformité.
3. **Proxy IA interne (gateway KOVELA).** Permet la redaction PII, le logging immuable, le
   rate limiting, le kill-switch, le linter wording.
4. **Minimisation / anonymisation lorsque possible.** Les PII ne sont envoyées au LLM que si
   strictement nécessaire à la fonction. Privilégier les références (`{patient_id}`) plutôt
   que les noms quand le prompt le permet.
5. **Prompt versioning.** Les prompts sont stockés en base, chaque appel référence une version
   précise. Aucune modification rétroactive.
6. **Kill switch.** Activable par l'admin KOVELA en quelques secondes, sans déploiement.
7. **Audit log.** Chaque interaction est tracée de manière immuable (hash chaining).
8. **Monitoring usage.** Tableau de bord interne : appels / jour, taux d'acceptation,
   taux d'erreur, latence p95. La tarification fournisseur est suivie en interne, hors
   documentation technique.
9. **Fournisseur IA interchangeable.** L'abstraction du gateway permet de changer de LLM
   provider en quelques heures. Aucun couplage fort dans le code métier.

### Choix de fournisseur LLM (à arbitrer)

| Fournisseur | Avantages | Contraintes |
|---|---|---|
| **Anthropic Claude** (Bedrock UE) | Qualité top, raisonnement, alignement | DPA via AWS, tarification à surveiller en interne |
| **Mistral** (FR) | Souveraineté, hébergement FR, DPA direct | Qualité variable selon modèle |
| **OpenAI Azure** (Europe) | Qualité top, écosystème | Transferts hors UE à clarifier |

**Recommandation** : commencer V1 avec **Anthropic Claude via Bedrock UE** (qualité prouvée
pour les tâches de rédaction structurée + DPA en place via AWS). Tester Mistral en parallèle
pour les fonctions moins exigeantes (reformulation), en vue d'une bascule progressive.

---

## 6. Mesure de performance IA (V1)

KPI à suivre depuis le tableau de bord Admin / Head of Care (cf. `/admin/supervision` du
prototype) :

- **Volume** : nombre d'appels IA par jour / fonction.
- **Qualité humaine perçue** : taux acceptation / modification / refus par fonction.
- **Temps estimé gagné** (estimation prototype basée sur barème par fonction).
- **Latence** : médiane et p95 par fonction.
- **Usage** : volume d'appels par fonction et par jour (consommation à monitorer en interne,
  sans affichage de chiffrage dans cette documentation).
- **Conformité wording** : 0 occurrence de mot interdit dans les sorties (linter
  automatique).

**KPI dangereux ou prématurés à NE PAS introduire** :
- Score qualité de superviseur basé sur taux d'acceptation IA (induit du biais : un bon
  superviseur peut refuser plus souvent).
- Classement comparatif entre superviseurs (cf. doctrine : indicateurs opérationnels,
  jamais punitifs).

---

## 7. Évolutions V2

À conserver hors scope V1 :

- **Fine-tuning** sur des templates KOVELA validés (V2).
- **IA spécialisée par verticale** (esthétique vs ortho vs ORL).
- **Linter wording IA en interne** (V2 — pour V1 un linter basé sur grep des mots interdits
  suffit).
- **Détection de patterns à risque opérationnel** (ex. plusieurs patients silencieux du même
  superviseur) — opérationnel uniquement, jamais clinique.
- **Synthèses transverses** (patient × période × verticale) pour reporting Head of Care.

---

## 8. Validation juridique requise (cross-référence Aumans)

Voir `docs/REGULATORY_REVIEW_NOTES.md` section 4 (IA assistive) et la **checklist juridique
synthèse pour validation Aumans** pour les questions ouvertes. Synthèse des points IA à
trancher :

- **AIPD (Analyse d'impact)** obligatoire ou non ? Probable oui.
- **Information patient** explicite sur l'usage d'une IA interne ?
- **AI Act européen** : catégorisation de KOVELA (a priori risque limité, à confirmer).
- **Choix du LLM provider** : DPA RGPD, transferts hors UE.
- **Droit d'accès patient** aux sorties IA le concernant.
- **Durée de conservation** des logs IA.
