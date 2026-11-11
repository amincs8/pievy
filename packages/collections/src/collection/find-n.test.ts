import { describe, expect, it } from "vitest";

import { findN } from "./find-n";

describe("@pievy/collections: collection/findN", () => {
  it("should return the first N matching values", () => {
    const visited: number[] = [];

    const result = findN([1, 2, 3, 4, 5, 6], (value) => {
      visited.push(value);
      return value % 2 === 0;
    }, 2);

    expect(result).toEqual([2, 4]);
    expect(visited).toEqual([1, 2, 3, 4]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string, number]> = [];

    const result = findN(
      { first: 1, second: 2, third: 3 },
      (value, key, loopCount) => {
        visited.push([value, key, loopCount]);
        return value > 1;
      },
      1,
    );

    expect(result).toEqual([2]);
    expect(visited).toEqual([
      [1, "first", 0],
      [2, "second", 1],
    ]);
  });

  it("should use strict true-only comparison by default", () => {
    expect(findN([1, 2], (value) => value, 1)).toEqual([]);
    expect(findN([1, 2], (value) => value, 1, false)).toEqual([1]);
  });

  it("should return an empty array for invalid inputs or match limits", () => {
    expect(findN(12 as any, () => true, 1)).toEqual([]);
    expect(findN([1], null as any, 1)).toEqual([]);
    expect(findN([1], () => true, 0)).toEqual([]);
    expect(findN([1], () => true, 1.5)).toEqual([]);
  });

  it("should return fewer than the limit when fewer values match", () => {
    expect(findN([1, 2, 3], (value) => value === 2, 3)).toEqual([2]);
  });
});
