import { describe, expect, it } from "vitest";

import { reverse } from "./reverse";

describe("@pievy/collections: array/reverse", () => {
  it("should iterate values in reverse order", () => {
    expect([...reverse([1, 2, 3, 4])]).toEqual([4, 3, 2, 1]);
  });

  it("should support repeated iteration without mutating the original array", () => {
    const values = ["a", "b", "c"];
    const reversed = reverse(values);

    expect([...reversed]).toEqual(["c", "b", "a"]);
    expect([...reversed]).toEqual(["c", "b", "a"]);
    expect(values).toEqual(["a", "b", "c"]);
  });

  it("should return an empty iterable for an empty array", () => {
    expect([...reverse([])]).toEqual([]);
  });

  it("should throw a TypeError when the input is not an array", () => {
    expect(() => reverse(null as any)).toThrow(TypeError);
    expect(() => reverse({ length: 3 } as any)).toThrow(TypeError);
  });
});
