import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Tests whether exactly one value in an async iterable, iterable, or plain
 * object satisfies an asynchronous predicate.
 *
 * Callback calls are awaited sequentially, and iteration stops as soon as a
 * second matching value is found. By default, only an explicit `true` result
 * counts as a match; with `strict: false`, results are compared to `true` using
 * loose equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Async predicate called with each value, its index or key, and the loop count.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns A promise that resolves to `true` if exactly one value passes; otherwise `false`.
 *
 * @example
 * ```ts
 * await oneAsync([1, 2, 3], async (value) => value === 2); // true
 * await oneAsync({ first: 1, second: 2 }, async (value) => value > 0); // false
 * ```
 */
export function oneAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function oneAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function oneAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  strict?: boolean,
): Promise<boolean>;

export async function oneAsync(
  values: unknown,
  predicateFn: Function,
  strict = true,
): Promise<boolean> {
  const { isInputValid, returnValue, matchedCount } = await _predicateAsync({
    predicateFn,
    stop: {
      minMatches: 2,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid === true && !returnValue! && matchedCount === 1;
}
