# AI_AGENTS — Les 5 agents IA de démarrage

**Valeur stratégique :** ★★★★★
**Owner :** Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Les **5 agents IA internes** qui assistent l'exécution growth. Chacun a un rôle,
des entrées, des sorties, un point de branchement dans le système et un KPI.
Tous respectent `AI_DOCTRINE.md` : IA interne, humain dans la boucle, interdits
respectés. On démarre à 5, pas plus.

## Objectif

Décrire précisément ce que fait chaque agent pour que le Growth Ops sache quand
et comment l'utiliser, et où ranger la sortie.

## Action attendue

Pour chaque tâche growth récurrente, identifier l'agent compétent, lancer son
prompt, brancher la sortie au bon endroit du repo.

## KPI

- Nombre de tâches assistées par agent / semaine.
- Temps gagné par tâche.
- Taux de sortie réutilisée sans correction lourde.

## Process — Les 5 agents

### 1. IA CRM / enrichissement

- **Rôle :** compléter et qualifier une fiche chirurgien à partir d'infos publiques.
- **Entrées :** nom, spécialité, ville/structure, liens publics (LinkedIn, site).
- **Sorties :** champs CRM remplis (spécialité, type structure, zone, volume
  post-op estimé, signaux) + proposition de tier.
- **Branché dans :** `03_CRM/CRM_SCHEMA.md` (entité `Chirurgien`).
- **Prompt :** `SURGEON_ENRICHMENT_PROMPT.md`.
- **KPI :** % de fiches complètes ; temps moyen d'enrichissement.

### 2. IA scoring

- **Rôle :** proposer un `score` (0–100) et un `tier` (1/2/3) selon le barème.
- **Entrées :** champs de fit (volume, structure, spécialité, zone) + signaux d'intent.
- **Sorties :** score chiffré justifié + tier + recommandation d'action.
- **Branché dans :** `03_CRM/SCORING_MODEL.md` (champs `score`, `tier`).
- **Prompt :** inclus dans `SURGEON_ENRICHMENT_PROMPT.md` (section scoring).
- **KPI :** taux de signature par tranche de score (le modèle prédit-il bien ?).

### 3. IA résumé de call

- **Rôle :** transformer un call commercial en résumé structuré exploitable.
- **Entrées :** notes ou transcription d'un call chirurgien.
- **Sorties :** points clés, objections, signaux, next step → entité `Interaction`.
- **Branché dans :** `03_CRM/CRM_SCHEMA.md` (entité `Interaction`, champ `resume`).
- **Prompt :** `CALL_SUMMARY_PROMPT.md`.
- **KPI :** % de calls résumés et poussés au CRM sous 24 h.

### 4. IA contenu (recyclage)

- **Rôle :** décliner un actif de contenu en plusieurs formats premium.
- **Entrées :** un actif source (article, note, transcript, post de référence).
- **Sorties :** post LinkedIn, article SEO, carrousel, script vidéo, newsletter.
- **Branché dans :** `04_ACQUISITION/` (production de contenu).
- **Prompt :** `CONTENT_RECYCLING_PROMPT.md`.
- **KPI :** nombre de formats produits par actif ; volume publié / semaine.

### 5. IA objections (extraction)

- **Rôle :** extraire et catégoriser les objections depuis notes et calls.
- **Entrées :** notes/calls/messages contenant des freins exprimés.
- **Sorties :** objections normalisées, catégorisées, avec réponse type suggérée.
- **Branché dans :** `02_ICP_MESSAGING/OBJECTIONS.md`.
- **Prompt :** `OBJECTION_EXTRACTION_PROMPT.md`.
- **KPI :** nombre d'objections capturées ; % d'objections avec réponse validée.

## Règles

- Tous les agents suivent `AI_DOCTRINE.md` : humain dans la boucle, interdits respectés.
- Une sortie d'agent **alimente toujours un autre actif** (CRM, objections, contenu).
- On n'ajoute un 6e agent que si une tâche growth récurrente le justifie clairement.

## TODO

- [ ] Tester chaque agent sur un cas réel.
- [ ] Définir le format exact d'export vers le CRM.
- [ ] Suivre les KPI par agent dès le premier mois.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — carte claire des outils.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui**
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non** — 5 agents bornés.
- Peut-on supprimer quelque chose ? On pourrait fusionner enrichissement et scoring (déjà fait via un prompt commun).
- Prochaine amélioration recommandée : mesurer l'usage réel pour décider du 6e agent.
