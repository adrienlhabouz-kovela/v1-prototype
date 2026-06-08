// Scénarios des simulateurs Croisière & Régate.

export interface Choice {
  label: string;
  /** Effet sur les scores et qualité de la décision. */
  good: boolean;
  feedback: string;
  /** Deltas de score (sécurité / confort pour la croisière). */
  securite?: number;
  confort?: number;
}

export interface CruiseScenario {
  id: string;
  title: string;
  from: string;
  to: string;
  distanceNM: number;
  crew: string;
  conditions: {
    wind: string;
    sea: string;
    evolution: string;
  };
  constraints: string;
  /** Décision attendue. */
  recommended: "GO" | "NO-GO";
  decisionExplain: string;
  /** Choix secondaire (mouillage, route, plan B). */
  followUp: {
    prompt: string;
    options: Choice[];
  };
}

export const CRUISE_SCENARIOS: CruiseScenario[] = [
  {
    id: "nice-stjean",
    title: "Première sortie côtière",
    from: "Nice",
    to: "Saint-Jean-Cap-Ferrat",
    distanceNM: 6,
    crew: "Adrien + 1, débutants",
    conditions: {
      wind: "Sud-Ouest 10-12 nœuds, rafales 14",
      sea: "Mer belle, houle résiduelle 0,3 m",
      evolution: "Stable toute la journée, thermique faiblissant le soir",
    },
    constraints: "Retour avant la nuit, peu d'expérience de mouillage.",
    recommended: "GO",
    decisionExplain:
      "GO franc : courte distance, brise maniable, mer plate, conditions stables. Le terrain idéal pour une première croisière côtière à deux.",
    followUp: {
      prompt: "Tu arrives dans la rade de Saint-Jean. Où mouilles-tu pour déjeuner ?",
      options: [
        {
          label: "Plein milieu, là où c'est profond",
          good: false,
          feedback: "Trop profond = beaucoup de chaîne et grand cercle d'évitage, près des autres. Peu pratique.",
          securite: -5,
          confort: -5,
        },
        {
          label: "Près du bord sablonneux, abrité du Sud-Ouest, 4 m d'eau",
          good: true,
          feedback: "Parfait : abri du vent du jour, fond de sable qui tient, profondeur raisonnable pour 15-20 m de chaîne.",
          securite: 15,
          confort: 15,
        },
        {
          label: "Au plus près de la plage bondée",
          good: false,
          feedback: "Trop près des baigneurs (zone interdite à <300 m balisée) et risque de talonner. On s'écarte.",
          securite: -10,
          confort: 0,
        },
      ],
    },
  },
  {
    id: "nice-menton",
    title: "Le long de la côte",
    from: "Nice",
    to: "Menton",
    distanceNM: 17,
    crew: "Adrien + 1",
    conditions: {
      wind: "Est 18-22 nœuds, rafales 28, pile dans le nez",
      sea: "Mer agitée, clapot court 1 m",
      evolution: "Vent qui forcit l'après-midi",
    },
    constraints: "Route plein Est = au près tout du long. Retour le soir.",
    recommended: "NO-GO",
    decisionExplain:
      "NO-GO. Vent d'Est soutenu et forcissant, pile dans la route : 17 milles au près dans le clapot, à deux, c'est épuisant et long. Là tu pars confiant, mais la météo te prépare une petite facture. On reporte ou on raccourcit.",
    followUp: {
      prompt: "Tu décides quand même de sortir le nez dehors. Quel plan B raisonnable ?",
      options: [
        {
          label: "Forcer jusqu'à Menton coûte que coûte",
          good: false,
          feedback: "S'entêter au près dans 25 nœuds forcissants à deux : c'est comme ça qu'on casse du matériel ou de l'équipage.",
          securite: -20,
          confort: -15,
        },
        {
          label: "Viser Cap-Ferrat / Villefranche, plus proche et sous le vent",
          good: true,
          feedback: "Bon réflexe : on raccourcit, on reste près d'abris, on garde une porte de sortie. La mer sera toujours là demain.",
          securite: 15,
          confort: 10,
        },
        {
          label: "Mouiller en pleine côte exposée à l'Est",
          good: false,
          feedback: "Mouiller au vent et à la houle, c'est rouler toute la nuit et risquer de chasser. Mauvaise idée.",
          securite: -15,
          confort: -10,
        },
      ],
    },
  },
  {
    id: "antibes-lerins",
    title: "Escapade aux îles",
    from: "Antibes",
    to: "Îles de Lérins",
    distanceNM: 9,
    crew: "Adrien + 1 + 2 invités",
    conditions: {
      wind: "Ouest 14 nœuds, rafales 18",
      sea: "Mer peu agitée, houle 0,5 m d'Ouest",
      evolution: "Stable, brise tombant en fin de journée",
    },
    constraints: "Mouillage pour la nuit avec invités peu marins.",
    recommended: "GO",
    decisionExplain:
      "GO : distance courte, brise agréable, conditions stables. Attention au choix du mouillage de nuit avec un équipage peu aguerri.",
    followUp: {
      prompt: "Tu mouilles pour la nuit aux Lérins. Ton réflexe avant de dormir ?",
      options: [
        {
          label: "Prendre des amers et vérifier l'évitage et la chaîne",
          good: true,
          feedback: "Exactement. Repères à terre + bonne longueur de chaîne + vérif météo nocturne = nuit tranquille.",
          securite: 18,
          confort: 12,
        },
        {
          label: "Couper la nav et aller dormir, l'ancre tiendra bien",
          good: false,
          feedback: "L'ancre qui chasse la nuit sans surveillance, c'est le grand classique des galères. On garde un œil (alarme de mouillage).",
          securite: -12,
          confort: -5,
        },
        {
          label: "Mouiller côté exposé pour la vue au lever",
          good: false,
          feedback: "La vue ne vaut pas une nuit à rouler et un équipage malade. Abri d'abord.",
          securite: -8,
          confort: -12,
        },
      ],
    },
  },
  {
    id: "corse",
    title: "Traversée vers la Corse (fictive)",
    from: "Côte d'Azur",
    to: "Cap corse fictif",
    distanceNM: 95,
    crew: "Adrien + 1, peu d'hauturier",
    conditions: {
      wind: "Nord-Ouest 15 nœuds montant à 25 la nuit, rafales 30",
      sea: "Houle 1,5 m se creusant, traversée de nuit",
      evolution: "Dégradation annoncée à mi-parcours",
    },
    constraints: "Traversée de nuit, hors de vue des côtes, à deux.",
    recommended: "NO-GO",
    decisionExplain:
      "NO-GO pour ce niveau : 95 milles de nuit, à deux, avec une dégradation annoncée à mi-chemin et plus d'abri possible. Une traversée se tente avec une vraie fenêtre météo et de l'expérience hauturière. On attend la bonne fenêtre.",
    followUp: {
      prompt: "Comment prépares-tu correctement une telle traversée pour plus tard ?",
      options: [
        {
          label: "Fenêtre météo stable, quart organisé, sécurité et avitaillement vérifiés",
          good: true,
          feedback: "Voilà l'état d'esprit : on attend une vraie fenêtre, on organise les quarts, on prépare le bateau et l'équipage. C'est ça, devenir skipper.",
          securite: 20,
          confort: 10,
        },
        {
          label: "Partir vite avant que ça se dégrade",
          good: false,
          feedback: "Courir devant la dégradation sans marge, c'est précisément ce qu'il ne faut pas faire au large.",
          securite: -20,
          confort: -10,
        },
      ],
    },
  },
  {
    id: "sardaigne",
    title: "Cabotage en Sardaigne (fictive)",
    from: "Mouillage Nord",
    to: "Crique Sud abritée",
    distanceNM: 22,
    crew: "Adrien + 1, en confiance",
    conditions: {
      wind: "Sud 12 nœuds, rafales 16, régulier",
      sea: "Mer belle, houle 0,4 m",
      evolution: "Beau temps stable, brise thermique l'après-midi",
    },
    constraints: "Étape tranquille de cabotage, choix de mouillage pour la nuit.",
    recommended: "GO",
    decisionExplain:
      "GO : étape de cabotage idéale, conditions clémentes et stables, abris nombreux. C'est le genre de journée qui donne envie de continuer.",
    followUp: {
      prompt: "Le vent thermique de Sud monte l'après-midi. Quelle crique pour la nuit ?",
      options: [
        {
          label: "Une crique ouverte au Sud",
          good: false,
          feedback: "Ouverte au vent du soir = houle qui entre et nuit agitée. On cherche l'inverse.",
          securite: -10,
          confort: -12,
        },
        {
          label: "Une calanque abritée du Sud, fond de sable",
          good: true,
          feedback: "Parfait : abri du vent dominant du soir, bonne tenue, nuit au calme. Tu commences à raisonner en chef de bord.",
          securite: 16,
          confort: 16,
        },
      ],
    },
  },
];

