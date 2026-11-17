import { describe, expect, it, vi } from "vitest";

import { once } from "./once";

describe("@pievy/functions: once", () => {
  it("should invoke the function only once", () => {
    const fn = vi.fn<() => number>(() => 1);
    const wrapped = once(fn);
    expect(wrapped()).toBe(1);
    expect(wrapped()).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should return the first result", () => {
    let n = 0;
    const wrapped = once(() => ++n);
    expect(wrapped()).toBe(1);
    expect(wrapped()).toBe(1);
  });

  it("should forward arguments and preserve this", () => {
    const ctx = { add(n: number) { return this.base + n; }, base: 2 };
    const wrapped = once(ctx.add);
    expect(wrapped.call(ctx, 3)).toBe(5);
    expect(wrapped.call({ base: 9 }, 3)).toBe(5);
  });

  it("should resolve the first promise result once", async () => {
    let calls = 0;
    const wrapped = once(async () => {
      calls++;
      return calls;
    });
    const a = await wrapped();
    const b = await wrapped();
    expect(a).toBe(1);
    expect(b).toBe(1);
    expect(calls).toBe(1);
  });

  it("should forward arguments to promise function once", async () => {
    const fn = vi.fn<(x: number) => Promise<number>>(async (x) => x * 2);
    const wrapped = once(fn);
    const a = await wrapped(5);
    const b = await wrapped(6);
    expect(a).toBe(10);
    expect(b).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

