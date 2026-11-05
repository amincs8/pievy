/**
 * Checks whether a value is `null`.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is `null`; otherwise `false`.
 *
 * @example
 * ```ts
 * isNull(null); // true
 * isNull(undefined); // false
 * isNull(""); // false
 * ```
 * @public
 */
export function isNull(value: unknown): value is null {
  return value === null;
}
