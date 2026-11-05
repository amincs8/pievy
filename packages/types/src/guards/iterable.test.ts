import { describe, expect, it } from "vitest";

import { isIterable } from "./iterable";

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
