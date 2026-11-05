/**
 * Checks whether a value is a boolean.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a boolean; otherwise `false`.
 *
 * @example
 * ```ts
 * isBoolean(true); // true
 * isBoolean(false); // true
 * isBoolean(0); // false
 * ```
 * @public
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/**
 * Checks whether a value is the boolean `true`.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is exactly `true`; otherwise `false`.
 *
 * @example
 * ```ts
 * isTrue(true); // true
 * isTrue(false); // false
 * ```
 * @public
 */
export function isTrue(value: unknown): value is true {
  return isBoolean(value) && value;
}

/**
 * Checks whether a value is the boolean `false`.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is exactly `false`; otherwise `false`.
 *
 * @example
 * ```ts
 * isFalse(false); // true
 * isFalse(true); // false
 * ```
 * @public
 */
export function isFalse(value: unknown): value is false {
  return isBoolean(value) && !value;
}
