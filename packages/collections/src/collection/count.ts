import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _predicate } from "./_predicate";

/**
 * Counts the values in an iterable or plain object that satisfy a predicate.
 *
 * The callback receives each value, its index or object key, and a zero-based
 * iteration count. By default, only an explicit `true` result is counted; with
 * `strict: false`, results are compared to `true` using loose equality.
 * Invalid inputs return `0`.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called for each value.
 * @param strict - When `true`, only a literal `true` result is counted; defaults to `true`.
 * @returns The number of values that satisfy the predicate.
 *
 * @example
 * ```ts
 * count([1, 2, 3, 4], (value) => value % 2 === 0); // 2
 * count({ first: 1, second: 2 }, (value) => value > 1); // 1
 * ```
 */
export function count<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  strict?: boolean,
): number;
export function count<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  strict?: boolean,
): number;

export function count(values: unknown, predicateFn: Function, strict = true): number {
  const { isInputValid, matchedCount } = _predicate({
    predicateFn,
    stop: {
      minMatches: Infinity,
      value: true,
    },
    strict,
    values,
  });

  return isInputValid ? matchedCount : 0;
}
