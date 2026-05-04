import { useEffect, useRef, useState } from "react";
import "./App.css";
import { GameBoard } from "./components/GameBoard";
import { GameControls } from "./components/GameControls";
import { GameHeader } from "./components/GameHeader";
import { GameKeyboardLegend } from "./components/GameKeyboardLegend";
import { GameKeyboardShortcuts } from "./components/GameKeyboardShortcuts";
import { GameOverlay } from "./components/GameOverlay";
import {
  addRandomTile,
  createInitialBoard,
  getMoveTransitions,
  getGameStatus,
  moveBoard,
  suggestBasicMove,
} from "./game";
import { suggestAiMove } from "./game/model-suggestion";
import type {
  Board,
  Direction,
  GameStatus,
  SuggestionMode,
  TileTransition,
} from "./game/types";

const createBaseDebugBoard = (): Board => {
  return [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 2, 4],
    [8, 16, 32, 64],
  ];
};

// eslint-disable-next-line react-refresh/only-export-components
export const createDebugWinBoard = (): Board => {
  const board = createBaseDebugBoard();
  board[2][2] = 2048;
  return board;
};

// eslint-disable-next-line react-refresh/only-export-components
export const createDebugLoseBoard = (): Board => {
  return createBaseDebugBoard();
};

function App() {
  const MOVE_ANIMATION_MS = 130;
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [activeDirection, setActiveDirection] = useState<Direction | null>(
    null,
  );
  const [suggestedDirection, setSuggestedDirection] =
    useState<Direction | null>(null);
  const [hasRequestedSuggestion, setHasRequestedSuggestion] = useState(false);
  const [suggestionMode, setSuggestionMode] = useState<SuggestionMode>("ai");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [movingTiles, setMovingTiles] = useState<TileTransition[]>([]);
  const [isAnimatingMove, setIsAnimatingMove] = useState(false);
  const activeDirectionTimeoutRef = useRef<number | null>(null);
  const moveAnimationTimeoutRef = useRef<number | null>(null);
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

  const resetSuggestionUi = () => {
    setHasRequestedSuggestion(false);
    setSuggestedDirection(null);
    setSuggestionError(null);
    setIsSuggesting(false);
  };

  const handleNewGame = () => {
    if (moveAnimationTimeoutRef.current !== null) {
      globalThis.clearTimeout(moveAnimationTimeoutRef.current);
      moveAnimationTimeoutRef.current = null;
    }

    setBoard(createInitialBoard());
    setMovingTiles([]);
    setIsAnimatingMove(false);
    resetSuggestionUi();
  };

  const handleRequestSuggestion = async () => {
    setHasRequestedSuggestion(true);
    setSuggestionError(null);

    if (!isPlaying) {
      setSuggestedDirection(null);
      return;
    }

    if (suggestionMode === "ai") {
      setIsSuggesting(true);
      try {
        const suggestion = await suggestAiMove(board);
        setSuggestedDirection(suggestion);
      } catch (err) {
        setSuggestionError(
          err instanceof Error ? err.message : "AI suggestion failed",
        );
        setSuggestedDirection(null);
      } finally {
        setIsSuggesting(false);
      }
    } else {
      setSuggestedDirection(suggestBasicMove(board));
    }
  };

  const handleSuggestionModeChange = (mode: SuggestionMode) => {
    setSuggestionMode(mode);
    resetSuggestionUi();
  };

  const handleMove = (direction: Direction) => {
    if (isAnimatingMove) {
      return;
    }

    flashDirection(direction);

    if (!isPlaying) {
      return;
    }

    resetSuggestionUi();
    const result = moveBoard(board, direction);

    if (!result.changed) {
      return;
    }

    const transitions = getMoveTransitions(board, direction);

    setMovingTiles(transitions);
    setIsAnimatingMove(true);

    if (moveAnimationTimeoutRef.current !== null) {
      globalThis.clearTimeout(moveAnimationTimeoutRef.current);
    }

    moveAnimationTimeoutRef.current = globalThis.setTimeout(() => {
      setBoard(addRandomTile(result.board));
      setMovingTiles([]);
      setIsAnimatingMove(false);
      moveAnimationTimeoutRef.current = null;
    }, MOVE_ANIMATION_MS);
  };

  const handleForceDebugWin = () => {
    if (moveAnimationTimeoutRef.current !== null) {
      globalThis.clearTimeout(moveAnimationTimeoutRef.current);
      moveAnimationTimeoutRef.current = null;
    }

    setBoard(createDebugWinBoard());
    setMovingTiles([]);
    setIsAnimatingMove(false);
    resetSuggestionUi();
  };

  const handleForceDebugLose = () => {
    if (moveAnimationTimeoutRef.current !== null) {
      globalThis.clearTimeout(moveAnimationTimeoutRef.current);
      moveAnimationTimeoutRef.current = null;
    }

    setBoard(createDebugLoseBoard());
    setMovingTiles([]);
    setIsAnimatingMove(false);
    resetSuggestionUi();
  };

  useEffect(() => {
    return () => {
      if (activeDirectionTimeoutRef.current !== null) {
        globalThis.clearTimeout(activeDirectionTimeoutRef.current);
      }

      if (moveAnimationTimeoutRef.current !== null) {
        globalThis.clearTimeout(moveAnimationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className="app-root">
      <GameKeyboardShortcuts
        isPlaying={isPlaying}
        isSuggesting={isSuggesting}
        isAnimatingMove={isAnimatingMove}
        onNewGame={handleNewGame}
        onRequestSuggestion={handleRequestSuggestion}
        onMove={handleMove}
        onForceDebugWin={handleForceDebugWin}
        onForceDebugLose={handleForceDebugLose}
      />
      <div className="game-layout">
        <section className="game-shell" aria-label="2048 game container">
          <GameHeader
            onNewGame={handleNewGame}
            suggestionMode={suggestionMode}
            onSuggestionModeChange={handleSuggestionModeChange}
          />
          <div className="game-board-wrapper">
            <GameBoard board={board} movingTiles={movingTiles} />
            {!isPlaying && (
              <GameOverlay status={status} onNewGame={handleNewGame} />
            )}
          </div>
        </section>
        <GameKeyboardLegend />
        <GameControls
          isPlaying={isPlaying && !isAnimatingMove}
          onMove={handleMove}
          onRequestSuggestion={handleRequestSuggestion}
          hasRequestedSuggestion={hasRequestedSuggestion}
          suggestedDirection={suggestedDirection}
          getMoveButtonClassName={getMoveButtonClassName}
          isSuggesting={isSuggesting}
          suggestionError={suggestionError}
        />
      </div>
    </main>
  );
}

export default App;
