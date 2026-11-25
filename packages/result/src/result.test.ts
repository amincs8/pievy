import { describe, expect, it } from "vitest";

import { resultError, resultOk } from "./result";

describe("@pievy/result: resultOk", () => {
  it("should create a successful result", () => {
    expect(resultOk(42)).toEqual({
      isOk: true,
      value: 42,
    });
  });

  it("should support undefined values", () => {
    expect(resultOk(undefined)).toEqual({
      isOk: true,
      value: undefined,
    });
  });
});

describe("@pievy/result: resultError", () => {
  it("should create a failed result", () => {
    const error = new Error("Failed");

    expect(resultError(error)).toEqual({
      error,
      isOk: false,
    });
  });

  it("should support custom error types", () => {
    const result = resultError(new Error("NOT_FOUND"));

    expect(result.error).toEqual(new Error("NOT_FOUND"));
  });
});
