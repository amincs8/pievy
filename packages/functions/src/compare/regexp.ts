/**
 * Checks whether two values are equal `RegExp` instances.
 *
 * Returns `true` only when both values are `RegExp` instances with the same
 * source, flags, and `lastIndex`.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `RegExp` instances with equal source, flags, and `lastIndex`.
 * @public
 */
export function _isEqualRegExp(left: RegExp, right: RegExp): boolean {
  return (
    left.source === right.source && left.flags === right.flags && left.lastIndex === right.lastIndex
  );
}

export function isEqualRegExp(left: RegExp, right: RegExp): boolean {
  return left instanceof RegExp && right instanceof RegExp && _isEqualRegExp(left, right);
}
