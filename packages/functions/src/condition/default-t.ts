import { isNil } from "@pievy/types";

/**
 * Returns `value` when it is not `null` or `undefined`, otherwise `defaultValue`.
 *
 * @param value - The value to check.
 * @param defaultValue - The value returned when `value` is `null` or `undefined`.
 * @returns `value` if it is not nil, otherwise `defaultValue`.
 * @public
 */
export function defaultTo<T, D>(value: T, defaultValue: D): NonNullable<T> | D {
  return isNil(value) ? defaultValue : (value as NonNullable<T>);
}
