import { describe, expect, it, vi } from "vitest";

import { atLeast } from "./at-least";

describe("@pievy/collections: collection/atLeast", () => {
  it("should return true when enough iterable values pass", () => {
    expect(atLeast([1, 2, 3, 4], (value) => value % 2 === 0, 2)).toBe(true);
  });

  it("should return false when fewer than the required values pass", () => {
    expect(atLeast([1, 2, 3, 4], (value) => value % 2 === 0, 3)).toBe(false);
  });

  it("should stop after the required number of matches", () => {
    const visited: number[] = [];

    const result = atLeast(
      [2, 4, 6, 8],
      (value) => {
        visited.push(value);
        return true;
      },
      2,
    );

    expect(result).toBe(true);
    expect(visited).toEqual([2, 4]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string]> = [];

    const result = atLeast(
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
    expect(atLeast([1], () => [], 1)).toBe(false);
    expect(atLeast([1], () => 1, 1)).toBe(false);
    expect(atLeast([1], () => 1, 1, false)).toBe(true);
    expect(atLeast([1], () => true, 1, true)).toBe(true);
  });

  it("should return true for a zero threshold without calling the predicate", () => {
    const predicate = vi.fn<() => boolean>(() => true);

    expect(atLeast([1, 2], predicate, 0)).toBe(true);
    expect(predicate).not.toHaveBeenCalled();
  });

  it("should return false for invalid inputs or thresholds", () => {
    expect(atLeast(12 as any, () => true, 1)).toBe(false);
    expect(atLeast([1], null as any, 1)).toBe(false);
    expect(atLeast([1], () => true, -1)).toBe(false);
    expect(atLeast([1], () => true, 1.5)).toBe(false);
  });
});
