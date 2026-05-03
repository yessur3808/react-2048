import type { Direction } from "../game/types";

type GameControlsProps = Readonly<{
  isPlaying: boolean;
  onMove: (direction: Direction) => void;
  getMoveButtonClassName: (direction: Direction) => string;
}>;

export const GameControls = ({
  isPlaying,
  onMove,
  getMoveButtonClassName,
}: GameControlsProps) => {
  return (
    <footer className="game-footer">
      <div className="game-controls" aria-label="game controls">
        <button
          className={getMoveButtonClassName("up")}
          onClick={() => onMove("up")}
          disabled={!isPlaying}
          aria-label="Move up"
        >
          Up
        </button>
        <button
          className={getMoveButtonClassName("left")}
          onClick={() => onMove("left")}
          disabled={!isPlaying}
          aria-label="Move left"
        >
          Left
        </button>
        <button
          className={getMoveButtonClassName("down")}
          onClick={() => onMove("down")}
          disabled={!isPlaying}
          aria-label="Move down"
        >
          Down
        </button>
        <button
          className={getMoveButtonClassName("right")}
          onClick={() => onMove("right")}
          disabled={!isPlaying}
          aria-label="Move right"
        >
          Right
        </button>
      </div>
    </footer>
  );
};
