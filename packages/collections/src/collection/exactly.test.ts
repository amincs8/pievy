import { describe, expect, it } from "vitest";

import { exactly } from "./exactly";

describe("@pievy/collections: collection/exactly", () => {
  it("should return true when exactly the requested number of values pass", () => {
    expect(exactly([1, 2, 3, 4], (value) => value % 2 === 0, 2)).toBe(true);
  });

  it("should return false when fewer than the requested number of values pass", () => {
    expect(exactly([1, 2, 3, 4], (value) => value % 2 === 0, 3)).toBe(false);
  });

  it("should return false when more than the requested number pass", () => {
    expect(exactly([2, 4, 6], () => true, 2)).toBe(false);
  });

  it("should stop after detecting one extra match", () => {
    const visited: number[] = [];

    const result = exactly(
      [2, 4, 6, 8],
      (value) => {
        visited.push(value);
        return true;
      },
      2,
    );

    expect(result).toBe(false);
    expect(visited).toEqual([2, 4, 6]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string]> = [];

    const result = exactly(
      { first: 1, second: 2, third: 3 },
      (value, key) => {
        visited.push([value, key]);
        return value > 1;
      },
      2,
    );

    expect(result).toBe(true);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
      [3, "third"],
    ]);
  });

  it("should use strict true-only comparison by default", () => {
    expect(exactly([1], () => 1, 0)).toBe(true);
    expect(exactly([1], () => 1, 1)).toBe(false);
    expect(exactly([1], () => 1, 1, false)).toBe(true);
    expect(exactly([1], () => true, 1, true)).toBe(true);
  });

  it("should handle a zero match count", () => {
    expect(exactly([], () => true, 0)).toBe(true);
    expect(exactly([1, 2], () => false, 0)).toBe(true);
    expect(exactly([1], () => true, 0)).toBe(false);
  });

  it("should return false for invalid inputs or match counts", () => {
    expect(exactly(12 as any, () => true, 1)).toBe(false);
    expect(exactly([1], null as any, 1)).toBe(false);
    expect(exactly([1], () => true, -1)).toBe(false);
    expect(exactly([1], () => true, 1.5)).toBe(false);
  });
});
