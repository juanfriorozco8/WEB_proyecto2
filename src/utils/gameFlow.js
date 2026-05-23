import { JOKERS } from '../data/jokers.js';
import {
  GAME_STATUS,
  HAND_SIZE,
  INITIAL_ROUND,
  INITIAL_TARGET_SCORE,
  getNextTargetScore
} from '../data/scoringRules.js';
import { createDeck, drawCards, shuffleDeck } from './deck.js';
import { evaluateHand } from './handEvaluation.js';
import { calculateScore } from './scoring.js';

export function createInitialGameState({ rng = Math.random } = {}) {
  const shuffledDeck = shuffleDeck(createDeck(), rng);
  const initialDraw = drawCards(shuffledDeck, HAND_SIZE);

  return {
    deck: initialDraw.remainingDeck,
    hand: initialDraw.drawnCards,
    selectedCardIds: [],
    round: INITIAL_ROUND,
    targetScore: INITIAL_TARGET_SCORE,
    lastScore: null,
    lastCombination: null,
    lastScoreResult: null,
    activeJokers: [],
    jokerOptions: [],
    gameStatus: GAME_STATUS.PLAYING,
    message: 'Ronda 1 lista.',
    gameOver: null
  };
}

export const startGame = createInitialGameState;

export function getSelectedCards(hand, selectedCardIds) {
  const selectedIds = new Set(selectedCardIds);
  return hand.filter((card) => selectedIds.has(card.id));
}

export function toggleCardSelection(selectedCardIds, cardId) {
  if (selectedCardIds.includes(cardId)) {
    return selectedCardIds.filter((selectedId) => selectedId !== cardId);
  }

  return [...selectedCardIds, cardId];
}

export function canReplaceFailedCards(deck, selectedCount) {
  const canReplace = Number.isInteger(selectedCount) && selectedCount >= 0 && deck.length >= selectedCount;

  return {
    canReplace,
    reason: canReplace ? '' : 'No quedan suficientes cartas para continuar.'
  };
}

export function replaceFailedCards(state, selectedCardIds = state.selectedCardIds) {
  const selectedCards = getSelectedCards(state.hand, selectedCardIds);
  const replacementCheck = canReplaceFailedCards(state.deck, selectedCards.length);

  if (!replacementCheck.canReplace) {
    return buildGameOverState(state, replacementCheck.reason);
  }

  const selectedIds = new Set(selectedCardIds);
  const keptCards = state.hand.filter((card) => !selectedIds.has(card.id));
  const replacementDraw = drawCards(state.deck, selectedCards.length);

  return {
    ...state,
    deck: replacementDraw.remainingDeck,
    hand: [...keptCards, ...replacementDraw.drawnCards],
    selectedCardIds: [],
    gameStatus: GAME_STATUS.PLAYING
  };
}

export function getJokerRewardOptions(activeJokers = [], { count = 2, rng = Math.random } = {}) {
  const ownedIds = new Set(activeJokers.map((joker) => (typeof joker === 'string' ? joker : joker.id)));
  const availableJokers = JOKERS.filter((joker) => !ownedIds.has(joker.id));

  return shuffleDeck(availableJokers, rng).slice(0, count);
}

export function submitSelectedHand(state, selectedCardIds = state.selectedCardIds, { rng = Math.random } = {}) {
  if (state.gameStatus !== GAME_STATUS.PLAYING) {
    return {
      ...state,
      message: 'No se puede jugar una mano en este estado.'
    };
  }

  const selectedCards = getSelectedCards(state.hand, selectedCardIds);

  if (selectedCards.length === 0) {
    return {
      ...state,
      message: 'Selecciona al menos una carta.'
    };
  }

  const evaluation = evaluateHand(selectedCards);
  const scoreResult = calculateScore(selectedCards, evaluation, state.activeJokers, state.round);
  const attemptPassed = scoreResult.finalScore >= state.targetScore;
  const scoredState = {
    ...state,
    selectedCardIds: [],
    lastScore: scoreResult.finalScore,
    lastCombination: evaluation.name,
    lastScoreResult: scoreResult
  };

  if (attemptPassed) {
    const jokerOptions = getJokerRewardOptions(state.activeJokers, { rng });

    if (jokerOptions.length === 0) {
      return startNextRound(scoredState, { rng });
    }

    return {
      ...scoredState,
      jokerOptions,
      gameStatus: GAME_STATUS.CHOOSING_JOKER,
      message: `${evaluation.name}: ${scoreResult.finalScore} puntos. Elige un joker.`
    };
  }

  const replacedState = replaceFailedCards(scoredState, selectedCardIds);

  if (replacedState.gameStatus === GAME_STATUS.GAME_OVER) {
    return {
      ...replacedState,
      lastScore: scoreResult.finalScore,
      lastCombination: evaluation.name,
      lastScoreResult: scoreResult
    };
  }

  return {
    ...replacedState,
    message: `${evaluation.name}: ${scoreResult.finalScore} puntos. Intenta otra mano.`
  };
}

export function chooseJokerAndStartNextRound(state, jokerId, { rng = Math.random } = {}) {
  if (state.gameStatus !== GAME_STATUS.CHOOSING_JOKER) {
    return {
      ...state,
      message: 'Primero debe resolverse la recompensa.'
    };
  }

  const chosenJoker = state.jokerOptions.find((joker) => joker.id === jokerId);

  if (!chosenJoker) {
    return {
      ...state,
      message: 'Joker no valido.'
    };
  }

  return startNextRound(
    {
      ...state,
      activeJokers: [...state.activeJokers, chosenJoker]
    },
    { rng }
  );
}

export function startNextRound(state, { rng = Math.random } = {}) {
  const nextRound = state.round + 1;
  const nextTargetScore = getNextTargetScore(state.targetScore, state.round);
  const shouldDealFreshHand = state.deck.length >= HAND_SIZE;
  const nextRoundDraw = shouldDealFreshHand ? drawCards(shuffleDeck(state.deck, rng), HAND_SIZE) : null;

  return {
    ...state,
    deck: nextRoundDraw?.remainingDeck ?? state.deck,
    hand: nextRoundDraw?.drawnCards ?? state.hand,
    selectedCardIds: [],
    round: nextRound,
    targetScore: nextTargetScore,
    jokerOptions: [],
    gameStatus: GAME_STATUS.PLAYING,
    message: `Ronda ${nextRound} lista. Objetivo: ${nextTargetScore}.`
  };
}

export function buildGameOverState(state, reason) {
  return {
    ...state,
    selectedCardIds: [],
    jokerOptions: [],
    gameStatus: GAME_STATUS.GAME_OVER,
    message: reason,
    gameOver: {
      reason,
      finalRound: state.round,
      targetScore: state.targetScore,
      lastScore: state.lastScore,
      activeJokers: state.activeJokers
    }
  };
}
