import { _isEqualDate } from "./_internal";

/**
 * Checks whether two values are equal `Date` instances.
 *
 * Returns `true` only when both values are `Date` instances with the same
 * timestamp.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both are `Date` instances with equal timestamps.
 * @public
 */
export function isEqualDate(left: Date, right: Date): boolean {
  return left instanceof Date && right instanceof Date && _isEqualDate(left, right);
}
