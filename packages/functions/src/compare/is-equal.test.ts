import { describe, expect, it } from "vitest";

import { isEqual } from "./is-equal";

describe("@pievy/functions: isEqual", () => {
  it("should return true for identical primitives", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual("a", "a")).toBe(true);
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
    expect(isEqual(undefined, undefined)).toBe(true);
  });

  it("should return false for different primitives", () => {
    expect(isEqual(1, 2)).toBe(false);
    expect(isEqual("a", "b")).toBe(false);
    expect(isEqual(true, false)).toBe(false);
  });

  it("should distinguish null and undefined", () => {
    expect(isEqual(null, undefined)).toBe(false);
  });

  it("should return true for equal arrays", () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([], [])).toBe(true);
  });

  it("should return false for arrays with different length or values", () => {
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isEqual([1, 2], [1, 3])).toBe(false);
  });

  it("should return true for equal objects", () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    expect(isEqual({}, {})).toBe(true);
  });

  it("should return false for objects with different keys or values", () => {
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
    expect(isEqual({ a: 1 }, {})).toBe(false);
  });

  it("should handle nested objects and arrays", () => {
    expect(isEqual({ a: [1, 2, { b: 3 }] }, { a: [1, 2, { b: 3 }] })).toBe(true);
    expect(isEqual({ a: [1, 2, { b: 3 }] }, { a: [1, 2, { b: 4 }] })).toBe(false);
  });

  it("should return false for different types", () => {
    expect(isEqual(1, "1")).toBe(false);
    expect(isEqual([], {})).toBe(false);
    expect(isEqual(null, {})).toBe(false);
  });

  it("should handle NaN", () => {
    expect(isEqual(NaN, NaN)).toBe(true);
  });

  it("should return true for equal Dates", () => {
    expect(isEqual(new Date("2020-01-01"), new Date("2020-01-01"))).toBe(true);
    expect(isEqual(new Date(0), new Date(0))).toBe(true);
  });

  it("should return false for different Dates", () => {
    expect(isEqual(new Date("2020-01-01"), new Date("2020-01-02"))).toBe(false);
  });

  it("should return true for equal RegExps", () => {
    expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
    expect(isEqual(/abc/, /abc/)).toBe(true);
  });

  it("should return false for different RegExps", () => {
    expect(isEqual(/abc/g, /abc/i)).toBe(false);
    expect(isEqual(/abc/, /def/)).toBe(false);
  });

  it("should return true for equal Maps", () => {
    expect(
      isEqual(
        new Map([
          ["a", 1],
          ["b", 2],
        ]),
        new Map([
          ["a", 1],
          ["b", 2],
        ]),
      ),
    ).toBe(true);
    expect(isEqual(new Map(), new Map())).toBe(true);
  });

  it("should return false for different Maps", () => {
    expect(isEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false);
    expect(isEqual(new Map([["a", 1]]), new Map([["b", 1]]))).toBe(false);
    expect(isEqual(new Map([["a", 1]]), new Map())).toBe(false);
  });

  it("should return true for equal Sets", () => {
    expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
    expect(isEqual(new Set(), new Set())).toBe(true);
  });

  it("should return false for different Sets", () => {
    expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
    expect(isEqual(new Set([1, 2]), new Set([1]))).toBe(false);
  });

  it("should return true for equal ArrayBuffers", () => {
    const a = new ArrayBuffer(4);
    const b = new ArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 4]);
    expect(isEqual(a, b)).toBe(true);
  });

  it("should return false for different ArrayBuffers", () => {
    const a = new ArrayBuffer(4);
    const b = new SharedArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 5]);

    expect(isEqual(a, b)).toBe(false);
    expect(isEqual(new ArrayBuffer(4), new ArrayBuffer(8))).toBe(false);
  });

  it("should return true for equal SharedArrayBuffers", () => {
    const a = new SharedArrayBuffer(4);
    const b = new SharedArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 4]);
    expect(isEqual(a, b)).toBe(true);
  });

  it("should return false for different SharedArrayBuffers", () => {
    const a = new SharedArrayBuffer(4);
    const b = new SharedArrayBuffer(4);
    new Uint8Array(a).set([1, 2, 3, 4]);
    new Uint8Array(b).set([1, 2, 3, 5]);
    expect(isEqual(a, b)).toBe(false);
  });

  it("should return true for equal DataViews", () => {
    const buf = new ArrayBuffer(8);
    const a = new DataView(buf, 0, 4);
    const b = new DataView(buf, 0, 4);
    new Uint8Array(buf).set([1, 2, 3, 4]);
    expect(isEqual(a, b)).toBe(true);
  });

  it("should return false for different DataViews", () => {
    const buf1 = new ArrayBuffer(8);
    const buf2 = new ArrayBuffer(8);
    new Uint8Array(buf1).set([1, 2, 3, 4]);
    new Uint8Array(buf2).set([1, 2, 3, 5]);
    expect(isEqual(new DataView(buf1, 0, 4), new DataView(buf2, 0, 4))).toBe(false);
    expect(isEqual(new DataView(buf1, 0, 4), new DataView(buf1, 2, 4))).toBe(false);
  });

  it("should return true for equal TypedArrays", () => {
    expect(isEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(isEqual(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 3]))).toBe(true);
    expect(isEqual(new Float64Array([1.5, 2.5]), new Float64Array([1.5, 2.5]))).toBe(true);
    expect(isEqual(new Uint16Array([1, 2, 3]), new Uint16Array([1, 2, 3]))).toBe(true);
  });

  it("should return false for different TypedArrays", () => {
    expect(isEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
    expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
    expect(isEqual(new Uint8Array([1, 2, 3]), new Int32Array([1, 2, 3]))).toBe(false);
  });

  it("should return false for values with different prototypes", () => {
    class A {}
    class B {}
    expect(isEqual(new A(), new B())).toBe(false);
  });

  it("should handle Map with object keys by reference", () => {
    const key = { id: 1 };
    expect(isEqual(new Map([[key, "v"]]), new Map([[key, "v"]]))).toBe(true);
    expect(isEqual(new Map([[key, "v"]]), new Map([[{ id: 1 }, "vv"]]))).toBe(false);
  });

  it("should handle Set with object elements deeply", () => {
    expect(isEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))).toBe(true);
    expect(isEqual(new Set([{ a: 1 }]), new Set([{ a: 2 }]))).toBe(false);
  });
});
