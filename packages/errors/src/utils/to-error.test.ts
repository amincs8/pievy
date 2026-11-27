import { describe, expect, it } from "vitest";

import { toError } from "./to-error";

describe("@pievy/errors: toError", () => {
  it("returns Error instances unchanged", () => {
    const err = new Error("original");
    expect(toError(err)).toBe(err);
  });

  it("returns custom Error subclasses unchanged", () => {
    const err = new TypeError("type error");
    expect(toError(err)).toBe(err);
  });

  it("creates Error from string", () => {
    const err = toError("something went wrong");
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("something went wrong");
  });

  it("creates Error from object with message property", () => {
    const err = toError({ code: 404, message: "custom message" });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("custom message");
    expect(err.cause).toEqual({ code: 404, message: "custom message" });
  });

  it("creates Error from object without message property", () => {
    const err = toError({ code: 500 });
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("An unknown error occurred");
    expect(err.cause).toEqual({ code: 500 });
  });

  it("handles null", () => {
    const err = toError(null);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("An unknown error occurred");
    expect(err.cause).toBeNull();
  });

  it("handles undefined", () => {
    const err = toError(undefined);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("An unknown error occurred");
    expect(err.cause).toBeUndefined();
  });

  it("handles primitives", () => {
    const err = toError(42);
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("An unknown error occurred");
    expect(err.cause).toBe(42);
  });
});
