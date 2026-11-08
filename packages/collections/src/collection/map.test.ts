import { describe, expect, it } from "vitest";

import { STOP } from "../consts";
import { map } from "./map";

describe("@pievy/collections: collection/map", () => {
  it("should map iterable values with numeric indices and loop counts", () => {
    const result = map(
      ["first", "second"],
      (value, index, loopCount) => `${loopCount}:${index}:${value}`,
    );

    expect(result).toEqual(["0:0:first", "1:1:second"]);
  });

  it("should visit sparse array slots as undefined iterable values", () => {
    const values = Array.from({ length: 3 });
    values[1] = "middle";

    expect(map(values, (value) => String(value))).toEqual(["undefined", "middle", "undefined"]);
  });

  it("should keep mapping when a callback result is the STOP signal", () => {
    const result = map([1, 2, 3], (value) => (value === 2 ? STOP : value));

    expect(result).toEqual([1, STOP, 3]);
  });

  it("should map map entries into an array", () => {
    const result = map(
      new Map([
        ["first", 10],
        ["second", 20],
      ]),
      ([key, value], index) => `${index}:${key}=${value}`,
    );

    expect(result).toEqual(["0:first=10", "1:second=20"]);
  });

  it("should map set values into an array", () => {
    const result = map(new Set([10, 20]), (value, index) => value + index);

    expect(result).toEqual([10, 21]);
  });

  it("should map a custom iterable into an array", () => {
    const values = {
      *[Symbol.iterator]() {
        yield "alpha";
        yield "beta";
      },
    };

    expect(map(values, (value) => value.toUpperCase())).toEqual(["ALPHA", "BETA"]);
  });

  it("should preserve plain object keys while mapping values", () => {
    const result = map(
      { first: 10, second: 20 },
      (value, key, loopCount) => `${key}:${loopCount}:${value}`,
    );

    expect(result).toEqual({ first: "first:0:10", second: "second:1:20" });
  });

  it("should preserve an own __proto__ key without changing the result prototype", () => {
    const result = map({ ["__proto__"]: "safe" }, (value) => value.toUpperCase());

    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result["__proto__"]).toBe("SAFE");
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });

  it("should map strings by character", () => {
    expect(map("abc", (character) => character.toUpperCase())).toEqual(["A", "B", "C"]);
  });

  it("should return an empty collection for empty inputs", () => {
    expect(map([], (value) => value)).toEqual([]);
    expect(map({}, (value) => value)).toEqual({});
  });
});
