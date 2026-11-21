import { describe, expect, it } from "vitest";

import { curry } from "./curry";

describe("@pievy/functions: curry", () => {
  it("should call fn with all arguments at once", () => {
    const add = (a: number, b: number) => a + b;
    const cAdd = curry(add);
    expect(cAdd(1, 2)).toBe(3);
  });

  it("should curry arguments incrementally", () => {
    const add = (a: number, b: number) => a + b;
    const curried = curry(add);
    expect(curried(1)(2)).toBe(3);
  });

  it("should support partial application with multiple args", () => {
    const sum = (a: number, b: number, c: number) => a + b + c;
    const curried = curry(sum);
    expect(curried(1, 2)(3)).toBe(6);
    expect(curried(1)(2, 3)).toBe(6);
    expect(curried(1)(2)(3)).toBe(6);
  });

  it("should use explicit arity", () => {
    const fn = (a: number, b: number, c: number) => a + b + c;
    const curried = curry(fn, 3);
    expect(curried(1)(2)(3)).toBe(6);
  });

  it("should preserve this-less pure functions", () => {
    const concat = (a: string, b: string) => a + b;
    expect(curry(concat)("foo")("bar")).toBe("foobar");
  });

  it("should handle zero-arity functions", () => {
    const fn = () => 42;
    expect(curry(fn)()).toBe(42);
  });
});
