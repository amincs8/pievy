import { describe, expect, it } from "vitest";

import { groupByAsync } from "./group-by-async";

describe("@pievy/collections: collection/groupByAsync", () => {
  it("should group async iterable values by the callback key", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
      },
    };

    const result = await groupByAsync(values, async (value, index) =>
      value % 2 === 0 ? `even:${index}` : `odd:${index}`,
    );

    expect(result).toEqual({
      "even:1": [2],
      "even:3": [4],
      "odd:0": [1],
      "odd:2": [3],
    });
  });

  it("should group plain object values while preserving property keys", async () => {
    const result = await groupByAsync(
      { first: 1, second: 2, third: 3 },
      async (value, key) => (value % 2 === 0 ? `${key}:even` : `${key}:odd`),
    );

    expect(result).toEqual({
      "first:odd": [1],
      "second:even": [2],
      "third:odd": [3],
    });
  });

  it("should return an empty object when the callback is not callable", async () => {
    await expect(groupByAsync([], undefined as never)).resolves.toEqual({});
    await expect(groupByAsync({ first: 1 }, null as never)).resolves.toEqual({});
  });
});
