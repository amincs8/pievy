import { describe, expect, it } from "vitest";

import { negate, negateAsync } from "./negate";

describe("@pievy/functions: negate", () => {
  it("should negate boolean results", () => {
    const isEven = (n: number) => n % 2 === 0;
    expect(negate(isEven)(2)).toBe(false);
    expect(negate(isEven)(3)).toBe(true);
  });

  it("should coerce truthy and falsy results to booleans", () => {
    expect(negate(() => 1)()).toBe(false);
    expect(negate(() => 0)()).toBe(true);
    expect(negate(() => "")()).toBe(true);
  });

  it("should forward arguments and preserve this", () => {
    const ctx = {
      base: 2,
      greaterThanBase(value: number, extra: number) {
        return value + extra > this.base;
      },
    };

    const notGreaterThanBase = negate(ctx.greaterThanBase);
    expect(notGreaterThanBase.call(ctx, 1, 0)).toBe(true);
    expect(notGreaterThanBase.call(ctx, 2, 1)).toBe(false);
  });
});

describe("@pievy/functions: negateAsync", () => {
  it("should negate resolved boolean results", async () => {
    const fn = async (n: number) => n % 2 === 0;
    const negated = negateAsync(fn);
    expect(await negated(2)).toBe(false);
    expect(await negated(3)).toBe(true);
  });

  it("should coerce truthy and falsy resolved results", async () => {
    const negated = negateAsync(() => Promise.resolve(1));
    expect(await negated()).toBe(false);
    expect(await negateAsync(() => Promise.resolve(0))()).toBe(true);
    expect(await negateAsync(() => Promise.resolve(""))()).toBe(true);
  });

  it("should forward arguments and preserve this", async () => {
    const ctx = {
      base: 2,
      async greaterThanBase(value: number, extra: number) {
        return value + extra > this.base;
      },
    };

    const notGreaterThanBase = negateAsync(ctx.greaterThanBase);
    expect(await notGreaterThanBase.call(ctx, 1, 0)).toBe(true);
    expect(await notGreaterThanBase.call(ctx, 2, 1)).toBe(false);
  });
});
