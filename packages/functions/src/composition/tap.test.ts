import { describe, expect, it, vi } from "vitest";

import { tap } from "./tap";

describe("@pievy/functions: tap", () => {
  it("should return value unchanged", () => {
    const check = tap(vi.fn());
    expect(check("value")).toBe("value");
    expect(check(42)).toBe(42);
  });

  it("should invoke fn with value", () => {
    const fn = vi.fn<(v: number) => void>();
    const check = tap(fn);
    check(5);
    expect(fn).toHaveBeenCalledWith(5);
  });

  it("should ignore fn return value", () => {
    const check = tap(() => "ignored");
    expect(check("kept")).toBe("kept");
  });

  it("should preserve object reference", () => {
    const obj = { x: 1 };
    const check = tap(vi.fn<(v: typeof obj) => void>());
    expect(check(obj)).toBe(obj);
  });
});
