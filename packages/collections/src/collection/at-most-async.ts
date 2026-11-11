import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Tests whether no more than `maxMatches` values in an async iterable, iterable,
 * or plain object satisfy an asynchronous predicate.
 *
 * Callback calls are awaited sequentially, and iteration stops as soon as the
 * number of matching values exceeds the inclusive maximum. By default, only
 * an explicit `true` result counts as a match; with `strict: false`, results
 * are compared to `true` using loose equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Async predicate called with each value, its index or key, and the loop count.
 * @param maxMatches - Maximum number of values that may pass; must be a non-negative integer.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns A promise that resolves to `true` if at most `maxMatches` values pass; otherwise `false`.
 *
 * @example
 * ```ts
 * await atMostAsync([1, 2, 3, 4], async (value) => value % 2 === 0, 2); // true
 * await atMostAsync({ first: 1, second: 2 }, async (value) => value > 1, 0); // true
 * ```
 */
export function atMostAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  maxMatches: number,
  strict?: boolean,
): Promise<boolean>;
export function atMostAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  maxMatches: number,

  strict?: boolean,
): Promise<boolean>;
export function atMostAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  maxMatches: number,

  strict?: boolean,
): Promise<boolean>;

export async function atMostAsync(
  values: unknown,
  predicateFn: Function,
  maxMatches: number,
  strict = true,
): Promise<boolean> {
  const { isInputValid, returnValue } = await _predicateAsync({
    predicateFn,
    stop: {
      minMatches: maxMatches + 1,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid === true && !returnValue!;
}
