import { describe, expect, it, vi } from "vitest";

import { resultError, resultOk } from "./result";
import { unwrap, unwrapOr, unwrapOrElse } from "./unwrap";

describe("@pievy/result: unwrap", () => {
  it("should return the Ok value", () => {
    expect(unwrap(resultOk(123))).toBe(123);
  });

  it("should throw the Err error", () => {
    const error = new Error("failed");

    expect(() => unwrap(resultError(error))).toThrow(error);
  });

  it("should throw non-Error values", () => {
    expect(() => unwrap(resultError("failed"))).toThrow("failed");
  });

  it("should support undefined as a successful value", () => {
    expect(unwrap(resultOk(undefined))).toBeUndefined();
  });
});

describe("@pievy/result: unwrapOr", () => {
  it("should return the Ok value", () => {
    expect(unwrapOr(resultOk(123), 0)).toBe(123);
  });

  it("should return the default value for Err", () => {
    expect(unwrapOr(resultError("failed"), 0)).toBe(0);
  });

  it("should support different value types", () => {
    expect(unwrapOr(resultOk(123), "default")).toBe(123);
    expect(unwrapOr(resultError("failed"), "default")).toBe("default");
  });

  it("should support undefined as a default value", () => {
    expect(unwrapOr(resultError("failed"), undefined)).toBeUndefined();
  });

  it("should not evaluate a function passed as the default value", () => {
    const defaultValue = vi.fn<() => number>(() => 0);

    expect(unwrapOr(resultOk(123), defaultValue)).toBe(123);
    expect(defaultValue).not.toHaveBeenCalled();
  });
});

describe("@pievy/result: unwrapOrElse", () => {
  it("should return the Ok value", () => {
    const handler = vi.fn<() => number>(() => 0);

    expect(unwrapOrElse(resultOk(123), handler)).toBe(123);
    expect(handler).not.toHaveBeenCalled();
  });

  it("should return the handler result for Err", () => {
    expect(unwrapOrElse(resultError("failed"), (error) => error.message.length)).toBe(6);
  });

  it("should pass the error to the handler", () => {
    const handler = vi.fn<() => number>(() => 0);

    unwrapOrElse(resultError("failed"), handler);

    expect(handler).toHaveBeenCalledWith(new Error("failed"));
  });

  it("should propagate handler errors", () => {
    const error = new Error("handler failed");

    expect(() =>
      unwrapOrElse(resultError("failed"), () => {
        throw error;
      }),
    ).toThrow(error);
  });
});
