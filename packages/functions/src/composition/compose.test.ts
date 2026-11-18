import { describe, expect, it } from "vitest";

import { compose } from "./compose";

describe("@pievy/functions: compose", () => {
  it("should return the result of a single function", () => {
    const addOne = (n: number) => n + 1;
    expect(compose(addOne)(1)).toBe(2);
  });

  it("should apply functions right-to-left", () => {
    const addOne = (n: number) => n + 1;
    const double = (n: number) => n * 2;

    // compose(addOne, double)(1) = addOne(double(1)) = addOne(2) = 3
    expect(compose(addOne, double)(1)).toBe(3);
    // compose(double, addOne)(1) = double(addOne(1)) = double(2) = 4
    expect(compose(double, addOne)(1)).toBe(4);
  });

  it("should chain transformations across type changes", () => {
    const toString = (n: number) => String(n);
    const length = (s: string) => s.length;

    // compose(length, toString)(12345) = length(toString(12345)) = length("12345") = 5
    expect(compose(length, toString)(12345)).toBe(5);
  });

  it("should handle three or more functions", () => {
    const add = (n: number) => n + 1;
    const mul = (n: number) => n * 10;
    const div = (n: number) => n / 5;

    // compose(add, mul, div)(4) = add(mul(div(4))) = add(mul(0.8)) = add(8) = 9
    expect(compose(add, mul, div)(4)).toBe(9);
  });

  it("should handle multiple initial arguments", () => {
    const sum = (...n: number[]) => n.reduce((a, b) => a + b, 0);
    const addOne = (n: number) => n + 1;
    const double = (n: number) => n * 2;

    expect(compose(addOne, double, sum)(1, 2)).toBe(7);
  });

  it("should pass falsy values through", () => {
    const isZero = (n: number) => n === 0;
    const toStr = (b: boolean) => String(b);

    expect(compose(toStr, isZero)(0)).toBe("true");
    expect(compose(toStr, isZero)(1)).toBe("false");
  });
});
