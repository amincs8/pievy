import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  type PlainObject,
  type XOR,
} from "@pievy/types";

import { STOP } from "../consts";
import { forEach } from "./for-each";
import { forEachAsync } from "./for-each-async";

/**
 * Evaluates whether every visited value in a collection satisfies a predicate.
 *
 * The predicate is called for each entry in an iterable or plain object. If it
 * returns the configured `stopIteration` value, iteration stops immediately and
 * this helper returns `false`. When no value causes a stop, it returns `true`.
 *
 * @param values - Iterable or plain object to traverse.
 * @param predicateFn - Callback invoked with the current value, its index/key, and loop count.
 * @param strict - When `true`, compare with strict equality; otherwise use loose equality.
 * @param stopIteration - Predicate result that terminates iteration.
 * @returns `true` if iteration completes without a matching stop condition; otherwise `false`.
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

/**
 * Asynchronously evaluates whether every visited value in a collection satisfies a predicate.
 *
 * This helper mirrors {@link _predicate}, but it awaits each predicate result before
 * continuing. Iteration stops as soon as the callback resolves to the configured
 * `stopIteration` value, returning `false` for the overall check.
 *
 * @param values - Async iterable, iterable, or plain object to traverse.
 * @param predicateFn - Async callback invoked with the current value, its index/key, and loop count.
 * @param strict - When `true`, compare with strict equality; otherwise use loose equality.
 * @param stopIteration - Predicate result that terminates iteration.
 * @returns A promise resolving to `true` if the collection completes without a matching stop condition; otherwise `false`.
 */
export async function _predicateAsync(
  values: unknown,
  predicateFn: Function,
  strict: boolean,
  stopIteration: boolean,
): Promise<boolean> {
  if (!isFunction(predicateFn)) return false;
  if (!isAsyncIterable(values) && !isIterable(values) && !isPlainObject(values)) return false;

  let result = true;
  const fn: (value: unknown, index: PropertyKey, loopCount: number) => Promise<void | typeof STOP> =
    strict === true
      ? async (value, index, loopCount) => {
          if ((await predicateFn(value, index, loopCount)) === stopIteration) {
            result = false;
            return STOP;
          }
        }
      : async (value, index, loopCount) => {
          if ((await predicateFn(value, index, loopCount)) == stopIteration) {
            result = false;
            return STOP;
          }
        };

  await forEachAsync(values, fn);

  return result;
}
