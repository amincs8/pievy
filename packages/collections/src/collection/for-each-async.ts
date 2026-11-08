import { isAsyncIterable, isFunction, isIterable, isPlainObject, type PlainObject } from "@pievy/types";

import { STOP, type StopSignal } from "./consts";

type AsyncIterableCallback<T> = (
  value: T,
  index: number,
  loopCount: number,
) => Promise<StopSignal>;
type AsyncObjectCallback<T> = (value: T, key: string, loopCount: number) => Promise<StopSignal>;

export function forEachAsync<T>(
  values: AsyncIterable<T>,
  callbackfn: AsyncIterableCallback<T>,
): Promise<void>;
export function forEachAsync<T>(values: Iterable<T>, callbackfn: AsyncIterableCallback<T>): Promise<void>;
export function forEachAsync<T extends PlainObject>(
  values: T,
  callbackfn: AsyncObjectCallback<T[keyof T]>,
): Promise<void>;

export async function forEachAsync(values: unknown, callbackfn: Function): Promise<void> {
  if (!isFunction(callbackfn)) return;

  let loopCount = 0;

  if (isAsyncIterable(values)) {
    for await (const value of values) {
      if ((await callbackfn(value, loopCount, loopCount)) === STOP) break;
      loopCount++;
    }
  } else if (isIterable(values)) {
    for (const value of values) {
      if ((await callbackfn(value, loopCount, loopCount)) === STOP) break;
      loopCount++;
    }
  } else if (isPlainObject(values)) {
    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

      const value = (values as Record<string, unknown>)[key];
      if ((await callbackfn(value, key, loopCount)) === STOP) break;
      loopCount++;
    }
  }
}