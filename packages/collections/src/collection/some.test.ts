import { describe, expect, it } from "vitest";

import { some } from "./some";

describe("@pievy/collections: collection/some", () => {
  it("should return true when at least one iterable value passes", () => {
    expect(some([1, 2, 3], (value) => value % 2 === 0)).toBe(true);
  });

  it("should stop at the first matching iterable value", () => {
    const visited: number[] = [];

    const result = some([1, 2, 3], (value) => {
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([1, 2]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string]> = [];

    const result = some({ first: 1, second: 2 }, (value, key) => {
      visited.push([value, key]);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
    ]);
  });

  it("should return false for empty collections", () => {
    expect(some([], () => true)).toBe(false);
    expect(some({}, () => true)).toBe(false);
  });

  it("should treat any truthy predicate result as passing", () => {
    expect(some([0, 1, 0], (value) => value)).toBe(true);
  });

  it("should use truthiness by default and only accept true in strict mode", () => {
    expect(some([0, 1, 0], (value) => value)).toBe(true);
    expect(some([0, 1, 0], (value) => value === 1, true)).toBe(true);
    expect(some([0, 1, 0], (value) => value, true)).toBe(false);
    expect(some([0, 0], () => 1, true)).toBe(false);
  });
});
