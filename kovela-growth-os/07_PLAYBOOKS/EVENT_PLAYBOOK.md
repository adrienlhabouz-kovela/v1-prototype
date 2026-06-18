# EVENT_PLAYBOOK — Procédure événement / congrès

**Valeur stratégique :** ★★★★☆
**Owner :** Adrien → Growth Ops
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

Procédure pour transformer un congrès ou événement chirurgical en RDV et comptes
CRM, et non en pile de cartes de visite oubliées. Trois temps : **avant**
(préparation + cibles identifiées), **pendant** (approche + collecte structurée),
**après** (suivi CRM + relances datées). Un événement sans suivi J+2 est un
événement raté.

## Objectif

Faire entrer des chirurgiens cibles dans le pipeline grâce à un contact humain de
qualité, puis convertir ce contact en RDV par un suivi rigoureux.

## Action attendue

Pour chaque événement : une liste de cibles préparée avant, des contacts collectés
proprement pendant, et 100 % des contacts en fiche CRM + première relance dans les
48 h après.

## KPI

- Nb de contacts cibles approchés / événement.
- Nb de fiches CRM créées (cible : 100 % des contacts dans les 48 h).
- Nb de RDV obtenus issus de l'événement.
- Coût par RDV événement (CAC canal `event`).

## Process

### AVANT (J-15 à J-1)

1. **Décider d'y aller** : l'événement réunit-il l'ICP (chirurgiens, direction
   cabinet/clinique, spécialités prioritaires) ? Sinon, ne pas y aller.
2. **Identifier les cibles** : lister intervenants, exposants et participants
   correspondant à l'ICP. Les pré-charger dans le CRM en `Identifié` (source `event`).
3. **Pré-engager sur LinkedIn (J-7)** : se connecter aux cibles prioritaires avec
   une note (« je serai à [événement], au plaisir d'échanger sur le post-op »).
4. **Préparer les angles** : 1 phrase d'accroche par cible Tier 1 (cf. recherche
   ABM). Message central prêt : *« Le post-op ne doit plus saturer votre cabinet. »*
5. **Logistique** : créneaux de RDV réservables (lien de prise de RDV), support de
   collecte (formulaire / notes), objectif chiffré de contacts.

Checklist AVANT :
- [ ] Liste de cibles pré-chargée dans le CRM.
- [ ] Connexions LinkedIn envoyées aux prioritaires.
- [ ] Accroches Tier 1 préparées.
- [ ] Lien de prise de RDV prêt à partager.
- [ ] Objectif de contacts fixé.

### PENDANT

- **Approche** : partir du contexte du chirurgien, écouter sa réalité post-op
  avant de parler de KOVELA. Positionnement : extension opérationnelle du cabinet,
  supervision humaine + IA interne. Jamais de promesse médicale.
- **Un seul CTA** : proposer un échange de 20 min (caler le créneau sur place si
  possible).
- **Collecte structurée** : pour chaque contact, noter immédiatement :

| Champ | À capturer sur place |
|---|---|
| Nom / structure / spécialité | Identification + fit ICP |
| Tension post-op évoquée | Angle de relance |
| Niveau d'intérêt | Chaud / tiède / froid |
| Prochaine action convenue | RDV calé / à relancer / doc à envoyer |

> Ne jamais finir une conversation sans noter la prochaine action. Une carte de
> visite sans note = un contact perdu.

### APRÈS (J+1 à J+5)

1. **J+1 (max J+2)** : créer/compléter toutes les fiches CRM, source `event`,
   scorer (`03_CRM/SCORING_MODEL.md`), assigner un `tier`.
2. **J+2** : première relance personnalisée par contact, qui **rappelle l'échange**
   (« suite à notre échange à [événement] sur… ») et propose un créneau précis.
   `stage_pipeline` → `Contacté` ou `Engagé`.
3. **J+5** : relance des chauds/tièdes sans réponse. Caler les RDV.
4. **Bilan événement** : remplir le mini-bilan ci-dessous et le reporter dans
   `08_KPIS/WEEKLY_REPORT.md` et `MONTHLY_REVIEW.md`.

| Bilan | Valeur |
|---|---|
| Contacts approchés |  |
| Fiches CRM créées |  |
| RDV obtenus |  |
| Coût total / coût par RDV |  |
| À refaire / à changer |  |

## TODO

- [ ] Établir la liste des congrès cibles de l'année.
- [ ] Créer le template de fiche-collecte sur place.
- [ ] Préparer le lien de prise de RDV dédié événement.
- [ ] Définir l'objectif de contacts par événement.

## Auto-audit

- Est-ce actionnable ? **Oui** — avant / pendant / après minutés.
- Est-ce utile au Growth Ops ? **Oui**
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — contact humain → RDV.
- Est-ce que cela simplifie le pilotage ? **Oui** — bilan chiffré par événement.
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Le pré-engagement LinkedIn si l'événement est petit.
- Prochaine amélioration recommandée : organiser un dîner/atelier KOVELA en marge d'un grand congrès une fois 10 signés.
