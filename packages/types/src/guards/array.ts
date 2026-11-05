/**
 * Checks whether a value is an array.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is an array; otherwise `false`.
 *
 * @example
 * ```ts
 * isArray([1, 2, 3]); // true
 * isArray({ length: 2 }); // false
 * ```
 * @public
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Checks whether a value is an empty array.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is an empty array; otherwise `false`.
 *
 * @example
 * ```ts
 * isArrayEmpty([]); // true
 * isArrayEmpty([1]); // false
 * ```
 * @public
 */
export function isArrayEmpty(value: unknown): value is [] {
  return Array.isArray(value) && value.length === 0;
}

/**
 * Checks whether a value is a non-empty array.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is an array with at least one element; otherwise `false`.
 *
 * @example
 * ```ts
 * isArrayNonEmpty([1, 2]); // true
 * isArrayNonEmpty([]); // false
 * ```
 * @public
 */
export function isArrayNonEmpty<T = unknown>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}
