import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _findAsync } from "./_find";

/**
 * Asynchronously returns the values in an async iterable, iterable, or plain
 * object whose predicate result matches `true`.
 *
 * The callback is awaited sequentially and receives each value, its index or
 * object key, and a zero-based iteration count. By default, only an explicit
 * `true` result matches; with `strict: false`, results are compared to `true`
 * using loose equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Async predicate called with each value, its index or key, and the loop count.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns A promise resolving to the matching values, or an empty array for invalid inputs.
 *
 * @example
 * ```ts
 * await findAsync([1, 2, 3, 4], async (value) => value % 2 === 0); // [2, 4]
 * ```
 */
export function findAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<T[]>;
export function findAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<T[]>;
export function findAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  strict?: boolean,
): Promise<T[]>;

export async function findAsync(values: unknown, predicateFn: Function, strict = true) {
  const { isInputValid, returnValue } = await _findAsync({
    predicateFn,
    strict,
    values,
  });

  return isInputValid ? returnValue : [];
}
