# KOVELA — Doctrine Wording

> **Audience** : équipe produit, dev, design, marketing, démo.
> **Statut** : source de vérité unique pour le vocabulaire utilisé en surface UI, en pitch, en démo et dans la documentation publique.
> **Référence** : [`DECISIONS_LOG.md`](DECISIONS_LOG.md) (entrées datées historiques).

---

## 1. Doctrine à respecter

> **KOVELA ne diagnostique pas. KOVELA ne prescrit pas. KOVELA ne prend pas de décision médicale. KOVELA ne gère pas les urgences.**
>
> **KOVELA structure, documente, transmet au cabinet selon le référentiel actif et trace les actions.**
>
> **L'IA est interne et assistive. Elle ne communique jamais directement avec le patient. Elle ne décide jamais seule.**

Cette doctrine doit transparaître dans **chaque** wording UI, démo et documentation publique.

---

## 2. Wording interdit (UI, démo, pitch, doc publique)

| Mot / formulation interdit | Pourquoi |
|---|---|
| `diagnostic` | KOVELA ne diagnostique pas. |
| `prescription` | KOVELA ne prescrit pas. |
| `décision médicale` | KOVELA ne décide pas médicalement. |
| `surveillance médicale` | KOVELA ne fait pas de surveillance médicale. |
| `tri médical`, `tri clinique` | Pas de tri médical automatique. |
| `patient à risque` | Pas de qualification médicale automatique. |
| `urgence gérée par KOVELA` | KOVELA ne gère pas les urgences. |
| `qualité médicale` | Préférer « qualité opérationnelle » ou « qualité du suivi ». |
| `interprétation médicale` | Sauf dans la formule négative explicite « sans interprétation médicale ». |
| `validation médicale` | C'est une validation **opérationnelle KOVELA**, non médicale. |
| `synthèse clinique` | Le CR est **factuel**, pas clinique. |
| `rapport médical`, `compte-rendu médical` | Le CR est un **CR factuel**, pas médical. |
| `escalade`, `escalade médicale` | Réservé aux identifiants techniques internes. UI utilise **« transmission cabinet »**. |
| `preuve juridique garantie` | Aucune garantie juridique revendiquée. |
| `bouclier médico-légal` | Aucune protection médico-légale revendiquée. |
| `certifié HDS`, `conforme HDS` | Tant que la certification réelle n'est pas en place. |
| `validé CNIL`, `agréé CNIL`, `certifié ISO` | Aucune certification revendiquée. |
| `100 % conforme RGPD`, `sécurité garantie` | Aucune garantie absolue revendiquée. |
| `service H24` | Le service est sur la plage **8h-20h**. |

---

## 3. Wording recommandé (UI, démo, pitch, doc publique)

### Lexique métier opérationnel

| Mot / formulation | Usage |
|---|---|
| `transmission cabinet` | Action de transmettre une compilation factuelle au cabinet. |
| `éléments déclarés par le patient` | Ce que le patient a écrit, sans interprétation. |
| `CR factuel` | Compte-rendu factuel KOVELA (non médical). |
| `synthèse factuelle` | Variante. |
| `référentiel actif` | Règles définies par le chirurgien que KOVELA applique. |
| `journal d'action` | Audit trail prototype (et bientôt réel V1). |
| `note interne` | Note équipe coordination, jamais envoyée au patient. |
| `message patient` | Message reçu du patient via la messagerie KOVELA. |
| `patient sans réponse selon référentiel` | Patient qui n'a pas répondu dans la fenêtre prévue par le référentiel. |
| `à revoir selon référentiel` | Patient à reconsidérer selon les règles du chirurgien. |
| `action à effectuer` | Prochaine action opérationnelle attendue. |
| `suivi à clôturer` | Suivi arrivé en fin de fenêtre prévue. |
| `supervision issue du terrain` | Profil des superviseuses (assistantes médicales, IBODE, équipes coordination cabinet — non médecins). |
| `IA interne assistive` | L'IA assiste l'équipe KOVELA, jamais le patient directement. |
| `brouillon IA interne` | Brouillon préparé par l'IA pour relecture humaine. |

### Mentions prototype / V1

| Formulation | Quand l'utiliser |
|---|---|
| `prototype — canal réel à valider en V1 selon cadre RGPD / HDS` | Modale transmission cabinet (WhatsApp, SMS, email…). |
| `Journal d'action prototype — audit trail réel prévu en V1` | Card journal sur la fiche patient. |
| `Export PDF prévu en V1` | Bouton désactivé sur le CR factuel. |
| `Aucun envoi réel` | Modale transmission. |
| `Données fictives, état non persistant` | Bandeau global prototype. |

### Mentions doctrine cabinet / chirurgien

