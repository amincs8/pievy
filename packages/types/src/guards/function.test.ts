import { describe, expect, it } from "vitest";

import { isFunction } from "./function";

describe("@pievy/types: guards/isFunction", () => {
  it("should return true for a void function", () => {
    expect(isFunction(function () {})).toBe(true);
  });
  it("should return true for a function", () => {
    expect(isFunction((v: unknown) => v)).toBe(true);
  });
  it("should return true for a function of a class", () => {
    expect(isFunction(String.prototype.charAt)).toBe(true);
  });
  it("should return true for an async function", () => {
    expect(isFunction(async function () {})).toBe(true);
  });
  it("should return true for an arrow async function", () => {
    expect(isFunction(async () => {})).toBe(true);
  });

  it("should return true for an arrow function", () => {
    expect(isFunction(() => {})).toBe(true);
  });
  it("should return true for a constructor", () => {
    expect(isFunction(Date)).toBe(true);
  });

  it("should return false for an object", () => {
    expect(isFunction(new Date())).toBe(false);
  });
  it("should return false for a string", () => {
    expect(isFunction("")).toBe(false);
  });
});
