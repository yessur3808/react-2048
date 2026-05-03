import { BOARD_SIZE } from "./constants";
import { moveBoard } from "./moves";
import { canMove } from "./status";
import type { Board, Direction } from "./types";

const DIRECTIONS: Direction[] = ["left", "up", "right", "down"];

const countEmptyCells = (board: Board): number => {
  let emptyCount = 0;

  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
      if (board[rowIndex][colIndex] === null) {
        emptyCount += 1;
      }
    }
  }

  return emptyCount;
};

const countAdjacentMergeCandidates = (board: Board): number => {
  let mergeCandidates = 0;

  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
      const current = board[rowIndex][colIndex];

      if (current === null) {
        continue;
      }

      const hasRightNeighbor = colIndex < BOARD_SIZE - 1;
      if (hasRightNeighbor && current === board[rowIndex][colIndex + 1]) {
        mergeCandidates += 1;
      }

      const hasBottomNeighbor = rowIndex < BOARD_SIZE - 1;
      if (hasBottomNeighbor && current === board[rowIndex + 1][colIndex]) {
        mergeCandidates += 1;
      }
    }
  }

  return mergeCandidates;
};

const getMaximumTile = (board: Board): number => {
  let maxTile = 0;

  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
      const current = board[rowIndex][colIndex];

      if (current !== null && current > maxTile) {
        maxTile = current;
      }
    }
  }

  return maxTile;
};

const hasMaxTileInCorner = (board: Board, maxTile: number): boolean => {
  if (maxTile === 0) {
    return false;
  }

  const lastIndex = BOARD_SIZE - 1;

  return (
    board[0][0] === maxTile ||
    board[0][lastIndex] === maxTile ||
    board[lastIndex][0] === maxTile ||
    board[lastIndex][lastIndex] === maxTile
  );
};

export const evaluateBoard = (board: Board): number => {
  const emptyCells = countEmptyCells(board);
  const mergeCandidates = countAdjacentMergeCandidates(board);
  const maxTile = getMaximumTile(board);
  const maxTileInCorner = hasMaxTileInCorner(board, maxTile);

  const emptyCellScore = emptyCells * 120;
  const mergeScore = mergeCandidates * 90;
  const maxTileValueScore =
    maxTile * 0.15 + Math.log2(Math.max(maxTile, 1)) * 60;
  const cornerScore = maxTileInCorner ? maxTile * 0.5 : 0;
  const immobilePenalty = canMove(board) ? 0 : -10000;

  return (
    emptyCellScore +
    mergeScore +
    maxTileValueScore +
    cornerScore +
    immobilePenalty
  );
};

export const suggestMove = (board: Board): Direction | null => {
  let bestDirection: Direction | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const direction of DIRECTIONS) {
    const result = moveBoard(board, direction);

    if (!result.changed) {
      continue;
    }

    const score = evaluateBoard(result.board);

    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  }

  return bestDirection;
};
