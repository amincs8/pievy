import { isFunction, isIterable, isPlainObject, type PlainObject, type XOR } from "@pievy/types";

import { STOP } from "../consts";
import { forEach } from "./for-each";

/**
 * Tests whether a collection fails a predicate before the traversal completes.
 *
 * The callback is invoked for each value in an iterable or plain object. If the
 * callback result matches `stopIteration`, the traversal stops and the function
 * returns `false`. When no entries trigger a stop condition, it returns `true`.
 *
 * @param values - Iterable or plain object to inspect.
 * @param predicateFn - Predicate invoked with each value, index/key, and loop count.
 * @param strict - When `true`, match with strict equality; otherwise use loose comparison.
 * @param stopIteration - Value against which callback results are compared to stop iteration.
 * @returns `true` when no visited value triggers the stop condition; otherwise `false`.
 */
export function _predicate(
  values: unknown,
  predicateFn: Function,
  strict: boolean,
  stopIteration: boolean,
): boolean {
  if (!isFunction(predicateFn)) return false;
  if (!isIterable(values) && !isPlainObject(values)) return false;

  let result = true;
  const fn: (value: unknown, index: PropertyKey, loopCount: number) => void | typeof STOP =
    strict === true
      ? (value, index, loopCount) => {
          if (predicateFn(value, index, loopCount) === stopIteration) {
            result = false;
            return STOP;
          }
        }
      : (value, index, loopCount) => {
          if (predicateFn(value, index, loopCount) == stopIteration) {
            result = false;
            return STOP;
          }
        };

  forEach(values as XOR<Iterable<unknown>, PlainObject>, fn);

  return result;
}
