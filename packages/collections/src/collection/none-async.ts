import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Asynchronously tests whether no value in an async iterable, iterable, or plain object passes.
 *
 * Callbacks are awaited sequentially and iteration stops at the first truthy
 * predicate result. By default, results are tested for truthiness; with
 * `strict: true`, only an explicit `true` result counts as a match. Empty
 * collections return `true`.
 *
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Asynchronous predicate called with the value, index or key, and loop count.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `false`.
 * @returns A promise that resolves to whether no visited value passes.
 *
 * @example
 * ```ts
 * const isClean = await noneAsync(items, async (item) => {
 *   return await isBlocked(item);
 * });
 * ```
 */
export function noneAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: false,
): Promise<boolean>;
export function noneAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict: true,
): Promise<boolean>;
export function noneAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function noneAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  strict?: boolean,
): Promise<boolean>;

export async function noneAsync(
  values: unknown,
  predicateFn: Function,
  strict = false,
): Promise<boolean> {
  const result = await _predicateAsync({
    predicateFn,
    retuenValueInit: true,
    stopValue: true,
    strict,
    values,
  });

  return result.isInputValid === true ? result.returnValue === true : false;
}
