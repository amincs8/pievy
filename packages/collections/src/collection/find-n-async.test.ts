import { describe, expect, it } from "vitest";

import { findNAsync } from "./find-n-async";

describe("@pievy/collections: collection/findNAsync", () => {
  it("should return up to the maximum number of matching iterable values", async () => {
    const visited: number[] = [];

    const result = await findNAsync([1, 2, 3, 4, 5], async (value) => {
      visited.push(value);
      return value % 2 === 0;
    }, 1);

    expect(result).toEqual([2]);
    expect(visited).toEqual([1, 2]);
  });

  it("should stop an async iterable after enough values match", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
      },
    };
    const visited: number[] = [];

    const result = await findNAsync(values, async (value) => {
      visited.push(value);
      return value > 1;
    }, 2);

    expect(result).toEqual([2, 3]);
    expect(visited).toEqual([1, 2, 3]);
  });

  it("should return the first N matching values", async () => {
    const result = await findNAsync([1, 2, 3, 4, 5, 6], async (value) => value % 2 === 0, 2);

    expect(result).toEqual([2, 4]);
  });

  it("should test plain object values and provide their keys", async () => {
    const visited: Array<[number, string, number]> = [];

    const result = await findNAsync(
      { first: 1, second: 2, third: 3 },
      async (value, key, loopCount) => {
        visited.push([value, key, loopCount]);
        return value > 1;
      },
      1,
    );

    expect(result).toEqual([2]);
    expect(visited).toEqual([
      [1, "first", 0],
      [2, "second", 1],
    ]);
  });

  it("should use strict true-only comparison by default", async () => {
    await expect(findNAsync([1, 2], async (value) => value, 1)).resolves.toEqual([]);
    await expect(findNAsync([1, 2], async (value) => value, 1, false)).resolves.toEqual([1]);
  });

  it("should return an empty array for invalid inputs or match limits", async () => {
    await expect(findNAsync(12 as any, async () => true, 1)).resolves.toEqual([]);
    await expect(findNAsync([1], null as any, 1)).resolves.toEqual([]);
    await expect(findNAsync([1], async () => true, 0)).resolves.toEqual([]);
    await expect(findNAsync([1], async () => true, 1.5)).resolves.toEqual([]);
  });
});
