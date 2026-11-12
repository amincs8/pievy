import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  type PlainObject,
} from "@pievy/types";

import type { AsyncReducerIterableCallback, AsyncReducerObjectCallback } from "../types";

/**
 * Asynchronously reduces an async iterable, iterable, or plain object to one value.
 *
 * Reducer callbacks are awaited sequentially. For iterable inputs, the callback
 * receives the accumulated result, the current value, numeric index, and loop
 * count. For plain objects, it receives the accumulated result, property value,
 * property key, and loop count. Invalid inputs return the provided accumulator.
 *
 * @typeParam T - Type of each iterated value.
 * @typeParam R - Accumulated result type.
 * @param values - Async iterable, iterable, or plain object to reduce.
 * @param callbackfn - Async reducer invoked for each value.
 * @param accumulator - Initial accumulated value.
 * @returns A promise for the final accumulated value.
 *
 * @example
 * ```ts
 * const total = await reduceAsync([1, 2, 3], async (sum, value) => sum + value, 0);
 * ```
 */
export function reduceAsync<T, R = unknown>(
  values: AsyncIterable<T>,
  callbackfn: AsyncReducerIterableCallback<T, R>,
  accumulator: R,
): Promise<R>;
export function reduceAsync<T, R = unknown>(
  values: Iterable<T>,
  callbackfn: AsyncReducerIterableCallback<T, R>,
  accumulator: R,
): Promise<R>;
export function reduceAsync<T extends PlainObject, R = unknown>(
  values: T,
  callbackfn: AsyncReducerObjectCallback<T[keyof T], R>,
  accumulator: R,
): Promise<R>;

export async function reduceAsync(
  values: unknown,
  callbackfn: Function,
  accumulator: unknown,
): Promise<unknown> {
  if (!isFunction(callbackfn)) return accumulator;

  let loopCount = 0;
  let result = accumulator;

  if (isAsyncIterable(values)) {
    for await (const value of values) {
      result = await callbackfn(result, value, loopCount, loopCount);
      loopCount++;
    }
  } else if (isIterable(values)) {
    for (const value of values) {
      result = await callbackfn(result, value, loopCount, loopCount);
      loopCount++;
    }
  } else if (isPlainObject(values)) {
    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

      result = await callbackfn(result, (values as Record<string, unknown>)[key], key, loopCount);
      loopCount++;
    }
  }

  return result;
}
