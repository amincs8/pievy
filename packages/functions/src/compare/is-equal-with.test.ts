import { describe, expect, it, vi } from "vitest";

import { isEqualWith } from "./is-equal-with";

describe("@pievy/functions: isEqualWith", () => {
  it("should use comparator result when defined", () => {
    const comparator = vi.fn(() => true);
    expect(isEqualWith(1, 2, comparator)).toBe(true);
    expect(comparator).toHaveBeenCalledWith(1, 2);
  });

  it("should return false when comparator returns false", () => {
    expect(isEqualWith(1, 1, () => false)).toBe(false);
  });

  it("should delegate to isEqual when comparator returns undefined", () => {
    expect(isEqualWith(1, 1, () => undefined)).toBe(true);
    expect(isEqualWith(1, 2, () => undefined)).toBe(false);
  });

  it("should delegate for objects when comparator returns undefined", () => {
    expect(isEqualWith({ a: 1 }, { a: 1 }, () => undefined)).toBe(true);
    expect(isEqualWith({ a: 1 }, { a: 2 }, () => undefined)).toBe(false);
  });

  it("should allow comparator to override deep equality", () => {
    // deep equal would be true, but comparator says false
    expect(isEqualWith({ a: 1 }, { a: 1 }, () => false)).toBe(false);
    // deep equal would be false, but comparator says true
    expect(isEqualWith({ a: 1 }, { a: 2 }, () => true)).toBe(true);
  });

  it("should pass both values to comparator", () => {
    const comparator = vi.fn(() => undefined);
    isEqualWith("left", "right", comparator);
    expect(comparator).toHaveBeenCalledWith("left", "right");
  });
});
