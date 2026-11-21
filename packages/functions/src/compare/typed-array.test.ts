import { describe, expect, it } from "vitest";

import {
  isEqualBigInt64Array,
  isEqualBigUint64Array,
  isEqualFloat32Array,
  isEqualFloat64Array,
  isEqualInt16Array,
  isEqualInt32Array,
  isEqualInt8Array,
  isEqualUint16Array,
  isEqualUint32Array,
  isEqualUint8Array,
  isEqualUint8ClampedArray,
} from "./typed-array";

describe("@pievy/functions: typed arrays", () => {
  it("isEqualInt8Array", () => {
    expect(isEqualInt8Array(new Int8Array([1, 2, 3]), new Int8Array([1, 2, 3]))).toBe(true);
    expect(isEqualInt8Array(new Int8Array([1, 2, 3]), new Int8Array([1, 2, 4]))).toBe(false);
    expect(isEqualInt8Array(new Int8Array([1, 2]), new Int8Array([1, 2, 3]))).toBe(false);
    expect(isEqualInt8Array(new Int8Array([1]), new Uint8Array([1]) as any)).toBe(false);
  });

  it("isEqualUint8Array", () => {
    expect(isEqualUint8Array(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(isEqualUint8Array(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
  });

  it("isEqualUint8ClampedArray", () => {
    expect(
      isEqualUint8ClampedArray(new Uint8ClampedArray([1, 2, 3]), new Uint8ClampedArray([1, 2, 3])),
    ).toBe(true);
    expect(
      isEqualUint8ClampedArray(new Uint8ClampedArray([1, 2, 3]), new Uint8ClampedArray([1, 2, 4])),
    ).toBe(false);
  });

  it("isEqualInt16Array", () => {
    expect(isEqualInt16Array(new Int16Array([1, 2, 3]), new Int16Array([1, 2, 3]))).toBe(true);
    expect(isEqualInt16Array(new Int16Array([1, 2, 3]), new Int16Array([1, 2, 4]))).toBe(false);
  });

  it("isEqualUint16Array", () => {
    expect(isEqualUint16Array(new Uint16Array([1, 2, 3]), new Uint16Array([1, 2, 3]))).toBe(true);
    expect(isEqualUint16Array(new Uint16Array([1, 2, 3]), new Uint16Array([1, 2, 4]))).toBe(false);
  });

  it("isEqualInt32Array", () => {
    expect(isEqualInt32Array(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 3]))).toBe(true);
    expect(isEqualInt32Array(new Int32Array([1, 2, 3]), new Int32Array([1, 2, 4]))).toBe(false);
  });

  it("isEqualUint32Array", () => {
    expect(isEqualUint32Array(new Uint32Array([1, 2, 3]), new Uint32Array([1, 2, 3]))).toBe(true);
    expect(isEqualUint32Array(new Uint32Array([1, 2, 3]), new Uint32Array([1, 2, 4]))).toBe(false);
  });

  it("isEqualFloat32Array", () => {
    expect(isEqualFloat32Array(new Float32Array([1.5, 2.5]), new Float32Array([1.5, 2.5]))).toBe(
      true,
    );
    expect(isEqualFloat32Array(new Float32Array([1.5, 2.5]), new Float32Array([1.5, 2.6]))).toBe(
      false,
    );
  });

  it("isEqualFloat64Array", () => {
    expect(isEqualFloat64Array(new Float64Array([1.5, 2.5]), new Float64Array([1.5, 2.5]))).toBe(
      true,
    );
    expect(isEqualFloat64Array(new Float64Array([1.5, 2.5]), new Float64Array([1.5, 2.6]))).toBe(
      false,
    );
  });

  it("isEqualBigInt64Array", () => {
    expect(
      isEqualBigInt64Array(new BigInt64Array([1n, 2n, 3n]), new BigInt64Array([1n, 2n, 3n])),
    ).toBe(true);
    expect(
      isEqualBigInt64Array(new BigInt64Array([1n, 2n, 3n]), new BigInt64Array([1n, 2n, 4n])),
    ).toBe(false);
  });

  it("isEqualBigUint64Array", () => {
    expect(
      isEqualBigUint64Array(new BigUint64Array([1n, 2n, 3n]), new BigUint64Array([1n, 2n, 3n])),
    ).toBe(true);
    expect(
      isEqualBigUint64Array(new BigUint64Array([1n, 2n, 3n]), new BigUint64Array([1n, 2n, 4n])),
    ).toBe(false);
  });
});
