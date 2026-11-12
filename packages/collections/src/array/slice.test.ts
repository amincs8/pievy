import { describe, expect, it } from "vitest";

import { slice } from "./slice";

describe("@pievy/collections: array/slice", () => {
  it("should iterate a contiguous range from start to end", () => {
    expect([...slice([10, 20, 30, 40, 50], 1, 4)]).toEqual([20, 30, 40]);
    expect([...slice([1, 2, 3, 4, 5], 1, -2)]).toEqual([2, 3]);
  });

  it("should default the end index to the array length", () => {
    expect([...slice(["a", "b", "c", "d"], 1)]).toEqual(["b", "c", "d"]);
  });

  it("should return an empty iterable when the range is empty", () => {
    expect([...slice([1, 2, 3], 3)]).toEqual([]);
    expect([...slice([1, 2, 3], 1, 1)]).toEqual([]);
  });

  it("should support repeated iteration without mutating the original array", () => {
    const values = ["x", "y", "z"];
    const sliced = slice(values, 1, 3);

    expect([...sliced]).toEqual(["y", "z"]);
    expect([...sliced]).toEqual(["y", "z"]);
    expect(values).toEqual(["x", "y", "z"]);
  });

  it("should throw a TypeError for invalid input", () => {
    expect(() => slice(null as any, 0)).toThrow(TypeError);
    expect(() => slice([1, 2, 3], 0, 1.5)).toThrow(TypeError);
    expect(() => slice([1, 2, 3], 0, -1.5)).toThrow(TypeError);
  });
});
