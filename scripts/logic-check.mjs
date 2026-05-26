#!/usr/bin/env node

import assert from 'node:assert/strict';

import { JOKERS, JOKER_EFFECT_TYPES } from '../src/data/jokers.js';
import { getTargetScoreForRound } from '../src/data/scoringRules.js';
import { createDeck, drawCards, hasUniqueCards, shuffleDeck } from '../src/utils/deck.js';
import { evaluateHand } from '../src/utils/handEvaluation.js';
import { calculateScore } from '../src/utils/scoring.js';
import {
  canReplaceFailedCards,
  getJokerRewardOptions,
  replaceFailedCards,
  startGame
} from '../src/utils/gameFlow.js';

let checks = 0;
const deck = createDeck();

function expectCheck(name, check) {
  check();
  checks += 1;
  console.log(`PASS ${name}`);
}

function card(rank, suit) {
  const found = deck.find((item) => item.rank === rank && item.suit === suit);
  assert.ok(found, `Missing fixture card: ${rank} ${suit}`);
  return found;
}

function joker(id) {
  const found = JOKERS.find((item) => item.id === id);
  assert.ok(found, `Missing joker: ${id}`);
  return found;
}

expectCheck('deck has 52 unique cards, 4 suits, and 13 ranks', () => {
  assert.equal(deck.length, 52);
  assert.equal(hasUniqueCards(deck), true);
  assert.equal(new Set(deck.map((item) => item.suit)).size, 4);
  assert.equal(new Set(deck.map((item) => item.rank)).size, 13);
});

expectCheck('shuffle preserves cards and draw leaves clean remainder', () => {
  const shuffled = shuffleDeck(deck, () => 0.999);
  assert.equal(shuffled.length, 52);
  assert.equal(new Set(shuffled.map((item) => item.id)).size, 52);
  assert.deepEqual(
    shuffled.map((item) => item.id).sort(),
    deck.map((item) => item.id).sort()
  );

  const draw = drawCards(deck, 8);
  assert.equal(draw.success, true);
  assert.equal(draw.drawnCards.length, 8);
  assert.equal(draw.remainingDeck.length, 44);
  assert.equal(hasUniqueCards([...draw.drawnCards, ...draw.remainingDeck]), true);

  const blockedDraw = drawCards(deck, 53);
  assert.equal(blockedDraw.success, false);
  assert.equal(blockedDraw.remainingDeck.length, 52);
});

const handFixtures = [
  ['high-card', [card('A', 'hearts'), card('7', 'clubs'), card('4', 'spades')]],
  ['pair', [card('A', 'hearts'), card('A', 'spades'), card('5', 'clubs')]],
  [
    'two-pair',
    [card('A', 'hearts'), card('A', 'spades'), card('K', 'clubs'), card('K', 'diamonds'), card('2', 'hearts')]
  ],
  [
    'three-of-a-kind',
    [card('Q', 'hearts'), card('Q', 'spades'), card('Q', 'clubs'), card('4', 'diamonds'), card('9', 'hearts')]
  ],
  ['straight', [card('6', 'hearts'), card('7', 'spades'), card('8', 'clubs'), card('9', 'diamonds'), card('10', 'hearts')]],
  ['flush', [card('2', 'hearts'), card('5', 'hearts'), card('9', 'hearts'), card('J', 'hearts'), card('K', 'hearts')]],
  [
    'full-house',
    [card('3', 'hearts'), card('3', 'spades'), card('3', 'clubs'), card('9', 'diamonds'), card('9', 'hearts')]
  ],
  [
    'four-of-a-kind',
    [card('4', 'hearts'), card('4', 'spades'), card('4', 'clubs'), card('4', 'diamonds'), card('8', 'hearts')]
  ],
  ['straight-flush', [card('9', 'hearts'), card('10', 'hearts'), card('J', 'hearts'), card('Q', 'hearts'), card('K', 'hearts')]]
];

expectCheck('every poker hand fixture resolves to expected best hand', () => {
  for (const [expected, fixture] of handFixtures) {
    assert.equal(evaluateHand(fixture).id, expected);
  }
});

expectCheck('ace-low and ace-high straights both work', () => {
  const aceLow = [card('A', 'hearts'), card('2', 'spades'), card('3', 'clubs'), card('4', 'diamonds'), card('5', 'hearts')];
  const aceHigh = [card('10', 'hearts'), card('J', 'spades'), card('Q', 'clubs'), card('K', 'diamonds'), card('A', 'hearts')];
  assert.equal(evaluateHand(aceLow).id, 'straight');
  assert.equal(evaluateHand(aceHigh).id, 'straight');
});

expectCheck('scoring applies fixed, conditional, then final multiplier jokers', () => {
  const pairHand = [card('A', 'hearts'), card('A', 'spades')];
  const result = calculateScore(
    pairHand,
    null,
    [joker('total-multiplier'), joker('heart-suit-multiplier'), joker('flat-bonus'), joker('pair-bonus')],
    1
  );

  assert.equal(result.baseScore, 30);
  assert.equal(result.cardScore, 22);
  assert.equal(result.subtotalScore, 52);
  assert.equal(result.finalScore, 228);
  assert.deepEqual(
    result.jokerBreakdown.map((item) => item.effectType),
    [
      JOKER_EFFECT_TYPES.FLAT_BONUS,
      JOKER_EFFECT_TYPES.PAIR_BONUS,
      JOKER_EFFECT_TYPES.SUIT_MULTIPLIER,
      JOKER_EFFECT_TYPES.TOTAL_MULTIPLIER
    ]
  );
});

expectCheck('target progression follows PRD formula and always increases', () => {
  const targets = [1, 2, 3, 4, 5].map(getTargetScoreForRound);
  assert.deepEqual(targets, [100, 200, 325, 475, 650]);
  assert.ok(targets.every((target, index) => index === 0 || target > targets[index - 1]));
});

expectCheck('reward options filter owned jokers and cap options at two', () => {
  const options = getJokerRewardOptions([joker('flat-bonus'), joker('total-multiplier')], {
    count: 2,
    rng: () => 0.999
  });

  assert.equal(options.length, 2);
  assert.equal(options.some((item) => item.id === 'flat-bonus'), false);
  assert.equal(options.some((item) => item.id === 'total-multiplier'), false);
});

expectCheck('failed replacement keeps unselected cards and blocks exhaustion', () => {
  const state = startGame({ rng: () => 0.999 });
  const selected = state.hand.slice(0, 2).map((item) => item.id);
  const kept = state.hand.slice(2).map((item) => item.id);
  const replaced = replaceFailedCards({ ...state, selectedCardIds: selected });

  assert.equal(replaced.hand.length, 8);
  assert.equal(replaced.deck.length, 42);
  assert.deepEqual(replaced.hand.slice(0, 6).map((item) => item.id), kept);
  assert.equal(canReplaceFailedCards([], 1).canReplace, false);
});

console.log(`logic-check: ${checks} checks passed`);
