import type { AnyFunction } from "@pievy/types";

import { raceAbort } from "./race-abort";

/**
 * Invokes `callback` with the given `signal` (or a fresh one) and races the
 * resulting promise against the signal's abort.
 *
 * @param callback - Function receiving an `AbortSignal` and returning a value or promise.
 * @param signal - Optional `AbortSignal` to race against.
 * @returns A promise resolving with the callback's result.
 */
export function withAbort<T>(
  callback: AnyFunction<[AbortSignal], T | PromiseLike<T>>,
  signal?: AbortSignal,
): Promise<Awaited<T>> {
  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  const controller = signal ? undefined : new AbortController();

  const operationSignal = signal ?? controller!.signal;

  try {
    return raceAbort(Promise.resolve(callback(operationSignal)), operationSignal);
  } catch (error) {
    return Promise.reject(error);
  }
}
