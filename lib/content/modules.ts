import type { Lesson, Module } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────
// Contenu pédagogique — 10 modules progressifs.
// Le ton : clair, motivant, premium, jamais infantilisant.
// ─────────────────────────────────────────────────────────────────────────

// Identifiants des zones du schéma bateau (doivent matcher le SVG BoatTopView).
export const BOAT_ZONES = [
  { id: "proue", label: "Proue", desc: "L'avant du bateau." },
  { id: "poupe", label: "Poupe", desc: "L'arrière du bateau." },
  { id: "babord", label: "Bâbord", desc: "Le côté gauche quand on regarde vers l'avant." },
  { id: "tribord", label: "Tribord", desc: "Le côté droit quand on regarde vers l'avant." },
  { id: "cockpit", label: "Cockpit", desc: "Là où l'équipage manœuvre et barre." },
  { id: "mat", label: "Mât", desc: "Le grand espar vertical qui porte les voiles." },
  { id: "bome", label: "Bôme", desc: "L'espar horizontal en bas de la grand-voile." },
  { id: "quille", label: "Quille", desc: "L'aileron lesté sous la coque : anti-dérive et stabilité." },
  { id: "safran", label: "Safran", desc: "La pelle immergée qui dirige le bateau." },
  { id: "winch", label: "Winch", desc: "Le treuil qui démultiplie l'effort sur les écoutes." },
  { id: "taquet", label: "Taquet", desc: "La pièce où l'on amarre / bloque un cordage." },
] as const;

