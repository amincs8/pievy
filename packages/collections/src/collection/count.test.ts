import { describe, expect, it } from "vitest";

import { count } from "./count";

describe("@pievy/collections: collection/count", () => {
  it("should count iterable values that pass", () => {
    expect(count([1, 2, 3, 4], (value) => value % 2 === 0)).toBe(2);
  });

  it("should visit every iterable value and provide its index", () => {
    const visited: Array<[number, number, number]> = [];

    const result = count([2, 4, 6], (value, index, loopCount) => {
      visited.push([value, index, loopCount]);
      return value > 2;
    });

    expect(result).toBe(2);
    expect(visited).toEqual([
      [2, 0, 0],
      [4, 1, 1],
      [6, 2, 2],
    ]);
  });

  it("should count plain object values and provide their keys", () => {
    const visited: Array<[number, string, number]> = [];

    const result = count({ first: 1, second: 2, third: 3 }, (value, key, loopCount) => {
      visited.push([value, key, loopCount]);
      return value > 1;
    });

    expect(result).toBe(2);
    expect(visited).toEqual([
      [1, "first", 0],
      [2, "second", 1],
      [3, "third", 2],
    ]);
  });

  it("should use strict true-only comparison by default", () => {
    expect(count([1, 2, 3], (value) => value)).toBe(0);
    expect(count([1, 2, 3], (value) => value === 2)).toBe(1);
  });

  it("should compare predicate results to true using loose equality when non-strict", () => {
    expect(count([1, 2, 3], (value) => value, false)).toBe(1);
    expect(count([0, 1, 2], (value) => value, true)).toBe(0);
  });

  it("should return zero for empty collections", () => {
    expect(count([], () => true)).toBe(0);
    expect(count({}, () => true)).toBe(0);
  });

  it("should return zero for invalid inputs or predicates", () => {
    expect(count(12 as any, () => true)).toBe(0);
    expect(count([1], null as any)).toBe(0);
  });
});
