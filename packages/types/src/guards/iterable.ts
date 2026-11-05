import { isNil } from "./nil";

/**
 * Checks whether a value is an iterable.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` implements the synchronous iterator protocol; otherwise `false`.
 *
 * @example
 * ```ts
 * isIterable([1, 2, 3]); // true
 * isIterable("abc"); // true
 * isIterable({}); // false
 * ```
 * @public
 */
export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  return !isNil(value) && typeof (value as any)[Symbol.iterator] === "function";
}

/**
 * Checks whether a value is an async iterable.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` implements the async iterator protocol; otherwise `false`.
 *
 * @example
 * ```ts
 * isAsyncIterable((async function* () {})()); // true
 * isAsyncIterable([1, 2, 3]); // false
 * ```
 * @public
 */
export function isAsyncIterable<T = unknown>(value: unknown): value is AsyncIterable<T> {
  return !isNil(value) && typeof (value as any)[Symbol.asyncIterator] === "function";
}
