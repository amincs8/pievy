import { isNonEmptyString } from "@pievy/types";
import { describe, expect, it } from "vitest";

import { pipeAsync } from "./pipe-async";

describe("@pievy/functions: pipeAsync", () => {
  it("should return the result of a single async function", async () => {
    const addOne = async (n: number) => n + 1;
    expect(await pipeAsync(addOne)(1)).toBe(2);
  });

  it("should pass each resolved result to the next function", async () => {
    const addOne = async (n: number) => n + 1;
    const double = async (n: number) => n * 2;

    expect(await pipeAsync(addOne, double)(1)).toBe(4);
    expect(await pipeAsync(double, addOne)(1)).toBe(3);
  });

  it("should handle multiple initial arguments", async () => {
    const sum = async (...n: number[]) => n.reduce((a, b) => a + b, 0);
    const addOne = async (n: number) => n + 1;
    const double = async (n: number) => n * 2;

    expect(await pipeAsync(sum, addOne, double)(1, 2)).toBe(8);
    expect(await pipeAsync(double, addOne)(100)).toBe(201);
  });

  it("should chain transformations across type changes", async () => {
    const toString = async (n: number) => String(n);
    const length = async (s: string) => s.length;

    expect(await pipeAsync(toString, length)(12345)).toBe(5);
  });

  it("should handle three or more functions", async () => {
    const add = async (n: number) => n + 1;
    const mul = async (n: number) => n * 10;
    const div = async (n: number) => n / 5;

    expect(await pipeAsync(add, mul, div)(4)).toBe(10);
  });

  it("should preserve object reference through side effects", async () => {
    const obj = { a: 1 };
    const addB = async (o: { a: number; b?: number }) => {
      o.b = 2;
      return o;
    };
    const identity = async <T>(v: T): Promise<T> => v;

    const result = await pipeAsync(addB, identity)(obj);
    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should handle null and undefined as initial value", async () => {
    const defaultTo = (value: string) => async (v: unknown) => (isNonEmptyString(v) ? v : value);
    const upper = async (s: string) => s.toUpperCase();

    expect(await pipeAsync(defaultTo("empty"), upper)(null)).toBe("EMPTY");
    expect(await pipeAsync(defaultTo("empty"), upper)(undefined)).toBe("EMPTY");
    expect(await pipeAsync(defaultTo("empty"), upper)("hi")).toBe("HI");
  });
});
