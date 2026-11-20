import { describe, expect, it, vi } from "vitest";

import { after } from "./after";

describe("@pievy/functions: after", () => {
  it("should invoke fn only after count calls", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = after(2, fn);

    expect(wrapped()).toBeUndefined();
    expect(wrapped()).toBe("result");

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should invoke fn on every subsequent call after threshold", () => {
    const fn = vi.fn<(x: number) => number>((x: number) => x * 2);
    const wrapped = after(2, fn);

    wrapped(1);
    expect(wrapped(2)).toBe(4);
    expect(wrapped(3)).toBe(6);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should invoke fn on first call when count is 1", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = after(1, fn);

    expect(wrapped()).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should invoke fn on first call when count is 0", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = after(0, fn);

    expect(wrapped()).toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should not invoke fn before threshold", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = after(3, fn);

    wrapped();
    wrapped();

    expect(fn).not.toHaveBeenCalled();
  });

  it("should forward arguments and preserve this", () => {
    const ctx = { add(n: number) { return this.base + n; }, base: 2 };
    const wrapped = after(2, ctx.add);

    wrapped.call(ctx, 3);
    expect(wrapped.call(ctx, 4)).toBe(6);
    expect(wrapped.call({ base: 9 }, 4)).toBe(13);
  });
});
