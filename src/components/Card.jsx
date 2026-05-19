const SUIT_SYMBOLS = {
  clubs: "♣",
  club: "♣",
  clover: "♣",
  diamonds: "♦",
  diamond: "♦",
  hearts: "♥",
  heart: "♥",
  spades: "♠",
  spade: "♠",
};

const RED_SUITS = new Set(["diamonds", "diamond", "hearts", "heart"]);

function getSuitKey(suit = "") {
  return String(suit).toLowerCase();
}

function getCardLabel(card) {
  return card.rankName || card.rank || card.label || card.value || "?";
}

export default function Card({ card, isSelected = false, disabled = false, onToggle }) {
  const suitKey = getSuitKey(card?.suit);
  const suitSymbol = card?.suitSymbol || SUIT_SYMBOLS[suitKey] || card?.suit || "";
  const label = getCardLabel(card);
  const accessibleLabel = card?.label || `${label} ${card?.suitName || suitSymbol}`;
  const isRed = RED_SUITS.has(suitKey) || suitSymbol === "♥" || suitSymbol === "♦";

  return (
    <button
      className={[
        "card",
        isSelected ? "card--selected" : "",
        isRed ? "card--red" : "card--black",
      ]
        .filter(Boolean)
        .join(" ")}
      type="button"
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={accessibleLabel.trim()}
      onClick={() => onToggle?.(card.id)}
    >
      <span className="card__corner">
        <strong>{label}</strong>
        <span>{suitSymbol}</span>
      </span>
      <span className="card__suit" aria-hidden="true">
        {suitSymbol}
      </span>
      <span className="card__corner card__corner--bottom">
        <strong>{label}</strong>
        <span>{suitSymbol}</span>
      </span>
    </button>
  );
}
