import { describe, expect, it } from "vitest";

import { isAsyncIterable, isIterable } from "./iterable";

describe("@pievy/types: guards/isIterable", () => {
  it("should return true for an empty string", () => {
    expect(isIterable("")).toBe(true);
  });
  it("should return true for a non-empty string", () => {
    expect(isIterable("string")).toBe(true);
  });
  it("should return true for an empty array", () => {
    expect(isIterable([])).toBe(true);
  });
  it("should return true for a non-empty array", () => {
    expect(isIterable([1, 2, 3])).toBe(true);
  });
  it("should return true for an array instance", () => {
    expect(isIterable(new Array())).toBe(true);
  });
  it("should return true for a set instance", () => {
    expect(isIterable(new Set())).toBe(true);
  });
  it("should return true for a map instance", () => {
    expect(isIterable(new Map())).toBe(true);
  });

  it("should return false for undefined", () => {
    expect(isIterable(undefined)).toBe(false);
  });
  it("should return false for null", () => {
    expect(isIterable(null)).toBe(false);
  });
  it("should return false for a number", () => {
    expect(isIterable(123)).toBe(false);
  });
  it("should return false for false", () => {
    expect(isIterable(false)).toBe(false);
  });
  it("should return false for true", () => {
    expect(isIterable(true)).toBe(false);
  });
  it("should return false for an empty object", () => {
    expect(isIterable({})).toBe(false);
  });
  it("should return false for a date", () => {
    expect(isIterable(new Date())).toBe(false);
  });
  it("should return false for a function", () => {
    expect(isIterable(function () {})).toBe(false);
  });
  it("should return false for an arrow function", () => {
    expect(isIterable(() => {})).toBe(false);
  });
});

describe("@pievy/types: guards/isAsyncIterable", () => {
  it("should return true for an async iterator function", () => {
    expect(
      isAsyncIterable(
        (async function* () {
          yield 1;
        })(),
      ),
    ).toBe(true);
  });
  it("should return true for an object that has Symbol.asyncIterator", () => {
    expect(
      isAsyncIterable({
        async *[Symbol.asyncIterator](): AsyncGenerator<number> {
          yield 1;
        },
      }),
    ).toBe(true);
  });

  it("should return false for an empty string", () => {
    expect(isAsyncIterable("")).toBe(false);
  });
  it("should return false for a non-empty string", () => {
    expect(isAsyncIterable("string")).toBe(false);
  });
  it("should return false for an empty array", () => {
    expect(isAsyncIterable([])).toBe(false);
  });
  it("should return false for a non-empty array", () => {
    expect(isAsyncIterable([1, 2, 3])).toBe(false);
  });
  it("should return false for an array instance", () => {
    expect(isAsyncIterable(new Array())).toBe(false);
  });
  it("should return false for a set instance", () => {
    expect(isAsyncIterable(new Set())).toBe(false);
  });
  it("should return false for a map instance", () => {
    expect(isAsyncIterable(new Map())).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isAsyncIterable(undefined)).toBe(false);
  });
  it("should return false for null", () => {
    expect(isAsyncIterable(null)).toBe(false);
  });
  it("should return false for a number", () => {
    expect(isAsyncIterable(123)).toBe(false);
  });
  it("should return false for false", () => {
    expect(isAsyncIterable(false)).toBe(false);
  });
  it("should return false for true", () => {
    expect(isAsyncIterable(true)).toBe(false);
  });
  it("should return false for an empty object", () => {
    expect(isAsyncIterable({})).toBe(false);
  });
  it("should return false for a date", () => {
    expect(isAsyncIterable(new Date())).toBe(false);
  });
  it("should return false for a function", () => {
    expect(isAsyncIterable(function () {})).toBe(false);
  });
  it("should return false for an arrow function", () => {
    expect(isAsyncIterable(() => {})).toBe(false);
  });
});
