import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Tests whether exactly `matches` values in an async iterable, iterable, or
 * plain object satisfy an asynchronous predicate.
 *
 * Callback calls are awaited sequentially, and iteration stops as soon as the
 * number of matching values exceeds `matches`. By default, only an explicit
 * `true` result counts as a match; with `strict: false`, results are compared
 * to `true` using loose equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Async predicate called with each value, its index or key, and the loop count.
 * @param matches - Exact number of values that must pass; must be a non-negative integer.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns A promise that resolves to `true` if exactly `matches` values pass; otherwise `false`.
 *
 * @example
 * ```ts
 * await exactlyAsync([1, 2, 3, 4], async (value) => value % 2 === 0, 2); // true
 * await exactlyAsync({ first: 1, second: 2 }, async (value) => value > 1, 1); // true
 * ```
 */
export function exactlyAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  matches: number,
  strict?: boolean,
): Promise<boolean>;
export function exactlyAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  matches: number,

  strict?: boolean,
): Promise<boolean>;
export function exactlyAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  matches: number,

  strict?: boolean,
): Promise<boolean>;

export async function exactlyAsync(
  values: unknown,
  predicateFn: Function,
  matches: number,
  strict = true,
): Promise<boolean> {
  const { isInputValid, returnValue, matchedCount } = await _predicateAsync({
    predicateFn,
    stop: {
      minMatches: matches + 1,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid === true && !returnValue! && matches === matchedCount;
}
