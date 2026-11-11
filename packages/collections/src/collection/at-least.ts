import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _predicate } from "./_predicate";

/**
 * Tests whether at least `minMatches` values in an iterable or plain object
 * satisfy a predicate.
 *
 * Iteration stops as soon as the required number of values passes. By default,
 * only an explicit `true` result counts as a match; with `strict: false`,
 * predicate results are tested for truthiness. A zero threshold returns `true`
 * for valid inputs without calling the predicate.
 *
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called with each value, its index or key, and the loop count.
 * @param minMatches - Minimum number of values that must pass; must be a non-negative integer.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns `true` if at least `minMatches` values pass; otherwise `false`.
 *
 * @example
 * ```ts
 * atLeast([1, 2, 3, 4], (value) => value % 2 === 0, 2); // true
 * atLeast({ first: 1, second: 2 }, (value) => value > 1, 1); // true
 * ```
 */
export function atLeast<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  minMatches: number,
  strict?: boolean,
): boolean;
export function atLeast<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  minMatches: number,
  strict?: boolean,
): boolean;

export function atLeast(
  values: unknown,
  predicateFn: Function,
  minMatches: number,
  strict = true,
): boolean {
  const { isInputValid, returnValue } = _predicate({
    predicateFn,
    stop: {
      minMatches,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid && returnValue!;
}
