import { describe, expect, it } from "vitest";

import { reduceAsync } from "./reduce-async";

describe("@pievy/collections: collection/reduceAsync", () => {
  it("should await iterable reducers sequentially", async () => {
    const calls: string[] = [];

    const result = await reduceAsync(
      [1, 2, 3],
      async (sum, value, index, loopCount) => {
        calls.push(`${sum}:${index}:${loopCount}:${value}`);
        return sum + value;
      },
      0,
    );

    expect(result).toBe(6);
    expect(calls).toEqual(["0:0:0:1", "1:1:1:2", "3:2:2:3"]);
  });

  it("should reduce plain object values with their keys", async () => {
    const result = await reduceAsync(
      { first: 10, second: 20 },
      async (sum, value, key, loopCount) => sum + value + (key === "first" ? 0 : loopCount),
      0,
    );

    expect(result).toBe(31);
  });

  it("should return the original accumulator when the reducer is not callable", async () => {
    await expect(reduceAsync([], undefined as never, 7)).resolves.toBe(7);
    await expect(reduceAsync({ first: 1 }, null as never, 8)).resolves.toBe(8);
  });
});