// ── Régate ───────────────────────────────────────────────────────────────

export interface RegattaStep {
  id: string;
  phase: string;
  situation: string;
  options: {
    label: string;
    /** Effet sur le classement. */
    places: number; // + gagne, - perd
    feedback: string;
  }[];
}

export const REGATTA_STEPS: RegattaStep[] = [
  {
    id: "depart",
    phase: "Le départ",
    situation:
      "30 secondes avant le coup de canon. Tu es un peu en retard sur la ligne, côté comité, vent légèrement adonnant à droite.",
    options: [
      {
        label: "Accélérer pour franchir lancé, pile au canon",
        places: 2,
        feedback: "Bien joué : partir lancé dans le vent adonné de droite, c'est prendre l'avantage dès le premier bord.",
      },
      {
        label: "Franchir 5 secondes trop tôt",
        places: -2,
        feedback: "Rappel ! Tu dois revenir derrière la ligne : tu perds tout ton avantage et des places.",
      },
      {
        label: "Partir prudemment 15 s après les autres",
        places: -1,
        feedback: "Trop sage : tu pars dans le vent sale de la flotte et tu démarres dernier.",
      },
    ],
  },
  {
    id: "pres",
    phase: "Remontée au près",
    situation:
      "Un concurrent te colle juste au vent et te dévente. Le bord de droite semble plus venté (risée sombre sur l'eau).",
    options: [
      {
        label: "Virer pour dégager et aller chercher la risée à droite",
        places: 2,
        feedback: "Bon réflexe : on quitte le vent sale et on va vers la pression. Souvent payant.",
      },
      {
        label: "Rester dans son vent sale en serrant les dents",
        places: -2,
        feedback: "Tu ralentis dans l'air perturbé et tu te fais distancer. Ne reste jamais dans le vent sale.",
      },
      {
        label: "Abattre franchement pour accélérer",
        places: -1,
        feedback: "Tu gagnes un peu de vitesse mais tu t'éloignes de la marque au vent. Mauvais compromis ici.",
      },
    ],
  },
  {
    id: "bascule",
    phase: "Une refusante arrive",
    situation:
      "Bâbord amures, le vent refuse nettement : ton cap vers la bouée se dégrade. Que fais-tu ?",
    options: [
      {
        label: "Virer immédiatement pour profiter de la bascule",
        places: 2,
        feedback: "Exact : sur une refusante, on vire pour repartir sur le bord redevenu favorable. Des places se gagnent là.",
      },
      {
        label: "Continuer tout droit, ça va revenir",
        places: -2,
        feedback: "Tu navigues à contre-bascule et tu perds du terrain à chaque seconde. On vire sur la refusante.",
      },
    ],
  },
  {
    id: "priorite",
    phase: "Croisement",
    situation:
      "Tu es bâbord amures. Un concurrent arrive tribord amures, route de collision. Priorité à lui.",
    options: [
      {
        label: "Passer derrière lui proprement",
        places: 0,
        feedback: "Décision sûre : tu respectes la priorité tribord sans pénalité. On ne gagne pas de place mais on n'en perd pas non plus.",
      },
      {
        label: "Lofer pour passer devant de justesse",
        places: -2,
        feedback: "Risqué et souvent pénalisé : tribord est prioritaire. Tu écopes d'un tour de pénalité.",
      },
      {
        label: "Le forcer à s'écarter",
        places: -3,
        feedback: "Faute claire : bâbord doit éviter tribord. Pénalité, voire abandon. À éviter absolument.",
      },
    ],
  },
  {
    id: "bouee",
    phase: "Passage de la bouée au vent",
    situation:
      "Tu approches la bouée. La layline est encore loin et plusieurs bateaux convergent. Comment l'aborder ?",
    options: [
      {
        label: "Virer sur la layline au dernier moment, vitesse conservée",
        places: 2,
        feedback: "Propre : tu gardes tes options, tu arrives lancé et tu empannes/abats bien réglé. Belle bouée.",
      },
      {
        label: "Toucher la layline très tôt et très loin",
        places: -1,
        feedback: "Tu t'enfermes (overstanding) : la moindre bascule te coûte cher et tu fais trop de route.",
      },
      {
        label: "Couper à l'intérieur sans priorité",
        places: -2,
        feedback: "Sans l'engagement requis, tu n'as pas la place à la bouée : pénalité et bateaux énervés.",
      },
    ],
  },
];
