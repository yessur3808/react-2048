import { BOARD_SIZE } from "./constants";
import type { Board, GameStatus } from "./types";

export const hasWon = (board: Board): boolean => {
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
      const cell = board[rowIndex][colIndex];

      if (cell !== null && cell >= 2048) {
        return true;
      }
    }
  }

  return false;
};

export const canMove = (board: Board): boolean => {
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
      const current = board[rowIndex][colIndex];

      if (current === null) {
        return true;
      }

      const hasRightNeighbor = colIndex < BOARD_SIZE - 1;
      if (hasRightNeighbor && current === board[rowIndex][colIndex + 1]) {
        return true;
      }

      const hasBottomNeighbor = rowIndex < BOARD_SIZE - 1;
      if (hasBottomNeighbor && current === board[rowIndex + 1][colIndex]) {
        return true;
      }
    }
  }

  return false;
};

export const hasLost = (board: Board): boolean => {
  return !hasWon(board) && !canMove(board);
};

export const getGameStatus = (board: Board): GameStatus => {
  if (hasWon(board)) {
    return "won";
  }

  if (hasLost(board)) {
    return "lost";
  }

  return "playing";
};
