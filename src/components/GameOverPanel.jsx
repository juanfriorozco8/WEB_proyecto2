function formatScore(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString("es-GT") : "0";
}

export default function GameOverPanel({ summary, activeJokers = [], onRestart }) {
  return (
    <section className="game-over" aria-label="Fin de partida">
      <div>
        <span className="game-over__label">Fin de partida</span>
        <h2>{summary?.reason || "No quedan cartas suficientes."}</h2>
      </div>
      <dl className="game-over__stats">
        <div>
          <dt>Ronda</dt>
          <dd>{summary?.round || 1}</dd>
        </div>
        <div>
          <dt>Meta</dt>
          <dd>{formatScore(summary?.targetScore)}</dd>
        </div>
        <div>
          <dt>Puntaje</dt>
          <dd>{formatScore(summary?.roundScore)}</dd>
        </div>
        <div>
          <dt>Jokers</dt>
          <dd>{activeJokers.length}</dd>
        </div>
      </dl>
      <button className="button button--primary" type="button" onClick={onRestart}>
        Volver a jugar
      </button>
    </section>
  );
}
