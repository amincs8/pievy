/**
 * Checks whether a value is a string.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a string; otherwise `false`.
 *
 * @example
 * ```ts
 * isString("hello"); // true
 * isString(123); // false
 * isString(undefined); // false
 * ```
 * @public
 */
export function isString(value: unknown): value is string {
  return typeof value === "string";
}

/**
 * Checks whether a value is an empty string.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a string with zero length; otherwise `false`.
 *
 * @example
 * ```ts
 * isEmptyString(""); // true
 * isEmptyString("hello"); // false
 * ```
 * @public
 */
export function isEmptyString(value: unknown): value is string {
  return isString(value) && value.length === 0;
}

/**
 * Checks whether a value is a non-empty string.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a string with at least one character; otherwise `false`.
 *
 * @example
 * ```ts
 * isNonEmptyString("hello"); // true
 * isNonEmptyString(""); // false
 * ```
 * @public
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}
