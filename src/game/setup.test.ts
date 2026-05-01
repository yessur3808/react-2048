import { describe, expect, it } from "vitest";

import { addRandomTile, createInitialBoard, getEmptyCells } from "./setup";

describe("board setup", () => {
  it("getEmptyCells returns the coordinates of all empty cells", () => {
    const board = [
      [2, null, 4, null],
      [null, null, 8, 16],
      [32, 64, null, 128],
      [256, 512, 1024, null],
    ];

    expect(getEmptyCells(board)).toEqual([
      { row: 0, col: 1 },
      { row: 0, col: 3 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 2 },
      { row: 3, col: 3 },
    ]);
  });

  it("addRandomTile returns an unchanged copy when the board is full", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    const result = addRandomTile(board);

    expect(result).toEqual(board);
    expect(result).not.toBe(board);
  });

  it("initial board has between 2 and 8 non-null cells", () => {
    const board = createInitialBoard();
    const filledCells = board.flat().filter((cell) => cell !== null);

    expect(filledCells.length).toBeGreaterThanOrEqual(2);
    expect(filledCells.length).toBeLessThanOrEqual(8);
  });

  it("all initial values are 2", () => {
    const board = createInitialBoard();
    const filledCells = board.flat().filter((cell) => cell !== null);

    expect(filledCells.every((cell) => cell === 2)).toBe(true);
  });

  it("addRandomTile increases filled cells by 1 when possible", () => {
    const board = [
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const beforeCount = board.flat().filter((cell) => cell !== null).length;
    const result = addRandomTile(board);
    const afterCount = result.flat().filter((cell) => cell !== null).length;

    expect(afterCount).toBe(beforeCount + 1);
  });

  it("addRandomTile does not mutate the input board", () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const snapshot = board.map((row) => [...row]);

    void addRandomTile(board);

    expect(board).toEqual(snapshot);
  });
});
