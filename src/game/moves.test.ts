import { describe, expect, it } from "vitest";

import { moveBoard, moveDown, moveLeft, moveRight, moveUp } from "./moves";

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

    moveLeft(board);
    moveRight(board);
    moveUp(board);
    moveDown(board);

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

  // --- Tricky vertical chain merges ---

  it("moveUp compacts a full column of equal pairs to the top: [2,2,2,2] → [4,4,null,null]", () => {
    const board = [
      [2, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
    ];

    const result = moveUp(board);

    expect(result.board).toEqual([
      [4, null, null, null],
      [4, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    expect(result.changed).toBe(true);
  });

  it("moveUp handles column with leading gap and mismatched tail: [null,2,2,4] → [4,4,null,null]", () => {
    const board = [
      [null, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
      [4, null, null, null],
    ];

    const result = moveUp(board);

    expect(result.board[0][0]).toBe(4);
    expect(result.board[1][0]).toBe(4);
    expect(result.board[2][0]).toBeNull();
    expect(result.board[3][0]).toBeNull();
    expect(result.changed).toBe(true);
  });

  it("moveUp handles multi-column chain merges simultaneously", () => {
    const board = [
      [2, 4, null, 8],
      [2, 4, null, 8],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const result = moveUp(board);

    expect(result.board).toEqual([
      [4, 8, null, 16],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]);
    expect(result.changed).toBe(true);
  });

  it("moveDown compacts a full column of equal pairs to the bottom: [2,2,2,2] → [null,null,4,4]", () => {
    const board = [
      [2, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
    ];

    const result = moveDown(board);

    expect(result.board).toEqual([
      [null, null, null, null],
      [null, null, null, null],
      [4, null, null, null],
      [4, null, null, null],
    ]);
    expect(result.changed).toBe(true);
  });

  it("moveDown handles column with trailing gap and mismatched head: [4,2,2,null] → [null,null,4,4]", () => {
    const board = [
      [4, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
      [null, null, null, null],
    ];

    const result = moveDown(board);

    expect(result.board[0][0]).toBeNull();
    expect(result.board[1][0]).toBeNull();
    expect(result.board[2][0]).toBe(4);
    expect(result.board[3][0]).toBe(4);
    expect(result.changed).toBe(true);
  });

  // --- No double-merge in columns after rotation transforms ---

  it("moveUp does not double-merge: [4,null,null,4] in a column produces 8 not 16", () => {
    const board = [
      [4, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [4, null, null, null],
    ];

    const result = moveUp(board);

    expect(result.board[0][0]).toBe(8);
    expect(result.board[1][0]).toBeNull();
    expect(result.board[2][0]).toBeNull();
    expect(result.board[3][0]).toBeNull();
  });

  it("moveUp does not double-merge: [2,2,4,null] first pair merges to 4, second 4 stays separate → [4,4,null,null]", () => {
    // If double-merge were allowed the result would be [8,null,null,null], which is wrong.
    const board = [
      [2, null, null, null],
      [2, null, null, null],
      [4, null, null, null],
      [null, null, null, null],
    ];

    const result = moveUp(board);

    expect(result.board[0][0]).toBe(4);
    expect(result.board[1][0]).toBe(4);
    expect(result.board[2][0]).toBeNull();
    expect(result.board[3][0]).toBeNull();
  });

  it("moveDown does not double-merge: [null,4,null,4] in a column produces 8 at the bottom", () => {
    const board = [
      [null, null, null, null],
      [4, null, null, null],
      [null, null, null, null],
      [4, null, null, null],
    ];

    const result = moveDown(board);

    expect(result.board[3][0]).toBe(8);
    expect(result.board[2][0]).toBeNull();
    expect(result.board[1][0]).toBeNull();
    expect(result.board[0][0]).toBeNull();
  });

  it("moveDown does not double-merge: [null,4,2,2] last two merge to 4, existing 4 stays separate → [null,null,4,4]", () => {
    // If double-merge were allowed the result would be [null,null,null,8], which is wrong.
    const board = [
      [null, null, null, null],
      [4, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
    ];

    const result = moveDown(board);

    expect(result.board[3][0]).toBe(4);
    expect(result.board[2][0]).toBe(4);
    expect(result.board[1][0]).toBeNull();
    expect(result.board[0][0]).toBeNull();
  });
});
