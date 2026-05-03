import { copyBoard } from "./base";
import { moveBoard } from "./moves";
import { getEmptyCells } from "./setup";
import { canMove } from "./status";
import { evaluateBasicBoard } from "./basic-suggestion";
import type { Board, Direction } from "./types";

const DIRECTIONS: Direction[] = ["left", "up", "right", "down"];
const EXPECTIMAX_DEPTH = 3;
const TILE_TWO_PROBABILITY = 0.9;
const TILE_FOUR_PROBABILITY = 0.1;

type Cache = Map<string, number>;

const boardToKey = (board: Board): string => {
  return board
    .map((row) => row.map((cell) => String(cell ?? "_")).join(","))
    .join("|");
};

const evaluateChanceNode = (
  board: Board,
  depth: number,
  cache: Cache,
): number => {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return evaluateExpectimax(board, depth - 1, false, cache);
  }

  const spawnCellProbability = 1 / emptyCells.length;
  let expectedValue = 0;

  for (const { row, col } of emptyCells) {
    const withTwo = copyBoard(board);
    withTwo[row][col] = 2;

    const withFour = copyBoard(board);
    withFour[row][col] = 4;

    const twoScore = evaluateExpectimax(withTwo, depth - 1, false, cache);
    const fourScore = evaluateExpectimax(withFour, depth - 1, false, cache);

    expectedValue +=
      spawnCellProbability *
      (TILE_TWO_PROBABILITY * twoScore + TILE_FOUR_PROBABILITY * fourScore);
  }

  return expectedValue;
};

const evaluateMaxNode = (board: Board, depth: number, cache: Cache): number => {
  let bestScore = Number.NEGATIVE_INFINITY;
  let foundValidMove = false;

  for (const direction of DIRECTIONS) {
    const result = moveBoard(board, direction);

    if (!result.changed) {
      continue;
    }

    foundValidMove = true;
    const score = evaluateExpectimax(result.board, depth - 1, true, cache);

    if (score > bestScore) {
      bestScore = score;
    }
  }

  if (!foundValidMove) {
    return evaluateBasicBoard(board);
  }

  return bestScore;
};

const evaluateExpectimax = (
  board: Board,
  depth: number,
  isChanceNode: boolean,
  cache: Cache,
): number => {
  const key = `${depth}:${isChanceNode ? "chance" : "max"}:${boardToKey(board)}`;
  const cachedValue = cache.get(key);

  if (cachedValue !== undefined) {
    return cachedValue;
  }

  let score: number;

  if (depth <= 0 || !canMove(board)) {
    score = evaluateBasicBoard(board);
  } else if (isChanceNode) {
    score = evaluateChanceNode(board, depth, cache);
  } else {
    score = evaluateMaxNode(board, depth, cache);
  }

  cache.set(key, score);
  return score;
};

export const suggestAiMove = (board: Board): Direction | null => {
  const cache: Cache = new Map();
  let bestDirection: Direction | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const direction of DIRECTIONS) {
    const result = moveBoard(board, direction);

    if (!result.changed) {
      continue;
    }

    const score = evaluateExpectimax(
      result.board,
      EXPECTIMAX_DEPTH - 1,
      true,
      cache,
    );

    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  }

  return bestDirection;
};
