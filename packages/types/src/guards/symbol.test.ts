import { describe, expect, it } from "vitest";

import { isSymbol } from "./symbol";

describe("@pievy/types: guards/isNull", () => {
  it("should return true for a symbol", () => {
    expect(isSymbol(Symbol())).toBe(true);
  });
  it("should return true for a named symbol", () => {
    expect(isSymbol(Symbol("named"))).toBe(true);
  });

  it("should return false for null", () => {
    expect(isSymbol(null)).toBe(false);
  });
  it("should return false for an object", () => {
    expect(isSymbol({})).toBe(false);
  });
  it("should return false for a string", () => {
    expect(isSymbol("string")).toBe(false);
  });
});
