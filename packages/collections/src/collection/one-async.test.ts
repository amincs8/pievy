import { describe, expect, it } from "vitest";

import { oneAsync } from "./one-async";

describe("@pievy/collections: collection/oneAsync", () => {
  it("should await iterable predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await oneAsync([1, 2, 3], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value === 2;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([1, 2, 3]);
  });

  it("should stop after finding a second matching async iterable value", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
      },
    };
    const visited: number[] = [];

    const result = await oneAsync(values, async (value) => {
      visited.push(value);
      return value > 1;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([1, 2, 3]);
  });

  it("should return false when no values pass", async () => {
    expect(await oneAsync([1, 2, 3], async (value) => value > 3)).toBe(false);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string]> = [];

    const result = await oneAsync({ first: 1, second: 2, third: 3 }, async (value, key) => {
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

  it("should use strict true-only comparison by default", async () => {
    expect(await oneAsync([1], async () => 1)).toBe(false);
    expect(await oneAsync([1], async () => 1, false)).toBe(true);
    expect(await oneAsync([1], async () => true, true)).toBe(true);
  });

  it("should return false for empty collections", async () => {
    expect(await oneAsync([], async () => true)).toBe(false);
    expect(await oneAsync({}, async () => true)).toBe(false);
  });

  it("should return false for invalid inputs or predicates", async () => {
    expect(await oneAsync(12 as any, async () => true)).toBe(false);
    expect(await oneAsync([1], null as any)).toBe(false);
  });
});
