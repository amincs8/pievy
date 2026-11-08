import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  type PlainObject,
} from "@pievy/types";

import { STOP, type LoopControl } from "../consts";
import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";

/**
 * Awaits a callback for each value in an async iterable, iterable, or plain object.
 *
 * Callbacks run sequentially. Return {@link STOP} to stop iteration. Iterable
 * callbacks receive the value, numeric index, and loop count; object callbacks
 * receive the value, string key, and loop count.
 *
 * @param values - Async iterable, iterable, or plain object to traverse.
 * @param callbackfn - Asynchronous function invoked for each value.
 * @returns A promise that resolves when iteration completes.
 *
 * @example
 * ```ts
 * await forEachAsync(items, async (item, index) => {
 *   await save(item);
 *   console.log(index);
 * });
 * ```
 */
export function forEachAsync<T>(
  values: AsyncIterable<T>,
  callbackfn: AsyncIterableCallback<T, LoopControl>,
): Promise<void>;
export function forEachAsync<T>(
  values: Iterable<T>,
  callbackfn: AsyncIterableCallback<T, LoopControl>,
): Promise<void>;
export function forEachAsync<T extends PlainObject>(
  values: T,
  callbackfn: AsyncObjectCallback<T[keyof T], LoopControl>,
): Promise<void>;

export async function forEachAsync(values: unknown, callbackfn: Function): Promise<void> {
  if (!isFunction(callbackfn)) return;

  let loopCount = 0;

  if (isAsyncIterable(values)) {
    for await (const value of values) {
      if ((await callbackfn(value, loopCount, loopCount)) === STOP) break;
      loopCount++;
    }
  } else if (isIterable(values)) {
    for (const value of values) {
      if ((await callbackfn(value, loopCount, loopCount)) === STOP) break;
      loopCount++;
    }
  } else if (isPlainObject(values)) {
    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

      const value = (values as Record<string, unknown>)[key];
      if ((await callbackfn(value, key, loopCount)) === STOP) break;
      loopCount++;
    }
  }
}
