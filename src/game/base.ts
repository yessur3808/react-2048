import { BOARD_SIZE } from "./constants";
import type { Board, Cell } from "./types";

export const copyBoard = (board: Board): Board => {
  return board.map((row) => [...row]);
};

export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_SIZE }, () =>
    new Array<Cell>(BOARD_SIZE).fill(null),
  );
};

export const mergeLineLeft = (line: Cell[]): Cell[] => {
  const compacted = line.filter((cell): cell is number => cell !== null);
  const merged: Cell[] = [];

  let index = 0;
  while (index < compacted.length) {
    const current = compacted[index];
    const next = compacted[index + 1];

    if (current === next) {
      merged.push(current * 2);
      index += 2;
      continue;
    }

    merged.push(current);
    index += 1;
  }

  while (merged.length < BOARD_SIZE) {
    merged.push(null);
  }

  return merged.slice(0, BOARD_SIZE);
};

export const boardsEqual = (a: Board, b: Board): boolean => {
  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
      if (a[rowIndex][colIndex] !== b[rowIndex][colIndex]) {
        return false;
      }
    }
  }

  return true;
};
