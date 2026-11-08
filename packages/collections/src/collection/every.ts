import { isFunction, isIterable, isPlainObject, type PlainObject, type XOR } from "@pievy/types";

import { STOP } from "../consts";
import { forEach } from "./for-each";

type IterableCallback<T> = (value: T, index: number, loopCount: number) => unknown;
type ObjectCallback<T> = (value: T, key: string, loopCount: number) => unknown;

/**
 * Tests whether every value in an iterable or plain object passes a predicate.
 *
 * Iteration stops at the first falsy predicate result. Empty collections return
 * `true`, matching the usual universal-quantification behavior.
 * By default, predicate results are tested for truthiness; with `strict: true`,
 * only an explicit `false` result fails.
 *
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called with each value, its index or key, and the loop count.
 * @param strict - When true, only a literal `false` result fails; defaults to false.
 * @returns `true` if every visited value passes; otherwise `false`.
 *
 * @example
 * ```ts
 * every([2, 4, 6], (value) => value % 2 === 0); // true
 * every([], (value) => value % 2 === 0); // true for empty iterable values
 * every({}, (value) => value); // true for empty object
 * every({ first: 2, second: 3 }, (value) => value % 2 === 0); // false
 * ```
 */
export function every<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  strict?: false,
): boolean;
export function every<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  strict: true,
): boolean;
export function every<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  strict?: false,
): boolean;
export function every<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  strict: true,
): boolean;

export function every(values: unknown, callbackfn: Function, strict = false): boolean {
  if (!isFunction(callbackfn)) return false;
  if (!isIterable(values) && !isPlainObject(values)) return false;

  let result = true;
  const fn: (value: unknown, index: PropertyKey, loopCount: number) => void | typeof STOP =
    strict === true
      ? (value, index, loopCount) => {
          if (callbackfn(value, index, loopCount) === false) {
            result = false;
            return STOP;
          }
        }
      : (value, index, loopCount) => {
          if (!callbackfn(value, index, loopCount)) {
            result = false;
            return STOP;
          }
        };

  forEach(values as XOR<Iterable<unknown>, PlainObject>, fn);

  return result;
}
