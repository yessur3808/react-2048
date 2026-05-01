import { BOARD_SIZE } from "./constants";
import { boardsEqual, createEmptyBoard, mergeLineLeft } from "./base";
import type { Board, Cell, Direction, MoveResult } from "./types";

export const moveLeft = (board: Board): MoveResult => {
  const moved = board.map((row) => mergeLineLeft([...row]));

  return {
    board: moved,
    changed: !boardsEqual(board, moved),
  };
};

export const moveRight = (board: Board): MoveResult => {
  const moved = board.map((row) => {
    const reversed = [...row].reverse();
    const merged = mergeLineLeft(reversed);

    return merged.reverse();
  });

  return {
    board: moved,
    changed: !boardsEqual(board, moved),
  };
};

export const moveUp = (board: Board): MoveResult => {
  const moved = createEmptyBoard();

  for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
    const line: Cell[] = [];

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
      line.push(board[rowIndex][colIndex]);
    }

    const merged = mergeLineLeft(line);

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
      moved[rowIndex][colIndex] = merged[rowIndex];
    }
  }

  return {
    board: moved,
    changed: !boardsEqual(board, moved),
  };
};

export const moveDown = (board: Board): MoveResult => {
  const moved = createEmptyBoard();

  for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
    const line: Cell[] = [];

    for (let rowIndex = BOARD_SIZE - 1; rowIndex >= 0; rowIndex -= 1) {
      line.push(board[rowIndex][colIndex]);
    }

    const merged = mergeLineLeft(line);

    let mergedIndex = 0;
    for (let rowIndex = BOARD_SIZE - 1; rowIndex >= 0; rowIndex -= 1) {
      moved[rowIndex][colIndex] = merged[mergedIndex];
      mergedIndex += 1;
    }
  }

  return {
    board: moved,
    changed: !boardsEqual(board, moved),
  };
};

export const moveBoard = (board: Board, direction: Direction): MoveResult => {
  switch (direction) {
    case "left":
      return moveLeft(board);
    case "right":
      return moveRight(board);
    case "up":
      return moveUp(board);
    case "down":
      return moveDown(board);
  }
};
