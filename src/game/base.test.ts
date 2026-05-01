import { describe, expect, it } from "vitest";

import { boardsEqual, mergeLineLeft } from "./base";

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
