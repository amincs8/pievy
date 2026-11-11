import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _predicate } from "./_predicate";

/**
 * Tests whether no more than `maxMatches` values in an iterable or plain object
 * satisfy a predicate.
 *
 * Iteration stops as soon as the number of matching values exceeds the
 * inclusive maximum. By default, only an explicit `true` result counts as a
 * match; with `strict: false`, results are compared to `true` using loose
 * equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called with each value, its index or key, and the loop count.
 * @param maxMatches - Maximum number of values that may pass; must be a non-negative integer.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns `true` if at most `maxMatches` values pass; otherwise `false`.
 *
 * @example
 * ```ts
 * atMost([1, 2, 3, 4], (value) => value % 2 === 0, 2); // true
 * atMost({ first: 1, second: 2 }, (value) => value > 1, 0); // true
 * ```
 */
export function atMost<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  maxMatches: number,
  strict?: boolean,
): boolean;
export function atMost<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  maxMatches: number,
  strict?: boolean,
): boolean;

export function atMost(
  values: unknown,
  predicateFn: Function,
  maxMatches: number,
  strict = true,
): boolean {
  const { isInputValid, returnValue } = _predicate({
    predicateFn,
    stop: {
      minMatches: maxMatches + 1,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid && !returnValue!;
}
