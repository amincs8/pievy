import { describe, expect, it } from "vitest";

import { isNil } from "./nil";

describe("@pievy/types: guards/isNil", () => {
  it("should return true for null value", () => {
    expect(isNil(null)).toBe(true);
  });

  it("should return true for a key=null", () => {
    expect(isNil({ key: null }.key)).toBe(true);
  });

  it("should return true for an undefined value", () => {
    expect(isNil(undefined)).toBe(true);
  });

  it("should return true for a non-exists key", () => {
    expect(isNil(({ key: "value" } as any).key2)).toBe(true);
  });

  it("should return true for a key=undefined", () => {
    expect(isNil({ key: undefined }.key)).toBe(true);
  });

  it("should return false for a string", () => {
    expect(isNil("")).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isNil(0)).toBe(false);
  });

  it("should return false for a object", () => {
    expect(isNil({})).toBe(false);
  });
});
