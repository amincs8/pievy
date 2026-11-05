import { describe, expect, it } from "vitest";

import { isObject } from "./object";

describe("@pievy/types: guards/isObject", () => {
  it("should return true for a empty object", () => {
    expect(isObject({})).toBe(true);
  });

  it("should return true for a date object", () => {
    expect(isObject(new Date())).toBe(true);
  });

  it("should return true for an array", () => {
    expect(isObject([])).toBe(true);
  });

  it("should return true for a plain object", () => {
    expect(isObject({ key: "value" })).toBe(true);
  });

  it("should return true for a string object", () => {
    expect(isObject(new String(""))).toBe(true);
  });

  it("should return false for null", () => {
    expect(isObject(null)).toBe(false);
  });

  it("should return false for a string", () => {
    expect(isObject("string")).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isObject(123)).toBe(false);
  });
});
