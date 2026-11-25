import { describe, expect, it, vi } from "vitest";

import { attemptAsync } from "./attempt-async";

describe("@pievy/result: attemptAsync", () => {
  it("should return Ok when callback resolves", async () => {
    await expect(attemptAsync(() => Promise.resolve(42))).resolves.toEqual({
      isOk: true,
      value: 42,
    });
  });

  it("should return Err when callback rejects", async () => {
    const error = new Error("Failed");

    await expect(attemptAsync(() => Promise.reject(error))).resolves.toEqual({
      error,
      isOk: false,
    });
  });

  it("should catch synchronous exceptions", async () => {
    const error = new Error("Sync failure");

    await expect(
      attemptAsync(() => {
        throw error;
      }),
    ).resolves.toEqual({
      error,
      isOk: false,
    });
  });

  it("should support synchronous return values", async () => {
    await expect(attemptAsync(() => 42)).resolves.toEqual({
      isOk: true,
      value: 42,
    });
  });

  it("should execute callback only once", async () => {
    const callback = vi.fn<() => Promise<number>>(() => Promise.resolve(42));

    await attemptAsync(callback);

    expect(callback).toHaveBeenCalledOnce();
  });
});
