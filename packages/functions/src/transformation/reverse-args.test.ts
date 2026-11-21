import { describe, expect, it, vi } from "vitest";

import { reverseArgs } from "./reverse-args";

describe("@pievy/functions: reverseArgs", () => {
  it("should reverse arguments when calling fn", () => {
    const fn = (a: string, b: string) => `${a} ${b}`;
    const reversed = reverseArgs(fn);

    expect(reversed("world", "hello")).toBe("hello world");
  });

  it("should handle single argument", () => {
    const fn = (n: number) => n * 2;
    const reversed = reverseArgs(fn);

    expect(reversed(5)).toBe(10);
  });

  it("should handle three arguments", () => {
    const fn = (a: number, b: number, c: number) => a + b + c;
    const reversed = reverseArgs(fn);

    expect(reversed(3, 2, 1)).toBe(6);
  });

  it("should forward arguments to fn", () => {
    const fn = vi.fn<(a: number, b: number) => number>((a: number, b: number) => a + b);
    const reversed = reverseArgs(fn);

    reversed(2, 1);

    expect(fn).toHaveBeenCalledWith(1, 2);
  });

  it("should preserve this-less pure functions", () => {
    const concat = (a: string, b: string, c: string) => a + b + c;
    const reversed = reverseArgs(concat);

    expect(reversed("c", "b", "a")).toBe("abc");
  });

  it("should handle zero arguments", () => {
    const fn = () => 42;
    const reversed = reverseArgs(fn);

    expect(reversed()).toBe(42);
  });
});
