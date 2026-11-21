import { _isEqualTypedArray } from "./_internal";

/**
 * Checks whether two values are equal `Int8Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Int8Array` instances with equal elements.
 * @public
 */
export function isEqualInt8Array(left: Int8Array, right: Int8Array): boolean {
  return left instanceof Int8Array && right instanceof Int8Array && _isEqualTypedArray(left, right);
}

/**
 * Checks whether two values are equal `Uint8Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Uint8Array` instances with equal elements.
 * @public
 */
export function isEqualUint8Array(left: Uint8Array, right: Uint8Array): boolean {
  return (
    left instanceof Uint8Array && right instanceof Uint8Array && _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `Uint8ClampedArray` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Uint8ClampedArray` instances with equal elements.
 * @public
 */
export function isEqualUint8ClampedArray(
  left: Uint8ClampedArray,
  right: Uint8ClampedArray,
): boolean {
  return (
    left instanceof Uint8ClampedArray &&
    right instanceof Uint8ClampedArray &&
    _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `Int16Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Int16Array` instances with equal elements.
 * @public
 */
export function isEqualInt16Array(left: Int16Array, right: Int16Array): boolean {
  return (
    left instanceof Int16Array && right instanceof Int16Array && _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `Uint16Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Uint16Array` instances with equal elements.
 * @public
 */
export function isEqualUint16Array(left: Uint16Array, right: Uint16Array): boolean {
  return (
    left instanceof Uint16Array && right instanceof Uint16Array && _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `Int32Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Int32Array` instances with equal elements.
 * @public
 */
export function isEqualInt32Array(left: Int32Array, right: Int32Array): boolean {
  return (
    left instanceof Int32Array && right instanceof Int32Array && _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `Uint32Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Uint32Array` instances with equal elements.
 * @public
 */
export function isEqualUint32Array(left: Uint32Array, right: Uint32Array): boolean {
  return (
    left instanceof Uint32Array && right instanceof Uint32Array && _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `Float32Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Float32Array` instances with equal elements.
 * @public
 */
export function isEqualFloat32Array(left: Float32Array, right: Float32Array): boolean {
  return (
    left instanceof Float32Array && right instanceof Float32Array && _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `Float64Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Float64Array` instances with equal elements.
 * @public
 */
export function isEqualFloat64Array(left: Float64Array, right: Float64Array): boolean {
  return (
    left instanceof Float64Array && right instanceof Float64Array && _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `BigInt64Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `BigInt64Array` instances with equal elements.
 * @public
 */
export function isEqualBigInt64Array(left: BigInt64Array, right: BigInt64Array): boolean {
  return (
    left instanceof BigInt64Array &&
    right instanceof BigInt64Array &&
    _isEqualTypedArray(left, right)
  );
}

/**
 * Checks whether two values are equal `BigUint64Array` instances.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `BigUint64Array` instances with equal elements.
 * @public
 */
export function isEqualBigUint64Array(left: BigUint64Array, right: BigUint64Array): boolean {
  return (
    left instanceof BigUint64Array &&
    right instanceof BigUint64Array &&
    _isEqualTypedArray(left, right)
  );
}
