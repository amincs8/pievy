import { describe, expect, it } from "vitest";

import { isObject, isPlainObject } from "./object";

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

describe("@pievy/types: guards/isPlainObject", () => {
  it("should return true for a empty object", () => {
    expect(isPlainObject({})).toBe(true);
  });

  it("should return true for a plain object", () => {
    expect(isPlainObject({ key: "value" })).toBe(true);
  });

  it("should return false for a date object", () => {
    expect(isPlainObject(new Date())).toBe(false);
  });

  it("should return false for an array", () => {
    expect(isPlainObject([])).toBe(false);
  });

  it("should return false for a string object", () => {
    expect(isPlainObject(new String(""))).toBe(false);
  });

  it("should return false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("should return false for a string", () => {
    expect(isPlainObject("string")).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isPlainObject(123)).toBe(false);
  });
});
