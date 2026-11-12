import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  type PlainObject,
} from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback, Grouped } from "../types";

/**
 * Asynchronously groups values by a key resolved from each item.
 *
 * The callback is awaited for each value and the returned key determines the bucket.
 * Iterable inputs receive the value, numeric index, and loop count; plain object
 * inputs receive the value, property key, and loop count.
 *
 * @typeParam T - Type of each grouped value.
 * @param values - Async iterable, iterable, or plain object to group.
 * @param callbackfn - Async function that returns the grouping key for each value.
 * @returns A record whose keys are the resolved group names and whose values are arrays of grouped items.
 *
 * @example
 * ```ts
 * const grouped = await groupByAsync([1, 2, 3], async (value) =>
 *   value % 2 === 0 ? "even" : "odd",
 * );
 * ```
 */
export function groupByAsync<T>(
  values: AsyncIterable<T>,
  callbackfn: AsyncIterableCallback<T, PropertyKey>,
): Promise<Grouped<T>>;
export function groupByAsync<T>(
  values: Iterable<T>,
  callbackfn: AsyncIterableCallback<T, PropertyKey>,
): Promise<Grouped<T>>;
export function groupByAsync<T extends PlainObject>(
  values: T,
  callbackfn: AsyncObjectCallback<T[keyof T], PropertyKey>,
): Promise<Grouped<T>>;

export async function groupByAsync(
  values: unknown,
  callbackfn: Function,
): Promise<Grouped<unknown>> {
  if (!isFunction(callbackfn)) return {};

  const result: Grouped<unknown> = {};
  let loopCount = 0;

  const add = async (value: unknown, index: unknown, lc: unknown): Promise<void> => {
    const key = (await callbackfn(value, index, lc)) as PropertyKey;

    (result[key] ??= []).push(value);
  };

  if (isAsyncIterable(values)) {
    for await (const value of values) {
      await add(value, loopCount, loopCount);
      loopCount++;
    }
  } else if (isIterable(values)) {
    for (const value of values) {
      await add(value, loopCount, loopCount);
      loopCount++;
    }
  } else if (isPlainObject(values)) {
    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

      await add((values as Record<string, unknown>)[key], key, loopCount);
      loopCount++;
    }
  }

  return result;
}
