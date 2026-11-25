import type { AnyFunction } from "@pievy/types";

import { _createError } from "./_internal";
import { resultError, resultOk } from "./result";
import type { Result } from "./types";

/**
 * Executes `callback` (sync or async), wrapping its result or thrown error
 * in a {@link Result}.
 *
 * @param callback - Function to execute.
 * @returns `Ok` with the awaited return value, or `Err` with the thrown error.
 */
export async function attemptAsync<T, E extends Error = Error>(
  callback: AnyFunction<[], T | PromiseLike<T>>,
): Promise<Result<Awaited<T>, E>> {
  try {
    return resultOk(await callback());
  } catch (error) {
    return resultError(_createError(error));
  }
}
