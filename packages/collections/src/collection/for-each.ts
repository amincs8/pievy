import { isFunction, isIterable, isPlainObject, type PlainObject } from "@pievy/types";

import { STOP, type StopSignal } from "./consts";

type IterableCallback<T> = (value: T, index: number, loopCount: number) => StopSignal;
type ObjectCallback<T> = (value: T, key: string, loopCount: number) => StopSignal;

export function forEach<T>(values: Iterable<T>, callbackfn: IterableCallback<T>): void;
export function forEach<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
): void;

export function forEach(values: unknown, callbackfn: Function): void {
  if (!isFunction(callbackfn)) return;

  let loopCount = 0;

  if (isIterable(values)) {
    for (const value of values) {
      if (callbackfn(value, loopCount, loopCount) === STOP) {
        break;
      }
      loopCount++;
    }
  } else if (isPlainObject(values)) {
    for (const key in values) {
      if (!Object.prototype.hasOwnProperty.call(values, key)) continue;

      const value = (values as Record<string, unknown>)[key];
      if (callbackfn(value, key, loopCount) === STOP) {
        break;
      }
      loopCount++;
    }
  }
}
