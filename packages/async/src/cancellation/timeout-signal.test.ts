import { describe, expect, it, vi } from "vitest";

import { timeoutSignal } from "./timeout-signal";

describe("@pievy/async: timeoutSignal", () => {
  it("throws for non-positive timeout", () => {
    expect(() => timeoutSignal(0)).toThrow(TypeError);
    expect(() => timeoutSignal(-1)).toThrow(TypeError);
    expect(() => timeoutSignal(NaN)).toThrow(TypeError);
  });

  it("is not aborted initially", () => {
    const signal = timeoutSignal(1000);
    expect(signal.aborted).toBe(false);
  });

  it("aborts after timeout with TimeoutError", async () => {
    vi.useFakeTimers();
    const signal = timeoutSignal(50);
    let aborted = false;
    signal.addEventListener("abort", () => {
      aborted = true;
    });
    vi.advanceTimersByTime(50);
    expect(aborted).toBe(true);
    expect(signal.reason?.name).toBe("TimeoutError");
    vi.useRealTimers();
  });

  it("uses custom reason", async () => {
    vi.useFakeTimers();
    const reason = new Error("custom");
    const signal = timeoutSignal(50, { reason });
    vi.advanceTimersByTime(50);
    expect(signal.reason).toBe(reason);
    vi.useRealTimers();
  });

  it("aborts immediately if parent signal already aborted", () => {
    const controller = new AbortController();
    controller.abort(new Error("parent"));
    const signal = timeoutSignal(1000, { signal: controller.signal });
    expect(signal.aborted).toBe(true);
    expect(signal.reason).toEqual(new Error("parent"));
  });

  it("aborts when parent signal aborts", () => {
    const controller = new AbortController();
    const signal = timeoutSignal(1000, { signal: controller.signal });
    controller.abort(new Error("parent-abort"));
    expect(signal.aborted).toBe(true);
    expect(signal.reason).toEqual(new Error("parent-abort"));
  });
});
