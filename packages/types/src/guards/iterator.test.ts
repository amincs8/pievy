import { describe, expect, it } from "vitest";

import { isIterator } from "./iterator";

describe("@pievy/types: guards/isIterator", () => {
  it("should return true for array iterator", () => {
    expect(isIterator([1, 2, 3][Symbol.iterator]())).toBe(true);
  });

  it("should return true for map iterator", () => {
    expect(isIterator(new Map([[1, "a"]]).entries())).toBe(true);
  });

  it("should return true for set iterator", () => {
    expect(isIterator(new Set([1, 2]).values())).toBe(true);
  });

  it("should return true for string iterator", () => {
    expect(isIterator("hello"[Symbol.iterator]())).toBe(true);
  });

  it("should return true for generator iterator", () => {
    function* generator() {
      yield 1;
    }

    expect(isIterator(generator())).toBe(true);
  });

  it("should return true for custom iterator", () => {
    const iterator = {
      next() {
        return { done: false, value: 1 };
      },
    };

    expect(isIterator(iterator)).toBe(true);
  });

  it("should return false for iterable objects", () => {
    expect(isIterator([1, 2, 3])).toBe(false);
    expect(isIterator("hello")).toBe(false);
    expect(isIterator(new Set())).toBe(false);
  });

  it("should return false for objects without next method", () => {
    expect(isIterator({})).toBe(false);
    expect(isIterator({ next: 1 })).toBe(false);
  });

  it("should return false for primitive values", () => {
    expect(isIterator(null)).toBe(false);
    expect(isIterator(undefined)).toBe(false);
    expect(isIterator(123)).toBe(false);
    expect(isIterator(true)).toBe(false);
    expect(isIterator("hello")).toBe(false);
  });

  it("should return false for functions", () => {
    expect(isIterator(() => {})).toBe(false);
  });
});
