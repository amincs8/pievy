import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _findAsync } from "./_find";

/**
 * Asynchronously returns up to `maxMatches` values whose predicate result
 * matches `true`.
 *
 * The callback is awaited sequentially and receives each value, its index or
 * object key, and a zero-based iteration count. By default, only an explicit
 * `true` result matches; with `strict: false`, results are compared to `true`
 * using loose equality. Iteration stops once `maxMatches` values have matched.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Async predicate called with each value, its index or key, and the loop count.
 * @param maxMatches - Positive integer maximum number of matching values to return.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns A promise resolving to the matching values, or an empty array for invalid inputs.
 *
 * @example
 * ```ts
 * await findNAsync([1, 2, 3, 4], async (value) => value % 2 === 0, 1); // [2]
 * ```
 */
export function findNAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  maxMatches: number,
  strict?: boolean,
): Promise<T[]>;
export function findNAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  maxMatches: number,
  strict?: boolean,
): Promise<T[]>;
export function findNAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  maxMatches: number,
  strict?: boolean,
): Promise<T[]>;

export async function findNAsync(
  values: unknown,
  predicateFn: Function,
  maxMatches: number,
  strict = true,
) {
  const { isInputValid, returnValue } = await _findAsync({
    maxMatches,
    predicateFn,
    strict,
    values,
  });

  return isInputValid ? returnValue : [];
}
