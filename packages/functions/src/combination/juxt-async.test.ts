import { describe, expect, it, vi } from "vitest";

import { juxtAsync } from "./juxt-async";

describe("@pievy/functions: juxtAsync", () => {
  it("should return resolved results of all functions applied to the same args", async () => {
    const add = async (a: number, b: number) => a + b;
    const mul = async (a: number, b: number) => a * b;

    expect(await juxtAsync(add, mul)(2, 3)).toEqual([5, 6]);
  });

  it("should forward the same arguments to every function", async () => {
    const a = vi.fn<(x: number, y: number) => Promise<number>>(async (x, y) => x + y);
    const b = vi.fn<(x: number, y: number) => Promise<number>>(async (x, y) => x - y);

    await juxtAsync(a, b)(5, 3);

    expect(a).toHaveBeenCalledWith(5, 3);
    expect(b).toHaveBeenCalledWith(5, 3);
  });

  it("should return an array with one result per function", async () => {
    const fn1 = async (n: number) => n + 1;
    const fn2 = async (n: number) => n * 2;
    const fn3 = async (n: number) => n - 1;

    expect(await juxtAsync(fn1, fn2, fn3)(4)).toEqual([5, 8, 3]);
  });

  it("should support type-changing transformations", async () => {
    const toStr = async (n: number) => String(n);
    const length = async (s: number) => String(s).length;

    expect(await juxtAsync(toStr, length)(12345)).toEqual(["12345", 5]);
  });

  it("should preserve object references", async () => {
    const obj = { a: 1 };
    const identity = async (o: { a: number }) => o;

    const result = await juxtAsync(identity)(obj);
    expect(result).toEqual([obj]);
    expect(result[0]).toBe(obj);
  });

  it("should invoke every function even if earlier ones return falsy", async () => {
    const a = vi.fn<() => Promise<boolean>>(async () => false);
    const b = vi.fn<() => Promise<boolean>>(async () => true);

    await juxtAsync(a, b)();

    expect(a).toHaveBeenCalled();
    expect(b).toHaveBeenCalled();
  });
});
