import { describe, expect, it, vi } from "vitest";

import { converge } from "./converge";

describe("@pievy/functions: converge", () => {
  it("should combine branch results with the transformer", () => {
    const addThenDouble = converge(
      (n: number, doubled: number) => n + doubled,
      [(x: number) => x, (x: number) => x * 2],
    );

    expect(addThenDouble(3)).toBe(9);
  });

  it("should forward arguments to every branch", () => {
    const branchA = vi.fn<(x: number, y: number) => number>((x: number, y: number) => x + y);
    const branchB = vi.fn<(x: number, y: number) => number>((x: number, y: number) => x - y);

    const check = converge((a: number, b: number) => a - b, [branchA, branchB]);

    check(5, 3);

    expect(branchA).toHaveBeenCalledWith(5, 3);
    expect(branchB).toHaveBeenCalledWith(5, 3);
  });

  it("should pass branch results in order to the transformer", () => {
    const first = (n: number) => n + 1;
    const second = (n: number) => n * 2;
    const third = (n: number) => n - 1;

    const result = converge(
      (a: number, b: number, c: number) => [a, b, c],
      [first, second, third],
    )(4);

    expect(result).toEqual([5, 8, 3]);
  });

  it("should preserve object references from branches", () => {
    const obj = { a: 1 };
    const identity = (o: { a: number }) => o;

    expect(converge((o: { a: number }) => o, [identity])(obj)).toBe(obj);
  });

  it("should chain across type changes", () => {
    const toStr = (n: number) => String(n);
    const length = (s: number) => String(s).length;

    const result = converge(
      (str: string, len: number) => `${str} has ${len} chars`,
      [toStr, length],
    )(12345);

    expect(result).toBe("12345 has 5 chars");
  });

  it("should invoke transformer with all branch results", () => {
    const transformer = vi.fn<(x: number, y: number) => number>((a: number, b: number) => a + b);
    const branchA = (n: number) => n;
    const branchB = (n: number) => n * 2;

    converge(transformer, [branchA, branchB])(4);

    expect(transformer).toHaveBeenCalledWith(4, 8);
  });
});
