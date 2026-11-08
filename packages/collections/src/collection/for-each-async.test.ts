import { describe, expect, it } from "vitest";

import { STOP } from "../consts";
import { forEachAsync } from "./for-each-async";

describe("@pievy/collections: collection/forEachAsync", () => {
  it("should await iterable callbacks sequentially", async () => {
    const calls: Array<[number, number, number]> = [];

    await forEachAsync([10, 20], async (value, index, loopCount) => {
      await Promise.resolve();
      calls.push([value, index, loopCount]);
    });

    expect(calls).toEqual([
      [10, 0, 0],
      [20, 1, 1],
    ]);
  });

  it("should await async iterable values", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield "first";
        yield "second";
      },
    };
    const visited: string[] = [];

    await forEachAsync(values, async (value) => {
      visited.push(value);
    });

    expect(visited).toEqual(["first", "second"]);
  });

  it("should await plain object callbacks", async () => {
    const calls: Array<[number, string, number]> = [];

    await forEachAsync({ first: 10, second: 20 }, async (value, key, loopCount) => {
      calls.push([value, key, loopCount]);
    });

    expect(calls).toEqual([
      [10, "first", 0],
      [20, "second", 1],
    ]);
  });

  it("should stop when an async callback returns STOP", async () => {
    const visited: number[] = [];

    await forEachAsync([1, 2, 3], async (value) => {
      visited.push(value);
      if (value === 2) return STOP;
    });

    expect(visited).toEqual([1, 2]);
  });
});
