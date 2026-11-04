import { describe, expect, it } from "vitest";

import { isString } from "./string";

describe("@pievy/types: guards/isString", () => {
  it("should return true for empty string", () => {
    expect(isString("")).toBe(true);
  });
  it("should return true for non-empty string", () => {
    expect(isString("string")).toBe(true);
  });

  it("should return false for undefined value", () => {
    expect(isString(undefined)).toBe(false);
  });
  it("should return false for null value", () => {
    expect(isString(null)).toBe(false);
  });
  it("should return false for a number", () => {
    expect(isString(0)).toBe(false);
  });
  it("should return false for a empty array", () => {
    expect(isString([])).toBe(false);
  });
  it("should return false for a non-empty array", () => {
    expect(isString([1, 2, 3, "a"])).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isString({})).toBe(false);
  });
});
