export const GameKeyboardLegend = () => {
  return (
    <aside className="game-key-sidebar" aria-label="keyboard shortcuts">
      <p className="game-key-sidebar__title">Keyboard</p>
      <ul className="game-key-legend">
        <li>
          <kbd>↑</kbd> Move Up
        </li>
        <li>
          <kbd>↓</kbd> Move Down
        </li>
        <li>
          <kbd>←</kbd> Move Left
        </li>
        <li>
          <kbd>→</kbd> Move Right
        </li>
      </ul>
      <br />
      <ul className="game-key-legend">
        <li>
          <kbd>?</kbd> Get Suggestion
        </li>
        <li>
          <kbd>N</kbd> New Game
        </li>
      </ul>
    </aside>
  );
};
