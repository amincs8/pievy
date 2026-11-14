import { describe, expect, it } from "vitest";

import { range } from ".";

describe("@pievy/collections: iterable/range", () => {
  it("creates an ascending range with the default step", () => {
    const values = range({ end: 4 });

    expect([...values]).toEqual([0, 1, 2, 3, 4]);
    expect(values.length).toBe(5);
  });

  it("creates a descending range with the default negative step", () => {
    const values = range({ end: 1, start: 5 });

    expect([...values]).toEqual([5, 4, 3, 2, 1]);
    expect(values.length).toBe(5);
  });

  it("supports custom steps and singleton ranges", () => {
    expect([...range({ end: 10, start: 0, step: 2 })]).toEqual([0, 2, 4, 6, 8, 10]);
    expect([...range({ end: 4, start: 4 })]).toEqual([4]);
  });

  it("throws on invalid numeric input", () => {
    expect(() => range({ end: 3, start: 0, step: 0 })).toThrow(RangeError);
    expect(() => range({ end: 3, start: 1, step: -1 })).toThrow(RangeError);
    expect(() => range({ end: 3.5, start: 0 })).toThrow(TypeError);
  });
});
