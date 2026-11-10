import { describe, expect, it } from "vitest";

import { every } from "./every";

describe("@pievy/collections: collection/every", () => {
  it("should return true when every iterable value passes", () => {
    expect(every([2, 4, 6], (value) => value % 2 === 0)).toBe(true);
  });

  it("should stop at the first failing iterable value", () => {
    const visited: number[] = [];

    const result = every([2, 3, 4], (value) => {
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([2, 3]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string]> = [];

    const result = every({ first: 2, second: 4 }, (value, key) => {
      visited.push([value, key]);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([
      [2, "first"],
      [4, "second"],
    ]);
  });

  it("should return true for empty collections", () => {
    expect(every([], () => false)).toBe(true);
    expect(every({}, () => false)).toBe(true);
  });

  it("should treat any truthy predicate result as passing", () => {
    expect(every([1, 2, 3], (value) => value)).toBe(true);
  });

  it("should use strict false-only comparison by default", () => {
    expect(every([0], () => 0)).toBe(true);
    expect(every([0], () => false)).toBe(false);
    expect(every([0], () => 0, false)).toBe(false);
  });

  it("shoult return false for input values and predicatefn", () => {
    expect(every(12 as any, () => true)).toBe(false);
    expect(every([1, 2, 3], null as any)).toBe(false);
  });
});
