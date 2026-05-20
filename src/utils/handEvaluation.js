import { RANK_BY_ID } from '../data/cards.js';
import { COMBINATIONS, getCombinationRule } from '../data/scoringRules.js';

export function groupCardsByRank(cards) {
  const groups = new Map();

  cards.forEach((card) => {
    const rank = RANK_BY_ID[card.rank] ?? { id: card.rank, order: card.rankOrder ?? card.value };
    const currentGroup = groups.get(card.rank) ?? {
      rank: card.rank,
      rankOrder: rank.order,
      cards: [],
      count: 0
    };

    currentGroup.cards.push(card);
    currentGroup.count += 1;
    groups.set(card.rank, currentGroup);
  });

  return [...groups.values()].sort((first, second) => {
    if (second.count !== first.count) return second.count - first.count;
    return second.rankOrder - first.rankOrder;
  });
}

export function groupCardsBySuit(cards) {
  const groups = new Map();

  cards.forEach((card) => {
    const currentGroup = groups.get(card.suit) ?? { suit: card.suit, cards: [], count: 0 };
    currentGroup.cards.push(card);
    currentGroup.count += 1;
    groups.set(card.suit, currentGroup);
  });

  return [...groups.values()].sort((first, second) => second.count - first.count);
}

export function findStraight(cards) {
  const uniqueValues = new Set();
  const cardsByValue = new Map();

  cards.forEach((card) => {
    const rank = RANK_BY_ID[card.rank] ?? { order: card.rankOrder ?? card.value };
    uniqueValues.add(rank.order);
    cardsByValue.set(rank.order, card);

    if (card.rank === 'A') {
      uniqueValues.add(1);
      cardsByValue.set(1, card);
    }
  });

  const values = [...uniqueValues].sort((first, second) => first - second);
  let bestRun = [];
  let currentRun = [];

  values.forEach((value, index) => {
    if (index === 0 || value === values[index - 1] + 1) {
      currentRun.push(value);
    } else {
      currentRun = [value];
    }

    if (currentRun.length >= 5) {
      bestRun = currentRun.slice(-5);
    }
  });

  if (bestRun.length < 5) {
    return { isStraight: false, highCardValue: 0, values: [], cards: [] };
  }

  return {
    isStraight: true,
    highCardValue: bestRun[bestRun.length - 1],
    values: bestRun,
    cards: bestRun.map((value) => cardsByValue.get(value)).filter(Boolean)
  };
}

export function hasPair(rankGroups) {
  return rankGroups.some((group) => group.count >= 2);
}

export function evaluateHand(cards = []) {
  const selectedCards = [...cards];
  const rankGroups = groupCardsByRank(selectedCards);
  const suitGroups = groupCardsBySuit(selectedCards);
  const flushGroup = selectedCards.length >= 5 ? suitGroups.find((group) => group.count >= 5) : null;
  const straight = selectedCards.length >= 5 ? findStraight(selectedCards) : { isStraight: false };
  const straightFlush = flushGroup ? findStraight(flushGroup.cards) : { isStraight: false };
  const pairGroups = rankGroups.filter((group) => group.count >= 2);
  const threeGroups = rankGroups.filter((group) => group.count >= 3);
  const fourGroup = rankGroups.find((group) => group.count >= 4);

  let combinationId = COMBINATIONS.NONE;

  if (selectedCards.length === 0) {
    combinationId = COMBINATIONS.NONE;
  } else if (straightFlush.isStraight) {
    combinationId = COMBINATIONS.STRAIGHT_FLUSH;
  } else if (fourGroup) {
    combinationId = COMBINATIONS.FOUR_OF_A_KIND;
  } else if (threeGroups.length > 0 && pairGroups.some((group) => group.rank !== threeGroups[0].rank)) {
    combinationId = COMBINATIONS.FULL_HOUSE;
  } else if (flushGroup) {
    combinationId = COMBINATIONS.FLUSH;
  } else if (straight.isStraight) {
    combinationId = COMBINATIONS.STRAIGHT;
  } else if (threeGroups.length > 0) {
    combinationId = COMBINATIONS.THREE_OF_A_KIND;
  } else if (pairGroups.length >= 2) {
    combinationId = COMBINATIONS.TWO_PAIR;
  } else if (pairGroups.length === 1) {
    combinationId = COMBINATIONS.PAIR;
  } else {
    combinationId = COMBINATIONS.HIGH_CARD;
  }

  const rule = getCombinationRule(combinationId);

  return {
    id: rule.id,
    name: rule.name,
    rank: rule.rank,
    cards: selectedCards,
    rankGroups,
    suitGroups,
    isFlush: Boolean(flushGroup),
    isStraight: Boolean(straight.isStraight),
    straightHighCardValue: straight.highCardValue ?? 0,
    straightValues: straight.values ?? [],
    isStraightFlush: Boolean(straightFlush.isStraight),
    aceRule: 'Ace can be low in A-2-3-4-5 or high in 10-J-Q-K-A.'
  };
}
