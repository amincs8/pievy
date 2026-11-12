import { describe, expect, it } from "vitest";

import { reduce } from "./reduce";

describe("@pievy/collections: collection/reduce", () => {
  it("should reduce iterable values and preserve numeric indices", () => {
    const result = reduce(
      ["first", "second"],
      (accumulator, value, index, loopCount) => `${accumulator}${index}:${loopCount}:${value};`,
      "",
    );

    expect(result).toBe("0:0:first;1:1:second;");
  });

  it("should reduce plain object values and expose object keys", () => {
    const result = reduce(
      { first: 10, second: 20 },
      (sum, value, key, loopCount) => sum + value + (key === "first" ? 0 : loopCount),
      0,
    );

    expect(result).toBe(31);
  });

  it("should return the accumulator when the reducer is not callable", () => {
    expect(reduce([], undefined as never, 7)).toBe(7);
    expect(reduce({ first: 1 }, null as never, 8)).toBe(8);
  });
});
