import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  type PlainObject,
} from "@pievy/types";

import { STOP } from "../consts";
import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { forEachAsync } from "./for-each-async";

/**
 * Asynchronously tests whether every value in an async iterable, iterable, or plain object passes.
 *
 * Callbacks are awaited sequentially and iteration stops at the first failing
 * result. By default, results are tested for truthiness; with `strict: true`,
 * only an explicit `false` result fails. Empty collections return `true`.
 *
 * @param values - Async iterable, iterable, or plain object whose values are tested.
 * @param callbackfn - Asynchronous predicate called with the value, index or key, and loop count.
 * @param strict - When true, only a literal `false` result fails; defaults to false.
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
  callbackfn: AsyncIterableCallback<T>,
  strict?: false,
): Promise<boolean>;
export function everyAsync<T>(
  values: AsyncIterable<T>,
  callbackfn: AsyncIterableCallback<T>,
  strict: true,
): Promise<boolean>;
export function everyAsync<T>(
  values: Iterable<T>,
  callbackfn: AsyncIterableCallback<T>,
  strict?: boolean,
): Promise<boolean>;
export function everyAsync<T extends PlainObject>(
  values: T,
  callbackfn: AsyncObjectCallback<T[keyof T]>,
  strict?: boolean,
): Promise<boolean>;

export async function everyAsync(
  values: unknown,
  callbackfn: Function,
  strict = false,
): Promise<boolean> {
  if (!isFunction(callbackfn)) return false;
  if (!isAsyncIterable(values) && !isIterable(values) && !isPlainObject(values)) return false;

  let result = true;
  const predicate: (
    value: unknown,
    index: PropertyKey,
    loopCount: number,
  ) => Promise<void | typeof STOP> =
    strict === true
      ? async (value, index, loopCount) => {
          if ((await callbackfn(value, index, loopCount)) === false) {
            result = false;
            return STOP;
          }
        }
      : async (value, index, loopCount) => {
          if (!(await callbackfn(value, index, loopCount))) {
            result = false;
            return STOP;
          }
        };

  await forEachAsync(values, predicate);

  return result;
}
