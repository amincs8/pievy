type NumBigint = number | bigint;
/**
 * Checks whether `value` is between `min` and `max` (inclusive).
 *
 * @param value - The value to check.
 * @param min - The lower bound (inclusive).
 * @param max - The upper bound (inclusive).
 * @returns `true` when `min <= value <= max`, otherwise `false`.
 * @public
 */
export function isBetween(value: NumBigint, min: NumBigint, max: NumBigint) {
  return value >= min && value <= max;
}
