import JokerCard from "./JokerCard.jsx";

export default function ActiveJokers({ jokers = [] }) {
  return (
    <section className="active-jokers" aria-label="Jokers activos">
      <div className="section-title">
        <span>Jokers</span>
        <strong>{jokers.length}</strong>
      </div>
      {jokers.length ? (
        <div className="active-jokers__list">
          {jokers.map((joker) => (
            <JokerCard key={joker.id} joker={joker} compact />
          ))}
        </div>
      ) : (
        <p className="empty-copy">Sin jokers todavía.</p>
      )}
    </section>
  );
}
