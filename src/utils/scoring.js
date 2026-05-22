import { FACE_RANKS } from '../data/cards.js';
import { getJokerById, JOKER_EFFECT_TYPES } from '../data/jokers.js';
import {
  COMBINATIONS,
  getCombinationRule,
  getNextTargetScore,
  getTargetScoreForRound,
  normalizeCombinationId
} from '../data/scoringRules.js';
import { evaluateHand, hasPair } from './handEvaluation.js';

export { getNextTargetScore, getTargetScoreForRound };

export function getCombinationBaseScore(combination) {
  return getCombinationRule(combination).baseScore;
}

export function calculateCardScore(cards = []) {
  return cards.reduce((total, card) => total + (Number(card.value) || 0), 0);
}

export function calculateBaseScore(cards = [], combination = null) {
  return getCombinationBaseScore(combination ?? evaluateHand(cards)) + calculateCardScore(cards);
}

function resolveEvaluation(cards, combination) {
  const evaluatedHand = evaluateHand(cards);

  if (!combination) return evaluatedHand;
  if (typeof combination !== 'string' && combination.id) return combination;

  const rule = getCombinationRule(combination);
  return {
    ...evaluatedHand,
    id: rule.id,
    name: rule.name,
    rank: rule.rank
  };
}

function normalizeJoker(joker) {
  if (typeof joker === 'string') return getJokerById(joker);
  if (joker?.id && !joker.effectType) return getJokerById(joker.id);
  return joker ?? null;
}

function orderJokers(activeJokers) {
  const normalizedJokers = activeJokers.map(normalizeJoker).filter(Boolean);
  const phases = [
    [JOKER_EFFECT_TYPES.FLAT_BONUS],
    [JOKER_EFFECT_TYPES.PAIR_BONUS, JOKER_EFFECT_TYPES.FACE_CARD_BONUS, JOKER_EFFECT_TYPES.ROUND_BONUS],
    [
      JOKER_EFFECT_TYPES.SUIT_MULTIPLIER,
      JOKER_EFFECT_TYPES.FLUSH_MULTIPLIER,
      JOKER_EFFECT_TYPES.SINGLE_CARD_MULTIPLIER
    ],
    [JOKER_EFFECT_TYPES.TOTAL_MULTIPLIER]
  ];

  return phases.flatMap((phase) =>
    normalizedJokers.filter((joker) => phase.includes(joker.effectType))
  );
}

function buildBreakdown(joker, beforeScore, afterScore, applied, note) {
  return {
    jokerId: joker.id,
    name: joker.name,
    effectType: joker.effectType,
    applied,
    beforeScore,
    afterScore,
    change: afterScore - beforeScore,
    note
  };
}

function applyJoker(score, joker, context) {
  const beforeScore = score;
  let afterScore = score;
  let applied = true;
  let note = joker.description;

  if (joker.effectType === JOKER_EFFECT_TYPES.FLAT_BONUS) {
    afterScore += joker.value;
  } else if (joker.effectType === JOKER_EFFECT_TYPES.PAIR_BONUS) {
    applied = hasPair(context.evaluation.rankGroups);
    if (applied) afterScore += joker.value;
  } else if (joker.effectType === JOKER_EFFECT_TYPES.FACE_CARD_BONUS) {
    const faceCardCount = context.cards.filter((card) => FACE_RANKS.includes(card.rank)).length;
    applied = faceCardCount > 0;
    if (applied) afterScore += faceCardCount * joker.value;
    note = `${joker.description} Cartas de figura: ${faceCardCount}.`;
  } else if (joker.effectType === JOKER_EFFECT_TYPES.ROUND_BONUS) {
    afterScore += context.round * joker.value;
  } else if (joker.effectType === JOKER_EFFECT_TYPES.SUIT_MULTIPLIER) {
    applied = context.cards.some((card) => card.suit === joker.suit);
    if (applied) afterScore = Math.round(afterScore * joker.value);
  } else if (joker.effectType === JOKER_EFFECT_TYPES.FLUSH_MULTIPLIER) {
    applied =
      context.combinationId === COMBINATIONS.FLUSH ||
      context.combinationId === COMBINATIONS.STRAIGHT_FLUSH;
    if (applied) afterScore = Math.round(afterScore * joker.value);
  } else if (joker.effectType === JOKER_EFFECT_TYPES.SINGLE_CARD_MULTIPLIER) {
    applied = context.cards.length === 1;
    if (applied) afterScore = Math.round(afterScore * joker.value);
  } else if (joker.effectType === JOKER_EFFECT_TYPES.TOTAL_MULTIPLIER) {
    afterScore = Math.round(afterScore * joker.value);
  } else {
    applied = false;
    note = 'Tipo de joker no soportado.';
  }

  return {
    score: afterScore,
    breakdown: buildBreakdown(joker, beforeScore, afterScore, applied, note)
  };
}

export function calculateScore(cards = [], combination = null, activeJokers = [], round = 1) {
  const evaluation = resolveEvaluation(cards, combination);
  const combinationId = normalizeCombinationId(evaluation);
  const combinationRule = getCombinationRule(combinationId);
  const baseScore = combinationRule.baseScore;
  const cardScore = calculateCardScore(cards);
  let runningScore = baseScore + cardScore;
  const jokerBreakdown = [];

  orderJokers(activeJokers).forEach((joker) => {
    const result = applyJoker(runningScore, joker, {
      cards,
      evaluation,
      combinationId,
      round
    });

    runningScore = result.score;
    jokerBreakdown.push(result.breakdown);
  });

  return {
    combination: combinationRule.name,
    combinationId,
    baseScore,
    cardScore,
    subtotalScore: baseScore + cardScore,
    jokerBreakdown,
    finalScore: runningScore,
    evaluation
  };
}
