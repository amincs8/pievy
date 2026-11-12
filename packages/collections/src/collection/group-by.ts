import { isFunction, isIterable, isPlainObject, type PlainObject } from "@pievy/types";

import type { Grouped, IterableCallback, ObjectCallback } from "../types";

/**
 * Groups values by a key resolved from each item.
 *
 * The callback is invoked for each value and the returned key determines the bucket.
 * Iterable inputs receive the value, numeric index, and loop count; plain object
 * inputs receive the value, property key, and loop count.
 *
 * @typeParam T - Type of each grouped value.
 * @param values - Iterable or plain object to group.
 * @param callbackfn - Function that returns the grouping key for each value.
 * @returns A record whose keys are the resolved group names and whose values are arrays of grouped items.
 *
 * @example
 * ```ts
 * const groups = groupBy([1, 2, 3], (value) => (value % 2 === 0 ? "even" : "odd"));
 * ```
 */
export function groupBy<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T, PropertyKey>,
): Grouped<T>;
export function groupBy<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T], PropertyKey>,
): Grouped<T>;

export function groupBy(values: unknown, callbackfn: Function): Grouped<unknown> {
  if (!isFunction(callbackfn)) return {};

  const result: Grouped<unknown> = {};
  let loopCount = 0;

  const add = (value: unknown, index: unknown, lc: unknown): void => {
    const key = callbackfn(value, index, lc) as PropertyKey;

    (result[key] ??= []).push(value);
  };

  if (isIterable(values)) {
    for (const value of values) {
      add(value, loopCount, loopCount);
      loopCount++;
    }
  } else if (isPlainObject(values)) {
    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

      add((values as Record<string, unknown>)[key], key, loopCount);
      loopCount++;
    }
  }

  return result;
}
