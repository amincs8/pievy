import type { AnyFunction } from "@pievy/types";
import { describe, expect, it, vi } from "vitest";

import { throttle } from "./throttle";

describe("@pievy/functions: throttle", () => {
  it("should invoke on leading edge by default", () => {
    const fn = vi.fn<() => void>();
    const throttled = throttle(fn, { wait: 50 });

    throttled();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should not invoke again within wait window", async () => {
    const fn = vi.fn<() => void>();
    const throttled = throttle(fn, { wait: 50 });

    throttled();
    throttled();
    throttled();

    expect(fn).toHaveBeenCalledTimes(1);

    await new Promise((r) => setTimeout(r, 80));

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should invoke on trailing edge after wait", async () => {
    const fn = vi.fn<() => void>();
    const throttled = throttle(fn, { leading: false, wait: 50 });

    throttled();

    expect(fn).not.toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 80));

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should not invoke trailing when trailing is false", async () => {
    const fn = vi.fn<() => void>();
    const throttled = throttle(fn, { leading: true, trailing: false, wait: 50 });

    throttled();
    throttled();

    await new Promise((r) => setTimeout(r, 80));

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should throw when both leading and trailing are false", () => {
    expect(() =>
      throttle(vi.fn<() => void>(), { leading: false, trailing: false, wait: 50 }),
    ).toThrow(TypeError);
  });

  it("should throw for non-positive wait", () => {
    expect(() => throttle(vi.fn<() => void>(), { wait: 0 })).toThrow(TypeError);
    expect(() => throttle(vi.fn<() => void>(), { wait: -1 })).toThrow(TypeError);
  });

  it("should cancel pending invocation", async () => {
    const fn = vi.fn<() => void>();
    const throttled = throttle(fn, { leading: false, wait: 50 });

    throttled();
    throttled.cancel();

    await new Promise((r) => setTimeout(r, 80));

    expect(fn).not.toHaveBeenCalled();
  });

  it("should flush pending invocation", async () => {
    const fn = vi.fn<() => string>(() => "result");
    const throttled = throttle(fn, { leading: false, wait: 50 });

    throttled();
    const result = throttled.flush();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe("result");
  });

  it("should return undefined from flush when nothing pending", () => {
    const fn = vi.fn<() => string>(() => "result");
    const throttled = throttle(fn, { wait: 50 });

    expect(throttled.flush()).toBeUndefined();
  });

  it("should forward arguments", async () => {
    const fn = vi.fn<(a: number, b: number) => number>((a: number, b: number) => a + b);
    const throttled = throttle(fn, { wait: 50 });

    (throttled as AnyFunction)(1, 2);

    expect(fn).toHaveBeenCalledWith(1, 2);
  });

  it("should preserve this binding", async () => {
    const ctx = {
      add(n: number) {
        return this.base + n;
      },
      base: 2,
    };
    const throttled = throttle(ctx.add, { wait: 50 });

    const result = throttled.call(ctx, 3);

    expect(result).toBe(5);
  });
});
