import type { PlainObject } from "../definitions";

/**
 * Checks whether a value is an object.
 *
 * This guard excludes `null` values and narrows to an object type.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a non-null object; otherwise `false`.
 *
 * @example
 * ```ts
 * isObject({}); // true
 * isObject(null); // false
 * isObject("test"); // false
 * ```
 * @public
 */
export function isObject<T = unknown>(value: T): value is T & object {
  return typeof value === "object" && value !== null;
}

/**
 * Checks whether a value is a plain object.
 *
 * A plain object is an object whose prototype is exactly `Object.prototype`.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a plain object; otherwise `false`.
 *
 * @example
 * ```ts
 * isPlainObject({}); // true
 * isPlainObject(new Date()); // false
 * isPlainObject([]); // false
 * ```
 * @public
 */
export function isPlainObject(value: unknown): value is PlainObject {
  return (
    value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype
  );
}
