import { describe, expect, it } from "vitest";

import { getErrorMessage } from "./get-error-message";

describe("@pievy/errors: getErrorMessage", () => {
  it("returns Error message", () => {
    expect(getErrorMessage(new Error("error message"))).toBe("error message");
  });

  it("returns string directly", () => {
    expect(getErrorMessage("just a string")).toBe("just a string");
  });

  it("returns message from object with message property", () => {
    expect(getErrorMessage({ message: "object message" })).toBe("object message");
  });

  it("returns String(value) for objects without message", () => {
    expect(getErrorMessage({ code: 404 })).toBe("[object Object]");
  });

  it("handles null", () => {
    expect(getErrorMessage(null)).toBe("null");
  });

  it("handles undefined", () => {
    expect(getErrorMessage(undefined)).toBe("undefined");
  });

  it("handles numbers", () => {
    expect(getErrorMessage(42)).toBe("42");
  });

  it("handles arrays", () => {
    expect(getErrorMessage([1, 2, 3])).toBe("1,2,3");
  });

  it("ignores non-string message property", () => {
    expect(getErrorMessage({ message: 123 })).toBe("[object Object]");
  });
});