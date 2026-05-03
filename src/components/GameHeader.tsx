import type { MouseEventHandler } from "react";

type GameHeaderProps = Readonly<{
  onNewGame: MouseEventHandler<HTMLButtonElement>;
}>;

export const GameHeader = ({ onNewGame }: GameHeaderProps) => {
  return (
    <header className="game-header">
      <p className="game-kicker">React 2048</p>
      <div className="game-header-row">
        <h1 className="game-title">2048</h1>
        <button className="game-new-btn game-new-btn--top" onClick={onNewGame}>
          New Game
        </button>
      </div>
      <p className="game-subtitle">Use the arrow keys to move tiles.</p>
    </header>
  );
};
