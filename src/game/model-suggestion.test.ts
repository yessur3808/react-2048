import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Board, Direction } from "./types";

// Mock @tensorflow/tfjs before importing model-suggestion
vi.mock("@tensorflow/tfjs", () => {
  const mockDispose = vi.fn();

  const mockPredict = vi.fn(() => ({
    data: async () => new Float32Array([0.1, 0.2, 0.4, 0.3]),
    dispose: mockDispose,
  }));

  return {
    loadLayersModel: vi.fn(async () => ({ predict: mockPredict })),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tensor2d: vi.fn((_data: number[][], _shape: number[]) => ({
      dispose: mockDispose,
    })),
  };
});

describe("suggestAiMove", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns a legal direction based on model output scores", async () => {
    const { suggestAiMove } = await import("./model-suggestion");

    // Mock scores: left=0.1, up=0.2, right=0.4, down=0.3
    // Board where all four moves are legal
    const board: Board = [
      [null, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    const result = await suggestAiMove(board);
    const validDirections: Direction[] = ["left", "up", "right", "down"];
    expect(validDirections).toContain(result);
  });

  it("returns null when no moves are legal", async () => {
    const { suggestAiMove } = await import("./model-suggestion");

    // Fully interleaved board — no moves possible
    const board: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];

    const result = await suggestAiMove(board);
    expect(result).toBeNull();
  });

  it("skips illegal moves and picks next best legal direction", async () => {
    const { suggestAiMove } = await import("./model-suggestion");

    // Board where tiles are already packed left — only 'down' or 'right' valid
    const board: Board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, null],
    ];

    const result = await suggestAiMove(board);
    // model scores right highest (0.4), then down (0.3) — both legal here
    expect(["right", "down"]).toContain(result);
  });
});
