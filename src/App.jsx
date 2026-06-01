import { useMemo, useState } from "react";
import GameBoard from "./components/GameBoard.jsx";
import GameMenu from "./components/GameMenu.jsx";
import { GAME_STATUS, INITIAL_TARGET_SCORE } from "./data/scoringRules.js";
import {
  chooseJokerAndStartNextRound,
  startGame as createPlayingState,
  submitSelectedHand,
} from "./utils/gameFlow.js";
import "./styles.css";

const MENU_STATE = {
  deck: [],
  hand: [],
  round: 1,
  targetScore: INITIAL_TARGET_SCORE,
  roundScore: 0,
  lastResult: null,
  lastScoreResult: null,
  activeJokers: [],
  jokerOptions: [],
  gameStatus: GAME_STATUS.MENU,
  gameOverSummary: null,
  message: "",
};

function normalizeGameState(state) {
  const scoreSource = state?.lastScoreResult || state?.lastResult || null;
  const finalScore = scoreSource?.finalScore ?? state?.lastScore ?? null;
  const passed = Number(finalScore) >= Number(state?.targetScore || INITIAL_TARGET_SCORE);
  const prevRoundScore = state?.roundScore ?? 0;
  const roundScore = scoreSource
    ? passed
      ? 0
      : prevRoundScore + Number(finalScore ?? 0)
    : prevRoundScore;

  return {
    ...MENU_STATE,
    ...state,
    deck: state?.deck || [],
    hand: state?.hand || [],
    activeJokers: state?.activeJokers || [],
    jokerOptions: state?.jokerOptions || [],
    roundScore,
    lastResult: scoreSource
      ? {
          ...scoreSource,
          combination: state?.lastCombination || scoreSource.combination,
          finalScore,
          passed,
          roundScoreAfter: roundScore,
        }
      : null,
    gameOverSummary:
      state?.gameOverSummary ||
      (state?.gameOver
        ? {
            reason: state.gameOver.reason,
            round: state.gameOver.finalRound,
            targetScore: state.gameOver.targetScore,
            lastScore: state.gameOver.lastScore,
          }
        : null),
  };
}

export default function App() {
  const [game, setGame] = useState(MENU_STATE);
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const selectedCards = useMemo(
    () => game.hand.filter((card) => selectedCardIds.includes(card.id)),
    [game.hand, selectedCardIds],
  );

  function startGame() {
    setSelectedCardIds([]);
    setGame(normalizeGameState(createPlayingState()));
  }

  function toggleCard(cardId) {
    if (game.gameStatus !== GAME_STATUS.PLAYING) {
      return;
    }

    setSelectedCardIds((current) =>
      current.includes(cardId) ? current.filter((id) => id !== cardId) : [...current, cardId],
    );
  }

  function submitHand() {
    if (game.gameStatus !== GAME_STATUS.PLAYING || selectedCards.length === 0) {
      return;
    }

    const nextGame = submitSelectedHand({ ...game, selectedCardIds }, selectedCardIds);
    setSelectedCardIds(nextGame.selectedCardIds || []);
    setGame(normalizeGameState(nextGame));
  }

  function chooseJoker(joker) {
    if (game.gameStatus !== GAME_STATUS.CHOOSING_JOKER) {
      return;
    }

    const nextGame = chooseJokerAndStartNextRound({ ...game, selectedCardIds }, joker.id);
    setSelectedCardIds(nextGame.selectedCardIds || []);
    setGame(normalizeGameState(nextGame));
  }

  if (game.gameStatus === GAME_STATUS.MENU) {
    return <GameMenu onStart={startGame} />;
  }

  return (
    <GameBoard
      game={game}
      selectedCardIds={selectedCardIds}
      onToggleCard={toggleCard}
      onSubmitHand={submitHand}
      onChooseJoker={chooseJoker}
      onRestart={startGame}
    />
  );
}