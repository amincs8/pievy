import { describe, expect, it } from "vitest";

import { isError } from "./is-error";

describe("@pievy/errors: utils/isError", () => {
  it("returns true for Error instances", () => {
    expect(isError(new Error())).toBe(true);
    expect(isError(new TypeError())).toBe(true);
    expect(isError(new RangeError())).toBe(true);
  });

  it("returns true for custom Error subclasses", () => {
    class CustomError extends Error {}
    expect(isError(new CustomError())).toBe(true);
  });

  it("returns false for non-Error objects", () => {
    expect(isError({ message: "oops" })).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
    expect(isError("error")).toBe(false);
    expect(isError(123)).toBe(false);
    expect(isError([])).toBe(false);
    expect(isError({})).toBe(false);
  });

  it("returns false for plain objects with name/message", () => {
    expect(isError({ message: "oops", name: "Error" })).toBe(false);
  });
});
