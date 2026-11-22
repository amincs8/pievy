/**
 * Compares two `Date` instances by their timestamp.
 *
 * @param left - The first date.
 * @param right - The second date.
 * @returns `true` when both have the same timestamp.
 * @internal
 */
export function _isEqualDate(left: Date, right: Date): boolean {
  return left.getTime() === right.getTime();
}

/**
 * Compares two `RegExp` instances by source, flags, and `lastIndex`.
 *
 * @param left - The first regular expression.
 * @param right - The second regular expression.
 * @returns `true` when both have the same source, flags, and `lastIndex`.
 * @internal
 */
export function _isEqualRegExp(left: RegExp, right: RegExp): boolean {
  return (
    left.source === right.source && left.flags === right.flags && left.lastIndex === right.lastIndex
  );
}

/**
 * Compares two typed arrays element-by-element.
 *
 * @param left - The first typed array.
 * @param right - The second typed array.
 * @returns `true` when both have the same length and equal elements.
 * @internal
 */
export function _isEqualTypedArray<T extends { length: number; [index: number]: number | bigint }>(
  left: T,
  right: T,
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; ++index) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

/**
 * Compares two `ArrayBuffer` or `SharedArrayBuffer` instances byte-by-byte.
 *
 * @param left - The first buffer.
 * @param right - The second buffer.
 * @returns `true` when both have the same byte length and contents.
 * @internal
 */
export function _isEqualBuffer<T extends ArrayBuffer | SharedArrayBuffer>(left: T, right: T) {
  return _isEqualTypedArray(new Uint8Array(left), new Uint8Array(right));
}
