/**
 * Base de données de citations inspirantes
 * Une citation différente pour chaque jour
 */

export interface Quote {
  text: string;
  author: string;
}

export const INSPIRATIONAL_QUOTES: Quote[] = [
  {
    text: "Le succès est la somme de petits efforts répétés jour après jour.",
    author: "Robert Collier"
  },
  {
    text: "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
    author: "Steve Jobs"
  },
  {
    text: "Ne regardez pas l'horloge ; faites comme elle : avancez.",
    author: "Sam Levenson"
  },
  {
    text: "Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment est maintenant.",
    author: "Proverbe chinois"
  },
  {
    text: "Vous n'avez pas à être grand pour commencer, mais vous devez commencer pour être grand.",
    author: "Zig Ziglar"
  },
  {
    text: "La discipline est le pont entre les objectifs et les accomplissements.",
    author: "Jim Rohn"
  },
  {
    text: "Le futur appartient à ceux qui croient en la beauté de leurs rêves.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Chaque accomplissement commence par la décision d'essayer.",
    author: "John F. Kennedy"
  },
  {
    text: "La motivation vous fait démarrer. L'habitude vous fait continuer.",
    author: "Jim Ryun"
  },
  {
    text: "Ne comptez pas les jours, faites que les jours comptent.",
    author: "Muhammad Ali"
  },
  {
    text: "L'excellence n'est pas une destination ; c'est un voyage continu qui ne s'arrête jamais.",
    author: "Brian Tracy"
  },
  {
    text: "Un objectif sans plan n'est qu'un souhait.",
    author: "Antoine de Saint-Exupéry"
  },
  {
    text: "Le secret pour avancer est de commencer.",
    author: "Mark Twain"
  },
  {
    text: "La seule limite à notre réalisation de demain sera nos doutes d'aujourd'hui.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Croyez que vous pouvez et vous êtes déjà à mi-chemin.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
    author: "Winston Churchill"
  },
  {
    text: "Votre temps est limité, ne le gaspillez pas en vivant la vie de quelqu'un d'autre.",
    author: "Steve Jobs"
  },
  {
    text: "La créativité, c'est l'intelligence qui s'amuse.",
    author: "Albert Einstein"
  },
  {
    text: "La vie est 10% ce qui nous arrive et 90% comment nous y réagissons.",
    author: "Charles R. Swindoll"
  },
  {
    text: "Les opportunités ne se produisent pas, vous les créez.",
    author: "Chris Grosser"
  },
  {
    text: "La seule personne que vous êtes destiné à devenir est la personne que vous décidez d'être.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Il n'est jamais trop tard pour être ce que vous auriez pu être.",
    author: "George Eliot"
  },
  {
    text: "Si vous voulez quelque chose que vous n'avez jamais eu, vous devez être prêt à faire quelque chose que vous n'avez jamais fait.",
    author: "Thomas Jefferson"
  },
  {
    text: "Les gagnants trouvent des moyens, les perdants trouvent des excuses.",
    author: "F.D. Roosevelt"
  },
  {
    text: "La perfection n'est pas atteignable, mais si nous poursuivons la perfection, nous pouvons atteindre l'excellence.",
    author: "Vince Lombardi"
  },
  {
    text: "L'action est la clé fondamentale de tout succès.",
    author: "Pablo Picasso"
  },
  {
    text: "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme.",
    author: "Winston Churchill"
  },
  {
    text: "Ce que nous pensons, nous le devenons.",
    author: "Bouddha"
  },
  {
    text: "La simplicité est la sophistication suprême.",
    author: "Léonard de Vinci"
  },
  {
    text: "La vie commence là où commence votre zone de confort.",
    author: "Neale Donald Walsch"
  },
  {
    text: "N'attendez pas que les opportunités se présentent. Créez-les.",
    author: "Roy T. Bennett"
  },
  {
    text: "La meilleure revanche est un succès massif.",
    author: "Frank Sinatra"
  },
  {
    text: "Les petites actions répétées créent de grands résultats.",
    author: "Robin Sharma"
  },
  {
    text: "Commencez où vous êtes. Utilisez ce que vous avez. Faites ce que vous pouvez.",
    author: "Arthur Ashe"
  },
  {
    text: "Le travail acharné bat le talent quand le talent ne travaille pas dur.",
    author: "Tim Notke"
  },
  {
    text: "Soyez le changement que vous voulez voir dans le monde.",
    author: "Gandhi"
  },
  {
    text: "La différence entre l'ordinaire et l'extraordinaire est ce petit 'extra'.",
    author: "Jimmy Johnson"
  },
  {
    text: "Votre attitude, pas votre aptitude, déterminera votre altitude.",
    author: "Zig Ziglar"
  },
  {
    text: "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès.",
    author: "Albert Schweitzer"
  },
  {
    text: "Faites de chaque jour votre chef-d'œuvre.",
    author: "John Wooden"
  },
  {
    text: "La vie est faite de choix. Aujourd'hui, faites les bons.",
    author: "Anonyme"
  },
  {
    text: "Ne laissez jamais la peur de frapper vous empêcher de jouer le jeu.",
    author: "Babe Ruth"
  },
  {
    text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.",
    author: "Sénèque"
  },
  {
    text: "La meilleure façon de prédire l'avenir est de le créer.",
    author: "Peter Drucker"
  },
  {
    text: "Un peu de progrès chaque jour s'additionne à de grands résultats.",
    author: "Satya Nani"
  },
  {
    text: "Les perdants ont des excuses. Les gagnants ont des plans.",
    author: "Anonyme"
  },
  {
    text: "La persistance garantit que les résultats sont inévitables.",
    author: "Paramahansa Yogananda"
  },
  {
    text: "Vous manquez 100% des coups que vous ne tentez pas.",
    author: "Wayne Gretzky"
  },
  {
    text: "Le courage n'est pas l'absence de peur, mais la capacité de la vaincre.",
    author: "Nelson Mandela"
  },
  {
    text: "Chaque expert a d'abord été un débutant.",
    author: "Helen Hayes"
  },
  {
    text: "La vie est courte. Souriez pendant que vous avez encore des dents.",
    author: "Mallory Hopkins"
  },
  {
    text: "Les rêves ne fonctionnent pas à moins que vous ne le fassiez.",
    author: "John C. Maxwell"
  },
  {
    text: "Soyez plus fort que vos excuses.",
    author: "Anonyme"
  },
  {
    text: "Le succès, c'est la somme de petits efforts répétés jour après jour.",
    author: "Robert Collier"
  },
  {
    text: "N'abandonnez jamais un rêve à cause du temps qu'il faudra pour l'accomplir. Le temps passera de toute façon.",
    author: "Earl Nightingale"
  },
  {
    text: "La vie commence à la fin de votre zone de confort.",
    author: "Neale Donald Walsch"
  },
  {
    text: "Si vous n'aimez pas où vous êtes, changez-le. Vous n'êtes pas un arbre.",
    author: "Jim Rohn"
  },
  {
    text: "Le seul endroit où le succès vient avant le travail est dans le dictionnaire.",
    author: "Vidal Sassoon"
  },
  {
    text: "Ne vous contentez pas de l'ordinaire.",
    author: "Steve Jobs"
  },
  {
    text: "Agissez comme si ce que vous faites fait une différence. C'est le cas.",
    author: "William James"
  },
  {
    text: "La réussite appartient à ceux qui y croient.",
    author: "Orison Swett Marden"
  },
  {
    text: "Chaque matin nous naissons à nouveau. Ce que nous faisons aujourd'hui compte le plus.",
    author: "Bouddha"
  },
  {
    text: "Les obstacles sont ces choses effrayantes que vous voyez quand vous détournez les yeux de votre objectif.",
    author: "Henry Ford"
  },
  {
    text: "Le bonheur n'est pas par hasard, mais par choix.",
    author: "Jim Rohn"
  },
  {
    text: "Ce qui nous attend n'est rien comparé à ce qui est en nous.",
    author: "Ralph Waldo Emerson"
  }
];

/**
 * Obtient la citation du jour basée sur la date actuelle
 * Utilise un index rotatif pour garantir une citation différente chaque jour
 */
export const getDailyQuote = (): Quote => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Utilise le modulo pour faire tourner les citations
  const index = dayOfYear % INSPIRATIONAL_QUOTES.length;
  
  return INSPIRATIONAL_QUOTES[index];
};
