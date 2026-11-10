import { describe, expect, it } from "vitest";

import { someAsync } from "./some-async";

describe("@pievy/collections: collection/someAsync", () => {
  it("should await iterable predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await someAsync([1, 2, 3], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([1, 2]);
  });

  it("should stop at the first matching async iterable value", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
      },
    };
    const visited: number[] = [];

    const result = await someAsync(values, async (value) => {
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([1, 2]);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string]> = [];

    const result = await someAsync({ first: 1, second: 2 }, async (value, key) => {
      visited.push([value, key]);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
    ]);
  });

  it("should return false for empty collections", async () => {
    expect(await someAsync([], async () => true)).toBe(false);
    expect(await someAsync({}, async () => true)).toBe(false);
  });

  it("should use strict true-only comparison by default", async () => {
    expect(await someAsync([0], async () => true)).toBe(true);
    expect(await someAsync([0], async () => 1)).toBe(false);
    expect(await someAsync([0], async () => 1, false)).toBe(true);
    expect(await someAsync([0], async () => 1, true)).toBe(false);
  });
});
