import type { Result } from "./types";

/**
 * Flattens a nested `Result<Result<T, E>, E>` into `Result<T, E>`.
 *
 * If the outer result is `Ok`, returns the inner result (which may be `Ok` or `Err`).
 * If the outer result is `Err`, returns it directly.
 *
 * @param result - A result containing another result.
 * @returns The inner result if outer is `Ok`, otherwise the outer `Err`.
 */
export function flatten<T, E extends Error>(result: Result<Result<T, E>, E>): Result<T, E> {
  return result.isOk ? result.value : result;
}
