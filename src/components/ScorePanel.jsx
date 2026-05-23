function formatScore(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString("es-GT") : "0";
}

export default function ScorePanel({
  targetScore,
  roundScore,
  deckCount,
  handsRemaining,
  discardsRemaining,
  selectedCount,
  lastResult,
  scorePreview,
  message,
  gameStatus,
}) {
  const resultTone = lastResult?.passed ? "score-panel__result--success" : "score-panel__result--fail";
  const previewTone = scorePreview?.passed ? "score-panel__preview--success" : "";

  return (
    <aside className="score-panel" aria-label="Marcador">
      <div className="score-panel__stats">
        <div>
          <span>Meta</span>
          <strong>{formatScore(targetScore)}</strong>
        </div>
        <div>
          <span>Puntaje</span>
          <strong>{formatScore(roundScore)}</strong>
        </div>
        <div>
          <span>Mazo</span>
          <strong>{deckCount}</strong>
        </div>
        <div>
          <span>Manos</span>
          <strong>{handsRemaining}</strong>
        </div>
        <div>
          <span>Descartes</span>
          <strong>{discardsRemaining}</strong>
        </div>
        <div>
          <span>Elegidas</span>
          <strong>{selectedCount}</strong>
        </div>
      </div>

      <div className="score-panel__status">
        <span>Estado</span>
        <p>{message || (gameStatus === "playing" ? "Elige cartas para jugar." : "Partida pausada.")}</p>
      </div>

      <div className={`score-panel__preview ${previewTone}`}>
        <span>Estimado</span>
        {scorePreview ? (
          <>
            <strong>{formatScore(scorePreview.finalScore)} pts</strong>
            <p>
              {scorePreview.combination} · quedaria en {formatScore(scorePreview.roundScoreAfter)}/
              {formatScore(targetScore)}
            </p>
            <dl>
              <div>
                <dt>Base</dt>
                <dd>{formatScore(scorePreview.baseScore)}</dd>
              </div>
              <div>
                <dt>Cartas</dt>
                <dd>{formatScore(scorePreview.cardScore)}</dd>
              </div>
              <div>
                <dt>Jokers</dt>
                <dd>
                  {scorePreview.jokerBreakdown?.filter((item) => item.applied).length || 0}
                </dd>
              </div>
            </dl>
          </>
        ) : (
          <p>Sin cartas seleccionadas.</p>
        )}
      </div>

      {lastResult ? (
        <div className={`score-panel__result ${resultTone}`}>
          <span>Ultima mano</span>
          <strong>{formatScore(lastResult.finalScore ?? lastResult.score)} pts</strong>
          <p>
            {lastResult.combination || "Mano"} · acumulado {formatScore(lastResult.roundScoreAfter ?? roundScore)}
          </p>
          {lastResult.jokerBonus ? <p>Jokers: {lastResult.jokerBonus}</p> : null}
        </div>
      ) : null}
    </aside>
  );
}
