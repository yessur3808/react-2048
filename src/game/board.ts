import { BOARD_SIZE } from "./constants";
import type { Board, Cell, Direction, MoveResult } from "./types";

const copyBoard = (board: Board): Board => {
  return board.map((row) => [...row]);
};

export const createEmptyBoard = (): Board => {
  return Array.from({ length: BOARD_SIZE }, () =>
    new Array<Cell>(BOARD_SIZE).fill(null),
  );
};

export const getEmptyCells = (
  board: Board,
): Array<{ row: number; col: number }> => {
  const emptyCells: Array<{ row: number; col: number }> = [];

  for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
    for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
      if (board[rowIndex][colIndex] === null) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    }
  }

  return emptyCells;
};

export const addRandomTile = (board: Board): Board => {
  const nextBoard = copyBoard(board);
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return nextBoard;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomCell = emptyCells[randomIndex];
  const tileValue = Math.random() < 0.9 ? 2 : 4;

  nextBoard[randomCell.row][randomCell.col] = tileValue;

  return nextBoard;
};

export const createInitialBoard = (): Board => {
  let board = createEmptyBoard();
  const initialTileCount = Math.floor(Math.random() * 7) + 2;

  for (let tileIndex = 0; tileIndex < initialTileCount; tileIndex += 1) {
    const emptyCells = getEmptyCells(board);

    if (emptyCells.length === 0) {
      break;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const nextBoard = copyBoard(board);

    nextBoard[randomCell.row][randomCell.col] = 2;
    board = nextBoard;
  }

  return board;
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
