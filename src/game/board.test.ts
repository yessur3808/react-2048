import { describe, expect, it, vi } from "vitest";

import {
  addRandomTile,
  boardsEqual,
  createInitialBoard,
  createEmptyBoard,
  getEmptyCells,
  mergeLineLeft,
  moveBoard,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
} from "./board";

describe("mergeLineLeft", () => {
  it("returns [8, 4, null, null] for [null, 8, 2, 2]", () => {
    expect(mergeLineLeft([null, 8, 2, 2])).toEqual([8, 4, null, null]);
  });

  it("returns [4, 2, null, null] for [2, 2, 2, null]", () => {
    expect(mergeLineLeft([2, 2, 2, null])).toEqual([4, 2, null, null]);
  });

  it("returns [4, 4, null, null] for [2, 2, 2, 2]", () => {
    expect(mergeLineLeft([2, 2, 2, 2])).toEqual([4, 4, null, null]);
  });

  it("returns [null, null, null, null] for [null, null, null, null]", () => {
    expect(mergeLineLeft([null, null, null, null])).toEqual([
      null,
      null,
      null,
      null,
    ]);
  });

  it("returns [8, 4, null, null] for [4, null, 4, 4]", () => {
    expect(mergeLineLeft([4, null, 4, 4])).toEqual([8, 4, null, null]);
  });
});

describe("boardsEqual", () => {
  it("returns true for equal boards", () => {
    const a = [
      [2, null, null, null],
      [null, 4, null, null],
      [null, null, 8, null],
      [null, null, null, 16],
    ];

    const b = [
      [2, null, null, null],
      [null, 4, null, null],
      [null, null, 8, null],
      [null, null, null, 16],
    ];

    expect(boardsEqual(a, b)).toBe(true);
  });

  it("returns false for different boards", () => {
    const a = [
      [2, null, null, null],
      [null, 4, null, null],
      [null, null, 8, null],
      [null, null, null, 16],
    ];

    const b = [
      [2, null, null, null],
      [null, 4, null, null],
      [null, null, 16, null],
      [null, null, null, 16],
    ];

    expect(boardsEqual(a, b)).toBe(false);
  });
});

describe("board movement", () => {
  it("moveLeft returns expected board for the provided starting board", () => {
    const board = [
      [null, 8, 2, 2],
      [4, 2, null, 2],
      [null, null, null, null],
      [null, null, null, 2],
    ];

    const result = moveLeft(board);

    expect(result.board).toEqual([
      [8, 4, null, null],
      [4, 4, null, null],
      [null, null, null, null],
      [2, null, null, null],
    ]);
    expect(result.changed).toBe(true);
  });

  it("moveRight works on a simple board", () => {
    const board = [
      [2, null, 2, null],
      [4, 4, null, null],
      [null, null, null, null],
      [2, null, null, 2],
    ];

    const result = moveRight(board);

    expect(result.board).toEqual([
      [null, null, null, 4],
      [null, null, null, 8],
      [null, null, null, null],
      [null, null, null, 4],
    ]);
    expect(result.changed).toBe(true);
  });

  it("moveUp works on a simple board", () => {
    const board = [
      [null, 2, null, null],
      [2, null, null, null],
      [2, 2, null, null],
      [null, null, null, null],
    ];

    const result = moveUp(board);

    expect(result.board).toEqual([
      [4, 4, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    expect(result.changed).toBe(true);
  });

  it("moveDown works on a simple board", () => {
    const board = [
      [null, 2, null, null],
      [2, null, null, null],
      [2, 2, null, null],
      [null, null, null, null],
    ];

    const result = moveDown(board);

    expect(result.board).toEqual([
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [4, 4, null, null],
    ]);
    expect(result.changed).toBe(true);
  });

  it("moveBoard dispatches by direction", () => {
    const board = [
      [null, 2, 2, null],
      [null, null, null, null],
      [4, null, 4, 4],
      [2, 2, 2, 2],
    ];

    expect(moveBoard(board, "left").board).toEqual(moveLeft(board).board);
    expect(moveBoard(board, "right").board).toEqual(moveRight(board).board);
    expect(moveBoard(board, "up").board).toEqual(moveUp(board).board);
    expect(moveBoard(board, "down").board).toEqual(moveDown(board).board);
  });

  it("move functions do not mutate the original board", () => {
    const board = [
      [null, 2, 2, null],
      [2, null, 2, 2],
      [null, null, null, null],
      [2, 2, 2, 2],
    ];
    const snapshot = board.map((row) => [...row]);

    void moveLeft(board);
    void moveRight(board);
    void moveUp(board);
    void moveDown(board);

    expect(board).toEqual(snapshot);
  });

  it("changed is false when the board cannot move in that direction", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(moveLeft(board).changed).toBe(false);
  });
});

describe("board generation", () => {
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

  it("addRandomTile adds a 2 with 90 percent probability", () => {
    const board = createEmptyBoard();
    const randomSpy = vi.spyOn(Math, "random");

    randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    const result = addRandomTile(board);

    expect(result).toEqual([
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);

    randomSpy.mockRestore();
  });

  it("addRandomTile adds a 4 with 10 percent probability", () => {
    const board = createEmptyBoard();
    const randomSpy = vi.spyOn(Math, "random");

    randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0.95);

    const result = addRandomTile(board);

    expect(result).toEqual([
      [4, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);

    randomSpy.mockRestore();
  });

  it("addRandomTile does not mutate the input board", () => {
    const board = createEmptyBoard();
    const snapshot = board.map((row) => [...row]);
    const randomSpy = vi.spyOn(Math, "random");

    randomSpy.mockReturnValueOnce(0).mockReturnValueOnce(0.5);

    void addRandomTile(board);

    expect(board).toEqual(snapshot);

    randomSpy.mockRestore();
  });

  it("createInitialBoard can create the minimum number of initial 2 tiles", () => {
    const randomSpy = vi.spyOn(Math, "random");

    randomSpy
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const board = createInitialBoard();
    const placedValues = board.flat().filter((cell) => cell !== null);

    expect(placedValues).toHaveLength(2);
    expect(placedValues.every((cell) => cell === 2)).toBe(true);

    randomSpy.mockRestore();
  });

  it("createInitialBoard can create the maximum number of initial 2 tiles", () => {
    const randomSpy = vi.spyOn(Math, "random");

    randomSpy
      .mockReturnValueOnce(0.999999)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const board = createInitialBoard();
    const placedValues = board.flat().filter((cell) => cell !== null);

    expect(placedValues).toHaveLength(8);
    expect(placedValues.every((cell) => cell === 2)).toBe(true);

    randomSpy.mockRestore();
  });
});
