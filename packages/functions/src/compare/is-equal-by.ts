import type { AnyFunction } from "@pievy/types";

import { isEqual } from "./is-equal";

/**
 * Checks whether two values are equal after applying an iteratee.
 *
 * @param left - The first value.
 * @param right - The second value.
 * @param iteratee - The function used to transform both values.
 * @returns Whether the transformed values are deeply equal.
 * @public
 */
export function isEqualBy<T, U>(left: T, right: U, iteratee: AnyFunction<[T | U], unknown>): boolean {
  return isEqual(iteratee(left), iteratee(right));
}
