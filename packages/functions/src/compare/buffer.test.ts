import { describe, expect, it } from "vitest";

import { isEqualArrayBuffer, isEqualSharedArrayBuffer } from "./buffer";

describe("@pievy/functions: isEqualArrayBuffer", () => {
  it("should return true for equal ArrayBuffers", () => {
    const a = new ArrayBuffer(4);
    const b = new ArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 4]);
    expect(isEqualArrayBuffer(a, b)).toBe(true);
  });

  it("should return false for different ArrayBuffers", () => {
    const a = new ArrayBuffer(4);
    const b = new ArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 5]);
    expect(isEqualArrayBuffer(a, b)).toBe(false);
  });

  it("should return false for different lengths", () => {
    expect(isEqualArrayBuffer(new ArrayBuffer(4), new ArrayBuffer(8))).toBe(false);
  });

  it("should return false when either is not an ArrayBuffer", () => {
    expect(isEqualArrayBuffer(new ArrayBuffer(4), "x" as any)).toBe(false);
    expect(isEqualArrayBuffer("x" as any, new ArrayBuffer(4))).toBe(false);
  });

  it("should handle empty buffers", () => {
    expect(isEqualArrayBuffer(new ArrayBuffer(0), new ArrayBuffer(0))).toBe(true);
  });
});

describe("@pievy/functions: isEqualSharedArrayBuffer", () => {
  it("should return true for equal SharedArrayBuffers", () => {
    const a = new SharedArrayBuffer(4);
    const b = new SharedArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 4]);
    expect(isEqualSharedArrayBuffer(a, b)).toBe(true);
  });

  it("should return false for different SharedArrayBuffers", () => {
    const a = new SharedArrayBuffer(4);
    const b = new SharedArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 5]);
    expect(isEqualSharedArrayBuffer(a, b)).toBe(false);
  });

  it("should return false for different lengths", () => {
    expect(isEqualSharedArrayBuffer(new SharedArrayBuffer(4), new SharedArrayBuffer(8))).toBe(false);
  });

  it("should return false when either is not a SharedArrayBuffer", () => {
    expect(isEqualSharedArrayBuffer(new SharedArrayBuffer(4), "x" as any)).toBe(false);
    expect(isEqualSharedArrayBuffer("x" as any, new SharedArrayBuffer(4))).toBe(false);
  });

  it("should handle empty buffers", () => {
    expect(isEqualSharedArrayBuffer(new SharedArrayBuffer(0), new SharedArrayBuffer(0))).toBe(true);
  });
});
