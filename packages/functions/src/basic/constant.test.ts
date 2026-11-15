import { describe, expect, it } from "vitest";

import { constant } from "./constant";

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
