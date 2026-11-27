import { describe, expect, it } from "vitest";

import { BaseError } from "./base-error";

describe("@pievy/errors: BaseError", () => {
  it("creates an error with message", () => {
    const error = new BaseError("Something went wrong");
    expect(error.message).toBe("Something went wrong");
    expect(error.name).toBe("BaseError");
  });

  it("sets code option", () => {
    const error = new BaseError("Failed", { code: "ERR_FAILED" });
    expect(error.code).toBe("ERR_FAILED");
  });

  it("sets details option", () => {
    const error = new BaseError("Failed", { details: { reason: "timeout" } });
    expect(error.details).toEqual({ reason: "timeout" });
  });

  it("sets expose option", () => {
    const error = new BaseError("Failed", { expose: true });
    expect(error.expose).toBe(true);
  });

  it("defaults expose to false", () => {
    const error = new BaseError("Failed");
    expect(error.expose).toBe(false);
  });

  it("sets cause option", () => {
    const cause = new Error("Original");
    const error = new BaseError("Failed", { cause });
    expect(error.cause).toBe(cause);
  });

  it("sets timestamp automatically", () => {
    const before = Date.now();
    const error = new BaseError("Failed");
    const after = Date.now();
    expect(error.timestamp).toBeGreaterThanOrEqual(before);
    expect(error.timestamp).toBeLessThanOrEqual(after);
  });

  it("maintains prototype chain", () => {
    const error = new BaseError("Failed");
    expect(error instanceof Error).toBe(true);
    expect(error instanceof BaseError).toBe(true);
  });

  it("supports subclassing with custom name", () => {
    class CustomError extends BaseError<"CUSTOM"> {
      constructor(message: string) {
        super(message, { code: "CUSTOM" });
      }
    }

    const error = new CustomError("Custom failed");
    expect(error.name).toBe("CustomError");
    expect(error.code).toBe("CUSTOM");
  });

  it("supports numeric code", () => {
    const error = new BaseError("Failed", { code: 500 });
    expect(error.code).toBe(500);
  });

  it("supports symbol code", () => {
    const sym = Symbol("error");
    const error = new BaseError("Failed", { code: sym });
    expect(error.code).toBe(sym);
  });
});