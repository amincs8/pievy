import type { AnyFunction, AnyFunctionAsync } from "../definitions";

/**
 * Checks whether a value is a function.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a function; otherwise `false`.
 *
 * @example
 * ```ts
 * isFunction(() => "hi"); // true
 * isFunction({}); // false
 * ```
 * @public
 */
export function isFunction<T extends AnyFunction = AnyFunction>(value: unknown): value is T {
  return typeof value === "function";
}

/**
 * Checks whether a value is an async function.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is an async function; otherwise `false`.
 *
 * @example
 * ```ts
 * isFunctionAsync(async () => "hi"); // true
 * isFunctionAsync(() => "hi"); // false
 * ```
 * @public
 */
export function isFunctionAsync<T extends AnyFunctionAsync = AnyFunctionAsync>(
  value: unknown,
): value is T {
  return isFunction(value) && value.constructor.name === "AsyncFunction";
}
