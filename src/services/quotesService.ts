export const dailyQuotes = [
  "Le succès c'est tomber sept fois et se relever huit. - Proverbe japonais",
  "La meilleure façon de prédire l'avenir est de le créer. - Peter Drucker",
  "Ne remettez pas à demain ce que vous pouvez faire aujourd'hui. - Benjamin Franklin",
  "La vie, c'est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre. - Albert Einstein",
  "Les opportunités ne se présentent pas, elles se créent. - Chris Grosser",
  "Le plus grand risque est de ne prendre aucun risque. - Mark Zuckerberg",
  "Votre temps est limité, ne le gaspillez pas en vivant la vie de quelqu'un d'autre. - Steve Jobs",
  "Croire que c'est possible est déjà la moitié du chemin parcouru. - Theodore Roosevelt",
  "Le seul endroit où le succès vient avant le travail, c'est dans le dictionnaire. - Vidal Sassoon",
  "La qualité n'est jamais un accident, c'est toujours le résultat d'un effort intelligent. - John Ruskin",
  "Le secret pour avancer, c'est de commencer. - Mark Twain",
  "La persévérance est la clé de toutes les portes fermées. - Proverbe arabe",
  "Un objectif sans plan n'est qu'un souhait. - Antoine de Saint-Exupéry",
  "Le succès est la somme de petits efforts répétés jour après jour. - Robert Collier",
  "Ne regarde pas l'horloge ; fais ce qu'elle fait. Continue. - Sam Levenson",
  "La discipline est le pont entre les objectifs et leur réalisation. - Jim Rohn",
  "Le futur appartient à ceux qui croient en la beauté de leurs rêves. - Eleanor Roosevelt",
  "L'excellence n'est pas un acte, mais une habitude. - Aristote",
  "Le courage n'est pas l'absence de peur, mais la capacité de vaincre ce qui fait peur. - Nelson Mandela",
  "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions. - Dalaï Lama",
  "Le seul échec est de ne pas essayer. - George Clooney",
  "Investissez en vous-même. Votre carrière est la roue de secours de votre vie. - Michelle Obama",
  "Si tu ne travailles pas pour tes rêves, quelqu'un t'embauchera pour travailler pour les siens. - Steve Jobs",
  "Le travail acharné bat le talent quand le talent ne travaille pas dur. - Tim Notke",
  "Les champions continuent de jouer jusqu'à ce qu'ils réussissent. - Billie Jean King",
  "Ne laissez jamais vos souvenirs être plus grands que vos rêves. - Doug Ivester",
  "La seule limite à notre réalisation de demain sera nos doutes d'aujourd'hui. - Franklin D. Roosevelt",
  "Le succès, c'est d'aller d'échec en échec sans perdre son enthousiasme. - Winston Churchill",
  "La vie est soit une aventure audacieuse, soit rien du tout. - Helen Keller",
  "Ne rêvez pas votre vie, vivez vos rêves. - Anonyme",
  "Le courage de commencer est ce qui sépare les rêveurs des réalisateurs. - Anonyme",
  "Le plus grand plaisir dans la vie, c'est de faire ce que les autres disent que vous ne pouvez pas faire. - Walter Bagehot",
  "La seule personne que vous êtes destiné à devenir est la personne que vous décidez d'être. - Ralph Waldo Emerson",
  "Votre attitude, pas votre aptitude, déterminera votre altitude. - Zig Ziglar",
  "La différence entre l'impossible et le possible réside dans la détermination. - Tommy Lasorda",
  "Les grands esprits discutent des idées, les esprits moyens discutent des événements, les petits esprits discutent des gens. - Eleanor Roosevelt",
  "La créativité, c'est l'intelligence qui s'amuse. - Albert Einstein",
  "Ne vous souciez pas des échecs, souciez-vous des chances que vous manquez quand vous n'essayez même pas. - Jack Canfield",
  "Le succès, c'est aimer ce que vous faites et faire ce que vous aimez. - Wayne Dyer",
  "La vie est comme une caméra. Concentrez-vous sur ce qui est important, capturez les bons moments, développez-les, et si ça ne marche pas, recommencez. - Anonyme",
  "Le bonheur est quand ce que vous pensez, ce que vous dites et ce que vous faites sont en harmonie. - Mahatma Gandhi",
  "L'éducation est l'arme la plus puissante que vous puissiez utiliser pour changer le monde. - Nelson Mandela",
  "La simplicité est la sophistication suprême. - Léonard de Vinci",
  "La patience est amère, mais son fruit est doux. - Jean-Jacques Rousseau",
  "Le but de la vie est de donner vie à un but. - Richard Bach",
  "La chance, c'est quand la préparation rencontre l'opportunité. - Sénèque",
  "La véritable éducation consiste à tirer le meilleur de soi-même. - Mahatma Gandhi",
  "Le plus grand voyageur n'est pas celui qui a fait dix fois le tour du monde, mais celui qui a fait une seule fois le tour de lui-même. - Confucius",
  "Le monde appartient à ceux qui se lèvent tôt. Mais surtout à ceux qui se lèvent tôt le week-end. - Anonyme",
  "Le meilleur moyen de prédire l'avenir, c'est de le créer. - Alan Kay"
];

export const getQuoteOfTheDay = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const quoteIndex = dayOfYear % dailyQuotes.length;
  return dailyQuotes[quoteIndex];
};

export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
  return dailyQuotes[randomIndex];
};