const m1: Module = {
  id: "bateau",
  index: 1,
  title: "Découvrir le bateau",
  subtitle: "Le vocabulaire de base",
  goal: "Nommer les parties principales du voilier.",
  glyph: "⛵",
  accent: "lagoon",
  lessons: [
    {
      id: "bateau-1",
      moduleId: "bateau",
      title: "Les parties du voilier",
      goal: "Repérer proue, poupe, bâbord, tribord et le gréement.",
      minutes: 8,
      xp: 60,
      blocks: [
        {
          id: "b-intro",
          kind: "text",
          title: "On parle bateau",
          body: "Avant de toucher une écoute, il faut nommer les choses. À bord, « gauche » et « droite » dépendent de qui regarde où. On utilise donc un vocabulaire fixe, lié au bateau lui-même.",
        },
        {
          id: "b-diagram",
          kind: "boatDiagram",
          title: "Touche les zones",
          body: "Explore le schéma : chaque zone t'explique son rôle.",
        },
        {
          id: "b-cards",
          kind: "flashcards",
          title: "Mémorise les essentiels",
          flashcards: [
            { id: "f1", front: "Bâbord", back: "Le côté GAUCHE, face à l'avant. Astuce : « bâbord » et « gauche » ont… des lettres en commun, et le feu est rouge.", hint: "Côté du feu rouge" },
            { id: "f2", front: "Tribord", back: "Le côté DROIT, face à l'avant. Feu vert.", hint: "Feu vert" },
            { id: "f3", front: "Proue", back: "L'avant du bateau (l'étrave fend l'eau)." },
            { id: "f4", front: "Poupe", back: "L'arrière du bateau (le tableau arrière)." },
            { id: "f5", front: "Bôme", back: "L'espar horizontal au pied de la grand-voile. Elle balaie le cockpit lors des manœuvres : tête baissée !", hint: "Attention à la tête" },
            { id: "f6", front: "Quille", back: "L'aileron lesté sous la coque : empêche la dérive et redresse le bateau." },
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "clickZone",
          prompt: "Clique sur BÂBORD.",
          target: "babord",
          explanation: "Bâbord = gauche face à l'avant, côté du feu rouge. Tout le monde confond au début ; le problème, c'est de le faire en arrivant au ponton.",
          concept: "babord-tribord",
        },
        {
          id: "q2",
          kind: "clickZone",
          prompt: "Clique sur la PROUE.",
          target: "proue",
          explanation: "La proue, c'est l'avant. La poupe, c'est l'arrière. Facile à retenir : la proue « propulse » vers l'avant.",
          concept: "proue-poupe",
        },
        {
          id: "q3",
          kind: "qcm",
          prompt: "À quoi sert la quille ?",
          options: [
            "À ranger les voiles",
            "À empêcher la dérive et stabiliser le bateau",
            "À diriger le bateau",
            "À accrocher l'ancre",
          ],
          correct: 1,
          explanation: "La quille est lestée : elle limite la dérive sous le vent et redresse le bateau quand il gîte. Le safran, lui, dirige.",
          concept: "quille",
        },
        {
          id: "q4",
          kind: "trueFalse",
          prompt: "Le winch sert à démultiplier l'effort pour border une voile.",
          answer: true,
          explanation: "Exact. Le winch est un treuil : avec la manivelle, on borde une voile très chargée sans s'arracher les bras.",
          concept: "winch",
        },
      ],
    },
  ],
};

const m2: Module = {
  id: "vent",
  index: 2,
  title: "Comprendre le vent",
  subtitle: "Réel, apparent, et la zone interdite",
  goal: "Savoir d'où vient le vent et comment le bateau réagit.",
  glyph: "🌬️",
  accent: "spray",
  lessons: [
    {
      id: "vent-1",
      moduleId: "vent",
      title: "Vent réel & vent apparent",
      goal: "Distinguer le vent que tu sens du vent qui fait avancer.",
      minutes: 10,
      xp: 70,
      blocks: [
        {
          id: "v-intro",
          kind: "text",
          title: "Le vent, ton moteur",
          body: "Le vent réel est celui qui souffle sur l'eau. Mais dès que le bateau avance, il crée son propre vent (comme la main par la fenêtre d'une voiture). La combinaison des deux, c'est le vent apparent — et c'est lui que ressentent les voiles et la girouette.",
        },
        {
          id: "v-rose",
          kind: "windRose",
          title: "Rose des vents",
          body: "Fais tourner le vent et observe la zone interdite (face au vent) où aucune voile ne porte.",
        },
        {
          id: "v-callout",
          kind: "callout",
          title: "Adonnante vs refusante",
          body: "Une bascule ADONNANTE te permet de remonter plus près de ta route (le vent « t'aide »). Une REFUSANTE t'oblige à abattre ou virer. En régate, lire ces bascules fait gagner des places.",
        },
        {
          id: "v-cards",
          kind: "flashcards",
          title: "Le lexique du vent",
          flashcards: [
            { id: "f1", front: "Vent réel", back: "Le vent qui souffle réellement sur le plan d'eau, indépendant du bateau." },
            { id: "f2", front: "Vent apparent", back: "Vent réel + vent créé par la vitesse du bateau. Toujours plus en avant et souvent plus fort." },
            { id: "f3", front: "Zone interdite", back: "Le secteur d'environ ±35° face au vent où le bateau ne peut pas avancer : les voiles faseyent." },
            { id: "f4", front: "Adonnante", back: "Bascule du vent qui te laisse remonter plus près de ta destination." },
            { id: "f5", front: "Refusante", back: "Bascule qui te repousse : tu dois abattre ou virer." },
            { id: "f6", front: "Rafale / molle", back: "Renforcement / faiblissement momentané du vent. La rafale tend, la molle relâche." },
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "windAngle",
          prompt: "Place le bateau dans la ZONE INTERDITE (face au vent).",
          target: 0,
          tolerance: 30,
          explanation: "Face au vent (±35°), les voiles faseyent et le bateau cale. Pour avancer, il faut s'écarter de cet axe.",
          concept: "zone-interdite",
        },
        {
          id: "q2",
          kind: "trueFalse",
          prompt: "Le vent apparent est toujours plus reculé que le vent réel.",
          answer: false,
          explanation: "Au contraire : le vent apparent est décalé vers l'AVANT, car le bateau ajoute son propre vent de vitesse. C'est pour ça qu'on borde plus que prévu en accélérant.",
          concept: "vent-apparent",
        },
        {
          id: "q3",
          kind: "qcm",
          prompt: "Le vent bascule et tu peux soudain pointer plus vers ta destination au près. C'est…",
          options: ["une refusante", "une adonnante", "une molle", "une rafale"],
          correct: 1,
          explanation: "C'est une adonnante : le vent « t'adonne » et tu remontes mieux. Profites-en. Une refusante ferait l'inverse.",
          concept: "adonnante-refusante",
        },
        {
          id: "q4",
          kind: "qcm",
          prompt: "Une rafale arrive. Que se passe-t-il d'abord ?",
          options: [
            "Le bateau ralentit",
            "Le bateau gîte davantage et accélère",
            "Le vent passe derrière",
            "Rien, c'est une molle",
          ],
          correct: 1,
          explanation: "La rafale apporte plus de puissance : gîte et vitesse augmentent. On peut choquer un peu ou lofer légèrement pour absorber.",
          concept: "rafales",
        },
      ],
    },
  ],
};

const m3: Module = {
  id: "allures",
  index: 3,
  title: "Les allures",
  subtitle: "Adapter le bateau à l'angle au vent",
  goal: "Reconnaître chaque allure et son réglage.",
  glyph: "📐",
  accent: "lagoon",
  lessons: [
    {
      id: "allures-1",
      moduleId: "allures",
      title: "Du près au vent arrière",
      goal: "Identifier l'allure selon l'angle au vent.",
      minutes: 12,
      xp: 80,
      blocks: [
        {
          id: "a-intro",
          kind: "text",
          title: "Une allure = un angle",
          body: "L'allure décrit l'angle entre l'axe du bateau et le vent. Plus tu t'éloignes du vent (tu « abats »), plus l'allure est ouverte. Plus tu t'en rapproches (tu « lofes »), plus elle est fermée. Chaque allure a sa vitesse, sa voile et son piège.",
        },
        {
          id: "a-circle",
          kind: "pointsOfSail",
          title: "Cercle des allures",
          body: "Déplace le bateau autour du vent : l'app te dit l'allure, la voile et l'erreur à éviter.",
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "windAngle",
          prompt: "Place le bateau au TRAVERS (vent de côté, ~90°).",
          target: 90,
          tolerance: 15,
          explanation: "Au travers, le vent vient à 90°. C'est souvent l'allure la plus rapide et la plus confortable.",
          concept: "allure-travers",
          hints: [
            "Pense à l'allure où le vent arrive sur le côté du bateau.",
            "Cette allure est souvent la plus confortable et performante.",
          ],
        },
        {
          id: "q2",
          kind: "windAngle",
          prompt: "Place le bateau au PRÈS SERRÉ (au plus près du vent).",
          target: 42,
          tolerance: 12,
          explanation: "Au près serré (~40-45°), on remonte au vent voiles bordées. Plus près, on entre dans la zone interdite et on cale.",
          concept: "allure-pres",
        },
        {
          id: "q3",
          kind: "qcm",
          prompt: "À quelle allure les voiles sont-elles le plus largement choquées ?",
          options: ["Près serré", "Travers", "Grand largue / vent arrière", "Bon plein"],
          correct: 2,
          explanation: "Plus l'allure est ouverte (largue, grand largue, vent arrière), plus on choque pour offrir la voile au vent.",
          concept: "reglage-allure",
        },
        {
          id: "q4",
          kind: "qcm",
          prompt: "Erreur classique au près : tu lofes trop. Que se passe-t-il ?",
          options: [
            "Tu accélères",
            "Les voiles faseyent et tu cales",
            "Tu empannes",
            "Tu pars au largue",
          ],
          correct: 1,
          explanation: "Trop près du vent, les voiles dégonflent (faseyent) et la vitesse chute. Il faut abattre légèrement pour reprendre de l'erre.",
          concept: "erreur-lof",
        },
      ],
    },
  ],
};

const m4: Module = {
  id: "voiles",
  index: 4,
  title: "Les voiles",
  subtitle: "La bonne voile au bon moment",
  goal: "Choisir la voile selon vent, allure et objectif.",
  glyph: "🪂",
  accent: "spray",
  lessons: [
    {
      id: "voiles-1",
      moduleId: "voiles",
      title: "Garde-robe du voilier",
      goal: "Connaître chaque voile et quand l'utiliser.",
      minutes: 10,
      xp: 70,
      blocks: [
        {
          id: "vo-intro",
          kind: "text",
          title: "Sécurité vs vitesse",
          body: "Choisir une voile, c'est arbitrer. Une grande voile légère (spi, code 0) = vitesse mais exigence et risque. Une toile réduite (foc, tourmentin) = sécurité et contrôle. Le bon équipage choisit selon le vent, l'allure ET son niveau.",
        },
        {
          id: "vo-cards",
          kind: "flashcards",
          title: "Les voiles",
          flashcards: [
            { id: "f1", front: "Grand-voile (GV)", back: "La voile principale, sur le mât et la bôme. Présente à presque toutes les allures." },
            { id: "f2", front: "Foc", back: "Petite voile d'avant, pour le près et le vent soutenu. Maniable et sûr." },
            { id: "f3", front: "Génois", back: "Grande voile d'avant qui recouvre la GV. Puissant dans le petit temps." },
            { id: "f4", front: "Spi symétrique", back: "Grand ballon pour le vent arrière. Puissant mais technique (tangon)." },
            { id: "f5", front: "Spi asymétrique", back: "Spi sans tangon, idéal au largue. Plus simple à manœuvrer." },
            { id: "f6", front: "Code 0", back: "Voile de portant serré / reaching dans le petit temps. Entre génois et spi." },
            { id: "f7", front: "Gennaker", back: "Hybride génois/spi pour le largue dans la brise légère." },
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "chooseSail",
          prompt: "Vent arrière, brise légère, croisière tranquille. Quelle voile d'avant ?",
          options: ["Tourmentin", "Spi symétrique", "Foc", "Aucune"],
          correct: 1,
          explanation: "Au vent arrière par petit temps, le spi symétrique capte un max de vent. En équipage réduit ou peu sûr, le génois en ciseaux reste une option plus sage.",
          concept: "choix-spi",
        },
        {
          id: "q2",
          kind: "chooseSail",
          prompt: "25 nœuds, mer formée, équipage à deux fatigué. Priorité ?",
          options: ["Spi asymétrique", "Génois full", "Foc / toile réduite", "Code 0"],
          correct: 2,
          explanation: "Quand ça souffle et que l'équipage est juste, on choisit la sécurité : toile réduite, bateau contrôlable. La vitesse passe après.",
          concept: "securite-vs-vitesse",
        },
        {
          id: "q3",
          kind: "trueFalse",
          prompt: "Le génois est plus grand que le foc.",
          answer: true,
          explanation: "Le génois recouvre la grand-voile et offre plus de surface : puissant dans le petit temps, mais à réduire quand ça forcit.",
          concept: "genois-foc",
        },
      ],
    },
  ],
};

const m5: Module = {
  id: "reglages",
  index: 5,
  title: "Réglages",
  subtitle: "Pourquoi ça accélère ou ça cale",
  goal: "Comprendre border / choquer, puissance et équilibre.",
  glyph: "🎚️",
  accent: "lagoon",
  lessons: [
    {
      id: "reglages-1",
      moduleId: "reglages",
      title: "Border, choquer, équilibrer",
      goal: "Régler une voile et gérer la surpuissance.",
      minutes: 11,
      xp: 80,
      blocks: [
        {
          id: "r-intro",
          kind: "text",
          title: "La voile est une aile",
          body: "Une voile bien réglée se comporte comme une aile d'avion : elle crée une force. Trop bordée, elle bride ; trop choquée, elle faseye et ne tire plus. Le bon réglage : la voile est à la limite du faseyement, juste « gonflée » sans dégonfler.",
        },
        {
          id: "r-trim",
          kind: "sailTrim",
          title: "Curseur d'écoute",
          body: "Joue avec l'écoute : observe la vitesse et la gîte. Trouve le réglage optimal.",
        },
        {
          id: "r-callout",
          kind: "callout",
          title: "Gîte = signal",
          body: "Une gîte modérée est normale et efficace. Une gîte excessive freine (la quille travaille mal, le safran décroche). Réponses : choquer, lofer, ou réduire la toile. Équilibre barre/voile : si la barre tire fort, c'est souvent que la GV est trop puissante.",
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "qcm",
          prompt: "Ta voile faseye (claque) sur son bord d'attaque. Que fais-tu ?",
          options: ["Tu choques", "Tu bordes un peu", "Tu lofes", "Rien"],
          correct: 1,
          explanation: "Si la voile faseye, c'est qu'elle est trop ouverte pour l'allure : on borde un peu jusqu'à ce qu'elle se gonfle proprement.",
          concept: "border-choquer",
        },
        {
          id: "q2",
          kind: "qcm",
          prompt: "Surpuissance : le bateau gîte trop dans une rafale. Réflexe le plus simple à la barre ?",
          options: [
            "Abattre vers le vent arrière",
            "Lofer légèrement et/ou choquer pour dévente",
            "Border à fond",
            "Lâcher la barre",
          ],
          correct: 1,
          explanation: "Lofer légèrement (remonter au vent) et choquer fait dévente la voile : la gîte diminue immédiatement. Au-delà, on réduit la toile.",
          concept: "surpuissance",
        },
        {
          id: "q3",
          kind: "trueFalse",
          prompt: "Le vrillage permet d'adapter le réglage du haut de la voile par rapport au bas.",
          answer: true,
          explanation: "Le vrillage ouvre le haut de la voile (où le vent est plus fort) pour évacuer la surpuissance et garder le bas efficace.",
          concept: "vrillage",
        },
      ],
    },
  ],
};

const m6: Module = {
  id: "manoeuvres",
  index: 6,
  title: "Manœuvres",
  subtitle: "Virer, empanner, réduire, secourir",
  goal: "Comprendre et participer aux manœuvres clés.",
  glyph: "🔄",
  accent: "sun",
  lessons: [
    {
      id: "manoeuvres-1",
      moduleId: "manoeuvres",
      title: "Le virement de bord",
      goal: "Maîtriser l'ordre des actions du virement.",
      minutes: 9,
      xp: 75,
      blocks: [
        {
          id: "ma-intro",
          kind: "text",
          title: "Changer de bord face au vent",
          body: "Virer de bord (virement vent debout), c'est passer l'avant du bateau à travers le lit du vent. La voile change de côté à l'avant. C'est la manœuvre la plus courante pour remonter au vent en zigzag.",
        },
        {
          id: "ma-timeline",
          kind: "maneuverTimeline",
          title: "Étape par étape",
          data: {
            steps: [
              "« Paré à virer ? » — l'équipage se prépare, mains sur les écoutes.",
              "« Envoyez ! / On vire » — le barreur loffe vers le vent.",
              "L'avant passe le lit du vent, le foc commence à faseyer.",
              "On choque l'ancienne écoute, on borde la nouvelle.",
              "Le bateau accélère sur le nouveau bord, on règle.",
            ],
          },
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "orderSteps",
          prompt: "Remets le virement de bord dans l'ordre.",
          steps: [
            "Annoncer « Paré à virer ? »",
            "Lofer vers le vent (barre)",
            "Passer le lit du vent",
            "Choquer l'ancien côté, border le nouveau",
            "Régler et accélérer sur le nouveau bord",
          ],
          explanation: "On prévient, on loffe, on traverse le vent, on change les écoutes, on règle. La communication évite les emmêlages et les doigts coincés.",
          concept: "virement-ordre",
        },
        {
          id: "q2",
          kind: "qcm",
          prompt: "Différence clé entre virement et empannage ?",
          options: [
            "Aucune",
            "Le virement passe l'avant face au vent, l'empannage passe l'arrière vent arrière",
            "Le virement se fait au moteur",
            "L'empannage est interdit",
          ],
          correct: 1,
          explanation: "Virement = l'avant traverse le vent (doux). Empannage = l'arrière passe sous le vent, la bôme traverse violemment : on contrôle l'écoute de GV impérativement.",
          concept: "virement-vs-empannage",
        },
        {
          id: "q3",
          kind: "chooseManeuver",
          prompt: "Le vent monte à 28 nœuds, le bateau est surtoilé et gîte fort. Manœuvre ?",
          options: ["Envoyer le spi", "Prendre un ris", "Empanner", "Mouiller l'ancre"],
          correct: 1,
          explanation: "Prendre un ris réduit la surface de grand-voile : le bateau se redresse et redevient pilotable. C'est LA réponse à la surpuissance durable.",
          concept: "prise-de-ris",
        },
        {
          id: "q4",
          kind: "qcm",
          prompt: "Homme à la mer : quel est le tout premier geste ?",
          options: [
            "Affaler toutes les voiles",
            "Crier « Homme à la mer », garder la personne en vue et jeter une bouée",
            "Appeler les secours",
            "Faire demi-tour au moteur sans regarder",
          ],
          correct: 1,
          explanation: "On alerte, un équipier garde la victime des yeux en permanence (et la pointe du doigt), on jette de la flottabilité. Perdre le contact visuel est le vrai danger.",
          concept: "homme-a-la-mer",
        },
      ],
    },
  ],
};

const m7: Module = {
  id: "mouillage",
  index: 7,
  title: "Mouillage & croisière",
  subtitle: "Poser l'ancre, vivre à bord",
  goal: "Préparer une croisière plaisir en sécurité.",
  glyph: "⚓",
  accent: "lagoon",
  lessons: [
    {
      id: "mouillage-1",
      moduleId: "mouillage",
      title: "Choisir et tenir un mouillage",
      goal: "Mouiller dans une crique sans déraper la nuit.",
      minutes: 11,
      xp: 80,
      blocks: [
        {
          id: "mo-intro",
          kind: "text",
          title: "Une ancre qui tient",
          body: "Un bon mouillage tient à 4 facteurs : abri du vent et de la houle, nature du fond (le sable tient mieux que la roche ou l'herbe), longueur de chaîne mouillée, et place pour éviter. Règle de base : mouiller 3 à 5 fois la profondeur en chaîne.",
        },
        {
          id: "mo-cards",
          kind: "flashcards",
          title: "Les réflexes croisière",
          flashcards: [
            { id: "f1", front: "Longueur de chaîne", back: "3 à 5× la hauteur d'eau (plus s'il forcit). Trop court = ça dérape." },
            { id: "f2", front: "Évitage", back: "Le cercle que décrit le bateau autour de son ancre quand le vent tourne. Vérifie que tu ne touches rien." },
            { id: "f3", front: "Amers / alignement", back: "Repères à terre pour détecter si l'ancre dérape pendant la nuit." },
            { id: "f4", front: "Avitaillement", back: "Eau, nourriture, gaz, énergie : prévoir avec marge. En Méditerranée, l'eau douce est la ressource critique." },
            { id: "f5", front: "Météo nocturne", back: "Vérifier le renforcement nocturne (brises thermiques, orages d'été) AVANT de dormir." },
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "qcm",
          prompt: "Profondeur 5 m. Combien de chaîne mouiller au minimum par temps calme ?",
          options: ["5 m", "10 m", "15 à 25 m", "50 m"],
          correct: 2,
          explanation: "3 à 5× la profondeur, soit 15-25 m ici. La chaîne couchée sur le fond fait l'essentiel de la tenue ; trop court, l'ancre se déterre.",
          concept: "longueur-chaine",
        },
        {
          id: "q2",
          kind: "qcm",
          prompt: "Tu choisis une crique pour la nuit. Critère prioritaire ?",
          options: [
            "La plus belle vue",
            "L'abri du vent prévu cette nuit et un bon fond de sable",
            "La plus proche du bar",
            "La plus profonde",
          ],
          correct: 1,
          explanation: "On mouille en pensant à la nuit, pas à l'instant. Un mouillage paradisiaque exposé au vent nocturne devient un piège. Abri + tenue d'abord.",
          concept: "choix-crique",
        },
        {
          id: "q3",
          kind: "trueFalse",
          prompt: "Une fois l'ancre posée, il est inutile de prendre des repères à terre.",
          answer: false,
          explanation: "Au contraire : un alignement d'amers permet de détecter un dérapage. Beaucoup de mésaventures nocturnes viennent d'une ancre qui chasse sans qu'on s'en aperçoive.",
          concept: "evitage-amers",
        },
      ],
    },
  ],
};

const m8: Module = {
  id: "meteo",
  index: 8,
  title: "Météo marine",
  subtitle: "Lire les conditions, décider",
  goal: "Lire la météo et décider go / no-go.",
  glyph: "🌦️",
  accent: "sun",
  lessons: [
    {
      id: "meteo-1",
      moduleId: "meteo",
      title: "Go ou No-Go ?",
      goal: "Croiser vent, houle et équipage pour décider.",
      minutes: 10,
      xp: 80,
      blocks: [
        {
          id: "me-intro",
          kind: "text",
          title: "Décider avant de larguer",
          body: "La meilleure décision météo se prend au ponton, café en main. On regarde la force du vent ET les rafales, la direction (de face ? portante ?), la houle (hauteur et période), et surtout l'évolution. Puis on confronte ça à son bateau et son équipage.",
        },
        {
          id: "me-cards",
          kind: "flashcards",
          title: "Les seuils utiles",
          flashcards: [
            { id: "f1", front: "Force 3-4 Beaufort", back: "≈ 7-16 nœuds. Brise idéale pour apprendre et naviguer confortablement." },
            { id: "f2", front: "Force 5-6", back: "≈ 17-27 nœuds. Ça travaille : ris, équipage aguerri, on réfléchit selon la route." },
            { id: "f3", front: "Rafales", back: "Regarde l'écart rafale/moyen. +40% = grain ou instabilité : prudence." },
            { id: "f4", front: "Houle : hauteur & période", back: "Une houle courte et hachée est plus pénible qu'une houle longue, même haute." },
            { id: "f5", front: "Évolution", back: "Vent qui forcit dans l'après-midi (thermique méditerranéen) : pars tôt, rentre tôt." },
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "goNoGo",
          prompt: "Sortie d'initiation à deux. Prévision : 12 nœuds établis, rafales 15, mer plate, stable. GO ou NO-GO ?",
          options: ["GO", "NO-GO"],
          correct: 0,
          explanation: "GO franc : brise maniable, peu de rafales, mer plate, conditions stables. Le terrain de jeu idéal pour progresser.",
          concept: "decision-meteo",
        },
        {
          id: "q2",
          kind: "goNoGo",
          prompt: "Même équipage débutant. Prévision : 22 nœuds, rafales 32, vent de face pour rentrer, mer formée, ça forcit. GO ou NO-GO ?",
          options: ["GO", "NO-GO"],
          correct: 1,
          explanation: "NO-GO. Beaucoup de vent qui forcit, fortes rafales, et surtout un retour au près dans la mer : épuisant et risqué à deux. Là tu pars confiant, mais la météo te prépare une facture.",
          concept: "decision-meteo",
        },
        {
          id: "q3",
          kind: "qcm",
          prompt: "Qu'est-ce qui doit le plus peser dans un go/no-go ?",
          options: [
            "L'envie de partir",
            "La force du vent seule",
            "Le croisement conditions × bateau × équipage × route de retour",
            "La couleur du ciel",
          ],
          correct: 2,
          explanation: "Une condition n'est ni bonne ni mauvaise dans l'absolu : elle l'est pour CE bateau, CET équipage et CETTE route. Le retour compte autant que l'aller.",
          concept: "decision-globale",
        },
      ],
    },
  ],
};

const m9: Module = {
  id: "navigation",
  index: 9,
  title: "Navigation côtière",
  subtitle: "Préparer une route simple",
  goal: "Tracer un cap, repérer dangers et abris.",
  glyph: "🧭",
  accent: "lagoon",
  lessons: [
    {
      id: "navigation-1",
      moduleId: "navigation",
      title: "Cap, dangers, balisage",
      goal: "Préparer une route côtière et lire les balises.",
      minutes: 10,
      xp: 80,
      blocks: [
        {
          id: "na-intro",
          kind: "text",
          title: "De A à B, prudemment",
          body: "Préparer une route, c'est choisir un cap, estimer la distance et le temps, repérer les dangers (hauts-fonds, cailloux, zones interdites) et identifier des abris en cas de pépin. On garde toujours une porte de sortie.",
        },
        {
          id: "na-cards",
          kind: "flashcards",
          title: "Le balisage (système A, Europe)",
          flashcards: [
            { id: "f1", front: "Marque latérale BÂBORD", back: "Rouge, cylindrique. On la laisse à bâbord en entrant au port (« rouge à gauche en rentrant »)." },
            { id: "f2", front: "Marque latérale TRIBORD", back: "Verte, conique. On la laisse à tribord en entrant au port." },
            { id: "f3", front: "Cardinale Nord", back: "On passe au Nord. Deux cônes pointes vers le haut." },
            { id: "f4", front: "Danger isolé", back: "Marque noire à bandes rouges, deux sphères. Il y a un danger juste là : on s'écarte." },
            { id: "f5", front: "Cap & distance", back: "Le cap se lit en degrés (0-360). 1 mille nautique ≈ 1,85 km ; à 5 nœuds tu fais 5 milles/heure." },
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "qcm",
          prompt: "Tu entres dans un port. Une marque ROUGE cylindrique : tu la laisses…",
          options: ["à tribord", "à bâbord", "tu fonces dessus", "ça dépend"],
          correct: 1,
          explanation: "« Rouge à gauche en rentrant » : on laisse la marque rouge à bâbord (gauche) en entrant au port. La verte à tribord.",
          concept: "balisage-lateral",
        },
        {
          id: "q2",
          kind: "qcm",
          prompt: "À 6 nœuds, combien de temps pour parcourir 12 milles nautiques ?",
          options: ["1 heure", "2 heures", "30 minutes", "12 heures"],
          correct: 1,
          explanation: "Distance / vitesse = 12 / 6 = 2 heures. Estimer le temps de route conditionne l'heure de départ et la météo à viser.",
          concept: "cap-distance",
        },
        {
          id: "q3",
          kind: "trueFalse",
          prompt: "Préparer une route, c'est aussi prévoir des abris de repli.",
          answer: true,
          explanation: "Toujours. Un bon plan de nav comporte des ports ou mouillages de repli si la météo tourne ou en cas d'avarie. On ne part jamais sans plan B.",
          concept: "abris-plan-b",
        },
      ],
    },
  ],
};

const m10: Module = {
  id: "regate",
  index: 10,
  title: "Régate avec Bertrand",
  subtitle: "Devenir utile à la barre et au réglage",
  goal: "Faire les bons choix tactiques en régate amateur.",
  glyph: "🏁",
  accent: "sun",
  lessons: [
    {
      id: "regate-1",
      moduleId: "regate",
      title: "Départ, près et tactique",
      goal: "Comprendre la ligne, les laylines et les priorités.",
      minutes: 12,
      xp: 90,
      blocks: [
        {
          id: "re-intro",
          kind: "text",
          title: "La régate, un jeu de placement",
          body: "En régate, on ne court pas qu'au plus vite : on se place. Bien partir, choisir le bon côté du plan d'eau, jouer les bascules et gérer les autres bateaux (priorités, dévente) compte autant que la vitesse pure. Ton rôle d'équipier : anticiper et communiquer.",
        },
        {
          id: "re-cards",
          kind: "flashcards",
          title: "Le vocabulaire tactique",
          flashcards: [
            { id: "f1", front: "La ligne de départ", back: "Entre le bateau comité et une bouée. On veut la franchir lancé, pile au coup de canon, pas avant (rappel)." },
            { id: "f2", front: "Layline", back: "La ligne imaginaire d'où l'on peut atteindre la bouée au près sans virer. La toucher trop tôt = perte de terrain." },
            { id: "f3", front: "Dévente / couverture", back: "Un bateau au vent te « dévente » (vent sale). En tête, tu peux « couvrir » l'adversaire en restant entre lui et la marque." },
            { id: "f4", front: "Priorités (base)", back: "Bâbord amure cède à tribord amure. Le bateau qui rattrape s'écarte. Sous le vent prioritaire sur celui au vent." },
            { id: "f5", front: "Lecture du plan d'eau", back: "Repérer les risées (zones sombres = plus de vent) et les bascules pour choisir son côté." },
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          kind: "qcm",
          prompt: "Tu es bâbord amures, un concurrent arrive tribord amures sur ta route. Qui a la priorité ?",
          options: ["Toi (bâbord)", "Lui (tribord)", "Personne", "Le plus rapide"],
          correct: 1,
          explanation: "Tribord amures est prioritaire sur bâbord amures. Tu dois l'éviter : virer, lofer ou passer derrière. Règle d'or des priorités.",
          concept: "priorite-tribord",
        },
        {
          id: "q2",
          kind: "chooseManeuver",
          prompt: "Au près, un adversaire te dévente juste au vent et tu ralentis. Bonne réaction ?",
          options: [
            "Continuer dans son vent sale",
            "Virer de bord pour trouver du vent propre",
            "Affaler",
            "Empanner",
          ],
          correct: 1,
          explanation: "On ne reste pas dans le vent sale : virer pour dégager et retrouver de l'air propre relance souvent mieux que de s'entêter.",
          concept: "vent-sale",
        },
        {
          id: "q3",
          kind: "trueFalse",
          prompt: "Toucher la layline très tôt et loin de la marque est généralement payant.",
          answer: false,
          explanation: "Non : arriver tôt sur la layline t'enferme (plus de marge pour jouer les bascules, et tu navigues « overstanding »). On garde des options le plus longtemps possible.",
          concept: "layline",
        },
      ],
    },
  ],
};

export const MODULES: Module[] = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10];

export function moduleById(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

export function lessonById(id: string): Lesson | undefined {
  for (const m of MODULES) {
    const l = m.lessons.find((x) => x.id === id);
    if (l) return l;
  }
  return undefined;
}

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

/** Concept → libellé lisible pour l'affichage des erreurs fréquentes. */
export const CONCEPT_LABELS: Record<string, string> = {
  "babord-tribord": "Bâbord / tribord",
  "proue-poupe": "Proue / poupe",
  quille: "Rôle de la quille",
  winch: "Le winch",
  "zone-interdite": "Zone interdite (près du vent)",
  "vent-apparent": "Vent apparent",
  "adonnante-refusante": "Adonnante / refusante",
  rafales: "Gérer les rafales",
  "allure-travers": "Allure du travers",
  "allure-pres": "Allure de près",
  "reglage-allure": "Réglage selon l'allure",
  "erreur-lof": "Lofer / abattre",
  "choix-spi": "Choisir le spi",
  "securite-vs-vitesse": "Sécurité vs vitesse",
  "genois-foc": "Génois vs foc",
  "border-choquer": "Border / choquer",
  surpuissance: "Gérer la surpuissance",
  vrillage: "Le vrillage",
  "virement-ordre": "Ordre du virement",
  "virement-vs-empannage": "Virement vs empannage",
  "prise-de-ris": "Prise de ris",
  "homme-a-la-mer": "Homme à la mer",
  "longueur-chaine": "Longueur de chaîne",
  "choix-crique": "Choisir un mouillage",
  "evitage-amers": "Évitage & amers",
  "decision-meteo": "Décision go / no-go",
  "decision-globale": "Décision globale",
  "balisage-lateral": "Balisage latéral",
  "cap-distance": "Cap & distance",
  "abris-plan-b": "Abris / plan B",
  "priorite-tribord": "Priorités (tribord)",
  "vent-sale": "Vent sale / dévente",
  layline: "Laylines",
  "regate-tactique": "Tactique de régate",
  "lecture-vent": "Lecture du vent (trainer)",
  "choix-mouillage": "Choix du mouillage",
};

export function conceptLabel(concept: string): string {
  return CONCEPT_LABELS[concept] ?? concept;
}
