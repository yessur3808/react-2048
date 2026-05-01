import { describe, expect, it } from "vitest";

import { canMove, getGameStatus, hasLost, hasWon } from "./status";

describe("game status", () => {
  it("hasWon is true when a tile is 2048", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4],
      [8, 16, 32, 64],
    ];

    expect(hasWon(board)).toBe(true);
  });

  it("hasWon is true when a tile is greater than 2048", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 4096, 4],
      [8, 16, 32, 64],
    ];

    expect(hasWon(board)).toBe(true);
  });

  it("hasWon is false when all tiles are below 2048", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(hasWon(board)).toBe(false);
  });

  it("canMove is true when at least one cell is null", () => {
    const board = [
      [2, 4, 8, 16],
      [32, null, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(canMove(board)).toBe(true);
  });

  it("canMove is true when full board has equal horizontal neighbors", () => {
    const board = [
      [2, 2, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(canMove(board)).toBe(true);
  });

  it("canMove is true when full board has equal vertical neighbors", () => {
    const board = [
      [2, 4, 8, 16],
      [2, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(canMove(board)).toBe(true);
  });

  it("canMove is false when board is full and has no equal neighbors", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(canMove(board)).toBe(false);
  });

  it("hasLost is true when board is not won and cannot move", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(hasLost(board)).toBe(true);
  });

  it("hasLost is false when board has been won", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4],
      [8, 16, 32, 64],
    ];

    expect(hasLost(board)).toBe(false);
  });

  it("getGameStatus returns won", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 4],
      [8, 16, 32, 64],
    ];

    expect(getGameStatus(board)).toBe("won");
  });

  it("getGameStatus returns lost", () => {
    const board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(getGameStatus(board)).toBe("lost");
  });

  it("getGameStatus returns playing", () => {
    const board = [
      [2, 4, 8, 16],
      [32, null, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];

    expect(getGameStatus(board)).toBe("playing");
  });
});
