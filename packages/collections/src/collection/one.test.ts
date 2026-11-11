import { describe, expect, it } from "vitest";

import { one } from "./one";

describe("@pievy/collections: collection/one", () => {
  it("should return true when exactly one iterable value passes", () => {
    expect(one([1, 2, 3], (value) => value === 2)).toBe(true);
  });

  it("should return false when no values pass", () => {
    expect(one([1, 2, 3], (value) => value > 3)).toBe(false);
  });

  it("should return false when more than one value passes", () => {
    expect(one([1, 2, 3], (value) => value > 1)).toBe(false);
  });

  it("should stop after finding a second matching value", () => {
    const visited: number[] = [];

    const result = one([1, 2, 3, 4], (value) => {
      visited.push(value);
      return value > 1;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([1, 2, 3]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string]> = [];

    const result = one({ first: 1, second: 2, third: 3 }, (value, key) => {
      visited.push([value, key]);
      return value === 2;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
      [3, "third"],
    ]);
  });

  it("should use strict true-only comparison by default", () => {
    expect(one([1], () => 1)).toBe(false);
    expect(one([1], () => 1, false)).toBe(true);
    expect(one([1], () => true, true)).toBe(true);
  });

  it("should return false for empty collections", () => {
    expect(one([], () => true)).toBe(false);
    expect(one({}, () => true)).toBe(false);
  });

  it("should return false for invalid inputs or predicates", () => {
    expect(one(12 as any, () => true)).toBe(false);
    expect(one([1], null as any)).toBe(false);
  });
});
