import { describe, expect, it } from "vitest";

import { constant, constantAsync } from "./constant";

describe("@pievy/functions: constant", () => {
  it("should return a function that returns the value", () => {
    const fn = constant(42);
    expect(fn()).toBe(42);
    expect(fn()).toBe(42);
  });

  it("should preserve object reference", () => {
    const obj = { a: 1 };
    expect(constant(obj)()).toBe(obj);
  });
});

describe("@pievy/functions: constantAsync", () => {
  it("should return a function that resolves to the value", async () => {
    const fn = constantAsync(42);
    await expect(fn()).resolves.toBe(42);
    await expect(fn()).resolves.toBe(42);
  });

  it("should preserve object reference", async () => {
    const obj = { a: 1 };
    await expect(constantAsync(obj)()).resolves.toBe(obj);
  });
});
