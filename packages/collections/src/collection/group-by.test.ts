import { describe, expect, it } from "vitest";

import { groupBy } from "./group-by";

describe("@pievy/collections: collection/groupBy", () => {
  it("should group iterable values by the callback key", () => {
    const result = groupBy([1, 2, 3, 4], (value, index) =>
      value % 2 === 0 ? `even:${index}` : `odd:${index}`,
    );

    expect(result).toEqual({
      "even:1": [2],
      "even:3": [4],
      "odd:0": [1],
      "odd:2": [3],
    });
  });

  it("should group plain object values while preserving property keys", () => {
    const result = groupBy(
      { first: 1, second: 2, third: 3 },
      (value, key) => (value % 2 === 0 ? `${key}:even` : `${key}:odd`),
    );

    expect(result).toEqual({
      "first:odd": [1],
      "second:even": [2],
      "third:odd": [3],
    });
  });

  it("should return an empty object when the callback is not callable", () => {
    expect(groupBy([], undefined as never)).toEqual({});
    expect(groupBy({ first: 1 }, null as never)).toEqual({});
  });
});
