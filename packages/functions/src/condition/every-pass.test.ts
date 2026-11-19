import { describe, expect, it, vi } from "vitest";

import { everyPass } from "./every-pass";

describe("@pievy/functions: everyPass", () => {
  it("should return true when all predicates return true", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    expect(everyPass(isPositive, isEven)(2)).toBe(true);
  });

  it("should return false when any predicate returns false", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    expect(everyPass(isPositive, isEven)(3)).toBe(false);
    expect(everyPass(isPositive, isEven)(-2)).toBe(false);
  });

  it("should forward the same arguments to each predicate until first false", () => {
    const a = vi.fn<(x: number, y: number) => boolean>((x: number, y: number) => x > y);
    const b = vi.fn<(x: number, y: number) => boolean>((x: number, y: number) => x < y + 1);

    const check = everyPass(a, b);

    check(1, 2); // a(1, 2) => false, short-circuits before b

    expect(a).toHaveBeenCalledWith(1, 2);
    expect(b).not.toHaveBeenCalled();
  });

  it("should call every predicate when all return true", () => {
    const a = vi.fn<(x: number) => boolean>(() => true);
    const b = vi.fn<(x: number) => boolean>(() => true);

    const check = everyPass(a, b);

    check(1);

    expect(a).toHaveBeenCalledWith(1);
    expect(b).toHaveBeenCalledWith(1);
  });

  it("should accept a single array of predicates", () => {
    const isPositive = (n: number) => n > 0;
    const isEven = (n: number) => n % 2 === 0;

    expect(everyPass([isPositive, isEven])(2)).toBe(true);
    expect(everyPass([isPositive, isEven])(3)).toBe(false);
  });

  it("should return true with no predicates", () => {
    expect(everyPass()(1)).toBe(true);
  });
});
