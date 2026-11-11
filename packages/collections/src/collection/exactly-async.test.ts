import { describe, expect, it } from "vitest";

import { exactlyAsync } from "./exactly-async";

describe("@pievy/collections: collection/exactlyAsync", () => {
  it("should await iterable predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await exactlyAsync([1, 2, 3], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value % 2 === 0;
    }, 1);

    expect(result).toBe(true);
    expect(visited).toEqual([1, 2, 3]);
  });

  it("should stop after detecting one extra async iterable match", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 2;
        yield 4;
        yield 6;
        yield 8;
      },
    };
    const visited: number[] = [];

    const result = await exactlyAsync(
      values,
      async (value) => {
        visited.push(value);
        return true;
      },
      2,
    );

    expect(result).toBe(false);
    expect(visited).toEqual([2, 4, 6]);
  });

  it("should return false when fewer than the requested number pass", async () => {
    expect(await exactlyAsync([1, 2, 3], async (value) => value > 2, 2)).toBe(false);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string]> = [];

    const result = await exactlyAsync(
      { first: 1, second: 2, third: 3 },
      async (value, key) => {
        visited.push([value, key]);
        return value > 1;
      },
      2,
    );

    expect(result).toBe(true);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
      [3, "third"],
    ]);
  });

  it("should use strict true-only comparison by default", async () => {
    expect(await exactlyAsync([1], async () => 1, 0)).toBe(true);
    expect(await exactlyAsync([1], async () => 1, 1)).toBe(false);
    expect(await exactlyAsync([1], async () => 1, 1, false)).toBe(true);
    expect(await exactlyAsync([1], async () => true, 1, true)).toBe(true);
  });

  it("should handle a zero match count", async () => {
    expect(await exactlyAsync([], async () => true, 0)).toBe(true);
    expect(await exactlyAsync([1, 2], async () => false, 0)).toBe(true);
    expect(await exactlyAsync([1], async () => true, 0)).toBe(false);
  });

  it("should return false for invalid inputs or match counts", async () => {
    expect(await exactlyAsync(12 as any, async () => true, 1)).toBe(false);
    expect(await exactlyAsync([1], null as any, 1)).toBe(false);
    expect(await exactlyAsync([1], async () => true, -1)).toBe(false);
    expect(await exactlyAsync([1], async () => true, 1.5)).toBe(false);
  });
});
