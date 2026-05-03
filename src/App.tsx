import { useEffect, useRef, useState } from "react";
import "./App.css";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { GameHeader } from "./components/GameHeader";
import { GameOverlay } from "./components/GameOverlay";
import {
  addRandomTile,
  createInitialBoard,
  getGameStatus,
  moveBoard,
  suggestMove,
} from "./game";
import type { Board, Direction, GameStatus } from "./game/types";

const getDirectionFromKey = (key: string): Direction | null => {
  switch (key) {
    case "ArrowLeft":
      return "left";
    case "ArrowRight":
      return "right";
    case "ArrowUp":
      return "up";
    case "ArrowDown":
      return "down";
    default:
      return null;
  }
};

function App() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [activeDirection, setActiveDirection] = useState<Direction | null>(
    null,
  );
  const [suggestedDirection, setSuggestedDirection] =
    useState<Direction | null>(null);
  const [hasRequestedSuggestion, setHasRequestedSuggestion] = useState(false);
  const activeDirectionTimeoutRef = useRef<number | null>(null);
  const status: GameStatus = getGameStatus(board);
  const isPlaying = status === "playing";

  const getMoveButtonClassName = (direction: Direction): string => {
    const isActive = activeDirection === direction;
    const isSuggested =
      hasRequestedSuggestion && suggestedDirection === direction && !isActive;

    return `game-move-btn game-move-btn--${direction}${isActive ? " game-move-btn--active" : ""}${isSuggested ? " game-move-btn--suggested" : ""}`;
  };

  // Briefly highlight the matching control for both keyboard and button moves.
  const flashDirection = (direction: Direction) => {
    setActiveDirection(direction);

    if (activeDirectionTimeoutRef.current !== null) {
      globalThis.clearTimeout(activeDirectionTimeoutRef.current);
    }

    activeDirectionTimeoutRef.current = globalThis.setTimeout(() => {
      setActiveDirection(null);
    }, 130);
  };

  const handleNewGame = () => {
    setBoard(createInitialBoard());
    setHasRequestedSuggestion(false);
    setSuggestedDirection(null);
  };

  const handleRequestSuggestion = () => {
    setHasRequestedSuggestion(true);

    if (!isPlaying) {
      setSuggestedDirection(null);
      return;
    }

    setSuggestedDirection(suggestMove(board));
  };

  const handleMove = (direction: Direction) => {
    flashDirection(direction);

    if (!isPlaying) {
      return;
    }

    setHasRequestedSuggestion(false);
    setSuggestedDirection(null);

    setBoard((currentBoard) => {
      const result = moveBoard(currentBoard, direction);

      if (!result.changed) {
        return currentBoard;
      }

      return addRandomTile(result.board);
    });
  };

  useEffect(() => {
    return () => {
      if (activeDirectionTimeoutRef.current !== null) {
        globalThis.clearTimeout(activeDirectionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlaying) {
        return;
      }

      const direction = getDirectionFromKey(event.key);

      if (direction === null) {
        return;
      }

      event.preventDefault();
      handleMove(direction);
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <main className="app-root">
      <section className="game-shell" aria-label="2048 game container">
        <GameHeader onNewGame={handleNewGame} />
        <div className="game-board-wrapper">
          <GameBoard board={board} />
          {!isPlaying && (
            <GameOverlay status={status} onNewGame={handleNewGame} />
          )}
        </div>
        <GameControls
          isPlaying={isPlaying}
          onMove={handleMove}
          onRequestSuggestion={handleRequestSuggestion}
          hasRequestedSuggestion={hasRequestedSuggestion}
          suggestedDirection={suggestedDirection}
          getMoveButtonClassName={getMoveButtonClassName}
        />
      </section>
    </main>
  );
}

export default App;
