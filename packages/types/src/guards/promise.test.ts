// oxlint-disable unicorn/no-thenable
import { describe, expect, it } from "vitest";

import { isPromiseLike } from "./promise";

describe("@pievy/types: guards/isPromiseLike", () => {
  it("should return true for a Promise", () => {
    expect(isPromiseLike(Promise.resolve(1))).toBe(true);
  });

  it("should return true for a thenable object", () => {
    expect(isPromiseLike({ then: () => {} })).toBe(true);
  });

  it("should return true for a thenable function", () => {
    const fn = () => {};
    (fn as { then?: () => void }).then = () => {};
    expect(isPromiseLike(fn)).toBe(true);
  });

  it("should return false for a non-thenable object", () => {
    expect(isPromiseLike({})).toBe(false);
  });

  it("should return false for null", () => {
    expect(isPromiseLike(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isPromiseLike(undefined)).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isPromiseLike(42)).toBe(false);
  });

  it("should return false for a string", () => {
    expect(isPromiseLike("string")).toBe(false);
  });

  it("should return false for an array", () => {
    expect(isPromiseLike([])).toBe(false);
  });

  it("should return false when then is not a function", () => {
    expect(isPromiseLike({ then: 42 })).toBe(false);
    expect(isPromiseLike({ then: "fn" })).toBe(false);
  });
});
