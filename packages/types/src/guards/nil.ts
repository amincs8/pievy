import { isNull } from "./null";
import { isUndefined } from "./undefined";

/**
 * Checks whether a value is `null` or `undefined`.
 *
 * This is useful for representing missing or intentionally empty values.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is `null` or `undefined`; otherwise `false`.
 *
 * @example
 * ```ts
 * isNil(null); // true
 * isNil(undefined); // true
 * isNil(0); // false
 * isNil("value"); // false
 * ```
 * @public
 */
export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}
