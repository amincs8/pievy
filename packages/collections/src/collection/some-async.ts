import type { PlainObject } from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { _predicateAsync } from "./_predicate";

/**
 * Asynchronously tests whether any value in an async iterable, iterable, or plain object passes.
 *
 * Callbacks are awaited sequentially and iteration stops at the first passing
 * result. By default, results are tested for truthiness; with `strict: true`,
 * only an explicit `true` result passes. Empty collections return `false`.
 *
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param predicateFn - Asynchronous predicate called with the value, index or key, and loop count.
 * @param strict - When true, only a literal `true` result passes; defaults to false.
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
  strict?: false,
): Promise<boolean>;
export function someAsync<T>(
  values: AsyncIterable<T>,
  predicateFn: AsyncIterableCallback<T>,
  strict: true,
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
  strict = false,
): Promise<boolean> {
  return !(await _predicateAsync(values, predicateFn, strict, true));
}
