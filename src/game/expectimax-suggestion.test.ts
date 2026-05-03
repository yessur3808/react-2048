import { describe, expect, it } from "vitest";

import { suggestAiMove } from "./expectimax-suggestion";

describe("offline AI expectimax suggestion", () => {
  it("returns null when the board is locked", () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];

    expect(suggestAiMove(board)).toBeNull();
  });

  it("returns a valid move on a playable board", () => {
    const board = [
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    expect(["left", "right", "up", "down"]).toContain(suggestAiMove(board));
  });

  it("is deterministic for the same board state", () => {
    const board = [
      [2, null, 2, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const first = suggestAiMove(board);
    const second = suggestAiMove(board);

    expect(first).toBe(second);
  });

  it("prefers a strong merge move when available", () => {
    const board = [
      [2, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    expect(suggestAiMove(board)).toBe("left");
  });
});
