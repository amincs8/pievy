import type { AnyFunction } from "@pievy/types";

import type { Result } from "./types";

/**
 * Chains a result-returning function on an `Ok` value, passing through `Err`.
 *
 * @param result - The result to chain.
 * @param mapper - Function mapping the `Ok` value to a new result.
 * @returns The mapped result if `Ok`, otherwise the original `Err`.
 */
export function andThen<T, U, E extends Error, F extends Error>(
  result: Result<T, E>,
  mapper: AnyFunction<[T], Result<U, F>>,
): Result<U, E | F> {
  return result.isOk ? mapper(result.value) : result;
}
