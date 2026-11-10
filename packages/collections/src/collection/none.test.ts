import { describe, expect, it } from "vitest";

import { none } from "./none";

describe("@pievy/collections: collection/none", () => {
  it("should return true when no iterable value passes", () => {
    expect(none([1, 3, 5], (value) => value % 2 === 0)).toBe(true);
  });

  it("should stop at the first matching iterable value", () => {
    const visited: number[] = [];

    const result = none([1, 2, 3], (value) => {
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([1, 2]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string]> = [];

    const result = none({ first: 1, second: 2 }, (value, key) => {
      visited.push([value, key]);
      return value % 2 === 0;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
    ]);
  });

  it("should return true for empty collections", () => {
    expect(none([], () => true)).toBe(true);
    expect(none({}, () => true)).toBe(true);
  });

  it("should treat any truthy predicate result as passing", () => {
    expect(none([0, 1, 0], (value) => value)).toBe(false);
  });

  it("should use truthiness by default and only accept true in strict mode", () => {
    expect(none([0, 1, 0], (value) => value)).toBe(false);
    expect(none([0, 1, 0], (value) => value === 1, true)).toBe(false);
    expect(none([0, 1, 0], (value) => value, true)).toBe(true);
    expect(none([0, 0], () => 1, true)).toBe(true);
  });

  it("should return true for invalid input values and predicatefn", () => {
    expect(none(12 as any, () => true)).toBe(false);
    expect(none([1, 2, 3], null as any)).toBe(false);
  });
});
