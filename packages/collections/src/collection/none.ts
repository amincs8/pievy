import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _predicate } from "./_predicate";

/**
 * Tests whether no value in an iterable or plain object passes a predicate.
 *
 * Iteration stops at the first matching predicate result. Empty collections
 * return `true`, matching the usual negated-existential behavior. By default,
 * only an explicit `true` result counts as a match; with `strict: false`,
 * predicate results are compared loosely against `true`.
 *
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called with each value, its index or key, and the loop count.
 * @param strict - When true, only a literal `true` result matches; defaults to true.
 * @returns `true` if no visited value passes; otherwise `false`.
 *
 * @example
 * ```ts
 * none([2, 4, 6], (value) => value % 2 === 0); // false
 * none([], (value) => value % 2 === 0); // true for empty iterable values
 * none({}, (value) => value); // true for empty object
 * none({ first: 2, second: 3 }, (value) => value % 2 === 0); // false
 * ```
 */
export function none<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  strict?: boolean,
): boolean;
export function none<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  strict?: boolean,
): boolean;

export function none(values: unknown, predicateFn: Function, strict = true): boolean {
  const result = _predicate({
    predicateFn,
    retuenValueInit: true,
    stopValue: true,
    strict,
    values,
  });

  return result.isInputValid === true && result.returnValue!;
}
