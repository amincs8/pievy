import { describe, expect, it, vi } from "vitest";

import { atMostAsync } from "./at-most-async";

describe("@pievy/collections: collection/atMostAsync", () => {
  it("should await iterable predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await atMostAsync([1, 2, 3], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value % 2 === 0;
    }, 1);

    expect(result).toBe(true);
    expect(visited).toEqual([1, 2, 3]);
  });

  it("should stop after the maximum number of async iterable matches is exceeded", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 2;
        yield 4;
        yield 6;
        yield 8;
      },
    };
    const visited: number[] = [];

    const result = await atMostAsync(
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

  it("should return true when no more than the maximum number of values pass", async () => {
    expect(await atMostAsync([1, 2, 3, 4], async (value) => value % 2 === 0, 2)).toBe(true);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string]> = [];

    const result = await atMostAsync(
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
    expect(await atMostAsync([1], async () => 1, 0)).toBe(true);
    expect(await atMostAsync([1], async () => 1, 0, false)).toBe(false);
    expect(await atMostAsync([1], async () => true, 0, true)).toBe(false);
  });

  it("should return true for empty collections when the maximum is zero", async () => {
    const predicate = vi.fn<() => Promise<boolean>>(() => Promise.resolve(true));

    expect(await atMostAsync([], predicate, 0)).toBe(true);
    expect(await atMostAsync({}, predicate, 0)).toBe(true);
    expect(predicate).not.toHaveBeenCalled();
  });

  it("should return false for invalid inputs or thresholds", async () => {
    expect(await atMostAsync(12 as any, async () => true, 1)).toBe(false);
    expect(await atMostAsync([1], null as any, 1)).toBe(false);
    expect(await atMostAsync([1], async () => true, -1)).toBe(false);
    expect(await atMostAsync([1], async () => true, 1.5)).toBe(false);
  });
});
