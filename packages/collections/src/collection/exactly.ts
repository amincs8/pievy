import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _predicate } from "./_predicate";

/**
 * Tests whether exactly `matches` values in an iterable or plain object
 * satisfy a predicate.
 *
 * Iteration stops as soon as the number of matching values exceeds `matches`.
 * By default, only an explicit `true` result counts as a match; with
 * `strict: false`, results are compared to `true` using loose equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called with each value, its index or key, and the loop count.
 * @param matches - Exact number of values that must pass; must be a non-negative integer.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns `true` if exactly `matches` values pass; otherwise `false`.
 *
 * @example
 * ```ts
 * exactly([1, 2, 3, 4], (value) => value % 2 === 0, 2); // true
 * exactly({ first: 1, second: 2 }, (value) => value > 1, 1); // true
 * ```
 */
export function exactly<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  matches: number,
  strict?: boolean,
): boolean;
export function exactly<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  matches: number,
  strict?: boolean,
): boolean;

export function exactly(
  values: unknown,
  predicateFn: Function,
  matches: number,
  strict = true,
): boolean {
  const { isInputValid, returnValue, matchedCount } = _predicate({
    predicateFn,
    stop: {
      minMatches: matches + 1,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid && !returnValue! && matchedCount === matches;
}
