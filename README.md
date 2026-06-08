# Cap au Vent ⛵

> L'app privée d'Adrien pour apprendre la voile : vent, allures, manœuvres,
> croisière et régate. **Visuelle, interactive, ludique — 15 minutes par jour.**

Application web mobile-first, sans backend, déployable en un clic sur Vercel.
Toute la progression vit en `localStorage` (V1).

---

## 0. En bref

| | |
|---|---|
| **Stack** | Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · SVG natifs |
| **Persistance** | `localStorage` (clé `cap-au-vent:v1`) |
| **Dépendances visuelles externes** | aucune — toutes les illustrations sont des SVG codés à la main |
| **Déploiement** | Vercel (`framework: nextjs`, build statique/SSG) |

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production (testé : 19 pages générées)
```

---

## 1. Architecture produit

Trois piliers, accessibles depuis une barre de navigation basse (mobile-first) :

1. **Apprendre** — un parcours de 10 modules progressifs (Duolingo-like), chaque
   module = une leçon (contenu visuel + exercices adaptatifs) qui débloque le suivant.
2. **S'entraîner** — trois outils « bac à sable » réutilisables à l'infini :
   - **Smart Wind Trainer** : lecture de situation vent/allure en direct.
   - **Croisière Méditerranée** : décisions go/no-go, route, mouillage.
   - **Régate avec Bertrand** : choix tactiques, gain/perte de places.
3. **Progresser** — carnet de bord : niveaux, XP, streak, badges, scores
   thématiques, notions à consolider (répétition espacée).

Le tout est cousu par un **moteur de gamification** (XP → niveaux, badges,
streak) et un **moteur adaptatif** (suivi par concept, détection des points
faibles, répétition espacée).

## 2. Parcours utilisateur

```
Ouverture ─▶ Dashboard (niveau, XP, streak, "Reprends ici", points faibles)
            │
            ├─▶ Parcours ─▶ Module déverrouillé ─▶ Leçon
            │                                       ├─ Contenu (SVG interactifs, flashcards)
            │                                       ├─ Exercices (8 types, adaptatifs)
            │                                       └─ Résultat (score, +XP, badges, niveau)
            │
            ├─▶ Wind Trainer ─▶ règle vent+angle ─▶ allure/voile/réglage/risque/question
            ├─▶ Croisière ─▶ briefing ─▶ go/no-go ─▶ mouillage/plan B ─▶ score sécurité/confort
            ├─▶ Régate ─▶ 5 décisions tactiques ─▶ classement final
            └─▶ Progrès ─▶ grades, badges, scores, notions faibles, reset
```

Boucle d'engagement quotidienne : **streak + prochaine leçon recommandée + XP +
badges** poussent à revenir 10-20 min par jour.

## 3. Structure des pages (App Router)

| Route | Rôle |
|---|---|
| `/` | Dashboard : niveau, XP, streak, progression, prochaine leçon, erreurs fréquentes |
| `/learn` | Parcours : chemin des 10 modules avec déverrouillage progressif |
| `/lesson/[id]` | Lecteur de leçon : contenu → exercices → résultat (SSG des 10 leçons) |
| `/wind-trainer` | Smart Wind Trainer |
| `/cruise-simulator` | Simulateur Croisière Méditerranée |
| `/regatta-simulator` | Simulateur Régate avec Bertrand |
| `/progress` | Carnet de bord complet |

## 4. Composants React

```
components/
  layout/AppShell.tsx        Coque + barre de navigation basse (icônes SVG)
  ui/primitives.tsx          Pill, ProgressBar, ScoreRing, Card, Gauge, SectionTitle
  svg/
    BoatTopView.tsx          Voilier vu de dessus, 11 zones cliquables (explore/quiz)
    WindCircle.tsx           Cercle vent/allures : bateau pivotant draggable + zone interdite
    SailTrim.tsx             Réglage de voile interactif + jauges vitesse/gîte
  lesson/
    LessonPlayer.tsx         Orchestration contenu → quiz → résultats
    FlashcardDeck.tsx        Cartes mémoire flip 3D
    WindRoseExplorer.tsx     Bloc rose des vents
    PointsOfSailExplorer.tsx Bloc cercle des allures
    ManeuverTimeline.tsx     Timeline d'une manœuvre
    QuizRunner.tsx           Moteur de tests (8 types de questions) + feedback
