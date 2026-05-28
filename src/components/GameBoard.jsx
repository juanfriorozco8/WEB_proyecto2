import ActiveJokers from "./ActiveJokers.jsx";
import CardHand from "./CardHand.jsx";
import GameHeader from "./GameHeader.jsx";
import GameOverPanel from "./GameOverPanel.jsx";
import JokerPicker from "./JokerPicker.jsx";
import ScorePanel from "./ScorePanel.jsx";

export default function GameBoard({
  game,
  selectedCardIds,
  onToggleCard,
  onSubmitHand,
  onDiscardHand,
  onChooseJoker,
  onRestart,
  scorePreview,
}) {
  const isPlaying = game.gameStatus === "playing";
  const isChoosingJoker = game.gameStatus === "choosingJoker";
  const isGameOver = game.gameStatus === "gameOver";

  return (
    <main className="game-shell">
      <GameHeader
        round={game.round}
        targetScore={game.targetScore}
        gameStatus={game.gameStatus}
        onRestart={onRestart}
      />

      <div className="game-layout">
        <section className="table">
          <div className="table__topline">
            <div>
              <span>Mano</span>
              <strong>{game.hand.length}/8 cartas</strong>
            </div>
            <div className="table__actions">
              <button
                className="button button--ghost"
                type="button"
                disabled={!isPlaying || selectedCardIds.length === 0 || game.discardsRemaining <= 0}
                onClick={onDiscardHand}
              >
                Descartar
              </button>
              <button
                className="button button--primary"
                type="button"
                disabled={!isPlaying || selectedCardIds.length === 0 || game.handsRemaining <= 0}
                onClick={onSubmitHand}
              >
                Jugar mano
              </button>
            </div>
          </div>

          <CardHand
            cards={game.hand}
            selectedCardIds={selectedCardIds}
            disabled={!isPlaying}
            onToggleCard={onToggleCard}
          />

          {isChoosingJoker ? <JokerPicker options={game.jokerOptions} onChoose={onChooseJoker} /> : null}
          {isGameOver ? (
            <GameOverPanel summary={game.gameOverSummary} activeJokers={game.activeJokers} onRestart={onRestart} />
          ) : null}
        </section>

        <div className="side-rail">
          <ScorePanel
            round={game.round}
            targetScore={game.targetScore}
            roundScore={game.roundScore}
            deckCount={game.deck.length}
            handsRemaining={game.handsRemaining}
            discardsRemaining={game.discardsRemaining}
            selectedCount={selectedCardIds.length}
            lastResult={game.lastResult}
            scorePreview={scorePreview}
            message={game.message}
            gameStatus={game.gameStatus}
          />
          <ActiveJokers jokers={game.activeJokers} />
        </div>
      </div>
    </main>
  );
}
