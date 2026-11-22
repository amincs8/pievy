import { isFunction } from "./function";
import { isObject } from "./object";

/**
 * Checks whether `value` is promise-like (has a callable `then` method).
 *
 * @param value - The value to check.
 * @returns `true` when `value` is an object or function with a callable `then` property.
 * @public
 */
export function isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
  return (isObject(value) || isFunction(value)) && isFunction((value as { then?: unknown }).then);
}
