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
  const activeDirectionTimeoutRef = useRef<number | null>(null);
  const status: GameStatus = getGameStatus(board);
  const isPlaying = status === "playing";

  const getMoveButtonClassName = (direction: Direction): string => {
    const isActive = activeDirection === direction;
    return `game-move-btn game-move-btn--${direction}${isActive ? " game-move-btn--active" : ""}`;
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
  };

  const handleMove = (direction: Direction) => {
    flashDirection(direction);

    if (!isPlaying) {
      return;
    }

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
          getMoveButtonClassName={getMoveButtonClassName}
        />
      </section>
    </main>
  );
}

export default App;
