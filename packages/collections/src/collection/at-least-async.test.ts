import { describe, expect, it, vi } from "vitest";

import { atLeastAsync } from "./at-least-async";

describe("@pievy/collections: collection/atLeastAsync", () => {
  it("should await iterable predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await atLeastAsync([1, 2, 3], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value % 2 === 0;
    }, 1);

    expect(result).toBe(true);
    expect(visited).toEqual([1, 2]);
  });

  it("should stop after the required number of async iterable matches", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 2;
        yield 4;
        yield 6;
      },
    };
    const visited: number[] = [];

    const result = await atLeastAsync(
      values,
      async (value) => {
        visited.push(value);
        return true;
      },
      2,
    );

    expect(result).toBe(true);
    expect(visited).toEqual([2, 4]);
  });

  it("should return false when fewer than the required values pass", async () => {
    expect(await atLeastAsync([1, 2, 3], async (value) => value > 2, 2)).toBe(false);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string]> = [];

    const result = await atLeastAsync({ first: 1, second: 2 }, async (value, key) => {
      visited.push([value, key]);
      return value > 1;
    }, 1);

    expect(result).toBe(true);
    expect(visited).toEqual([
      [1, "first"],
      [2, "second"],
    ]);
  });

  it("should use strict true-only comparison by default", async () => {
    expect(await atLeastAsync([1], async () => 1, 1)).toBe(false);
    expect(await atLeastAsync([1], async () => 1, 1, false)).toBe(true);
    expect(await atLeastAsync([1], async () => true, 1, true)).toBe(true);
  });

  it("should return true for a zero threshold without calling the predicate", async () => {
    const predicate = vi.fn<() => Promise<boolean>>(() => Promise.resolve(true));

    expect(await atLeastAsync([1, 2], predicate, 0)).toBe(true);
    expect(predicate).not.toHaveBeenCalled();
  });

  it("should return false for invalid inputs or thresholds", async () => {
    expect(await atLeastAsync(12 as any, async () => true, 1)).toBe(false);
    expect(await atLeastAsync([1], null as any, 1)).toBe(false);
    expect(await atLeastAsync([1], async () => true, -1)).toBe(false);
    expect(await atLeastAsync([1], async () => true, 1.5)).toBe(false);
  });
});
