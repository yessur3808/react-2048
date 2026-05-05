// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Ensure the DOM is reset between every test regardless of which describe block
afterEach(() => {
  cleanup();
});
import App, { createDebugLoseBoard, createDebugWinBoard } from "./App";
import type { Board, Direction } from "./game/types";

// ─── Shared test fixtures ────────────────────────────────────────────────────

/** A sparse board where every direction produces a valid (changed) move. */
const MOVABLE_BOARD: Board = [
  [null, null, null, null],
  [null, 2, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

/**
 * A board packed left and right (all rows/cols full with no adjacent equals).
 * moveLeft / moveRight / moveUp are all illegal; only moveDown shifts tiles.
 * Used to test "no random tile when move does not change the board".
 */
const PACKED_NO_LEFT_BOARD: Board = [
  [2, 4, 8, 16],
  [32, 64, 128, 256],
  [512, 1024, 2, 4],
  [8, 16, 32, 64],
];

/** Contains a 2048 tile — getGameStatus returns "won". */
const WON_BOARD: Board = createDebugWinBoard();

/**
 * Fully interleaved, no adjacent equals, no nulls — getGameStatus returns
 * "lost" (hasLost = !hasWon && !canMove).
 */
const LOST_BOARD: Board = createDebugLoseBoard();

// ─── Module mocks ────────────────────────────────────────────────────────────

// Mock only createInitialBoard and addRandomTile; let all other game exports
// (moveBoard, getGameStatus, etc.) run through the real implementation.
vi.mock("./game", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./game")>();
  return {
    ...actual,
    createInitialBoard: vi.fn(() => MOVABLE_BOARD),
    addRandomTile: vi.fn((board: Board) => board),
  };
});

// Prevent real TF.js model loading during integration tests.
vi.mock("./game/model-suggestion", () => ({
  suggestAiMove: vi.fn(),
}));

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Flush the microtask queue without relying on setTimeout (safe under fake timers). */
const flushMicrotasks = async () => {
  for (let i = 0; i < 5; i += 1) {
    await Promise.resolve();
  }
};

const getGameModule = async () => import("./game");

const setInitialBoard = async (board: Board) => {
  const game = await getGameModule();
  vi.mocked(game.createInitialBoard).mockReturnValue(board);
  return game;
};

const expectControlsDisabled = () => {
  expect(screen.getByRole("button", { name: /move up/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /move down/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /move left/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /move right/i })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: /get suggestion/i }),
  ).toBeDisabled();
};

// ─── Random tile tests ───────────────────────────────────────────────────────

describe("random tile — only added after a valid (changed) move", () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    const game = await setInitialBoard(MOVABLE_BOARD);
    vi.mocked(game.addRandomTile).mockImplementation((board: Board) => board);
    vi.mocked(game.addRandomTile).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does NOT call addRandomTile when the move does not change the board (changed = false)", async () => {
    const game = await setInitialBoard(PACKED_NO_LEFT_BOARD);

    render(<App />);

    // moveLeft on a fully-packed-left board: changed = false
    fireEvent.click(screen.getByRole("button", { name: /move left/i }));

    // Advance past the animation window — no timer should fire, but flush anyway
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(vi.mocked(game.addRandomTile)).not.toHaveBeenCalled();
  });

  it("calls addRandomTile exactly once after the animation delay when the move changes the board (changed = true)", async () => {
    const game = await setInitialBoard(MOVABLE_BOARD);

    render(<App />);

    // moveUp moves the single '2' from row 1 to row 0 — changed = true
    fireEvent.click(screen.getByRole("button", { name: /move up/i }));

    // Before 130 ms — tile should not yet be placed
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(vi.mocked(game.addRandomTile)).not.toHaveBeenCalled();

    // After 130 ms — animation timeout fires and addRandomTile is called
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(vi.mocked(game.addRandomTile)).toHaveBeenCalledTimes(1);
  });
});

