import { describe, expect, it } from "vitest";

import { isNumber, isZero } from "./number";

describe("@pievy/types: guards/isNumber", () => {
  it("should return true for zero", () => {
    expect(isNumber(0)).toBe(true);
  });
  it("should return true for a non-zero number", () => {
    expect(isNumber(Math.random())).toBe(true);
  });
  it("should return true for Infinity", () => {
    expect(isNumber(Infinity)).toBe(true);
  });
  it("should return true for NaN", () => {
    expect(isNumber(NaN)).toBe(true);
  });

  it("should return false for a bigint", () => {
    expect(isNumber(1n)).toBe(false);
  });
  it("should return false for null", () => {
    expect(isNumber(null)).toBe(false);
  });
  it("should return false for undefined", () => {
    expect(isNumber(undefined)).toBe(false);
  });
  it("should return false for true", () => {
    expect(isNumber(true)).toBe(false);
  });
  it("should return false for false", () => {
    expect(isNumber(false)).toBe(false);
  });
  it("should return false for an empty string", () => {
    expect(isNumber("")).toBe(false);
  });
  it("should return false for a non-empty string", () => {
    expect(isNumber("123")).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isNumber({})).toBe(false);
  });
});

describe("@pievy/types: guards/isZero", () => {
  it("should return true for zero", () => {
    expect(isZero(0.0)).toBe(true);
  });
  it("should return false for non-zero", () => {
    expect(isZero(1.0)).toBe(false);
  });
  it("should return false for Infinity", () => {
    expect(isZero(Infinity)).toBe(false);
  });
});
