export const en_dict = {
  guessForm: {
    notFound: "No Vehicles Found.",
  },
  guessList: {
    vehicle: "Vehicle",
    nation: "Nation",
    tier: "Tier",
    type: "Type",
    damage: "Alpha Damage",
    tankType: {
      lightTank: "Light",
      heavyTank: "Heavy",
      mediumTank: "Medium",
      "AT-SPG": "TD",
      SPG: "SPG",
    },
  },
  hintPanel: {
    speed: "km/h",
    tankType: {
      reward: "Reward Tank",
      premium: "Premium Tank",
      techTree: "Tech Tree Tank",
    },
    triesTilHint: (tries: number) => `In ${tries} tries`,
  },
  statistics: {
    title: "Statistics",
    gamesWon: "Games Won",
    avgGuesses: "Average Guesses",
    currentStreak: "Current Streak",
    maxStreak: "Max Streak",
    numGames: "Number of Games",
    numGuesses: "Number of Guesses",
    games: "Games",
    guesses: "Guesses",
  },
  prompt: {
    title: "Guess today's World of Tanks vehicle!",
    content: "Type any vehicle tier 8 - 10 to begin",
  },
  victory: {
    nextTank: "Next tank in",
    title: "Victory!",
    numTries: "Number of tries:",
  },
};
