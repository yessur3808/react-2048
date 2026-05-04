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

const mockTfWithScores = (scores: number[]) => {
  vi.doMock("@tensorflow/tfjs", () => {
    const mockDispose = vi.fn();
    return {
      loadLayersModel: vi.fn(async () => ({
        predict: vi.fn(() => ({
          data: async () => new Float32Array(scores),
          dispose: mockDispose,
        })),
      })),
      tensor2d: vi.fn(() => ({ dispose: mockDispose })),
    };
  });
};

const mockTfLoadFailure = (message: string, loadSpy?: ReturnType<typeof vi.fn>) => {
  const loadLayersModel =
    loadSpy ?? vi.fn().mockRejectedValue(new Error(message));

  vi.doMock("@tensorflow/tfjs", () => ({
    loadLayersModel,
    tensor2d: vi.fn(() => ({ dispose: vi.fn() })),
  }));

  return loadLayersModel;
};

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

// Each describe block below uses vi.doMock to vary TF scores or error per test.
// vi.resetModules() in beforeEach ensures model-suggestion re-imports a fresh module
// (resetting the cachedModel / loadError singletons).

describe("suggestAiMove - adversarial move filtering", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("skips top two illegal directions and returns the third-ranked legal one", async () => {
    // Scores: left=0.9, up=0.8, right=0.7, down=0.6
    // Board: rows 0-2 are fully packed with no adjacent equals → left illegal.
    // Row 3 has a trailing null → right and down are legal.
    // Cols 0-2 are fully packed top-to-bottom with no adjacent equals → up illegal.
    // Col 3: [16,256,4,null] → no adjacent equals, already top-packed → up illegal.
    // right: row 3 [8,16,32,null] → shifts right → [null,8,16,32] → changed ✓
    // Ranking: left(0.9) skip, up(0.8) skip, right(0.7) → return "right"
    mockTfWithScores([0.9, 0.8, 0.7, 0.6]);

    const { suggestAiMove } = await import("./model-suggestion");

    const board: Board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, null],
    ];

    const result = await suggestAiMove(board);
    expect(result).toBe("right");
  });

  it("returns the only legal direction even when model scores it last", async () => {
    // Scores: left=0.4, up=0.3, right=0.2, down=0.1
    // Board: rows 0-2 fully packed, row 3 is all null.
    // left: rows 0-2 packed left with no adjacent equals, row 3 already null → no change → illegal.
    // right: same → illegal.
    // up: cols already packed at top (rows 0-2 non-null, row 3 null) → no change → illegal.
    // down: col 0 [2,32,512,null] → moveDown → [null,2,32,512] → changed ✓ → legal.
    mockTfWithScores([0.4, 0.3, 0.2, 0.1]);

    const { suggestAiMove } = await import("./model-suggestion");

    const board: Board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [null, null, null, null],
    ];

    const result = await suggestAiMove(board);
    expect(result).toBe("down");
  });

  it("returns null when all four directions are illegal regardless of scores", async () => {
    // Uniform high scores — but board is a fully interleaved lock (no moves possible).
    mockTfWithScores([0.9, 0.8, 0.7, 0.6]);

    const { suggestAiMove } = await import("./model-suggestion");

    const board: Board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];

    const result = await suggestAiMove(board);
    expect(result).toBeNull();
  });
});

describe("suggestAiMove - model loading failure", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("throws when loadLayersModel rejects", async () => {
    mockTfLoadFailure("Network error");

    const { suggestAiMove } = await import("./model-suggestion");

    const board: Board = [
      [null, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    await expect(suggestAiMove(board)).rejects.toThrow("Network error");
  });

  it("re-throws from cached error on subsequent calls without calling loadLayersModel again", async () => {
    const mockLoadLayersModel = vi
      .fn()
      .mockRejectedValue(new Error("Network error"));

    mockTfLoadFailure("Network error", mockLoadLayersModel);

    const { suggestAiMove } = await import("./model-suggestion");

    const board: Board = [
      [null, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    // First call triggers the rejection and caches the error.
    await expect(suggestAiMove(board)).rejects.toThrow("Network error");
    // Second call reads the cached error — no second network attempt.
    await expect(suggestAiMove(board)).rejects.toThrow("Network error");

    expect(mockLoadLayersModel).toHaveBeenCalledTimes(1);
  });
});
