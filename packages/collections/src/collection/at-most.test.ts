import { describe, expect, it, vi } from "vitest";

import { atMost } from "./at-most";

describe("@pievy/collections: collection/atMost", () => {
  it("should return true when no more than the maximum number of values pass", () => {
    expect(atMost([1, 2, 3, 4], (value) => value % 2 === 0, 2)).toBe(true);
  });

  it("should return false when more than the maximum number of values pass", () => {
    expect(atMost([1, 2, 3, 4], (value) => value % 2 === 0, 1)).toBe(false);
  });

  it("should stop after the maximum number of matches is exceeded", () => {
    const visited: number[] = [];

    const result = atMost(
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

    const result = atMost(
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
    expect(atMost([1], () => 1, 0)).toBe(true);
    expect(atMost([1], () => 1, 0, false)).toBe(false);
    expect(atMost([1], () => true, 0, true)).toBe(false);
  });

  it("should return true for empty collections when the maximum is zero", () => {
    const predicate = vi.fn<() => boolean>(() => true);

    expect(atMost([], predicate, 0)).toBe(true);
    expect(atMost({}, predicate, 0)).toBe(true);
    expect(predicate).not.toHaveBeenCalled();
  });

  it("should return false for invalid inputs or thresholds", () => {
    expect(atMost(12 as any, () => true, 1)).toBe(false);
    expect(atMost([1], null as any, 1)).toBe(false);
    expect(atMost([1], () => true, -1)).toBe(false);
    expect(atMost([1], () => true, 1.5)).toBe(false);
  });
});
