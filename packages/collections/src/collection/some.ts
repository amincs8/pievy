import type { PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { _predicate } from "./_predicate";

/**
 * Tests whether at least one value in an iterable or plain object satisfies a predicate.
 *
 * Iteration stops on the first matching predicate result. Empty collections
 * return `false`, matching the usual existential-quantification behavior. By
 * default, only an explicit `true` result counts; with `strict: false`,
 * predicate results are checked for truthiness.
 *
 * @param values - Iterable or plain object whose values are tested.
 * @param callbackfn - Predicate called with each value, its index or key, and the loop count.
 * @param strict - When `true`, only a literal `true` result matches; defaults to `true`.
 * @returns `true` if any visited value passes; otherwise `false`.
 *
 * @example
 * ```ts
 * some([1, 3, 5], (value) => value % 2 === 0); // false
 * some([2, 4, 6], (value) => value % 2 === 0); // true
 * some({}, (value) => value); // false for empty object
 * some({ first: 1, second: 2 }, (value) => value % 2 === 0); // true
 * ```
 */
export function some<T>(
  values: Iterable<T>,
  callbackfn: IterableCallback<T>,
  strict?: boolean,
): boolean;
export function some<T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<T[keyof T]>,
  strict?: boolean,
): boolean;

export function some(values: unknown, predicateFn: Function, strict = true): boolean {
  const { isInputValid, returnValue } = _predicate({
    predicateFn,
    retuenValueInit: true,
    stopValue: true,
    strict,
    values,
  });

  return isInputValid && !returnValue;
}
