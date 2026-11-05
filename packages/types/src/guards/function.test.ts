import { describe, expect, it } from "vitest";

import { isFunction, isFunctionAsync } from "./function";

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

describe("@pievy/types: guards/isFunctionAsync", () => {
  it("should return true for an async function", () => {
    expect(isFunctionAsync(async function () {})).toBe(true);
  });

  it("should return true for an arrow async function", () => {
    expect(isFunctionAsync(async () => {})).toBe(true);
  });

  it("should return false for a void function", () => {
    expect(isFunctionAsync(function () {})).toBe(false);
  });
  it("should return false for a function", () => {
    expect(isFunctionAsync((v: unknown) => v)).toBe(false);
  });
  it("should return false for a function of a class", () => {
    expect(isFunctionAsync(String.prototype.charAt)).toBe(false);
  });

  it("should return false for an arrow function", () => {
    expect(isFunctionAsync(() => {})).toBe(false);
  });
  it("should return false for a constructor", () => {
    expect(isFunctionAsync(Date)).toBe(false);
  });

  it("should return false for an object", () => {
    expect(isFunctionAsync(new Date())).toBe(false);
  });
  it("should return false for a string", () => {
    expect(isFunctionAsync("")).toBe(false);
  });
});
