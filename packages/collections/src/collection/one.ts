import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _predicate } from "./_predicate";

/**
 * Tests whether exactly one value in an iterable or plain object satisfies a
 * predicate.
 *
 * Iteration stops as soon as a second matching value is found. By default,
 * only an explicit `true` result counts as a match; with `strict: false`,
 * results are compared to `true` using loose equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called with each value, its index or key, and the loop count.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns `true` if exactly one value passes; otherwise `false`.
 *
 * @example
 * ```ts
 * one([1, 2, 3], (value) => value === 2); // true
 * one({ first: 1, second: 2 }, (value) => value > 0); // false
 * ```
 */
export function one<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  strict?: boolean,
): boolean;
export function one<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  strict?: boolean,
): boolean;

export function one(values: unknown, predicateFn: Function, strict = true): boolean {
  const { isInputValid, returnValue, matchedCount } = _predicate({
    predicateFn,
    stop: {
      minMatches: 2,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid && !returnValue! && matchedCount === 1;
}
