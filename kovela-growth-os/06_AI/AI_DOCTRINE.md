# AI_DOCTRINE — Doctrine de l'IA interne KOVELA

**Valeur stratégique :** ★★★★★
**Owner :** Adrien
**Statut :** Draft
**Dernière mise à jour :** 2026-06-18

---

## TL;DR

L'IA chez KOVELA est un **outil interne au service de l'exécution growth**.
Elle n'est jamais la promesse vendue au chirurgien. Toute sortie IA passe par un
**humain dans la boucle**. On respecte strictement les interdits de vocabulaire.
On protège les données patients et chirurgiens. Pas d'IA médicale, pas de
décision clinique.

## Objectif

Cadrer l'usage de l'IA pour qu'elle accélère le Growth Ops **sans jamais** faire
glisser KOVELA vers une promesse d'« IA médicale » — ce que nous ne sommes pas.

## Action attendue

Tout prompt, agent ou sortie IA de ce dossier respecte cette doctrine. En cas de
doute, on relit ce fichier avant d'utiliser ou de publier quoi que ce soit.

## KPI

- 0 mention interdite dans les contenus publiés.
- 100 % des sorties IA client-facing validées par un humain.
- 0 incident de fuite de donnée patient/chirurgien.

## Process — Les principes

### 1. L'IA est interne, pas la promesse vendue

L'IA sert **l'exécution growth interne** : enrichir le CRM, scorer, résumer des
calls, produire du contenu, écouter les objections. Ce que nous **vendons** au
chirurgien, c'est une **extension opérationnelle premium du cabinet** opérée
humainement. L'IA est un accélérateur en coulisses, pas l'argument commercial.

### 2. KOVELA reste ce qu'elle est

Rappel de positionnement à imposer à toutes les sorties :

- KOVELA **est** : coordination post-opératoire, supervision humaine augmentée
  par IA interne, traçabilité, vigilance opérationnelle, remontée d'informations.
- KOVELA **n'est PAS** : IA médicale, logiciel médical autonome, chatbot patient,
  plateforme de diagnostic, service d'urgence, simple SaaS.
- KOVELA **ne se substitue jamais** à la responsabilité médicale du chirurgien.

### 3. Interdits absolus (en entrée comme en sortie)

Aucune sortie IA ne doit contenir :

- « diagnostic IA »
- « IA médicale autonome »
- « chatbot patient »
- « télésurveillance médicale »
- « remplacement du chirurgien »
- « service d'urgence »
- « plateforme magique »
- « automatisation médicale »

À privilégier : coordination post-opératoire · supervision humaine · assistance
IA interne · traçabilité · vigilance opérationnelle · remontée d'informations ·
protocole chirurgien · extension du cabinet · expérience patient · réduction du
bruit post-op.

> Chaque prompt du dossier intègre ces interdits dans ses instructions de sortie.

### 4. Humain dans la boucle (non négociable)

- L'IA **propose**, l'humain **décide**.
- Aucun score, aucun message, aucun contenu n'est diffusé sans relecture humaine.
- L'IA ne prend **aucune décision clinique** et n'émet **aucun avis médical** —
  jamais, même en interne.

### 5. Confidentialité des données

- Ne pas coller dans un outil IA externe de **données patients identifiantes**.
- Anonymiser systématiquement les cas patients (initiales, pas de nom complet).
- Les données chirurgien restent dans le CRM ; ne transmettre à l'IA que le
  strict nécessaire à la tâche.
- Respecter le RGPD et le cadre de traitement de données de santé.

## TODO

- [ ] Faire valider cette doctrine par Adrien.
- [ ] Ajouter un rappel doctrine en en-tête de chaque prompt.
- [ ] Définir la règle d'anonymisation avec l'équipe opérations.

## Auto-audit

- Est-ce actionnable ? **Oui**
- Est-ce utile au Growth Ops ? **Oui** — il sait ce qu'il peut/ne peut pas faire.
- Est-ce que cela aide à signer plus de chirurgiens ? **Oui** — protège la crédibilité premium.
- Est-ce que cela simplifie le pilotage ? **Oui**
- Est-ce trop complexe ? **Non**
- Peut-on supprimer quelque chose ? Non, chaque principe couvre un risque réel.
- Prochaine amélioration recommandée : checklist d'anonymisation dédiée si volume de cas patients augmente.
