import { describe, expect, it } from "vitest";

import { isArray } from "./array";

describe("@pievy/types: guards/isArray", () => {
  it("should return true for an empty array", () => {
    expect(isArray([])).toBe(true);
  });
  it("should return true for an array", () => {
    expect(isArray([1, 2, 3])).toBe(true);
  });
  it("should return true for an array object", () => {
    expect(isArray(new Array())).toBe(true);
  });

  it("should return false for null", () => {
    expect(isArray(null)).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isArray({})).toBe(false);
  });
  it("should return false for a number", () => {
    expect(isArray(123)).toBe(false);
  });
});

describe("@pievy/types: guards/isArrayEmpty", () => {
  it("should return true for an empty array", () => {
    expect(isArrayEmpty([])).toBe(true);
  });
  it("should return false for a non-empty array", () => {
    expect(isArrayEmpty([1, 2, 3])).toBe(false);
  });
  it("should return true for an empty array object", () => {
    expect(isArrayEmpty(new Array())).toBe(true);
  });
  it("should return false for a non-empty array object", () => {
    expect(isArrayEmpty(Array.from([1, 2, 3]))).toBe(false);
  });

  it("should return false for null", () => {
    expect(isArrayEmpty(null)).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isArrayEmpty({})).toBe(false);
  });
  it("should return false for a number", () => {
    expect(isArrayEmpty(123)).toBe(false);
  });
});
