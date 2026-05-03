import { describe, expect, it } from "vitest";

import { evaluateBoard, suggestMove } from "./ai";

describe("offline AI move suggestion", () => {
  it("suggestMove returns null when no directions produce a change", () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];

    expect(suggestMove(board)).toBeNull();
  });

  it("suggestMove deterministically picks the best valid direction", () => {
    const board = [
      [null, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    expect(suggestMove(board)).toBe("left");
  });

  it("suggestMove ignores invalid moves where changed is false", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, null],
    ];

    const suggestion = suggestMove(board);

    expect(suggestion).not.toBe("left");
    expect(suggestion).not.toBe("up");
    expect(["right", "down"]).toContain(suggestion);
  });
});

describe("offline AI board evaluation", () => {
  it("rewards boards with more empty cells", () => {
    const sparseBoard = [
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const denseBoard = [
      [2, 4, 8, 16],
      [32, 64, null, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(evaluateBoard(sparseBoard)).toBeGreaterThan(
      evaluateBoard(denseBoard),
    );
  });

  it("rewards boards with adjacent merge opportunities", () => {
    const mergeFriendlyBoard = [
      [4, 4, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const noMergeBoard = [
      [4, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    expect(evaluateBoard(mergeFriendlyBoard)).toBeGreaterThan(
      evaluateBoard(noMergeBoard),
    );
  });

  it("rewards having the maximum tile in a corner", () => {
    const cornerMaxBoard = [
      [64, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const centerMaxBoard = [
      [null, null, null, null],
      [null, 64, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    expect(evaluateBoard(cornerMaxBoard)).toBeGreaterThan(
      evaluateBoard(centerMaxBoard),
    );
  });

  it("rewards larger maximum tile values", () => {
    const largerMaxBoard = [
      [128, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const smallerMaxBoard = [
      [64, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    expect(evaluateBoard(largerMaxBoard)).toBeGreaterThan(
      evaluateBoard(smallerMaxBoard),
    );
  });

  it("penalizes boards where canMove is false", () => {
    const lockedBoard = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];

    const playableBoard = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, null],
    ];

    expect(evaluateBoard(lockedBoard)).toBeLessThan(
      evaluateBoard(playableBoard),
    );
  });
});
