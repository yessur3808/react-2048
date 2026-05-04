import type { Direction } from "../game/types";

type GameControlsProps = Readonly<{
  isPlaying: boolean;
  onMove: (direction: Direction) => void;
  onRequestSuggestion: () => void;
  hasRequestedSuggestion: boolean;
  suggestedDirection: Direction | null;
  getMoveButtonClassName: (direction: Direction) => string;
  isSuggesting: boolean;
  suggestionError: string | null;
}>;

const toDirectionLabel = (direction: Direction | null): string => {
  if (direction === null) {
    return "None";
  }

  return `${direction.charAt(0).toUpperCase()}${direction.slice(1)}`;
};

export const GameControls = ({
  isPlaying,
  onMove,
  onRequestSuggestion,
  hasRequestedSuggestion,
  suggestedDirection,
  getMoveButtonClassName,
  isSuggesting,
  suggestionError,
}: GameControlsProps) => {
  let suggestionLabel = 'Press "Get Suggestion" to see the best next move.';

  if (hasRequestedSuggestion) {
    suggestionLabel = `Best move: ${toDirectionLabel(suggestedDirection)}`;
  }

  if (suggestionError !== null) {
    suggestionLabel = `Unable to suggest a move: ${suggestionError}`;
  }

  if (isSuggesting) {
    suggestionLabel = "Analyzing the board for the best move...";
  }

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
        <button
          className="game-suggest-btn"
          onClick={onRequestSuggestion}
          disabled={!isPlaying || isSuggesting}
        >
          {isSuggesting ? "Analyzing\u2026" : "Get Suggestion"}
        </button>
        <p className="game-controls-hint" aria-live="polite">
          <span>{suggestionLabel}</span>
        </p>
      </div>
    </footer>
  );
};
