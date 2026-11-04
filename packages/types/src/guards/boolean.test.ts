import { describe, expect, it } from "vitest";

import { isBoolean, isFalse, isTrue } from "./boolean";

describe("@pievy/types: guards/isBoolean", () => {
  it("should return true for true", () => {
    expect(isBoolean(true)).toBe(true);
  });
  it("should return true for false", () => {
    expect(isBoolean(false)).toBe(true);
  });
  it("should return true for a logic condition", () => {
    const value1 = 3;
    const value2 = 5;
    expect(isBoolean(value1 > 5 && value2 < 6)).toBe(true);
  });
  it("should return true for a compare condition", () => {
    const value1 = 3;
    expect(isBoolean(value1 > 5)).toBe(true);
  });

  it("should return false for null", () => {
    expect(isBoolean(null)).toBe(false);
  });
  it("should return false for undefined", () => {
    expect(isBoolean(undefined)).toBe(false);
  });
  it("should return false for an empty string", () => {
    expect(isBoolean("")).toBe(false);
  });
  it("should return false for a non-empty string", () => {
    expect(isBoolean("true")).toBe(false);
  });
  it("should return false for zero", () => {
    expect(isBoolean(0)).toBe(false);
  });
  it("should return false for a non-empty number", () => {
    expect(isBoolean(Math.random())).toBe(false);
  });
});

describe("@pievy/types: guards/isTrue", () => {
  it("should return true for true", () => {
    expect(isTrue(true)).toBe(true);
  });
  it("should return false for false", () => {
    expect(isTrue(false)).toBe(false);
  });
});
describe("@pievy/types: guards/isFalse", () => {
  it("should return false for false", () => {
    expect(isFalse(false)).toBe(true);
  });
  it("should return false for true", () => {
    expect(isFalse(true)).toBe(false);
  });
});
