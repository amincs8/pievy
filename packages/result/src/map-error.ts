import type { AnyFunction } from "@pievy/types";

import { resultError } from "./result";
import type { Result, ResultError } from "./types";

/**
 * Transforms the error of an `Err` result using `mapper`, leaving `Ok` unchanged.
 *
 * @param result - The result to transform.
 * @param mapper - Function mapping the original error to a new error.
 * @returns A new result with the mapped error (or the original `Ok` value).
 */
export function mapError<T, E extends Error, F extends Error>(
  result: Result<T, E>,
  mapper: AnyFunction<[E], F>,
): Result<T, F> {
  return result.isOk ? result : (resultError<F>(mapper(result.error)) as ResultError<F>);
}
