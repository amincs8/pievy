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
