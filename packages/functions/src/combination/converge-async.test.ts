import { describe, expect, it, vi } from "vitest";

import { convergeAsync } from "./converge-async";

type MockFunction = (x: number, y: number) => Promise<number>;

describe("@pievy/functions: convergeAsync", () => {
  it("should combine branch results with the transformer", async () => {
    const addThenDouble = convergeAsync(
      async (n: number, doubled: number) => n + doubled,
      [async (x: number) => x, async (x: number) => x * 2],
    );

    expect(await addThenDouble(3)).toBe(9);
  });

  it("should forward arguments to every branch", async () => {
    const branchA = vi.fn<MockFunction>(async (x: number, y: number) => x + y);
    const branchB = vi.fn<MockFunction>(async (x: number, y: number) => x - y);

    const check = convergeAsync(async (a: number, b: number) => a - b, [branchA, branchB]);

    await check(5, 3);

    expect(branchA).toHaveBeenCalledWith(5, 3);
    expect(branchB).toHaveBeenCalledWith(5, 3);
  });

  it("should pass branch results in order to the transformer", async () => {
    const first = async (n: number) => n + 1;
    const second = async (n: number) => n * 2;
    const third = async (n: number) => n - 1;

    const result = await convergeAsync(
      async (a: number, b: number, c: number) => [a, b, c],
      [first, second, third],
    )(4);

    expect(result).toEqual([5, 8, 3]);
  });

  it("should preserve object references from branches", async () => {
    const obj = { a: 1 };
    const identity = async (o: { a: number }) => o;

    expect(await convergeAsync(async (o: { a: number }) => o, [identity])(obj)).toBe(obj);
  });

  it("should chain across type changes", async () => {
    const toStr = async (n: number) => String(n);
    const length = async (s: number) => String(s).length;

    const result = await convergeAsync(
      async (str: string, len: number) => `${str} has ${len} chars`,
      [toStr, length],
    )(12345);

    expect(result).toBe("12345 has 5 chars");
  });

  it("should invoke transformer with all branch results", async () => {
    const transformer = vi.fn<MockFunction>(async (a: number, b: number) => a + b);
    const branchA = async (n: number) => n;
    const branchB = async (n: number) => n * 2;

    await convergeAsync(transformer, [branchA, branchB])(4);

    expect(transformer).toHaveBeenCalledWith(4, 8);
  });
});
