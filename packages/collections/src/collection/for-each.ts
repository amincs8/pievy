import { isFunction, isIterable, isPlainObject, type PlainObject } from "@pievy/types";

import { STOP, type LoopControl } from "../consts";
import type { IterableCallback, ObjectCallback } from "../types";

/**
 * Calls a callback for each value in an iterable or each own enumerable value in a plain object.
 *
 * Return {@link STOP} from the callback to stop iteration. For iterable inputs,
 * the callback receives the value, numeric index, and loop count. For objects,
 * it receives the value, string key, and loop count.
 *
 * @param values - Iterable or plain object to traverse.
 * @param callbackfn - Function invoked for each value.
 * @returns Nothing.
 *
 * @example
 * ```ts
 * forEach(["a", "b"], (value, index) => console.log(index, value));
 * forEach({ first: 1, second: 2 }, (value, key) => console.log(key, value));
 * ```
 */
export function forEach<T>(values: Iterable<T>, callbackfn: IterableCallback<T, LoopControl>): void;
export function forEach<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T], LoopControl>,
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
