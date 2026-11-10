import { describe, expect, it } from "vitest";

import { noneAsync } from "./none-async";

describe("@pievy/collections: collection/noneAsync", () => {
  it("should await iterable predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await noneAsync([1, 3, 5], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([1, 3, 5]);
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

    const result = await noneAsync(values, async (value) => {
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([1, 2]);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string]> = [];

    const result = await noneAsync({ first: 1, second: 2 }, async (value, key) => {
      visited.push([value, key]);
      return value % 2 === 0;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
    ]);
  });

  it("should return true for empty collections", async () => {
    expect(await noneAsync([], async () => true)).toBe(true);
    expect(await noneAsync({}, async () => true)).toBe(true);
  });

  it("should use strict true-only comparison by default", async () => {
    expect(await noneAsync([0], async () => true)).toBe(false);
    expect(await noneAsync([0], async () => 1)).toBe(true);
    expect(await noneAsync([0], async () => 1, false)).toBe(false);
    expect(await noneAsync([0], async () => 1, true)).toBe(true);
  });

  it("should return false for invalid input values and predicatefn", async () => {
    expect(await noneAsync(12 as any, async () => true)).toBe(false);
    expect(await noneAsync([1, 2, 3], null as any)).toBe(false);
  });
});
