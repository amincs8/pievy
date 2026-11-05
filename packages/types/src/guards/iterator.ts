import { isFunction } from "./function";
import { isObject } from "./object";

/**
 * Checks whether a value is an iterator.
 *
 * An iterator is an object or function exposing a `next` method.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` behaves like an iterator; otherwise `false`.
 *
 * @example
 * ```ts
 * isIterator([1, 2, 3][Symbol.iterator]()); // true
 * isIterator({ next() {} }); // true
 * isIterator({}); // false
 * ```
 * @public
 */
export function isIterator<T = unknown>(value: unknown): value is Iterator<T> {
  return (isObject(value) || isFunction(value)) && isFunction((value as Iterator<T>).next);
}
