import { describe, expect, it } from "vitest";

import { isBigint } from "./bigint";

describe("@pievy/types: guards/isBigint", () => {
  it("should return true for 0n", () => {
    expect(isBigint(0n)).toBe(true);
  });
  it("should return true for a non-zero bigint", () => {
    expect(isBigint(1234567n)).toBe(true);
  });
  it("should return false for 0", () => {
    expect(isBigint(0)).toBe(false);
  });
  it("should return false for regular number", () => {
    expect(isBigint(Math.floor(Math.random() * 1000))).toBe(false);
  });
  it("should return false for Infinity", () => {
    expect(isBigint(Infinity)).toBe(false);
  });
  it("should return false for NaN", () => {
    expect(isBigint(NaN)).toBe(false);
  });

  it("should return false for null", () => {
    expect(isBigint(null)).toBe(false);
  });
  it("should return false for undefined", () => {
    expect(isBigint(undefined)).toBe(false);
  });
  it("should return false for true", () => {
    expect(isBigint(true)).toBe(false);
  });
  it("should return false for false", () => {
    expect(isBigint(false)).toBe(false);
  });
  it("should return false for an empty string", () => {
    expect(isBigint("")).toBe(false);
  });
  it("should return false for a non-empty string", () => {
    expect(isBigint("123")).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isBigint({})).toBe(false);
  });
});
