import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Asynchronously tests whether any value in an async iterable, iterable, or plain object passes.
 *
 * Callbacks are awaited sequentially and iteration stops at the first passing
 * result. By default, only an explicit `true` result passes; with `strict: false`,
 * results are tested for truthiness. Empty collections return `false`.
 *
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Asynchronous predicate called with the value, index or key, and loop count.
 * @param strict - When true, only a literal `true` result passes; defaults to true.
 * @returns A promise that resolves to whether any visited value passes.
 *
 * @example
 * ```ts
 * const hasAvailableItem = await someAsync(items, async (item) => {
 *   return await isAvailable(item);
 * });
 * ```
 */
export function someAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function someAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function someAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  strict?: boolean,
): Promise<boolean>;

export async function someAsync(
  values: unknown,
  predicateFn: Function,
  strict = true,
): Promise<boolean> {
  const result = await _predicateAsync({
    predicateFn,
    retuenValueInit: true,
    stopValue: true,
    strict,
    values,
  });

  return result.isInputValid && !result.returnValue;
}
