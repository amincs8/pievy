import type { AnyFunction } from "@pievy/types";
import { describe, expect, it, vi } from "vitest";

import { debounce } from "./debounce";

describe("@pievy/functions: debounce", () => {
  it("should delay invocation until after delay", async () => {
    const fn = vi.fn<() => void>();
    const debounced = debounce(fn, { delay: 50 });

    debounced();

    expect(fn).not.toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 80));

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should reset timer on repeated calls", async () => {
    const fn = vi.fn<() => void>();
    const debounced = debounce(fn, { delay: 50 });

    debounced();
    await new Promise((r) => setTimeout(r, 30));
    debounced();

    await new Promise((r) => setTimeout(r, 30));
    expect(fn).not.toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 40));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should invoke with trailing edge by default", async () => {
    const fn = vi.fn<() => void>();
    const debounced = debounce(fn, { delay: 20 });

    (debounced as AnyFunction)(1, 2);

    await new Promise((r) => setTimeout(r, 40));

    expect(fn).toHaveBeenCalledWith(1, 2);
  });

  it("should invoke on leading edge when leading is true", () => {
    const fn = vi.fn<() => void>();
    const debounced = debounce(fn, { delay: 50, leading: true });

    debounced();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should not invoke when both leading and trailing are false", () => {
    expect(() =>
      debounce(vi.fn<() => void>(), { delay: 50, leading: false, trailing: false }),
    ).toThrow(TypeError);
  });

  it("should cancel pending invocation", async () => {
    const fn = vi.fn<() => void>();
    const debounced = debounce(fn, { delay: 50 });

    debounced();
    debounced.cancel();

    await new Promise((r) => setTimeout(r, 80));

    expect(fn).not.toHaveBeenCalled();
  });

  it("should flush pending invocation", async () => {
    const fn = vi.fn<() => string>(() => "result");
    const debounced = debounce(fn, { delay: 50 });

    debounced();
    const result = debounced.flush();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe("result");
  });

  it("should return undefined from flush when nothing pending", () => {
    const fn = vi.fn<() => string>(() => "result");
    const debounced = debounce(fn, { delay: 50 });

    expect(debounced.flush()).toBeUndefined();
  });

  it("should throw for non-positive delay", () => {
    expect(() => debounce(vi.fn<() => void>(), { delay: 0 })).toThrow(TypeError);
    expect(() => debounce(vi.fn<() => void>(), { delay: -1 })).toThrow(TypeError);
  });

  it("should throw for invalid maxWait", () => {
    expect(() => debounce(vi.fn<() => void>(), { delay: 50, maxWait: 10 })).toThrow(TypeError);
    expect(() => debounce(vi.fn<() => void>(), { delay: 50, maxWait: Infinity })).toThrow(
      TypeError,
    );
  });

  it("should preserve this binding", async () => {
    const ctx = {
      add(n: number) {
        return this.base + n;
      },
      base: 2,
    };
    const debounced = debounce(ctx.add, { delay: 20 });

    debounced.call(ctx, 3);

    await new Promise((r) => setTimeout(r, 40));

    expect(ctx.base).toBe(2);
  });
});
