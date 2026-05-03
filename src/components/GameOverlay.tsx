import type { GameStatus } from "../game/types";

type GameOverlayProps = Readonly<{
  status: GameStatus;
  onNewGame: () => void;
}>;

export const GameOverlay = ({ status, onNewGame }: GameOverlayProps) => {
  return (
    <div
      className={`game-overlay game-overlay--${status}`}
      role="status"
      aria-live="polite"
    >
      <p className="game-overlay__message">
        {status === "won" ? "You won! 🎉" : "Game over"}
      </p>
      <button className="game-overlay__btn" onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
};