| Formulation | Quand l'utiliser |
|---|---|
| `Transmettre au chirurgien` | Bouton d'action pour rendre disponible un CR. |
| `Marquer prêt pour chirurgien` | Variante. |
| `Préparer pour lecture chirurgien` | Variante. |
| `Mettre à disposition du chirurgien` | Variante doc / pitch. |

**⚠ Ne pas utiliser** « Publier pour le chirurgien » — supprimé de l'UI visible au profit de « Transmettre au chirurgien ».

---

## 4. Doctrine à afficher en UI

### Bloc doctrine sous le composer fiche patient

```
Cadre référentiel · Le message patient reste dans le cadre du
référentiel. KOVELA ne diagnostique pas, ne prescrit pas et ne décide
pas médicalement.
```

### Rappel urgence (formulation validée — à utiliser tel quel)

> **KOVELA ne prend pas en charge les urgences. En cas de situation urgente ou de doute important, le patient doit contacter immédiatement le 15 / 112, les urgences de la clinique ou suivre les consignes remises par son chirurgien.**

À afficher :
- discrètement sous le composer fiche patient ;
- dans la messagerie patient (encart bone clair) ;
- dans la modale transmission cabinet si pertinent.

**Ne pas faire** un gros bloc anxiogène qui pollue tout l'écran. Faire un rappel **clair, sobre et toujours accessible**.

### Signature template transmission cabinet

```
KOVELA — transmission factuelle, sans interprétation médicale.
```

C'est la **seule** occurrence autorisée de la formule « interprétation médicale » et elle est utilisée en **négation explicite**.

---

## 5. Cadre HDS / RGPD à utiliser

| Formulation autorisée | Formulation interdite |
|---|---|
| « Architecture cible HDS / RGPD » | « Certifié HDS » |
| « Conçus dans l'architecture dès le premier jour » | « Conforme HDS » |
| « Aucune certification revendiquée à ce stade » | « Validé CNIL » |
| « Cadre RGPD / HDS à valider en V1 » | « 100 % conforme RGPD » |

---

## 6. Cadre horaire de service

| Formulation autorisée | Formulation interdite |
|---|---|
| « Service actif · 8h-20h » | « Service H24 » |
| « Plage de service quotidienne 8h-20h » | « Disponible 24/7 » |
| « Hors horaires KOVELA, votre message sera repris à l'ouverture du service » | « Réponse garantie en X minutes 24h/24 » |

---

## 7. Cadre IA

| Formulation autorisée | Formulation interdite |
|---|---|
| « IA interne assistive » | « IA autonome » |
| « Brouillon IA — à relire et valider » | « Réponse automatique » |
| « Suggestion IA — à valider par un humain » | « Décision IA » |
| « Estimation prototype » | « Garanti par l'IA » |

L'IA n'est **jamais** présentée comme :
- décidant seule ;
- répondant directement au patient ;
- diagnostiquant ;
- qualifiant médicalement un symptôme ;
- analysant médicalement une photo.

---

## 8. Cas particuliers documentés

### « Interprétation médicale »

Autorisé **uniquement** dans la formule négative explicite : « sans interprétation médicale ».
- ✅ « KOVELA — transmission factuelle, sans interprétation médicale » (signature template).
- ✅ « KOVELA ne réalise pas d'interprétation médicale des photos » (espace chirurgien).
- ❌ « Interprétation médicale automatique ».

### « Décision médicale »

Autorisé **uniquement** dans la formule négative explicite : « ne prend pas de décision médicale », « aucune décision médicale n'est prise par KOVELA ».
- ✅ « KOVELA ne prend pas de décision médicale ».
- ✅ « Aucune décision médicale n'est prise par KOVELA ».
- ❌ « Décision médicale automatique ».

### « Diagnostic » / « Prescription »

Autorisés **uniquement** dans des formulations qui rappellent que KOVELA ne fait **pas** ces choses.
- ✅ « KOVELA ne diagnostique pas, ne prescrit pas et ne décide pas médicalement ».
- ❌ Toute utilisation où KOVELA semblerait diagnostiquer ou prescrire.

---

## 9. Procédure de vérification rapide

Avant tout commit qui touche du wording UI ou doc publique :

```bash
# Vérifier qu'aucun mot interdit n'a été réintroduit en UI :
grep -rni "tri médical\|surveillance médicale\|patient à risque\|urgence gérée par KOVELA\|certifié HDS\|preuve juridique\|bouclier médico-légal\|rapport médical\|synthèse clinique\|compte-rendu médical\|validation médicale\|qualité médicale" app/ components/

# Doit retourner zéro résultat (sauf negations explicites dans le code).
```

---

## 10. Mise à jour de ce document

Toute modification de la doctrine wording doit :
- être tracée dans [`DECISIONS_LOG.md`](DECISIONS_LOG.md) avec date et raison ;
- être validée produit avant déploiement ;
- préserver la cohérence avec le périmètre non médical de KOVELA.
