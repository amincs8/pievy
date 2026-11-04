import { describe, expect, it } from "vitest";

import { isNull } from "./null";

describe("@pievy/types: guards/isNull", () => {
  it("should return true for null value", () => {
    expect(isNull(null)).toBe(true);
  });

  it("should return true for a key=null", () => {
    expect(isNull({ key: null }.key)).toBe(true);
  });

  it("should return false for an undefined value", () => {
    expect(isNull(undefined)).toBe(false);
  });

  it("should return false for a non-exists key", () => {
    expect(isNull(({ key: "value" } as any).key2)).toBe(false);
  });

  it("should return flase for a key=undefined", () => {
    expect(isNull({ key: undefined }.key)).toBe(false);
  });

  it("should return false for a string", () => {
    expect(isNull("")).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isNull(0)).toBe(false);
  });

  it("should return false for a object", () => {
    expect(isNull({})).toBe(false);
  });
});
