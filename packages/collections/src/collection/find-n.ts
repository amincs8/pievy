import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _find } from "./_find";

/**
 * Returns up to `maxMatches` values in an iterable or plain object whose
 * predicate result matches `true`.
 *
 * The callback receives each value, its index or object key, and a zero-based
 * iteration count. By default, only an explicit `true` result matches; with
 * `strict: false`, results are compared to `true` using loose equality.
 * Iteration stops once `maxMatches` values have matched.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Iterable or plain object whose values are tested.
 * @param predicateFn - Predicate called with each value, its index or key, and the loop count.
 * @param maxMatches - Positive integer maximum number of matching values to return.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns The matching values, or an empty array for invalid inputs.
 *
 * @example
 * ```ts
 * findN([1, 2, 3, 4], (value) => value % 2 === 0, 1); // [2]
 * ```
 */
export function findN<T>(
  values: Iterable<T>,
  predicateFn: IterableCallback<T>,
  maxMatches: number,
  strict?: boolean,
): T[];

export function findN<T extends PlainObject>(
  values: T,
  predicateFn: ObjectCallback<T[keyof T]>,
  maxMatches: number,
  strict?: boolean,
): T[];

export function findN(values: unknown, predicateFn: Function, maxMatches: number, strict = true) {
  const { isInputValid, returnValue } = _find({
    maxMatches,
    predicateFn,
    strict,
    values,
  });

  return isInputValid ? returnValue : [];
}
