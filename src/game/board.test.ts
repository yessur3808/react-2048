import { describe, expect, it } from "vitest";

import {
  boardsEqual,
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
