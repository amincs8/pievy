import { isFunction, isIterable, isPlainObject, type PlainObject } from "@pievy/types";

import type { ReducerIterableCallback, ReducerObjectCallback } from "../types";

/**
 * Reduces an iterable or plain object to a single accumulated value.
 *
 * The reducer receives the accumulated result, the current value, its index/key,
 * and the zero-based loop count. For plain objects, the callback receives each
 * own enumerable property key. Invalid inputs return the original accumulator.
 *
 * @typeParam T - Type of each iterated value.
 * @typeParam R - Accumulated result type.
 * @param values - Iterable or plain object to reduce.
 * @param reducer - Function used to combine the existing result with the next value.
 * @param accumulator - Initial value passed to the reducer.
 * @returns The final accumulated value.
 *
 * @example
 * ```ts
 * reduce([1, 2, 3], (sum, value) => sum + value, 0); // 6
 * reduce({ first: 10, second: 20 }, (sum, value) => sum + value, 0); // 30
 * ```
 */
export function reduce<T, R = unknown>(
  values: Iterable<T>,
  reducer: ReducerIterableCallback<T, R>,
  accumulator: R,
): R;
export function reduce<T extends PlainObject, R = unknown>(
  values: T,
  reducer: ReducerObjectCallback<T[keyof T], R>,
  accumulator: R,
): R;

export function reduce(values: unknown, reducer: Function, accumulator: unknown): unknown {
  if (!isFunction(reducer)) return accumulator;

  let loopCount = 0;
  let result = accumulator;

  if (isIterable(values)) {
    for (const value of values) {
      result = reducer(result, value, loopCount, loopCount);
      loopCount++;
    }
  } else if (isPlainObject(values)) {
    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

      result = reducer(result, (values as Record<string, unknown>)[key], key, loopCount);
      loopCount++;
    }
  }

  return result;
}
