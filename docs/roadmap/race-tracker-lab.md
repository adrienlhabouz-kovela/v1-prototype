# Race Tracker Lab 🗺️ — module avancé (futur)

> **Statut : planifié, non développé.** Ce document décrit la vision et
> l'architecture prévue pour que le module s'intègre proprement le moment venu.
> Aucune ligne de code applicatif n'existe encore.

Inspiration : les cartographies de course au large (type Vendée Arctique)
transmises par Bertrand. L'objectif n'est **pas** de rejouer une course, mais
d'**apprendre à lire une cartographie de course comme un skipper** : vent, zones
météo, positions de la flotte, routes possibles, et la décision tactique qui en
découle.

---

## 1. Objectif pédagogique

Faire passer l'utilisateur de « je regarde une carte de course » à « je
comprends pourquoi tel bateau est avantagé et quelle route je choisirais ».

Compétences visées :
- lire un champ de vent (direction, force, bascules) sur une carte ;
- repérer les zones sans vent / zones météo et leur effet ;
- comparer des routes (distance vs vent vs risque) ;
- juger une position relative dans une flotte ;
- décider, puis confronter sa décision à un débrief argumenté.

---

## 2. Le pont (rôle central du module)

Race Tracker Lab est le module qui **relie** les cinq univers d'Adrien :

| Univers | Lien concret dans le module |
|---|---|
| **Apprentissage voile** (parcours actuel) | réutilise les concepts déjà appris : allures, adonnante/refusante, vent sale, laylines, priorités. Les questions tactiques pointent vers les leçons correspondantes. |
| **Virtual Regatta** | vocabulaire et logique de routage transposables (choix de route, bascules, options de bord) ; sert de terrain d'entraînement « jeu » à la lecture de carte. |
| **Régates de Bertrand** | le **mode Bertrand** (phase ultérieure) permettra d'analyser une situation réelle qu'il envoie ; les cartographies réelles inspirent les cartes pédagogiques. |
| **Lecture météo** | les zones météo et le champ de vent prolongent le Smart Wind Trainer et le module météo. |
| **Décision de skipper** | chaque carte se conclut par une décision + débrief : c'est l'aboutissement du parcours « de moussaillon à skipper ». |

---

## 3. Fonctionnalités prévues

1. **Carte de course pédagogique** — fond de carte fictif ou réaliste, marques,
   ligne de départ/arrivée, échelle, rose des vents.
2. **Bateaux concurrents** — flotte positionnée, avec cap/allure et amure.
3. **Direction & force du vent** — champ de vent (flèches/barbules), valeur
   locale, possibilité de bascules par zone.
