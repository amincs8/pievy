import type { AnyFunction } from "@pievy/types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { interval } from "./interval";

describe("@pievy/async: interval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should return an object with start, stop, and pause", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(typeof result.start).toBe("function");
    expect(typeof result.stop).toBe("function");
    expect(typeof result.pause).toBe("function");
  });

  it("should accept an options object", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, { timeout: 100 });

    expect(typeof result.start).toBe("function");
    expect(typeof result.stop).toBe("function");
    expect(typeof result.pause).toBe("function");
  });

  it("should accept handler args via rest parameters", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler as AnyFunction, 100, 1, 2, 3);

    expect(typeof result.start).toBe("function");
    expect(typeof result.stop).toBe("function");
    expect(typeof result.pause).toBe("function");
  });

  it("should allow start to be called", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(() => result.start()).not.toThrow();
  });

  it("should allow stop to be called", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(() => result.stop()).not.toThrow();
  });

  it("should allow pause to be called", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(() => result.pause()).not.toThrow();
  });

  it("should start with immediate option", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, { immediate: true, timeout: 100 });

    expect(typeof result.start).toBe("function");
    expect(typeof result.stop).toBe("function");
    expect(typeof result.pause).toBe("function");
  });

  it("should accept repeatCount option", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, { repeatCount: 3, timeout: 100 });

    expect(typeof result.start).toBe("function");
    expect(typeof result.stop).toBe("function");
    expect(typeof result.pause).toBe("function");
  });

  it("should accept handlerArgs option", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler as AnyFunction, { handlerArgs: [1, 2], timeout: 100 });

    expect(typeof result.start).toBe("function");
    expect(typeof result.stop).toBe("function");
    expect(typeof result.pause).toBe("function");
  });

  it("should allow multiple start/stop cycles", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(() => {
      result.start();
      result.stop();
      result.start();
      result.stop();
    }).toThrow("Cannot start a stopped interval");
  });

  it("should allow pause then start", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(() => {
      result.start();
      result.pause();
      result.start();
    }).not.toThrow();
  });

  it("should not throw when stop is called before start", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(() => result.stop()).not.toThrow();
  });

  it("should not throw when pause is called before start", () => {
    const handler = vi.fn<() => void>();
    const result = interval(handler, 100);

    expect(() => result.pause()).not.toThrow();
  });

  it("should execute immediately by default", () => {
    const handler = vi.fn<() => void>();

    interval(handler, 1000);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should delay the first execution when immediate is false", () => {
    const handler = vi.fn<() => void>();

    interval(handler, {
      immediate: false,
      timeout: 1000,
    });

    expect(handler).not.toHaveBeenCalled();

    vi.advanceTimersByTime(999);
    expect(handler).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should execute repeatedly", () => {
    const handler = vi.fn<() => void>();

    interval(handler, 1000);

    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(handler).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(1000);
    expect(handler).toHaveBeenCalledTimes(3);
  });

  it("should stop after repeatCount executions", () => {
    const handler = vi.fn<() => void>();

    interval(handler, {
      repeatCount: 3,
      timeout: 1000,
    });

    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(3000);

    expect(handler).toHaveBeenCalledTimes(3);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("should stop when handler returns null", () => {
    const handler = vi.fn<() => null>(() => null);

    interval(handler, 1000);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(5000);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should update the next execution delay", () => {
    const handler = vi.fn<() => number>(() => 2000);

    interval(handler, 1000);

    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1999);
    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("should pause execution", () => {
    const handler = vi.fn<() => void>();

    const task = interval(handler, 1000);

    expect(handler).toHaveBeenCalledTimes(1);

    task.pause();

    vi.advanceTimersByTime(5000);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should resume execution after pause", () => {
    const handler = vi.fn<() => void>();

    const task = interval(handler, 1000);

    vi.advanceTimersByTime(400);
    task.pause();

    vi.advanceTimersByTime(2000);

    expect(handler).toHaveBeenCalledTimes(1);

    task.start();

    vi.advanceTimersByTime(599);
    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("should preserve remaining time when paused multiple times", () => {
    const handler = vi.fn<() => void>();

    const task = interval(handler, 1000);

    vi.advanceTimersByTime(200);
    task.pause();

    vi.advanceTimersByTime(1000);
    task.start();

    vi.advanceTimersByTime(300);
    task.pause();

    vi.advanceTimersByTime(1000);
    task.start();

    vi.advanceTimersByTime(499);
    expect(handler).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it("should not execute after stop", () => {
    const handler = vi.fn<() => void>();

    const task = interval(handler, 1000);

    task.stop();

    vi.advanceTimersByTime(5000);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should not allow restarting after stop", () => {
    const task = interval(vi.fn(), 1000);

    task.stop();

    expect(() => task.start()).toThrow("Cannot start a stopped interval");
  });

  it("should ignore repeated pause and stop calls", () => {
    const handler = vi.fn<() => void>();

    const task = interval(handler, 1000);

    expect(() => {
      task.pause();
      task.pause();
      task.stop();
      task.stop();
    }).not.toThrow();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should use handlerArgs from options", () => {
    const handler = vi.fn<() => void>();

    interval(handler, {
      handlerArgs: [10, "test"],
      timeout: 1000,
    } as any);

    expect(handler).toHaveBeenCalledWith(10, "test");
  });

  it("should accept handler arguments in the overload", () => {
    const handler = vi.fn<() => void>();

    (interval as AnyFunction)(handler, 1000, 10, "test");

    expect(handler).toHaveBeenCalledWith(10, "test");
  });

  it("should update handler arguments on start", () => {
    const handler = vi.fn<() => void>();

    const task = interval(handler, {
      handlerArgs: [10, "initial"],
      timeout: 1000,
    } as any);

    task.pause();
    (task.start as AnyFunction)(20, "updated");
    vi.advanceTimersByTime(1000);

    expect(handler).toHaveBeenLastCalledWith(20, "updated");
  });

  it("should throw when timeout is invalid", () => {
    const handler = vi.fn<() => void>();

    expect(() => interval(handler, 0)).toThrow(TypeError);
    expect(() => interval(handler, -1)).toThrow(TypeError);
    expect(() => interval(handler, Infinity)).toThrow(TypeError);
    expect(() => interval(handler, NaN)).toThrow(TypeError);
  });

  it("should throw when repeatCount is invalid", () => {
    const handler = vi.fn<() => void>();

    expect(() =>
      interval(handler, {
        repeatCount: 0,
        timeout: 1000,
      }),
    ).toThrow(TypeError);

    expect(() =>
      interval(handler, {
        repeatCount: 1.5,
        timeout: 1000,
      }),
    ).toThrow(TypeError);
  });
});
