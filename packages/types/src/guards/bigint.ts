/**
 * Checks whether a value is a bigint.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a bigint; otherwise `false`.
 *
 * @example
 * ```ts
 * isBigint(1n); // true
 * isBigint(1); // false
 * isBigint("1"); // false
 * ```
 * @public
 */
export function isBigint(value: unknown): value is bigint {
  return typeof value === "bigint";
}
