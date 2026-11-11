import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Counts the values in an async iterable, iterable, or plain object that
 * satisfy an asynchronous predicate.
 *
 * Callback calls are awaited sequentially. The callback receives each value,
 * its index or object key, and a zero-based iteration count. By default, only
 * an explicit `true` result is counted; with `strict: false`, results are
 * compared to `true` using loose equality. Invalid inputs return `0`.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Async predicate called for each value.
 * @param strict - When `true`, only a literal `true` result is counted; defaults to `true`.
 * @returns A promise that resolves to the number of values that satisfy the predicate.
 *
 * @example
 * ```ts
 * await countAsync([1, 2, 3, 4], async (value) => value % 2 === 0); // 2
 * await countAsync({ first: 1, second: 2 }, async (value) => value > 1); // 1
 * ```
 */
export function countAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<number>;
export function countAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<number>;
export function countAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  strict?: boolean,
): Promise<number>;

export async function countAsync(
  values: unknown,
  predicateFn: Function,
  strict = true,
): Promise<number> {
  const { isInputValid, matchedCount } = await _predicateAsync({
    predicateFn,
    stop: {
      minMatches: Infinity,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid ? matchedCount : 0;
}
