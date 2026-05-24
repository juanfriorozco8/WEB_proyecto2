const JOKER_ART = {
  "flat-bonus": "/assets/joker-flat-bonus.png",
  "total-multiplier": "/assets/joker-total-multiplier.png",
  "heart-suit-multiplier": "/assets/joker-heart-suit-multiplier.png",
  "pair-bonus": "/assets/joker-pair-bonus.png",
  "face-card-bonus": "/assets/joker-face-card-bonus.png",
  "flush-multiplier": "/assets/joker-flush-multiplier.png",
  "round-bonus": "/assets/joker-round-bonus.png",
  "single-card-multiplier": "/assets/joker-single-card-multiplier.png",
};

export default function JokerCard({ joker, compact = false, onSelect }) {
  const artwork = JOKER_ART[joker.id];

  return (
    <button
      className={["joker-card", compact ? "joker-card--compact" : ""].filter(Boolean).join(" ")}
      type="button"
      onClick={() => onSelect?.(joker)}
    >
      <span className="joker-card__face" aria-hidden="true">
        {artwork ? <img src={artwork} alt="" loading="lazy" /> : "J"}
      </span>
      <span className="joker-card__text">
        <strong>{joker.name}</strong>
        <small>{joker.description}</small>
      </span>
    </button>
  );
}
