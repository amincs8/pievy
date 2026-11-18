import { describe, expect, it, vi } from "vitest";

import { tapAsync } from "./tap-async";

describe("@pievy/functions: tapAsync", () => {
  it("should return value unchanged", async () => {
    const check = tapAsync(vi.fn());
    expect(await check("value")).toBe("value");
    expect(await check(42)).toBe(42);
  });

  it("should invoke fn with value", async () => {
    const fn = vi.fn<(v: number) => Promise<void>>();
    const check = tapAsync(fn);
    await check(5);
    expect(fn).toHaveBeenCalledWith(5);
  });

  it("should await fn before returning", async () => {
    let resolved = false;
    const fn = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      resolved = true;
    };
    const check = tapAsync(fn);

    const promise = check("value");
    expect(resolved).toBe(false);
    await promise;
    expect(resolved).toBe(true);
  });

  it("should ignore fn resolved value", async () => {
    const check = tapAsync(async () => "ignored");
    expect(await check("kept")).toBe("kept");
  });

  it("should preserve object reference", async () => {
    const obj = { x: 1 };
    const check = tapAsync(vi.fn<(v: typeof obj) => Promise<void>>());
    expect(await check(obj)).toBe(obj);
  });
});
