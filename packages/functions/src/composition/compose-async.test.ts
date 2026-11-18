import { describe, expect, it } from "vitest";

import { composeAsync } from "./compose-async";

describe("@pievy/functions: composeAsync", () => {
  it("should return the result of a single async function", async () => {
    const addOne = async (n: number) => n + 1;
    expect(await composeAsync(addOne)(1)).toBe(2);
  });

  it("should apply functions right-to-left", async () => {
    const addOne = async (n: number) => n + 1;
    const double = async (n: number) => n * 2;

    // compose(addOne, double)(1) = addOne(double(1)) = addOne(2) = 3
    expect(await composeAsync(addOne, double)(1)).toBe(3);
    // compose(double, addOne)(1) = double(addOne(1)) = double(2) = 4
    expect(await composeAsync(double, addOne)(1)).toBe(4);
  });

  it("should chain transformations across type changes", async () => {
    const toString = async (n: number) => String(n);
    const length = async (s: string) => s.length;

    expect(await composeAsync(length, toString)(12345)).toBe(5);
  });

  it("should handle three or more functions", async () => {
    const add = async (n: number) => n + 1;
    const mul = async (n: number) => n * 10;
    const div = async (n: number) => n / 5;

    expect(await composeAsync(add, mul, div)(4)).toBe(9);
  });

  it("should handle multiple initial arguments", async () => {
    const sum = async (...n: number[]) => n.reduce((a, b) => a + b, 0);
    const addOne = async (n: number) => n + 1;
    const double = async (n: number) => n * 2;

    expect(await composeAsync(addOne, double, sum)(1, 2)).toBe(7);
  });

  it("should pass falsy values through", async () => {
    const isZero = async (n: number) => n === 0;
    const toStr = async (b: boolean) => String(b);

    expect(await composeAsync(toStr, isZero)(0)).toBe("true");
    expect(await composeAsync(toStr, isZero)(1)).toBe("false");
  });
});
