import type { AnyFunction } from "@pievy/types";

import type { Result } from "./types";

/**
 * Handlers for {@link match}.
 */
export interface MatchHandlers<T, E extends Error, U, V = U> {
  /** Called with the `Ok` value. */
  onOk: AnyFunction<[T], U>;
  /** Called with the `Err` error. */
  onError: AnyFunction<[E], V>;
}

/**
 * Pattern-matches a result, calling the appropriate handler.
 *
 * @param result - The result to match.
 * @param handlers - Object with `onOk` and `onError` functions.
 * @returns The return value of the called handler.
 */
export function match<T, E extends Error, U, V = U>(
  result: Result<T, E>,
  handlers: MatchHandlers<T, E, U, V>,
): U | V {
  return result.isOk ? handlers.onOk(result.value) : handlers.onError(result.error);
}
