import type { Result } from "./types";

/**
 * Returns the `Ok` value or throws the `Err` error.
 *
 * @param result - The result to unwrap.
 * @returns The `Ok` value.
 * @throws The `Err` error if the result is `Err`.
 */
export function unwrap<T, E extends Error>(result: Result<T, E>): T {
  if (result.isOk) {
    return result.value;
  }

  throw result.error;
}

/**
 * Returns the `Ok` value, or a default value if `Err`.
 *
 * @param result - The result to unwrap.
 * @param defaultValue - Value to return if the result is `Err`.
 * @returns The `Ok` value or `defaultValue`.
 */
export function unwrapOr<T, E extends Error, D>(
  result: Result<T, E>,
  defaultValue: D,
): T | D {
  return result.isOk ? result.value : defaultValue;
}

/**
 * Returns the `Ok` value, or calls `handler` with the `Err` error.
 *
 * @param result - The result to unwrap.
 * @param handler - Function producing a fallback from the error.
 * @returns The `Ok` value or the handler's return value.
 */
export function unwrapOrElse<T, E extends Error, D>(
  result: Result<T, E>,
  handler: (error: E) => D,
): T | D {
  return result.isOk ? result.value : handler(result.error);
}
