export default function GameHeader({ round, targetScore, gameStatus, onRestart }) {
  const statusText = {
    menu: "Menu",
    playing: "Jugando",
    choosingJoker: "Elige joker",
    gameOver: "Fin",
  };

  return (
    <header className="game-header">
      <div>
        <p className="game-header__eyebrow">Not-Balatro</p>
        <h1>Ronda {round}</h1>
      </div>
      <div className="game-header__meta" aria-label="Estado de partida">
        <span>{statusText[gameStatus] || gameStatus}</span>
        <strong>{targetScore} pts</strong>
        <button className="button button--ghost" type="button" onClick={onRestart}>
          Reiniciar
        </button>
      </div>
    </header>
  );
}
