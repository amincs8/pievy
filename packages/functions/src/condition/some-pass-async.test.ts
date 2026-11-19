import { describe, expect, it, vi } from "vitest";

import { somePassAsync } from "./some-pass-async";

describe("@pievy/functions: somePassAsync", () => {
  it("should return true when any predicate resolves true", async () => {
    const isNegative = async (n: number) => n < 0;
    const isEven = async (n: number) => n % 2 === 0;

    const check = somePassAsync(isNegative, isEven);

    expect(await check(2)).toBe(true);
    expect(await check(-1)).toBe(true);
  });

  it("should return false when every predicate resolves false", async () => {
    const isPositive = async (n: number) => n > 0;
    const isEven = async (n: number) => n % 2 === 0;

    expect(await somePassAsync(isPositive, isEven)(-3)).toBe(false);
  });

  it("should forward the same arguments to each predicate until first true", async () => {
    const a = vi.fn<(x: number) => Promise<boolean>>(async (x: number) => x > 0);
    const b = vi.fn<(x: number) => Promise<boolean>>(async (x: number) => x % 2 === 0);

    const check = somePassAsync(a, b);

    await check(-1); // a(-1) => false, b(-1) => false

    expect(a).toHaveBeenCalledWith(-1);
    expect(b).toHaveBeenCalledWith(-1);
  });

  it("should call every predicate when all resolve false", async () => {
    const a = vi.fn<(x: number) => Promise<boolean>>(async () => false);
    const b = vi.fn<(x: number) => Promise<boolean>>(async () => false);

    const check = somePassAsync(a, b);

    await check(1);

    expect(a).toHaveBeenCalledWith(1);
    expect(b).toHaveBeenCalledWith(1);
  });

  it("should accept a single array of predicates", async () => {
    const isNegative = async (n: number) => n < 0;
    const isEven = async (n: number) => n % 2 === 0;

    expect(await somePassAsync([isNegative, isEven])(-1)).toBe(true);
    expect(await somePassAsync([isNegative, isEven])(3)).toBe(false);
  });

  it("should return false with no predicates", async () => {
    expect(await somePassAsync()(1)).toBe(false);
  });
});
