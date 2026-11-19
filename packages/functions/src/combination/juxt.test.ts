import { describe, expect, it, vi } from "vitest";

import { juxt } from "./juxt";

describe("@pievy/functions: juxt", () => {
  it("should return results of all functions applied to the same args", () => {
    const add = (a: number, b: number) => a + b;
    const mul = (a: number, b: number) => a * b;

    expect(juxt(add, mul)(2, 3)).toEqual([5, 6]);
  });

  it("should forward the same arguments to every function", () => {
    const a = vi.fn<(x: number, y: number) => number>((x, y) => x + y);
    const b = vi.fn<(x: number, y: number) => number>((x, y) => x - y);

    juxt(a, b)(5, 3);

    expect(a).toHaveBeenCalledWith(5, 3);
    expect(b).toHaveBeenCalledWith(5, 3);
  });

  it("should return an array with one result per function", () => {
    const fn1 = (n: number) => n + 1;
    const fn2 = (n: number) => n * 2;
    const fn3 = (n: number) => n - 1;

    expect(juxt(fn1, fn2, fn3)(4)).toEqual([5, 8, 3]);
  });

  it("should support type-changing transformations", () => {
    const toStr = (n: number) => String(n);
    const length = (s: number) => String(s).length;

    expect(juxt(toStr, length)(12345)).toEqual(["12345", 5]);
  });

  it("should preserve object references", () => {
    const obj = { a: 1 };
    const identity = (o: { a: number }) => o;

    expect(juxt(identity)(obj)).toEqual([obj]);
    expect(juxt(identity)(obj)[0]).toBe(obj);
  });

  it("should invoke every function even if earlier ones return falsy", () => {
    const a = vi.fn<() => boolean>(() => false);
    const b = vi.fn<() => boolean>(() => true);

    juxt(a, b)();

    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
  });
});
