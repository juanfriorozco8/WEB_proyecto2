import Card from "./Card.jsx";

export default function CardHand({ cards = [], selectedCardIds = [], disabled = false, onToggleCard }) {
  const selectedIds = new Set(selectedCardIds);

  return (
    <section className="hand" aria-label="Mano actual">
      <div className="hand__grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isSelected={selectedIds.has(card.id)}
            disabled={disabled}
            onToggle={onToggleCard}
          />
        ))}
      </div>
    </section>
  );
}
