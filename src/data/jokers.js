export const JOKER_EFFECT_TYPES = {
  FLAT_BONUS: 'flatBonus',
  PAIR_BONUS: 'pairBonus',
  FACE_CARD_BONUS: 'faceCardBonus',
  ROUND_BONUS: 'roundBonus',
  SUIT_MULTIPLIER: 'suitMultiplier',
  FLUSH_MULTIPLIER: 'flushMultiplier',
  SINGLE_CARD_MULTIPLIER: 'singleCardMultiplier',
  TOTAL_MULTIPLIER: 'totalMultiplier'
};

export const JOKERS = [
  {
    id: 'flat-bonus',
    name: 'Bonus fijo',
    description: '+25 puntos en cada mano.',
    effectType: JOKER_EFFECT_TYPES.FLAT_BONUS,
    value: 25
  },
  {
    id: 'total-multiplier',
    name: 'Multiplicador total',
    description: 'Multiplica el total final por 1.5.',
    effectType: JOKER_EFFECT_TYPES.TOTAL_MULTIPLIER,
    value: 1.5
  },
  {
    id: 'heart-suit-multiplier',
    name: 'Corazones fuertes',
    description: 'Si juegas un corazon, multiplica por 1.3.',
    effectType: JOKER_EFFECT_TYPES.SUIT_MULTIPLIER,
    suit: 'hearts',
    value: 1.3
  },
  {
    id: 'pair-bonus',
    name: 'Par rentable',
    description: '+40 puntos si la mano tiene al menos un par.',
    effectType: JOKER_EFFECT_TYPES.PAIR_BONUS,
    value: 40
  },
  {
    id: 'face-card-bonus',
    name: 'Figuras caras',
    description: '+8 puntos por cada J, Q o K jugada.',
    effectType: JOKER_EFFECT_TYPES.FACE_CARD_BONUS,
    value: 8
  },
  {
    id: 'flush-multiplier',
    name: 'Color limpio',
    description: 'Multiplica por 1.4 si la mano es flush o straight flush.',
    effectType: JOKER_EFFECT_TYPES.FLUSH_MULTIPLIER,
    value: 1.4
  },
  {
    id: 'round-bonus',
    name: 'Escalada',
    description: '+10 puntos por ronda actual.',
    effectType: JOKER_EFFECT_TYPES.ROUND_BONUS,
    value: 10
  },
  {
    id: 'single-card-multiplier',
    name: 'Apuesta minima',
    description: 'Si juegas una sola carta, multiplica por 2.',
    effectType: JOKER_EFFECT_TYPES.SINGLE_CARD_MULTIPLIER,
    value: 2
  }
];

export function getJokerById(jokerId) {
  return JOKERS.find((joker) => joker.id === jokerId) ?? null;
}
