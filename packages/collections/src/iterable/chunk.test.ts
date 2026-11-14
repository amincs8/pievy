import { describe, expect, it } from "vitest";

import { chunk } from "./chunk";

describe("@pievy/collections: iterable/chunk", () => {
  it("splits values into fixed-size chunks while preserving order", () => {
    const a = chunk([1, 2, 3, 4, 5], 2);
    expect(Array.from(a)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("supports string inputs and returns character chunks in order", () => {
    expect(Array.from(chunk("abcd", 2))).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("supports Set, Map, and custom iterable inputs", () => {
    expect(Array.from(chunk(new Set(["a", "b", "c", "d"]), 2))).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);

    expect(
      Array.from(
        chunk(
          new Map([
            ["x", 1],
            ["y", 2],
            ["z", 3],
          ]),
          2,
        ),
      ),
    ).toEqual([
      [
        ["x", 1],
        ["y", 2],
      ],
      [["z", 3]],
    ]);

    const customIterable = {
      *[Symbol.iterator]() {
        yield "first";
        yield "second";
        yield "third";
      },
    };

    expect(Array.from(chunk(customIterable, 2))).toEqual([["first", "second"], ["third"]]);
  });

  it("returns a single chunk when the iterable fits within the requested size", () => {
    expect(Array.from(chunk(["a", "b", "c"], 5))).toEqual([["a", "b", "c"]]);
  });

  it("throws for invalid iterable and size values", () => {
    expect(() => chunk(null as any, 2)).toThrow(TypeError);
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
    expect(() => chunk([1, 2, 3], 1.5)).toThrow(RangeError);
  });
});
