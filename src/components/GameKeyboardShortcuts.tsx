import { useEffect } from "react";
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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ENABLE_DEBUG_SHORTCUTS &&
        event.shiftKey &&
        event.key.toLowerCase() === "w"
      ) {
        event.preventDefault();
        onForceDebugWin();
        return;
      }

      if (
        ENABLE_DEBUG_SHORTCUTS &&
        event.shiftKey &&
        event.key.toLowerCase() === "l"
      ) {
        event.preventDefault();
        onForceDebugLose();
        return;
      }

      if (event.key === "n") {
        event.preventDefault();
        onNewGame();
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        if (isPlaying && !isSuggesting && !isAnimatingMove) {
          onRequestSuggestion();
        }
        return;
      }

      if (!isPlaying || isAnimatingMove) {
        return;
      }

      const direction = getDirectionFromKey(event.key);

      if (direction === null) {
        return;
      }

      event.preventDefault();
      onMove(direction);
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isPlaying,
    isSuggesting,
    isAnimatingMove,
    onForceDebugLose,
    onForceDebugWin,
    onMove,
    onNewGame,
    onRequestSuggestion,
  ]);

  return null;
};
