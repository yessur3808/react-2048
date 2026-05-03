import { useEffect, useRef } from "react";
import type { Direction } from "../game/types";

type GameKeyboardShortcutsProps = Readonly<{
  isPlaying: boolean;
  isSuggesting: boolean;
  isAnimatingMove: boolean;
  onNewGame: () => void;
  onRequestSuggestion: () => void;
  onMove: (direction: Direction) => void;
  onForceDebugWin: () => void;
  onForceDebugLose: () => void;
}>;

const ENABLE_DEBUG_SHORTCUTS =
  import.meta.env.VITE_ENABLE_DEBUG_SHORTCUTS === "true";

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

export const GameKeyboardShortcuts = ({
  isPlaying,
  isSuggesting,
  isAnimatingMove,
  onNewGame,
  onRequestSuggestion,
  onMove,
  onForceDebugWin,
  onForceDebugLose,
}: GameKeyboardShortcutsProps) => {
  const latestStateRef = useRef({
    isPlaying,
    isSuggesting,
    isAnimatingMove,
    onNewGame,
    onRequestSuggestion,
    onMove,
    onForceDebugWin,
    onForceDebugLose,
  });

  useEffect(() => {
    latestStateRef.current = {
      isPlaying,
      isSuggesting,
      isAnimatingMove,
      onNewGame,
      onRequestSuggestion,
      onMove,
      onForceDebugWin,
      onForceDebugLose,
    };
  }, [
    isPlaying,
    isSuggesting,
    isAnimatingMove,
    onNewGame,
    onRequestSuggestion,
    onMove,
    onForceDebugWin,
    onForceDebugLose,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const {
        isPlaying: latestIsPlaying,
        isSuggesting: latestIsSuggesting,
        isAnimatingMove: latestIsAnimatingMove,
        onNewGame: latestOnNewGame,
        onRequestSuggestion: latestOnRequestSuggestion,
        onMove: latestOnMove,
        onForceDebugWin: latestOnForceDebugWin,
        onForceDebugLose: latestOnForceDebugLose,
      } = latestStateRef.current;

      if (
        ENABLE_DEBUG_SHORTCUTS &&
        event.shiftKey &&
        event.key.toLowerCase() === "w"
      ) {
        event.preventDefault();
        latestOnForceDebugWin();
        return;
      }

      if (
        ENABLE_DEBUG_SHORTCUTS &&
        event.shiftKey &&
        event.key.toLowerCase() === "l"
      ) {
        event.preventDefault();
        latestOnForceDebugLose();
        return;
      }

      if (event.key === "n") {
        event.preventDefault();
        latestOnNewGame();
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        if (latestIsPlaying && !latestIsSuggesting && !latestIsAnimatingMove) {
          latestOnRequestSuggestion();
        }
        return;
      }

      if (!latestIsPlaying || latestIsAnimatingMove) {
        return;
      }

      const direction = getDirectionFromKey(event.key);

      if (direction === null) {
        return;
      }

      event.preventDefault();
      latestOnMove(direction);
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
};