```

## 5. Modèle de données (`lib/types.ts`)

- **Contenu** : `Module` → `Lesson` → `LessonBlock[]` (contenu visuel) + `Question[]`.
  - `LessonBlock.kind` : `text | flashcards | boatDiagram | windRose | pointsOfSail | sailTrim | maneuverTimeline | callout`.
  - `Question.kind` : `qcm | trueFalse | clickZone | windAngle | chooseSail | chooseManeuver | goNoGo | orderSteps`.
  - Chaque question porte un `concept` (clé du moteur adaptatif) et une `explanation`.
- **Progression** (`ProgressState`) : `xp`, `completedLessons`, `lessonScores`,
  `badges`, `streak`, `lastActiveDay`, `concepts` (stats + répétition espacée),
  `scores` (securite / regate / meteo / manoeuvres).

Contenu : `lib/content/` (`modules.ts`, `levels.ts`, `badges.ts`, `scenarios.ts`).
Logique : `lib/engine/` (`points-of-sail.ts`, `wind-trainer.ts`, `adaptive.ts`).

## 6. Logique LocalStorage

`lib/progress/store.tsx` expose un `ProgressProvider` + hook `useProgress()` :

- chargement initial tolérant aux erreurs (mode privé / quota / version) ;
- **versionné** (`STATE_VERSION`) : un changement de schéma repart proprement ;
- persistance automatique à chaque mutation ;
- gestion du **streak** à l'ouverture (série rompue si > 1 jour d'absence) ;
- API : `completeLesson(id, score)` (XP + badges + niveau), `answerConcept`,
  `bumpScore`, `flagAchievement`, `reset`.

## 7. Design system

- **Palette** (`tailwind.config.ts`) : `abyss` (bleu nuit, fond), `lagoon`
  (surfaces), `spray` (turquoise écume, accent primaire), `sun` (or, XP/badges),
  `coral` (danger/erreur), `sail`/`foam` (clairs).
- **Typo** : display (serif) pour les titres, sans pour le corps.
- **Composants** (`globals.css`) : `.card`, `.btn-primary/-ghost/-sun`, `.pill`,
  `.label-caps`, ombres `card/lift/glow`.
- **Mobile-first** : conteneur `max-w-md`, cibles tactiles ≥ 44px, sliders
  custom, contrastes lisibles au soleil.
- **Animations** : transitions douces, bateau qui pivote (spring), voiles qui
  s'ouvrent, XP/badges qui apparaissent, indicateur de navigation animé.

## 8. Roadmap

### V1 — livrée (cette version)
- ✅ Dashboard, parcours 10 modules, lecteur de leçon, 3 simulateurs, carnet de bord
- ✅ 8 types d'exercices, moteur adaptatif (répétition espacée + points faibles)
- ✅ Gamification complète (XP, 6 niveaux, streak, 9 badges, scores thématiques)
- ✅ SVG interactifs : schéma bateau, cercle des allures, réglage de voile
- ✅ Build statique, 0 dépendance image externe, prêt Vercel

### V2 — pistes
- Contenu : plusieurs leçons par module, plus de scénarios, audio.
- Visuels : animation de virement/empannage, carte de crique cliquable, météo dynamique.
- Wind Trainer : mode « quiz chronométré », vent qui bascule (adonnante/refusante).
- Backend optionnel (sync multi-appareils, comptes), notifications de streak.
- Accessibilité : navigation clavier complète, mode contraste élevé.

### V3 — module avancé : **Race Tracker Lab** 🗺️ (futur, non développé)
Apprendre à **lire une cartographie de course comme un skipper** (inspiré des
cartographies de course type Vendée Arctique transmises par Bertrand).
Carte de course pédagogique, flotte concurrente, vent (direction/force), zones
météo, routes possibles, analyse de position, questions tactiques, débrief après
chaque décision, et un **mode « Bertrand »** pour analyser plus tard une situation
de régate réelle.

Ce module fait le **pont** entre l'apprentissage voile, Virtual Regatta, les
régates de Bertrand, la lecture météo et la prise de décision de skipper.

➡️ Architecture détaillée : [`docs/roadmap/race-tracker-lab.md`](docs/roadmap/race-tracker-lab.md)

---

## Structure du projet

```
app/                  pages (App Router)
components/            UI, SVG, blocs de leçon
lib/
  types.ts            modèle de données
  content/            modules, niveaux, badges, scénarios
  engine/             allures, wind trainer, moteur adaptatif
  progress/store.tsx  état persistant (localStorage)
```

*Application privée conçue pour Adrien. Le contenu pédagogique est une aide à
l'apprentissage et ne remplace ni une formation encadrée ni le jugement d'un
chef de bord en conditions réelles.*
