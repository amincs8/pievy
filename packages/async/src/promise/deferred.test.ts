import { describe, expect, it } from "vitest";

import { deferred } from "./deferred";

describe("@pievy/async: promise/deferred", () => {
  it("should resolve with the given value", async () => {
    const d = deferred<number>();

    d.resolve(42);

    await expect(d.promise).resolves.toBe(42);
  });

  it("should reject with the given reason", async () => {
    const d = deferred<number>();

    d.reject(new Error("boom"));

    await expect(d.promise).rejects.toThrow("boom");
  });

  it("should default to void", async () => {
    const d = deferred();

    d.resolve();

    await expect(d.promise).resolves.toBeUndefined();
  });

  it("should return the same promise reference", () => {
    const d = deferred<number>();
    expect(d.promise).toBe(d.promise);
  });
});
