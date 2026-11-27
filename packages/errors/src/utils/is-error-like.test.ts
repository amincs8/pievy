import { describe, expect, it } from "vitest";

import { isErrorLike } from "./is-error-like";

describe("@pievy/errors: isErrorLike", () => {
  it("returns true for Error instances", () => {
    expect(isErrorLike(new Error())).toBe(true);
    expect(isErrorLike(new TypeError())).toBe(true);
  });

  it("returns true for objects with string message", () => {
    expect(isErrorLike({ message: "hello" })).toBe(true);
    expect(isErrorLike({ message: "hello", name: "Custom" })).toBe(true);
    expect(isErrorLike({ message: "hello", stack: "trace" })).toBe(true);
    expect(isErrorLike({ cause: "root", message: "hello" })).toBe(true);
  });

  it("returns false for objects without message", () => {
    expect(isErrorLike({})).toBe(false);
    expect(isErrorLike({ name: "Error" })).toBe(false);
    expect(isErrorLike({ stack: "trace" })).toBe(false);
  });

  it("returns false for non-string message", () => {
    expect(isErrorLike({ message: 123 })).toBe(false);
    expect(isErrorLike({ message: null })).toBe(false);
    expect(isErrorLike({ message: { nested: "obj" } })).toBe(false);
  });

  it("returns false for primitives", () => {
    expect(isErrorLike("error message")).toBe(false);
    expect(isErrorLike(42)).toBe(false);
    expect(isErrorLike(true)).toBe(false);
    expect(isErrorLike(null)).toBe(false);
    expect(isErrorLike(undefined)).toBe(false);
  });

  it("returns false for arrays", () => {
    expect(isErrorLike([])).toBe(false);
    expect(isErrorLike(["message"])).toBe(false);
  });
});