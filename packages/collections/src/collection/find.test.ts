import { describe, expect, it } from "vitest";

import { find } from "./find";

describe("@pievy/collections: collection/find", () => {
  it("should return all iterable values whose predicate passes", () => {
    expect(find([1, 2, 3, 4], (value) => value % 2 === 0)).toEqual([2, 4]);
  });

  it("should provide iterable indices and loop counts", () => {
    const visited: Array<[number, number, number]> = [];

    const result = find([10, 20, 30], (value, index, loopCount) => {
      visited.push([value, index, loopCount]);
      return index === 1;
    });

    expect(result).toEqual([20]);
    expect(visited).toEqual([
      [10, 0, 0],
      [20, 1, 1],
      [30, 2, 2],
    ]);
  });

  it("should test plain object values and provide their keys", () => {
    const visited: Array<[number, string, number]> = [];

    const result = find({ first: 1, second: 2, third: 3 }, (value, key, loopCount) => {
      visited.push([value, key, loopCount]);
      return value > 1;
    });

    expect(result).toEqual([2, 3]);
    expect(visited).toEqual([
      [1, "first", 0],
      [2, "second", 1],
      [3, "third", 2],
    ]);
  });

  it("should use strict true-only comparison by default", () => {
    expect(find([1, 2], (value) => value)).toEqual([]);
    expect(find([1, 2], (value) => value, false)).toEqual([1]);
    expect(find([1, 2], (value) => value === 2, true)).toEqual([2]);
  });

  it("should evaluate the predicate only once per value in strict mode", () => {
    let calls = 0;

    expect(
      find([1], () => {
        calls++;
        return calls === 1 ? true : 1;
      }),
    ).toEqual([1]);
    expect(calls).toBe(1);
  });

  it("should return an empty array for empty collections or invalid inputs", () => {
    expect(find([], () => true)).toEqual([]);
    expect(find({}, () => true)).toEqual([]);
    expect(find(12 as any, () => true)).toEqual([]);
    expect(find([1, 2], null as any)).toEqual([]);
  });
});
