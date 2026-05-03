import { describe, expect, it } from "vitest";

import { evaluateBasicBoard, suggestBasicMove } from "./basic-suggestion";

describe("basic move suggestion", () => {
  it("returns null when no directions produce a change", () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];

    expect(suggestBasicMove(board)).toBeNull();
  });

  it("deterministically picks the best valid direction", () => {
    const board = [
      [null, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    expect(suggestBasicMove(board)).toBe("left");
  });

  it("ignores invalid moves where changed is false", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, null],
    ];

    const suggestion = suggestBasicMove(board);

    expect(suggestion).not.toBe("left");
    expect(suggestion).not.toBe("up");
    expect(["right", "down"]).toContain(suggestion);
  });
});

describe("basic board evaluation", () => {
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

    expect(evaluateBasicBoard(sparseBoard)).toBeGreaterThan(
      evaluateBasicBoard(denseBoard),
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

    expect(evaluateBasicBoard(mergeFriendlyBoard)).toBeGreaterThan(
      evaluateBasicBoard(noMergeBoard),
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

    expect(evaluateBasicBoard(cornerMaxBoard)).toBeGreaterThan(
      evaluateBasicBoard(centerMaxBoard),
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

    expect(evaluateBasicBoard(largerMaxBoard)).toBeGreaterThan(
      evaluateBasicBoard(smallerMaxBoard),
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

    expect(evaluateBasicBoard(lockedBoard)).toBeLessThan(
      evaluateBasicBoard(playableBoard),
    );
  });
});
