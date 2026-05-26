import "../styles/shop.css";

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

export default function JokerPicker({ options = [], onChoose }) {
  const shopOptions = options.slice(0, 2);

  if (!shopOptions.length) {
    return null;
  }

  return (
    <section className="shop-panel" aria-label="Tienda de jokers" aria-modal="true" role="dialog">
      <div className="shop-panel__scrim" aria-hidden="true" />
      <div className="shop-panel__inner">
        <div className="shop-panel__head">
          <span>Premio de ronda</span>
          <h2>Tienda de jokers</h2>
          <p>Escoge una mejora. La ronda sigue al comprar.</p>
        </div>

        <div className="shop-panel__grid">
          {shopOptions.map((joker) => {
            const artwork = JOKER_ART[joker.id];

            return (
              <article className="shop-card" key={joker.id}>
                <div className="shop-card__art" aria-hidden="true">
                  {artwork ? <img src={artwork} alt="" loading="lazy" /> : <span>J</span>}
                </div>
                <div className="shop-card__body">
                  <span className="shop-card__tag">Gratis</span>
                  <h3>{joker.name}</h3>
                  <p>{joker.description}</p>
                </div>
                <button className="shop-card__action" type="button" onClick={() => onChoose?.(joker)}>
                  Comprar
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
