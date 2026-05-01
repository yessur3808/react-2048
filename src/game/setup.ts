import type { Board } from "./types";
import { copyBoard, createEmptyBoard } from "./base";
import { BOARD_SIZE } from "./constants";

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