4. **Zones météo** — risées, molles, **zones sans vent**, fronts, courant.
5. **Routes possibles** — tracés candidats comparables (directe, par la risée,
   par l'abri…).
6. **Analyse de position** — qui mène, qui est sous le vent / au vent, qui a la
   route la plus dégagée.
7. **Questions tactiques** (réutilise le moteur de quiz + l'aide progressive) :
   - qui est avantagé ?
   - pourquoi ce bateau vire ?
   - qui a le meilleur angle ?
   - qui risque d'entrer dans une zone sans vent ?
   - quelle route choisir ?
8. **Débrief pédagogique** après chaque décision — argumenté, relié aux concepts.
9. **Mode « Bertrand »** (phase ultérieure) — annoter/analyser une capture ou une
   situation de régate réelle envoyée par Bertrand.

---

## 4. Architecture technique prévue

Principe directeur : **réutiliser les briques existantes**, ne rien dupliquer.

### 4.1 Réutilisation des fondations actuelles

| Brique existante | Usage dans Race Tracker Lab |
|---|---|
| `lib/content/scenarios.ts` (pattern de scénarios) | modèle pour les **cartes pédagogiques** (contenu déclaratif). |
| `lib/engine/help.ts` + `components/help/HelpButton.tsx` | aide progressive **indice → explication → réponse** sur chaque question tactique (déjà conforme à la règle « jamais bloqué »). |
| `components/lesson/QuizRunner.tsx` (logique) | base des **questions tactiques** (QCM « quel bateau », choix de route, etc.). |
| `components/svg/WindCircle.tsx`, `BoatTopView.tsx` | briques SVG réutilisables pour les bateaux et la rose des vents. |
| `lib/engine/adaptive.ts` | concepts tactiques fragiles reposés en priorité. |
| `lib/progress/store.tsx` | progression : `recordSession({ kind: "racemap", … })`, `recordHelp(concept)`, scores. |
| Profils & tuning (`lib/profiles`) | version Andy simplifiée (moins de bateaux, vocabulaire allégé, plus de visuel) **sans** dupliquer le contenu. |

### 4.2 Nouveau modèle de contenu (esquisse, `lib/content/race-maps.ts`)

```ts
// Esquisse documentaire — à affiner lors de l'implémentation.
interface RaceMap {
  id: string;
  title: string;
  brief: string;                 // contexte de course
  level: "initiation" | "intermediaire" | "avance";
  bounds: { w: number; h: number };           // repère cartographique
  marks: { id: string; kind: "depart" | "bouee" | "arrivee"; x: number; y: number; label: string }[];
  wind: {
    baseDir: number;             // direction dominante (°)
    baseStrength: number;        // nœuds
    shifts?: { zone: string; dir: number; note: string }[];  // bascules locales
  };
  weatherZones: {
    id: string;
    kind: "risee" | "molle" | "sans-vent" | "courant" | "front";
    polygon: { x: number; y: number }[];
    note: string;
  }[];
  boats: {
    id: string;
    name: string;                // "Toi", concurrents, voire "Bertrand"
    x: number; y: number;
    heading: number;             // cap (°)
    tack: "babord" | "tribord";
    isPlayer?: boolean;
  }[];
  routes: {
    id: string;
    label: string;               // "Directe", "Par la risée Nord"…
    path: { x: number; y: number }[];
    tradeoff: string;            // distance vs vent vs risque
  }[];
  questions: RaceQuestion[];     // s'appuie sur le type Question existant
  debrief: string;               // synthèse pédagogique de la carte
}

// Réutilise le `Question` actuel + un type tactique dédié.
interface RaceQuestion extends Pick<Question, "id" | "prompt" | "explanation" | "concept" | "hints"> {
  kind: "whoFavored" | "whyTack" | "bestAngle" | "deadZoneRisk" | "chooseRoute";
  targetBoatId?: string;         // pour "qui est avantagé ?"
  targetRouteId?: string;        // pour "quelle route ?"
  debrief: string;               // débrief spécifique à la décision
}
```

> Le débrief (point 8) est natif : chaque `RaceQuestion` et chaque `RaceMap`
> portent un `debrief`. L'aide progressive reste disponible **avant** de répondre
> (indice → explication → réponse), le débrief vient **après** la décision.

### 4.3 Nouveaux concepts (à ajouter à `CONCEPT_LABELS`)

`lecture-carte`, `position-relative`, `choix-route`, `zone-sans-vent`,
`bascule-strategie`, `risee-molle`. Ils alimentent automatiquement les points
faibles, l'aide et la section « Notions qui demandent le plus d'aide ».

### 4.4 Pages & navigation

- Route : `app/race-lab/page.tsx` (liste des cartes) + `app/race-lab/[id]/page.tsx`
  (carte jouable) — calquées sur le pattern leçon/simulateur (statique/SSG).
- Entrée dans `AppShell` (barre de navigation) une fois le module disponible.
- Composants : `components/race/RaceMapCanvas.tsx` (rendu SVG carte + flotte +
  vent + zones), `RouteOverlay`, `TacticalQuiz` (réutilise QuizRunner), `Debrief`.

### 4.5 Mode « Bertrand » (phase ultérieure, à cadrer)

Objectif : analyser une situation **réelle** envoyée par Bertrand.
- Entrée : import d'une image/capture + saisie guidée (positions, vent) **ou**
  une carte semi-annotée. **Pas d'analyse automatique d'image** au départ : on
  reste sur une **annotation assistée** (l'utilisateur place bateaux/vent/zones
  sur un canvas, l'app guide le raisonnement et le débrief).
- Données **locales** uniquement (cohérent avec l'app sans backend) ; pas
  d'upload externe sans décision explicite. À cadrer côté vie privée.
- C'est le pont le plus direct avec les régates réelles de Bertrand.

---

## 5. Phasage proposé (incrémental)

1. **Lecture statique** : afficher une carte pédagogique (marques, vent, zones,
   flotte) + légende. Aucune interaction.
2. **Questions tactiques + aide + débrief** : les 5 questions, via QuizRunner et
   le moteur d'aide ; enregistrement dans la progression.
3. **Routes comparables** : sélection d'une route + débrief comparatif.
4. **Adaptatif & stats** : concepts tactiques dans les points faibles / aide.
5. **Mode Bertrand** : annotation assistée d'une situation réelle.

---

## 6. Hors scope (volontairement, au départ)

- Simulation physique temps réel / routage automatique (≠ objectif pédagogique).
- Reconnaissance automatique d'images de cartographie.
- Toute dépendance backend ou service externe (l'app reste statique/local-first).

---

## 7. Garde-fous

- **Ne touche pas à KOVELA** (app distincte, autre branche).
- Développement sur `claude/voile-app`.
- Réutiliser le contenu voile existant : **une seule formation**, pas de doublon.
- Respecter la règle produit « l'utilisateur ne reste jamais bloqué » via l'aide
  progressive déjà en place.