// ─── Win / loss — UI controls disable ───────────────────────────────────────

describe("game controls are disabled when status is not 'playing'", () => {
  beforeEach(async () => {
    // Reset to a neutral board first so each test can override cleanly.
    await setInitialBoard(MOVABLE_BOARD);
  });

  it("all move buttons and Get Suggestion are disabled on a won board", async () => {
    await setInitialBoard(WON_BOARD);

    render(<App />);

    expectControlsDisabled();
  });

  it("renders a won overlay message on a won board", async () => {
    await setInitialBoard(WON_BOARD);

    render(<App />);

    expect(screen.getByText(/great job/i)).toBeInTheDocument();
  });

  it("all move buttons and Get Suggestion are disabled on a lost board", async () => {
    await setInitialBoard(LOST_BOARD);

    render(<App />);

    expectControlsDisabled();
  });

  it("renders a lost overlay message on a lost board", async () => {
    await setInitialBoard(LOST_BOARD);

    render(<App />);

    expect(screen.getByText(/no moves left/i)).toBeInTheDocument();
  });
});

// ─── AI model loading failure — UI fallback ───────────────────────────────────

describe("AI suggestion — model load failure shows error in UI", () => {
  beforeEach(async () => {
    await setInitialBoard(MOVABLE_BOARD);
  });

  it("displays the error message in the controls hint when suggestAiMove rejects", async () => {
    const { suggestAiMove } = await import("./game/model-suggestion");
    vi.mocked(suggestAiMove).mockRejectedValue(
      new Error("Failed to load AI model"),
    );

    render(<App />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /get suggestion/i }));
      await flushMicrotasks();
    });

    expect(screen.getByText(/unable to suggest a move/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to load ai model/i)).toBeInTheDocument();
  });
});

// ─── Race condition — stale AI response after user moves ─────────────────────

describe("race condition — stale AI suggestion is discarded after user moves", () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    const game = await setInitialBoard(MOVABLE_BOARD);
    vi.mocked(game.addRandomTile).mockImplementation((board: Board) => board);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not display the stale AI direction after user makes a move before response arrives", async () => {
    const { suggestAiMove } = await import("./game/model-suggestion");

    // Create a deferred promise so the AI result arrives after the user moves.
    let resolveAi!: (direction: Direction | null) => void;
    const aiPromise = new Promise<Direction | null>((resolve) => {
      resolveAi = resolve;
    });
    vi.mocked(suggestAiMove).mockReturnValue(aiPromise);

    render(<App />);

    // Step 1: User requests an AI suggestion — promise in-flight.
    fireEvent.click(screen.getByRole("button", { name: /get suggestion/i }));

    // The "Get Suggestion" button text changes to "Analyzing…" while in-flight.
    expect(
      screen.getByRole("button", { name: /analyzing/i }),
    ).toBeInTheDocument();

    // Step 2: User makes a valid move before AI responds.
    // moveUp shifts the '2' in row 1 to row 0 → changed = true → resetSuggestionUi fires.
    fireEvent.click(screen.getByRole("button", { name: /move up/i }));

    // Suggestion state is cleared synchronously by resetSuggestionUi — button
    // reverts to "Get Suggestion" and the hint shows the default text.
    expect(
      screen.queryByRole("button", { name: /analyzing/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/press "get suggestion"/i)).toBeInTheDocument();

    // Step 3: AI promise resolves (stale) — setSuggestedDirection("right") is called.
    await act(async () => {
      resolveAi("right");
      await flushMicrotasks();
    });

    // Step 4: Because hasRequestedSuggestion was reset by the move, the stale
    // suggestion direction must NOT be shown in the UI.
    expect(screen.queryByText(/best move: right/i)).not.toBeInTheDocument();
    expect(screen.getByText(/press "get suggestion"/i)).toBeInTheDocument();

    // Clean up animation timers.
    act(() => {
      vi.runAllTimers();
    });
  });
});
