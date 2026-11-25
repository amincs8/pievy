import { describe, expect, it, vi } from "vitest";

import { attempt } from "./attempt";

describe("@pievy/result: attempt", () => {
  it("should return Ok when callback succeeds", () => {
    expect(attempt(() => 42)).toEqual({
      isOk: true,
      value: 42,
    });
  });

  it("should return Err when callback throws", () => {
    const error = new TypeError("Failed");

    expect(
      attempt(() => {
        throw error;
      }),
    ).toEqual({
      error,
      isOk: false,
    });
  });

  it("should support undefined return values", () => {
    expect(attempt(() => undefined)).toEqual({
      isOk: true,
      value: undefined,
    });
  });

  it("should execute callback only once", () => {
    const callback = vi.fn<() => number>(() => 42);

    attempt(callback);

    expect(callback).toHaveBeenCalledOnce();
  });
});
