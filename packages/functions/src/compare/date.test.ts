import { describe, expect, it } from "vitest";

import { isEqualDate } from "./date";

describe("@pievy/functions: isEqualDate", () => {
  it("should return true for equal dates", () => {
    expect(isEqualDate(new Date("2020-01-01"), new Date("2020-01-01"))).toBe(true);
    expect(isEqualDate(new Date(0), new Date(0))).toBe(true);
    expect(isEqualDate(new Date(12345), new Date(12345))).toBe(true);
  });

  it("should return false for different dates", () => {
    expect(isEqualDate(new Date("2020-01-01"), new Date("2020-01-02"))).toBe(false);
  });

  it("should return false when either value is not a Date", () => {
    expect(isEqualDate("2020-01-01" as any, new Date("2020-01-01"))).toBe(false);
    expect(isEqualDate(new Date("2020-01-01"), "2020-01-01" as any)).toBe(false);
    expect(isEqualDate(123 as any, 123 as any)).toBe(false);
  });

  it("should treat equal timestamps as equal", () => {
    const a = new Date(1000);
    const b = new Date(1000);
    expect(isEqualDate(a, b)).toBe(true);
  });
});
