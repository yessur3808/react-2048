import { BOARD_SIZE } from "./constants";
import { boardsEqual, createEmptyBoard, mergeLineLeft } from "./base";
import type {
  Board,
  Cell,
  Direction,
  MoveResult,
  TileTransition,
} from "./types";

type LineEntry = {
  row: number;
  col: number;
  value: number;
};

type MergedCell = {
  value: number;
  sources: LineEntry[];
};

const getLineEntries = (
  board: Board,
  direction: Direction,
  line: number,
): LineEntry[] => {
  const entries: LineEntry[] = [];

  for (let step = 0; step < BOARD_SIZE; step += 1) {
    let row = 0;
    let col = 0;

    switch (direction) {
      case "left":
        row = line;
        col = step;
        break;
      case "right":
        row = line;
        col = BOARD_SIZE - 1 - step;
        break;
      case "up":
        row = step;
        col = line;
        break;
      case "down":
        row = BOARD_SIZE - 1 - step;
        col = line;
        break;
    }

    const value = board[row][col];
    if (value !== null) {
      entries.push({ row, col, value });
    }
  }

  return entries;
};

const orientedIndexToCoord = (
  direction: Direction,
  line: number,
  index: number,
): { row: number; col: number } => {
  switch (direction) {
    case "left":
      return { row: line, col: index };
    case "right":
      return { row: line, col: BOARD_SIZE - 1 - index };
    case "up":
      return { row: index, col: line };
    case "down":
      return { row: BOARD_SIZE - 1 - index, col: line };
  }
};

const mergeLineEntriesLeft = (entries: LineEntry[]): MergedCell[] => {
  const merged: MergedCell[] = [];

  let index = 0;
  while (index < entries.length) {
    const current = entries[index];
    const next = entries[index + 1];

    if (next?.value === current.value) {
      merged.push({
        value: current.value * 2,
        sources: [current, next],
      });
      index += 2;
      continue;
    }

    merged.push({
      value: current.value,
      sources: [current],
    });
    index += 1;
  }

  return merged;
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

export const getMoveTransitions = (
  board: Board,
  direction: Direction,
): TileTransition[] => {
  const transitions: TileTransition[] = [];

  for (let line = 0; line < BOARD_SIZE; line += 1) {
    const entries = getLineEntries(board, direction, line);
    const merged = mergeLineEntriesLeft(entries);

    for (let outIndex = 0; outIndex < merged.length; outIndex += 1) {
      const destination = orientedIndexToCoord(direction, line, outIndex);
      const destinationValue = merged[outIndex].value;

      for (
        let sourceIndex = 0;
        sourceIndex < merged[outIndex].sources.length;
        sourceIndex += 1
      ) {
        const source = merged[outIndex].sources[sourceIndex];
        const moved =
          source.row !== destination.row || source.col !== destination.col;

        if (!moved) {
          continue;
        }

        transitions.push({
          key: `${source.row}-${source.col}-${destination.row}-${destination.col}-${destinationValue}-${sourceIndex}`,
          value: source.value,
          fromRow: source.row,
          fromCol: source.col,
          toRow: destination.row,
          toCol: destination.col,
        });
      }
    }
  }

  return transitions;
};
