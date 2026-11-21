import { describe, expect, it, vi } from "vitest";

import { wrap } from "./wrap";

describe("@pievy/functions: wrap", () => {
  it("should call wrapper with fn and args", () => {
    const fn = (a: number, b: number) => a + b;
    const wrapper = vi.fn<(f: typeof fn, a: number, b: number) => number>(
      (f: typeof fn, a: number, b: number) => f(a, b) * 2,
    );

    const wrapped = wrap(fn, wrapper);

    expect(wrapped(2, 3)).toBe(10);
    expect(wrapper).toHaveBeenCalledWith(fn, 2, 3);
  });

  it("should allow wrapper to transform the result", () => {
    const fn = (n: number) => n + 1;
    const wrapped = wrap(fn, (f, n) => f(n) * 10);

    expect(wrapped(4)).toBe(50);
  });

  it("should allow wrapper to skip calling fn", () => {
    const fn = vi.fn<() => string>(() => "original");
    const wrapped = wrap(fn, () => "wrapped");

    expect(wrapped()).toBe("wrapped");
    expect(fn).not.toHaveBeenCalled();
  });

  it("should forward arguments to fn via wrapper", () => {
    const fn = (a: number, b: number, c: number) => a + b + c;
    const wrapped = wrap(fn, (f, ...args) => f(...args));

    expect(wrapped(1, 2, 3)).toBe(6);
  });

  it("should preserve object reference from fn", () => {
    const obj = { x: 1 };
    const fn = () => obj;
    const wrapped = wrap(fn, (f) => f());

    expect(wrapped()).toBe(obj);
  });

  it("should allow wrapper to add side effects", () => {
    const log: unknown[] = [];
    const fn = (n: number) => n * 2;
    const wrapped = wrap(fn, (f, n) => {
      log.push(n);
      return f(n);
    });

    expect(wrapped(5)).toBe(10);
    expect(log).toEqual([5]);
  });
});

describe("@pievy/functions: wrap with async functions", () => {
  it("should call async wrapper with fn and args", async () => {
    const fn = async (a: number, b: number) => a + b;
    const wrapper = vi.fn<(f: typeof fn, a: number, b: number) => Promise<number>>(
      async (f: typeof fn, a: number, b: number) => (await f(a, b)) * 2,
    );

    const wrapped = wrap(fn, wrapper);

    expect(await wrapped(2, 3)).toBe(10);
    expect(wrapper).toHaveBeenCalledWith(fn, 2, 3);
  });

  it("should allow async wrapper to transform the result", async () => {
    const fn = async (n: number) => n + 1;
    const wrapped = wrap(fn, async (f, n: number) => (await f(n)) * 10);

    expect(await wrapped(4)).toBe(50);
  });

  it("should allow async wrapper to skip calling fn", async () => {
    const fn = vi.fn<() => Promise<string>>(async () => "original");
    const wrapped = wrap(fn as any, async () => "wrapped");

    expect(await wrapped()).toBe("wrapped");
    expect(fn).not.toHaveBeenCalled();
  });

  it("should forward arguments to async fn via wrapper", async () => {
    const fn = async (a: number, b: number, c: number) => a + b + c;
    const wrapped = wrap(fn, async (f, ...args) => f(...args));

    expect(await wrapped(1, 2, 3)).toBe(6);
  });

  it("should preserve object reference from async fn", async () => {
    const obj = { x: 1 };
    const fn = async () => obj;
    const wrapped = wrap(fn, async (f) => f());

    expect(await wrapped()).toBe(obj);
  });

  it("should allow async wrapper to add side effects", async () => {
    const log: unknown[] = [];
    const fn = async (n: number) => n * 2;
    const wrapped = wrap(fn, async (f, n: number) => {
      log.push(n);
      return f(n);
    });

    expect(await wrapped(5)).toBe(10);
    expect(log).toEqual([5]);
  });
});
