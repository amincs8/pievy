import { describe, expect, it } from "vitest";

import { isBetween } from "./is-between";

describe("@pievy/functions: isBetween", () => {
  it("should return true when value is within range", () => {
    expect(isBetween(5, 1, 10)).toBe(true);
    expect(isBetween(1, 1, 10)).toBe(true);
    expect(isBetween(10, 1, 10)).toBe(true);
  });

  it("should return false when value is outside range", () => {
    expect(isBetween(0, 1, 10)).toBe(false);
    expect(isBetween(11, 1, 10)).toBe(false);
  });

  it("should work with bigint", () => {
    expect(isBetween(5n, 1n, 10n)).toBe(true);
    expect(isBetween(0n, 1n, 10n)).toBe(false);
    expect(isBetween(10n, 1n, 10n)).toBe(true);
  });

  it("should handle negative ranges", () => {
    expect(isBetween(-5, -10, -1)).toBe(true);
    expect(isBetween(-11, -10, -1n)).toBe(false);
    expect(isBetween(0, -10, -1)).toBe(false);
  });

  it("should handle min equal to max", () => {
    expect(isBetween(5, 5, 5)).toBe(true);
    expect(isBetween(4, 5, 5)).toBe(false);
  });
});
