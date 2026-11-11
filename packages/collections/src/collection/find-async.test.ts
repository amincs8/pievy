import { describe, expect, it } from "vitest";

import { findAsync } from "./find-async";

describe("@pievy/collections: collection/findAsync", () => {
  it("should return all async iterable values whose predicate passes", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
      },
    };

    await expect(findAsync(values, async (value) => value % 2 === 0)).resolves.toEqual([2, 4]);
  });

  it("should await predicates sequentially and provide indices and loop counts", async () => {
    const visited: Array<[number, number, number]> = [];

    const result = await findAsync([10, 20, 30], async (value, index, loopCount) => {
      await Promise.resolve();
      visited.push([value, index, loopCount]);
      return index !== 1;
    });

    expect(result).toEqual([10, 30]);
    expect(visited).toEqual([
      [10, 0, 0],
      [20, 1, 1],
      [30, 2, 2],
    ]);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string, number]> = [];

    const result = await findAsync(
      { first: 1, second: 2, third: 3 },
      async (value, key, loopCount) => {
        visited.push([value, key, loopCount]);
        return value > 1;
      },
    );

    expect(result).toEqual([2, 3]);
    expect(visited).toEqual([
      [1, "first", 0],
      [2, "second", 1],
      [3, "third", 2],
    ]);
  });

  it("should use strict true-only comparison by default", async () => {
    await expect(findAsync([1, 2], async (value) => value)).resolves.toEqual([]);
    await expect(findAsync([1, 2], async (value) => value, false)).resolves.toEqual([1]);
    await expect(findAsync([1, 2], async (value) => value === 2, true)).resolves.toEqual([2]);
  });

  it("should return an empty array for empty collections or invalid inputs", async () => {
    await expect(findAsync([], async () => true)).resolves.toEqual([]);
    await expect(findAsync({}, async () => true)).resolves.toEqual([]);
    await expect(findAsync(12 as any, async () => true)).resolves.toEqual([]);
    await expect(findAsync([1, 2], null as any)).resolves.toEqual([]);
  });
});
