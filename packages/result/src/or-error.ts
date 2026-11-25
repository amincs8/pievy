import type { AnyFunction } from "@pievy/types";

import type { Result } from "./types";

/**
 * Chains an error handler on an `Err` result, passing through `Ok`.
 *
 * @param result - The result to handle.
 * @param handler - Function mapping the error to a new result.
 * @returns The original `Ok` value, or the handler's result.
 */
export function orElse<T, E extends Error, U, F extends Error>(
  result: Result<T, E>,
  handler: AnyFunction<[E], Result<U, F>>,
): Result<T | U, F> {
  return result.isOk ? result : handler(result.error);
}
