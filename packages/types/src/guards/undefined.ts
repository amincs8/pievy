/**
 * Checks whether a value is `undefined`.
 *
 * This guard narrows `unknown` values to `undefined`, which is useful
 * for handling optional or missing values safely.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is `undefined`; otherwise `false`.
 *
 * @example
 * ```ts
 * isUndefined(undefined); // true
 * isUndefined({}.key); // true
 *
 * isUndefined(null); // false
 * isUndefined(""); // false
 * isUndefined("value"); // false
 * isUndefined(0); // false
 * isUndefined(123); // false
 * isUndefined({}); // false
 * ```
 * @public
 */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === "undefined";
}
