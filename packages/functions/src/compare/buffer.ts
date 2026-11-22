import { _isEqualBuffer } from "./_internal";

/**
 * Checks whether two values are equal `ArrayBuffer` instances.
 *
 * Returns `true` only when both values are `ArrayBuffer` instances with the same
 * byte length and identical byte contents.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `ArrayBuffer` instances with equal contents.
 * @public
 */
export function isEqualArrayBuffer(left: ArrayBuffer, right: ArrayBuffer): boolean {
  return left instanceof ArrayBuffer && right instanceof ArrayBuffer && _isEqualBuffer(left, right);
}

/**
 * Checks whether two values are equal `SharedArrayBuffer` instances.
 *
 * Returns `true` only when both values are `SharedArrayBuffer` instances with the
 * same byte length and identical byte contents.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `SharedArrayBuffer` instances with equal contents.
 * @public
 */
export function isEqualSharedArrayBuffer(
  left: SharedArrayBuffer,
  right: SharedArrayBuffer,
): boolean {
  return (
    left instanceof SharedArrayBuffer &&
    right instanceof SharedArrayBuffer &&
    _isEqualBuffer(left, right)
  );
}
