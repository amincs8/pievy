import { describe, expect, it } from "vitest";

import { isUndefined } from "./undefined";

describe("@pievy/types: guards/isUndefined", () => {
  it("should return true for undefined value", () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  it("should return true for a non-exists key", () => {
    expect(isUndefined(({ key: "value" } as any).key2)).toBe(true);
  });

  it("should return true for a key=undefined", () => {
    expect(isUndefined({ key: undefined }.key)).toBe(true);
  });

  it("should return false for null value", () => {
    expect(isUndefined(null)).toBe(false);
  });

  it("should return false for a string", () => {
    expect(isUndefined("")).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isUndefined(0)).toBe(false);
  });
});
