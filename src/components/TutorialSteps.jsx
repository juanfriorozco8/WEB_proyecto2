const STEPS = [
  {
    title: "Escoge cartas",
    text: "Marca una mano con las cartas de la mesa. Mientras mejor la jugada, más puntos suma.",
  },
  {
    title: "Llega a la meta",
    text: "Cada ronda pide un puntaje mínimo. Suma varias manos antes de quedarte sin intentos.",
  },
  {
    title: "Elige un joker",
    text: "Al pasar la ronda, toma un joker. Sus bonus cambian cómo conviene jugar.",
  },
  {
    title: "Sigue subiendo",
    text: "La meta crece en cada ronda. Combina buenas manos con jokers útiles.",
  },
];

export default function TutorialSteps() {
  return (
    <aside className="tutorial-panel" aria-label="Como se juega">
      <img
        className="tutorial-panel__image"
        src="/assets/tutorial-cards-cue.png"
        alt=""
        aria-hidden="true"
      />

      <div className="tutorial-panel__head">
        <span>Como se juega</span>
        <strong>Primero mira tus cartas. Luego decide si vale la pena arriesgar.</strong>
      </div>

      <ol className="tutorial-steps">
        {STEPS.map((step, index) => (
          <li className="tutorial-step" key={step.title}>
            <span className="tutorial-step__number">{index + 1}</span>
            <div>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
