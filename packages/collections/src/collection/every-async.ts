import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Asynchronously tests whether every value in an async iterable, iterable, or plain object passes.
 *
 * Callbacks are awaited sequentially and iteration stops at the first failing
 * result. By default, only an explicit `false` result fails; with `strict: false`,
 * predicate results are evaluated by truthiness. Empty collections return `true`.
 *
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Asynchronous predicate called with the value, index or key, and loop count.
 * @param strict - When true, only a literal `false` result fails; defaults to true.
 * @returns A promise that resolves to whether every visited value passes.
 *
 * @example
 * ```ts
 * const allAvailable = await everyAsync(items, async (item) => {
 *   return await isAvailable(item);
 * });
 * ```
 */
export function everyAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function everyAsync<T>(
  values: Iterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function everyAsync<T extends PlainObject>(
  values: T,
  predicateFn: AsyncObjectCallback<T[keyof T]>,
  strict?: boolean,
): Promise<boolean>;

export async function everyAsync(
  values: unknown,
  predicateFn: Function,
  strict = true,
): Promise<boolean> {
  const { isInputValid, returnValue } = await _predicateAsync({
    predicateFn,
    retuenValueInit: true,
    stopValue: false,
    strict,
    values,
  });

  return isInputValid === true && returnValue!;
}
