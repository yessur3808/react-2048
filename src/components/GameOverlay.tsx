import type { GameStatus } from "../game/types";

type GameOverlayProps = Readonly<{
  status: GameStatus;
  onNewGame: () => void;
}>;

export const GameOverlay = ({ status, onNewGame }: GameOverlayProps) => {
  const message =
    status === "won"
      ? "Great job - you reached 2048!"
      : "No moves left. Start a new run and try again.";

  return (
    <div
      className={`game-overlay game-overlay--${status}`}
      role="status"
      aria-live="polite"
    >
      <p className="game-overlay-message">{message}</p>
      <button className="game-overlay-btn" onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
};
