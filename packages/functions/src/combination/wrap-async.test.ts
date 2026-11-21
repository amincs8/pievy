import { describe, expect, it, vi } from "vitest";

import { wrapAsync } from "./wrap-async";

describe("@pievy/functions: wrapAsync", () => {
  it("should call wrapper with fn and args", async () => {
    const fn = async (a: number, b: number) => a + b;
    const wrapper = vi.fn(async (f: typeof fn, a: number, b: number) => (await f(a, b)) * 2);

    const wrapped = wrapAsync(fn, wrapper);

    expect(await wrapped(2, 3)).toBe(10);
    expect(wrapper).toHaveBeenCalledWith(fn, 2, 3);
  });

  it("should allow wrapper to transform the result", async () => {
    const fn = async (n: number) => n + 1;
    const wrapped = wrapAsync(fn, async (f, n) => (await f(n)) * 10);

    expect(await wrapped(4)).toBe(50);
  });

  it("should allow wrapper to skip calling fn", async () => {
    const fn = vi.fn(async () => "original");
    const wrapped = wrapAsync(fn, async () => "wrapped");

    expect(await wrapped()).toBe("wrapped");
    expect(fn).not.toHaveBeenCalled();
  });

  it("should forward arguments to fn via wrapper", async () => {
    const fn = async (a: number, b: number, c: number) => a + b + c;
    const wrapped = wrapAsync(fn, async (f, ...args) => f(...args));

    expect(await wrapped(1, 2, 3)).toBe(6);
  });

  it("should preserve object reference from fn", async () => {
    const obj = { x: 1 };
    const fn = async () => obj;
    const wrapped = wrapAsync(fn, async (f) => f());

    expect(await wrapped()).toBe(obj);
  });

  it("should allow wrapper to add side effects", async () => {
    const log: unknown[] = [];
    const fn = async (n: number) => n * 2;
    const wrapped = wrapAsync(fn, async (f, n) => {
      log.push(n);
      return f(n);
    });

    expect(await wrapped(5)).toBe(10);
    expect(log).toEqual([5]);
  });

  it("should await wrapper before returning", async () => {
    let resolved = false;
    const fn = async (n: number) => n;
    const wrapped = wrapAsync(fn, async (f, n) => {
      resolved = true;
      return f(n);
    });

    const promise = wrapped(1);
    expect(resolved).toBe(false);
    await promise;
    expect(resolved).toBe(true);
  });
});
