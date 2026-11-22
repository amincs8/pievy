import type { AnyFunction } from "@pievy/types";

import { isEqual } from "./is-equal";

/**
 * Checks whether two values are deeply equal using a custom comparator.
 *
 * The comparator can override the default equality behavior by returning
 * true or false. Returning undefined delegates the comparison to isEqual.
 *
 * @param left - The first value.
 * @param right - The second value.
 * @param comparator - The custom comparison function.
 * @returns Whether the values are equal.
 * @public
 */
export function isEqualWith(
  left: unknown,
  right: unknown,
  comparator: AnyFunction<[unknown, unknown], boolean | undefined>,
): boolean {
  const result = comparator(left, right);

  if (result !== undefined) {
    return result;
  }

  return isEqual(left, right);
}
