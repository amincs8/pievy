import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _find } from "./_find";

/**
 * Returns the values in an iterable or plain object whose predicate result
 * matches `true`.
 *
 * The callback receives each value, its index or object key, and a zero-based
 * iteration count. By default, only an explicit `true` result matches; with
 * `strict: false`, results are compared to `true` using loose equality.
 *
 * @typeParam T - The type of values in the collection.
 * @param values - Iterable or plain object whose values are tested.
 * @param predicateFn - Predicate called with each value, its index or key, and the loop count.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns An array of values for which the predicate matches, or an empty array
 *   for invalid inputs.
 *
 * @example
 * ```ts
 * find([1, 2, 3, 4], (value) => value % 2 === 0); // [2, 4]
 * find({ first: 1, second: 2 }, (value) => value > 1); // [2]
 * ```
 */
export function find<T>(
  values: Iterable<T>,
  predicateFn: IterableCallback<T>,
  strict?: boolean,
): T[];

export function find<T extends PlainObject>(
  values: T,
  predicateFn: ObjectCallback<T[keyof T]>,
  strict?: boolean,
): T[];

export function find(values: unknown, predicateFn: Function, strict = true) {
  const { isInputValid, returnValue } = _find({
    predicateFn,
    strict,
    values,
  });

  return isInputValid ? returnValue : [];
}
