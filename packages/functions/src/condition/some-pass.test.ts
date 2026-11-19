import { describe, expect, it, vi } from "vitest";

import { somePass } from "./some-pass";

describe("@pievy/functions: somePass", () => {
  it("should return true when any predicate returns true", () => {
    const isNegative = (n: number) => n < 0;
    const isEven = (n: number) => n % 2 === 0;

    const check = somePass(isNegative, isEven);

    expect(check(2)).toBe(true);
    expect(check(-1)).toBe(true);
  });

  it("should return false when every predicate returns false", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    expect(somePass(isPositive, isEven)(-3)).toBe(false);
  });

  it("should forward the same arguments to each predicate until first true", () => {
    const a = vi.fn<(x: number) => boolean>((x: number) => x > 0);
    const b = vi.fn<(x: number) => boolean>((x: number) => x % 2 === 0);

    const check = somePass(a, b);

    check(-1); // a(-1) => false, b(-1) => false

    expect(a).toHaveBeenCalledWith(-1);
    expect(b).toHaveBeenCalledWith(-1);
  });

  it("should call every predicate when all return false", () => {
    const a = vi.fn<(x: number) => boolean>(() => false);
    const b = vi.fn<(x: number) => boolean>(() => false);

    const check = somePass(a, b);

    check(1);

    expect(a).toHaveBeenCalledWith(1);
    expect(b).toHaveBeenCalledWith(1);
  });

  it("should accept a single array of predicates", () => {
    const isNegative = (n: number) => n < 0;
    const isEven = (n: number) => n % 2 === 0;

    expect(somePass([isNegative, isEven])(-1)).toBe(true);
    expect(somePass([isNegative, isEven])(3)).toBe(false);
  });

  it("should return false with no predicates", () => {
    expect(somePass()(1)).toBe(false);
  });
});
