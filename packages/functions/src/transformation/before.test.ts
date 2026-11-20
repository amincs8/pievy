import { describe, expect, it, vi } from "vitest";

import { before } from "./before";

describe("@pievy/functions: before", () => {
  it("should invoke fn count - 1 times", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = before(3, fn);

    expect(wrapped()).toBe("result");
    expect(wrapped()).toBe("result");
    expect(wrapped()).toBe("result");

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should return the last result after limit is reached", () => {
    let n = 0;
    const fn = () => ++n;
    const wrapped = before(3, fn);

    expect(wrapped()).toBe(1);
    expect(wrapped()).toBe(2);
    expect(wrapped()).toBe(2);
    expect(wrapped()).toBe(2);
  });

  it("should not invoke fn when count is 1", () => {
    const fn = vi.fn<() => string>(() => "result");
    const wrapped = before(1, fn);

    expect(wrapped()).toBeUndefined();
    expect(wrapped()).toBeUndefined();

    expect(fn).not.toHaveBeenCalled();
  });

  it("should invoke fn on every call when count is large", () => {
    const fn = vi.fn<(x: number) => number>((x: number) => x * 2);
    const wrapped = before(10, fn);

    expect(wrapped(2)).toBe(4);
    expect(wrapped(3)).toBe(6);
    expect(wrapped(4)).toBe(8);

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should forward arguments and preserve this", () => {
    const ctx = { add(n: number) { return this.base + n; }, base: 2 };
    const wrapped = before(3, ctx.add);

    expect(wrapped.call(ctx, 3)).toBe(5);
    expect(wrapped.call(ctx, 4)).toBe(6);
    expect(wrapped.call({ base: 9 }, 4)).toBe(6);
  });

  it("should handle count of 0 & 1 by never invoking fn", () => {
    const fn_0 = vi.fn<() => string>(() => "result");
    const fn_1 = vi.fn<() => string>(() => "result");
    const wrapped_0 = before(0, fn_0);
    const wrapped_1 = before(1, fn_1);

    expect(wrapped_0()).toBeUndefined();
    expect(wrapped_1()).toBeUndefined();
    expect(fn_0).not.toHaveBeenCalled();
    expect(fn_1).not.toHaveBeenCalled();
  });
});
