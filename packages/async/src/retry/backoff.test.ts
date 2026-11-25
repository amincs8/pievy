import { describe, expect, it } from "vitest";

import { backoff } from "./backoff";

describe("@pievy/async: backoff", () => {
  it("should compute fixed delay", () => {
    expect(backoff(1, { delay: 100, strategy: "fixed" })).toBe(100);
    expect(backoff(5, { delay: 100, strategy: "fixed" })).toBe(100);
  });

  it("should compute linear delay", () => {
    expect(backoff(1, { delay: 100, strategy: "linear" })).toBe(100);
    expect(backoff(2, { delay: 100, strategy: "linear" })).toBe(200);
    expect(backoff(3, { delay: 100, strategy: "linear" })).toBe(300);
  });

  it("should compute exponential delay", () => {
    expect(backoff(1, { delay: 100, factor: 2, strategy: "exponential" })).toBe(100);
    expect(backoff(2, { delay: 100, factor: 2, strategy: "exponential" })).toBe(200);
    expect(backoff(3, { delay: 100, factor: 2, strategy: "exponential" })).toBe(400);
  });

  it("should default to exponential strategy", () => {
    expect(backoff(1, { delay: 100 })).toBe(100);
    expect(backoff(2, { delay: 100 })).toBe(200);
  });

  it("should cap at maxDelay", () => {
    expect(backoff(10, { delay: 100, factor: 2, maxDelay: 500, strategy: "exponential" })).toBe(
      500,
    );
  });

  it("should apply jitter when enabled", () => {
    const result = backoff(1, { delay: 100, jitter: true, strategy: "fixed" });
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it("should throw for invalid attempt", () => {
    expect(() => backoff(0)).toThrow(TypeError);
    expect(() => backoff(-1)).toThrow(TypeError);
    expect(() => backoff(1.5)).toThrow(TypeError);
  });

  it("should throw for invalid delay", () => {
    expect(() => backoff(1, { delay: 0 })).toThrow(TypeError);
    expect(() => backoff(1, { delay: -1 })).toThrow(TypeError);
    expect(() => backoff(1, { delay: NaN })).toThrow(TypeError);
  });

  it("should throw for invalid factor", () => {
    expect(() => backoff(1, { factor: 0 })).toThrow(TypeError);
    expect(() => backoff(1, { factor: -1 })).toThrow(TypeError);
    expect(() => backoff(1, { factor: NaN })).toThrow(TypeError);
  });

  it("should throw for invalid maxDelay", () => {
    expect(() => backoff(1, { maxDelay: -1 })).toThrow(TypeError);
    expect(() => backoff(1, { maxDelay: NaN })).toThrow(TypeError);
  });

  it("should throw for invalid strategy", () => {
    expect(() => backoff(1, { strategy: "foo" as any })).toThrow(TypeError);
  });

  it("should use default delay of 1000", () => {
    expect(backoff(1)).toBe(1000);
  });

  it("should use default factor of 2", () => {
    expect(backoff(2, { delay: 100 })).toBe(200);
  });

  it("should allow maxDelay of Infinity", () => {
    expect(
      backoff(10, { delay: 100, factor: 2, maxDelay: Infinity, strategy: "exponential" }),
    ).toBe(51200);
  });
});
