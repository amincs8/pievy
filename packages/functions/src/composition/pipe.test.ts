import { isNonEmptyString } from "@pievy/types";
import { describe, expect, it } from "vitest";

import { pipe } from "./pipe";

describe("@pievy/functions: pipe", () => {
  it("should return the result of a single function", () => {
    const addOne = (n: number) => n + 1;
    expect(pipe(addOne)(1)).toBe(2);
  });

  it("should pass each result to the next function", () => {
    const addOne = (n: number) => n + 1;
    const double = (n: number) => n * 2;

    expect(pipe(addOne, double)(1)).toBe(4);
    expect(pipe(double, addOne)(1)).toBe(3);
  });

  it("should pass each result to the next function", () => {
    const first = (n: number, m: number) => n + m;
    const addOne = (n: number) => n + 1;
    const double = (n: number) => n * 2;
    const toHex = (n: number) => n.toString(16);

    expect(pipe(first, addOne, double)(1, 2)).toBe(8);
    expect(pipe(double, addOne, toHex)(100)).toBe("c9");
  });

  it("should chain transformations across type changes", () => {
    const toString = (n: number) => String(n);
    const length = (s: string) => s.length;

    expect(pipe(toString, length)(12345)).toBe(5);
  });

  it("should handle three or more functions", () => {
    const add = (n: number) => n + 1;
    const mul = (n: number) => n * 10;
    const div = (n: number) => n / 5;

    expect(pipe(add, mul, div)(4)).toBe(10);
  });

  it("should preserve object reference through the pipeline", () => {
    const obj = { a: 1 };
    const addB = (o: { a: number; b: number }) => {
      o.b = 2;
      return o;
    };
    const checkB = (o: { a: number; b: number }) => o.b === 2;

    const result = pipe(addB, checkB)(obj as any);
    expect(result).not.toEqual(obj);
    expect(result).toBe(true);
  });

  it("should pass falsy values through the pipeline", () => {
    const isZero = (n: number) => n === 0;
    const toStr = (b: boolean) => String(b);

    expect(pipe(isZero, toStr)(0)).toBe("true");
    expect(pipe(isZero, toStr)(1)).toBe("false");
  });

  it("should handle null and undefined as initial value", () => {
    const defaultTo = (value: string) => (v: unknown) => (isNonEmptyString(v) ? v : value);
    const upper = (s: string) => s.toUpperCase();

    expect(pipe(defaultTo("empty"), upper)(null)).toBe("EMPTY");
    expect(pipe(defaultTo("empty"), upper)(undefined)).toBe("EMPTY");
    expect(pipe(defaultTo("empty"), upper)("hi")).toBe("HI");
  });

  it("should apply side effects in order", () => {
    const log: unknown[] = [];
    const record = (v: any) => {
      log.push(v);
      return v;
    };
    const addOne = (n: number) => n + 1;

    pipe(record, addOne, record)(1);

    expect(log).toEqual([1, 2]);
  });
});
