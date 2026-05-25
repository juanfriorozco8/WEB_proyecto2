export const SUITS = [
  { id: 'clubs', label: 'Clubs', color: 'black' },
  { id: 'diamonds', label: 'Diamonds', color: 'red' },
  { id: 'hearts', label: 'Hearts', color: 'red' },
  { id: 'spades', label: 'Spades', color: 'black' }
];

export const RANKS = [
  { id: 'A', label: 'A', value: 11, order: 14 },
  { id: '2', label: '2', value: 2, order: 2 },
  { id: '3', label: '3', value: 3, order: 3 },
  { id: '4', label: '4', value: 4, order: 4 },
  { id: '5', label: '5', value: 5, order: 5 },
  { id: '6', label: '6', value: 6, order: 6 },
  { id: '7', label: '7', value: 7, order: 7 },
  { id: '8', label: '8', value: 8, order: 8 },
  { id: '9', label: '9', value: 9, order: 9 },
  { id: '10', label: '10', value: 10, order: 10 },
  { id: 'J', label: 'J', value: 10, order: 11 },
  { id: 'Q', label: 'Q', value: 10, order: 12 },
  { id: 'K', label: 'K', value: 10, order: 13 }
];

export const RANK_BY_ID = Object.fromEntries(RANKS.map((rank) => [rank.id, rank]));
export const SUIT_BY_ID = Object.fromEntries(SUITS.map((suit) => [suit.id, suit]));
export const FACE_RANKS = ['J', 'Q', 'K'];
