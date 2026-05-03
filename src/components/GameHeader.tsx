import type { MouseEventHandler } from "react";
import type { SuggestionMode } from "../game/types";

type GameHeaderProps = Readonly<{
  onNewGame: MouseEventHandler<HTMLButtonElement>;
  suggestionMode: SuggestionMode;
  onSuggestionModeChange: (mode: SuggestionMode) => void;
}>;

export const GameHeader = ({
  onNewGame,
  suggestionMode,
  onSuggestionModeChange,
}: GameHeaderProps) => {
  return (
    <header className="game-header">
      <div className="game-header-row">
        <h1 className="game-title">React 2048</h1>
        <button className="game-new-btn game-new-btn--top" onClick={onNewGame}>
          New Game
        </button>
      </div>
      <p className="game-subtitle">
        Use arrow keys or the move buttons to slide and merge tiles.
      </p>
      <div className="game-settings-row" aria-label="suggestion mode">
        <span className="game-settings-label">Suggestion mode</span>
        <div
          className="game-mode-toggle"
          role="group"
          aria-label="Select suggestion mode"
        >
          <button
            className={`game-mode-toggle__btn${suggestionMode === "basic" ? " game-mode-toggle__btn--active" : ""}`}
            onClick={() => onSuggestionModeChange("basic")}
          >
            Basic
          </button>
          <button
            className={`game-mode-toggle__btn${suggestionMode === "ai" ? " game-mode-toggle__btn--active" : ""}`}
            onClick={() => onSuggestionModeChange("ai")}
          >
            AI
          </button>
        </div>
      </div>
    </header>
  );
};
