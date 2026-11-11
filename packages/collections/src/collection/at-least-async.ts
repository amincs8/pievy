import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Tests whether at least `minMatches` values in an async iterable, iterable, or
 * plain object satisfy an asynchronous predicate.
 *
 * Callback calls are awaited sequentially, and iteration stops as soon as the
 * required number of values passes. By default, only an explicit `true` result
 * counts as a match; with `strict: false`, results are compared to `true` using
 * loose equality. A zero threshold returns `true` for valid inputs without
 * calling the predicate.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Async predicate called with each value, its index or key, and the loop count.
 * @param minMatches - Minimum number of values that must pass; must be a non-negative integer.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns A promise that resolves to `true` if at least `minMatches` values pass; otherwise `false`.
 *
 * @example
 * ```ts
 * await atLeastAsync([1, 2, 3, 4], async (value) => value % 2 === 0, 2); // true
 * await atLeastAsync({ first: 1, second: 2 }, async (value) => value > 1, 1); // true
 * ```
 */
export function atLeastAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  minMatches: number,
  strict?: boolean,
): Promise<boolean>;
export function atLeastAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  minMatches: number,

  strict?: boolean,
): Promise<boolean>;
export function atLeastAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  minMatches: number,

  strict?: boolean,
): Promise<boolean>;

export async function atLeastAsync(
  values: unknown,
  predicateFn: Function,
  minMatches: number,
  strict = true,
): Promise<boolean> {
  const { isInputValid, returnValue } = await _predicateAsync({
    predicateFn,
    stop: {
      minMatches,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid === true && returnValue!;
}
