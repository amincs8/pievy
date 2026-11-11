import { describe, expect, it } from "vitest";

import { countAsync } from "./count-async";

describe("@pievy/collections: collection/countAsync", () => {
  it("should count iterable values that pass and await predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await countAsync([1, 2, 3, 4], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(2);
    expect(visited).toEqual([1, 2, 3, 4]);
  });

  it("should count async iterable values that pass", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
      },
    };

    expect(await countAsync(values, async (value) => value % 2 === 0)).toBe(2);
  });

  it("should provide iterable indices and loop counts", async () => {
    const visited: Array<[number, number, number]> = [];

    const result = await countAsync([2, 4, 6], async (value, index, loopCount) => {
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

  it("should count plain object values and provide their keys", async () => {
    const visited: Array<[number, string, number]> = [];

    const result = await countAsync({ first: 1, second: 2, third: 3 }, async (value, key, loopCount) => {
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

  it("should use strict true-only comparison by default", async () => {
    expect(await countAsync([1, 2, 3], async (value) => value)).toBe(0);
    expect(await countAsync([1, 2, 3], async (value) => value === 2)).toBe(1);
  });

  it("should compare predicate results to true using loose equality when non-strict", async () => {
    expect(await countAsync([1, 2, 3], async (value) => value, false)).toBe(1);
    expect(await countAsync([0, 1, 2], async (value) => value, true)).toBe(0);
  });

  it("should return zero for empty collections", async () => {
    expect(await countAsync([], async () => true)).toBe(0);
    expect(await countAsync({}, async () => true)).toBe(0);
  });

  it("should return zero for invalid inputs or predicates", async () => {
    expect(await countAsync(12 as any, async () => true)).toBe(0);
    expect(await countAsync([1], null as any)).toBe(0);
  });
});
