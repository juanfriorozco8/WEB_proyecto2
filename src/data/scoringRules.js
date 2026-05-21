export const COMBINATIONS = {
  NONE: 'none',
  HIGH_CARD: 'high-card',
  PAIR: 'pair',
  TWO_PAIR: 'two-pair',
  THREE_OF_A_KIND: 'three-of-a-kind',
  STRAIGHT: 'straight',
  FLUSH: 'flush',
  FULL_HOUSE: 'full-house',
  FOUR_OF_A_KIND: 'four-of-a-kind',
  STRAIGHT_FLUSH: 'straight-flush'
};

export const COMBINATION_RULES = {
  [COMBINATIONS.NONE]: { id: COMBINATIONS.NONE, name: 'No hand', baseScore: 0, rank: 0 },
  [COMBINATIONS.HIGH_CARD]: { id: COMBINATIONS.HIGH_CARD, name: 'High card', baseScore: 10, rank: 1 },
  [COMBINATIONS.PAIR]: { id: COMBINATIONS.PAIR, name: 'Pair', baseScore: 30, rank: 2 },
  [COMBINATIONS.TWO_PAIR]: { id: COMBINATIONS.TWO_PAIR, name: 'Two pair', baseScore: 60, rank: 3 },
  [COMBINATIONS.THREE_OF_A_KIND]: {
    id: COMBINATIONS.THREE_OF_A_KIND,
    name: 'Three of a kind',
    baseScore: 90,
    rank: 4
  },
  [COMBINATIONS.STRAIGHT]: { id: COMBINATIONS.STRAIGHT, name: 'Straight', baseScore: 120, rank: 5 },
  [COMBINATIONS.FLUSH]: { id: COMBINATIONS.FLUSH, name: 'Flush', baseScore: 140, rank: 6 },
  [COMBINATIONS.FULL_HOUSE]: { id: COMBINATIONS.FULL_HOUSE, name: 'Full house', baseScore: 180, rank: 7 },
  [COMBINATIONS.FOUR_OF_A_KIND]: {
    id: COMBINATIONS.FOUR_OF_A_KIND,
    name: 'Four of a kind',
    baseScore: 240,
    rank: 8
  },
  [COMBINATIONS.STRAIGHT_FLUSH]: {
    id: COMBINATIONS.STRAIGHT_FLUSH,
    name: 'Straight flush',
    baseScore: 320,
    rank: 9
  }
};

export const BASE_SCORES = Object.fromEntries(
  Object.values(COMBINATION_RULES).map((rule) => [rule.id, rule.baseScore])
);

export const GAME_STATUS = {
  MENU: 'menu',
  PLAYING: 'playing',
  CHOOSING_JOKER: 'choosingJoker',
  GAME_OVER: 'gameOver'
};

export const HAND_SIZE = 8;
export const INITIAL_ROUND = 1;
export const INITIAL_TARGET_SCORE = 100;
export const TARGET_SCORE_FLAT_INCREASE = 75;
export const TARGET_SCORE_ROUND_MULTIPLIER = 25;

export function normalizeCombinationId(combination) {
  if (!combination) return COMBINATIONS.NONE;
  if (typeof combination === 'string') return combination.toLowerCase().replace(/\s+/g, '-');
  return normalizeCombinationId(combination.id ?? combination.name);
}

export function getCombinationRule(combination) {
  return COMBINATION_RULES[normalizeCombinationId(combination)] ?? COMBINATION_RULES[COMBINATIONS.NONE];
}

export function getNextTargetScore(currentTargetScore, currentRound) {
  return currentTargetScore + TARGET_SCORE_FLAT_INCREASE + currentRound * TARGET_SCORE_ROUND_MULTIPLIER;
}

export function getTargetScoreForRound(round) {
  if (round <= INITIAL_ROUND) return INITIAL_TARGET_SCORE;

  let targetScore = INITIAL_TARGET_SCORE;
  for (let currentRound = INITIAL_ROUND; currentRound < round; currentRound += 1) {
    targetScore = getNextTargetScore(targetScore, currentRound);
  }
  return targetScore;
}
