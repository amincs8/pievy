import { describe, expect, it, vi } from "vitest";

import { everyPassAsync } from "./every-pass-async";

describe("@pievy/functions: everyPassAsync", () => {
  it("should return true when all predicates resolve true", async () => {
    const isPositive = async (n: number) => n > 0;
    const isEven = async (n: number) => n % 2 === 0;

    const check = everyPassAsync(isPositive, isEven);

    expect(await check(2)).toBe(true);
  });

  it("should return false when any predicate resolves false", async () => {
    const isPositive = async (n: number) => n > 0;
    const isEven = async (n: number) => n % 2 === 0;

    expect(await everyPassAsync(isPositive, isEven)(3)).toBe(false);
    expect(await everyPassAsync(isPositive, isEven)(-2)).toBe(false);
  });

  it("should forward the same arguments to each predicate until first false", async () => {
    const a = vi.fn<(x: number, y: number) => Promise<boolean>>(
      async (x: number, y: number) => x > y,
    );
    const b = vi.fn<(x: number, y: number) => Promise<boolean>>(
      async (x: number, y: number) => x < y + 1,
    );

    const check = everyPassAsync(a, b);

    await check(1, 2); // a(1, 2) => false, short-circuits before b

    expect(a).toHaveBeenCalledWith(1, 2);
    expect(b).not.toHaveBeenCalled();
  });

  it("should call every predicate when all resolve true", async () => {
    const a = vi.fn<(x: number) => Promise<boolean>>(async () => true);
    const b = vi.fn<(x: number) => Promise<boolean>>(async () => true);

    const check = everyPassAsync(a, b);

    await check(1);

    expect(a).toHaveBeenCalledWith(1);
    expect(b).toHaveBeenCalledWith(1);
  });

  it("should accept a single array of predicates", async () => {
    const isPositive = async (n: number) => n > 0;
    const isEven = async (n: number) => n % 2 === 0;

    expect(await everyPassAsync([isPositive, isEven])(2)).toBe(true);
    expect(await everyPassAsync([isPositive, isEven])(3)).toBe(false);
  });

  it("should return true with no predicates", async () => {
    expect(await everyPassAsync()(1)).toBe(true);
  });
});
