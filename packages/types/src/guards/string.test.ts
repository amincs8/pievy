import { describe, expect, it } from "vitest";

import { isEmptyString, isNonEmptyString, isString } from "./string";

describe("@pievy/types: guards/isString", () => {
  it("should return true for an empty string", () => {
    expect(isString("")).toBe(true);
  });
  it("should return true for a non-empty string", () => {
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

describe("@pievy/types: guards/isEmptyString", () => {
  it("should return true for an empty string", () => {
    expect(isEmptyString("")).toBe(true);
  });
  it("should return false for a non-empty string", () => {
    expect(isEmptyString("string")).toBe(false);
  });

  it("should return false for undefined value", () => {
    expect(isEmptyString(undefined)).toBe(false);
  });
  it("should return false for null value", () => {
    expect(isEmptyString(null)).toBe(false);
  });
  it("should return false for a number", () => {
    expect(isEmptyString(0)).toBe(false);
  });
  it("should return false for a empty array", () => {
    expect(isEmptyString([])).toBe(false);
  });
  it("should return false for a non-empty array", () => {
    expect(isEmptyString([1, 2, 3, "a"])).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isEmptyString({})).toBe(false);
  });
});

describe("@pievy/types: guards/isNonEmptyString", () => {
  it("should return true for a non-empty string", () => {
    expect(isNonEmptyString("string")).toBe(true);
  });
  it("should return false for an empty string", () => {
    expect(isNonEmptyString("")).toBe(false);
  });

  it("should return false for undefined value", () => {
    expect(isNonEmptyString(undefined)).toBe(false);
  });
  it("should return false for null value", () => {
    expect(isNonEmptyString(null)).toBe(false);
  });
  it("should return false for a number", () => {
    expect(isNonEmptyString(0)).toBe(false);
  });
  it("should return false for a empty array", () => {
    expect(isNonEmptyString([])).toBe(false);
  });
  it("should return false for a non-empty array", () => {
    expect(isNonEmptyString([1, 2, 3, "a"])).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isNonEmptyString({})).toBe(false);
  });
});
