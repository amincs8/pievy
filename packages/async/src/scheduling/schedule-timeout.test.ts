import { describe, expect, it, vi } from "vitest";

import { scheduleTimeout } from "./schedule-timeout";

describe("@pievy/async: scheduleTimeout", () => {
  it("should return a cancel function", () => {
    const cancel = scheduleTimeout(() => {}, 10);

    expect(typeof cancel).toBe("function");
    cancel();
  });

  it("should invoke callback after delay", async () => {
    const fn = vi.fn();
    scheduleTimeout(fn, 20);

    await new Promise((r) => setTimeout(r, 50));

    expect(fn).toHaveBeenCalled();
  });

  it("should forward arguments to callback", async () => {
    const fn = vi.fn();
    scheduleTimeout(fn, 20, 1, 2, 3);

    await new Promise((r) => setTimeout(r, 50));

    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });

  it("should cancel scheduled invocation", async () => {
    const fn = vi.fn();
    const cancel = scheduleTimeout(fn, 50);

    cancel();

    await new Promise((r) => setTimeout(r, 80));

    expect(fn).not.toHaveBeenCalled();
  });

  it("should invoke callback with default delay of 0", async () => {
    const fn = vi.fn();
    scheduleTimeout(fn);

    await new Promise((r) => setTimeout(r, 20));

    expect(fn).toHaveBeenCalled();
  });

  it("should not throw when cancel is called multiple times", () => {
    const cancel = scheduleTimeout(() => {}, 100);

    expect(() => {
      cancel();
      cancel();
    }).not.toThrow();
  });
});
