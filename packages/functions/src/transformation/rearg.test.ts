import { describe, expect, it, vi } from "vitest";

import { rearg } from "./rearg";

describe("@pievy/functions: rearg", () => {
  it("should rearrange arguments according to indexes", () => {
    const fn = (a: string, b: number) => a.repeat(b);
    const swapped = rearg(fn, [1, 0]);

    expect(swapped(5, "hello")).toBe("hello".repeat(5));
  });

  it("should support three arguments", () => {
    const fn = (a: number, b: number, c: number) => `${a}${b}${c}`;
    const reordered = rearg(fn, [2, 0, 1]);

    expect(reordered(1, 2, 3)).toBe("312");
  });

  it("should forward arguments to fn in reordered order", () => {
    const fn = vi.fn<(a: number, b: number) => number>((a: number, b: number) => a + b);
    const reordered = rearg(fn, [1, 0]);

    reordered(1, 2);

    expect(fn).toHaveBeenCalledWith(2, 1);
  });

  it("should handle identity indexes", () => {
    const fn = (a: number, b: number) => a + b;
    const same = rearg(fn, [0, 1]);

    expect(same(1, 2)).toBe(3);
  });

  it("should handle duplicate indexes", () => {
    const fn = (a: number, b: number) => a + b;
    const dup = rearg(fn, [0, 0]);

    expect(dup(5, 3)).toBe(10);
  });

  it("should preserve object reference", () => {
    const obj = { x: 1 };
    const fn = (o: { x: number }) => o;
    const wrapped = rearg(fn, [0]);

    expect(wrapped(obj)).toBe(obj);
  });
});
