import type { AnyFunction } from "@pievy/types";

import { resultError, resultOk } from "./result";
import type { Result } from "./types";

/**
 * Executes `callback` synchronously, wrapping its result or thrown error
 * in a {@link Result}.
 *
 * @param callback - Function to execute.
 * @returns `Ok` with the return value, or `Err` with the thrown error.
 */
export function attempt<T, E = unknown>(
  callback: AnyFunction<[], T>,
): Result<T, E extends Error ? E : Error> {
  try {
    return resultOk(callback());
  } catch (error) {
    return resultError<E>(error as E);
  }
}
