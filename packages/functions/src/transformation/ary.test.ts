import type { AnyFunction } from "@pievy/types";
import { describe, expect, it, vi } from "vitest";

import { ary } from "./ary";

describe("@pievy/functions: ary", () => {
  it("should limit the number of arguments passed to fn", () => {
    const fn = (a: number, b: number, c: number) => [a, b, c];
    const wrapped = ary(fn, 2);

    expect(wrapped(1, 2, 3)).toEqual([1, 2, undefined]);
  });

  it("should pass all arguments when argCount exceeds provided args", () => {
    const fn = (a: number, b: number) => a + b;
    const wrapped = ary(fn, 5);

    expect(wrapped(1, 2)).toBe(3);
  });

  it("should pass no arguments when argCount is 0", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = ary(fn, 0) as AnyFunction;

    expect(wrapped(1, 2, 3)).toBe("result");
    expect(fn).toHaveBeenCalledWith();
  });

  it("should handle argCount of 1", () => {
    const fn = (a: number, _b: number, _c: number) => a;
    const wrapped = ary(fn, 1);

    expect(wrapped(1, 2, 3)).toBe(1);
  });

  it("should preserve this binding", () => {
    const ctx = {
      add(a: number, b: number) {
        return this.base + a + b;
      },
      base: 2,
    };
    const wrapped = ary(ctx.add, 2);

    expect(wrapped.call(ctx, 3, 4, 5)).toBe(9);
  });

  it("should handle negative argCount by passing no arguments", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = ary(fn, -1) as AnyFunction;

    expect(wrapped(1, 2)).toBe("result");
    expect(fn).toHaveBeenCalledWith();
  });
});
