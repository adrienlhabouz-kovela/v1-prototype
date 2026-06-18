# CRM_SCHEMA — Schéma de données du CRM

**Valeur stratégique :** ★★★★★
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Le modèle de données minimal mais suffisant pour piloter l'acquisition de
chirurgiens. Une entité principale (**Chirurgien / Compte**), enrichie de champs
de qualification, de scoring et de suivi pipeline. Volontairement compact : on
n'ajoute un champ que s'il déclenche une action.

## Objectif

Définir **quels champs** stocker pour pouvoir scorer, prioriser et faire avancer
chaque chirurgien dans le pipeline — sans champ inutile.

## Action attendue

Permettre de configurer le CRM (Notion / HubSpot / Attio) à l'identique et de
commencer à le remplir immédiatement.

## KPI

- % de fiches complètes (champs obligatoires renseignés).
- % de fiches avec score à jour.
- Fraîcheur : aucune fiche « active » sans interaction depuis > 14 jours.

## Process — Schéma

### Entité : `Chirurgien` (compte principal)

| Champ | Type | Obligatoire | Usage / action déclenchée |
|---|---|---|---|
| `nom` | texte | ✅ | Identification |
| `specialite` | select | ✅ | Qualification ICP |
| `ville_region` | texte | ✅ | Ciblage géographique |
| `type_structure` | select (cabinet / clinique privée / hôpital) | ✅ | Éligibilité offre |
| `volume_post_op_estime` | select (faible / moyen / élevé) | ✅ | Scoring fit |
| `tier` | select (1 / 2 / 3) | ✅ | Priorisation (voir `SCORING_MODEL.md`) |
| `score` | nombre (0–100) | ✅ | Priorisation auto |
| `stage_pipeline` | select | ✅ | Voir `PIPELINE_STAGES.md` |
| `source` | select (LinkedIn / SEO / ABM / referral / event / inbound) | ✅ | Quel canal fonctionne |
| `owner` | personne | ✅ | Responsable du suivi |
| `derniere_interaction` | date | ✅ | Fraîcheur / relance |
| `prochaine_action` | texte | ✅ | « Que fait-on ? » |
| `prochaine_action_date` | date | ✅ | Cadence |
| `linkedin_url` | URL | — | Approche |
| `email` | email | — | Approche |
| `telephone` | tel | — | Approche |
| `signaux` | multi-select | — | Signal-based selling |
| `objections` | texte long | — | Alimente `02_ICP_MESSAGING/OBJECTIONS.md` |
| `notes` | texte long | — | Contexte |
| `date_signature` | date | — | Conversion |
| `mrr_arr` | nombre | — | Valeur |

### Entité liée : `Interaction` (optionnel V1)

| Champ | Type | Usage |
|---|---|---|
| `chirurgien` | relation | Lien compte |
| `type` | select (call / email / DM / event / demo) | Canal |
| `date` | date | Historique |
| `resume` | texte long | Alimenté par l'IA résumé de call (`06_AI/CALL_SUMMARY_PROMPT.md`) |
| `next_step` | texte | Action suivante |

## Règles

- **Tout chirurgien identifié entre dans le CRM** (pas de leads dans un coin).
- Chaque fiche « active » a **toujours** une `prochaine_action` + date.
- Le `score` et le `tier` sont recalculés selon `SCORING_MODEL.md`.
- Les `objections` remontent vers le fichier objections (un actif en produit un autre).

## TODO

- [ ] Choisir l'outil CRM.
- [ ] Créer la base avec ces champs.
- [ ] Importer les chirurgiens connus.
- [ ] Brancher l'IA d'enrichissement (`06_AI/SURGEON_ENRICHMENT_PROMPT.md`).

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — c'est son outil quotidien.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui**
- Est-ce que cela simplifie le pilotage ? **Oui** — chaque champ a un usage.
- Est-ce trop complexe ? **Non** — schéma volontairement réduit.
- Peut-on supprimer quelque chose ? Repousser l'entité `Interaction` en V1 si besoin.
- Prochaine amélioration recommandée : automatiser le calcul du score à l'écriture.
