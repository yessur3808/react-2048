import { useEffect, useState } from "react";
import "./App.css";
import { GameBoard } from "./components/GameBoard";
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
  const status: GameStatus = getGameStatus(board);
  const isOver = status === "won" || status === "lost";

  const handleNewGame = () => {
    setBoard(createInitialBoard());
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOver) {
        return;
      }

      const direction = getDirectionFromKey(event.key);

      if (direction === null) {
        return;
      }

      event.preventDefault();

      setBoard((currentBoard) => {
        const result = moveBoard(currentBoard, direction);

        if (!result.changed) {
          return currentBoard;
        }

        return addRandomTile(result.board);
      });
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOver]);

  return (
    <main className="app-root">
      <section className="game-shell" aria-label="2048 game container">
        <header className="game-header">
          <p className="game-kicker">React 2048</p>
          <h1 className="game-title">2048</h1>
          <p className="game-subtitle">Use the arrow keys to move tiles.</p>
        </header>
        <div className="game-board-wrapper">
          <GameBoard board={board} />
          {isOver && (
            <div
              className={`game-overlay game-overlay--${status}`}
              role="status"
              aria-live="polite"
            >
              <p className="game-overlay__message">
                {status === "won" ? "You won! 🎉" : "Game over"}
              </p>
              <button className="game-overlay__btn" onClick={handleNewGame}>
                New Game
              </button>
            </div>
          )}
        </div>
        {!isOver && (
          <footer className="game-footer">
            <button className="game-new-btn" onClick={handleNewGame}>
              New Game
            </button>
          </footer>
        )}
      </section>
    </main>
  );
}

export default App;
