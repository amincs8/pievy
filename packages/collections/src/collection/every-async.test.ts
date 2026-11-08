import { describe, expect, it } from "vitest";

import { everyAsync } from "./every-async";

describe("@pievy/collections: collection/everyAsync", () => {
  it("should await iterable predicates sequentially", async () => {
    const visited: number[] = [];

    const result = await everyAsync([2, 4, 6], async (value) => {
      await Promise.resolve();
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([2, 4, 6]);
  });

  it("should stop after the first failing async iterable value", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 2;
        yield 3;
        yield 4;
      },
    };
    const visited: number[] = [];

    const result = await everyAsync(values, async (value) => {
      visited.push(value);
      return value % 2 === 0;
    });

    expect(result).toBe(false);
    expect(visited).toEqual([2, 3]);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string]> = [];

    const result = await everyAsync({ first: 2, second: 4 }, async (value, key) => {
      visited.push([value, key]);
      return value % 2 === 0;
    });

    expect(result).toBe(true);
    expect(visited).toEqual([
      [2, "first"],
      [4, "second"],
    ]);
  });

  it("should return true for empty collections", async () => {
    expect(await everyAsync([], async () => false)).toBe(true);
    expect(await everyAsync({}, async () => false)).toBe(true);
  });

  it("should apply strict false-only comparison when requested", async () => {
    expect(await everyAsync([0], async () => 0, true)).toBe(true);
    expect(await everyAsync([0], async () => false, true)).toBe(false);
    expect(await everyAsync([0], async () => 0)).toBe(false);
  });
});
