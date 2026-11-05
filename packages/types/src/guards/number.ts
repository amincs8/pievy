/**
 * Checks whether a value is a number.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a JavaScript number; otherwise `false`.
 *
 * @example
 * ```ts
 * isNumber(42); // true
 * isNumber("42"); // false
 * isNumber(NaN); // true
 * ```
 * @public
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

/**
 * Checks whether a value is zero.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is the number `0`; otherwise `false`.
 *
 * @example
 * ```ts
 * isZero(0); // true
 * isZero(1); // false
 * ```
 * @public
 */
export function isZero(value: unknown): value is 0 {
  return isNumber(value) && Number.isFinite(value) && value === 0;
}

/**
 * Checks whether a value is positive.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is greater than `0`; otherwise `false`.
 *
 * @example
 * ```ts
 * isPositive(3); // true
 * isPositive(0); // false
 * isPositive(-1); // false
 * ```
 * @public
 */
export function isPositive(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value) && value > 0;
}

/**
 * Checks whether a value is negative.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is less than `0`; otherwise `false`.
 *
 * @example
 * ```ts
 * isNegative(-3); // true
 * isNegative(0); // false
 * isNegative(1); // false
 * ```
 * @public
 */
export function isNegative(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value) && value < 0;
}
