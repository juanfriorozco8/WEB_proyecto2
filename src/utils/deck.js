import { RANKS, SUITS } from '../data/cards.js';

export function createDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      id: `${suit.id}-${rank.id}`,
      suit: suit.id,
      suitName: suit.label,
      rank: rank.id,
      rankName: rank.label,
      label: `${rank.label} of ${suit.label}`,
      value: rank.value,
      rankOrder: rank.order,
      color: suit.color
    }))
  );
}

export function shuffleDeck(deck, rng = Math.random) {
  const shuffledDeck = [...deck];

  for (let index = shuffledDeck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffledDeck[index], shuffledDeck[swapIndex]] = [shuffledDeck[swapIndex], shuffledDeck[index]];
  }

  return shuffledDeck;
}

export function canDrawCards(deck, count) {
  return Number.isInteger(count) && count >= 0 && count <= deck.length;
}

export function drawCards(deck, count) {
  if (!canDrawCards(deck, count)) {
    return {
      success: false,
      reason: 'No quedan suficientes cartas para robar.',
      drawnCards: [],
      remainingDeck: [...deck]
    };
  }

  return {
    success: true,
    reason: '',
    drawnCards: deck.slice(0, count),
    remainingDeck: deck.slice(count)
  };
}

export function hasUniqueCards(cards) {
  return new Set(cards.map((card) => card.id)).size === cards.length;
}
