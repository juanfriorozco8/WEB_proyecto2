import TutorialSteps from "./TutorialSteps.jsx";
import "../styles/menu-tutorial.css";

export default function GameMenu({ onStart }) {
  return (
    <main className="menu-shell">
      <section className="menu-layout" aria-labelledby="menu-title">
        <div className="menu-panel menu-panel--intro">
          <div className="menu-panel__mark">NB</div>
          <h1 id="menu-title">Not-Balatro</h1>
          <p>Juega manos de poker, llega a la meta y elige jokers para aguantar más rondas.</p>
          <button className="button button--primary menu-start" type="button" onClick={onStart}>
            Nueva partida
          </button>
        </div>

        <TutorialSteps />
      </section>
    </main>
  );
}
