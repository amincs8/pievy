import { raceAbort } from "../cancellation";
import { sleep } from "../scheduling";
import { backoff, type BackoffOptions } from "./backoff";

export interface RetryOptions extends BackoffOptions {
  attempts?: number;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export type RetryCallback<T> = (attempt: number, signal?: AbortSignal) => T | PromiseLike<T>;

/**
 * Retries an async operation with configurable backoff.
 *
 * Invokes `callback` up to `attempts` times, waiting between attempts using the
 * configured backoff strategy. Resolves with the first successful result or
 * rejects with the last error. Aborts early when `signal` is aborted.
 *
 * @param callback - Function invoked with the attempt number (and optional signal).
 * @param options - Retry options (attempts, delay, factor, maxDelay, strategy, jitter, shouldRetry, signal).
 * @returns A promise resolving to the callback's result.
 * @public
 */
export async function retry<T>(
  callback: RetryCallback<T>,
  options: RetryOptions = {},
): Promise<Awaited<T>> {
  const {
    attempts = 3,
    delay = 0,
    factor = 2,
    maxDelay = Infinity,
    strategy = "exponential",
    jitter = false,
    signal,
    shouldRetry,
  } = options;

  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new TypeError("'attempts' must be a positive integer");
  }

  // Validate backoff options before executing the callback.
  backoff(1, {
    delay,
    factor,
    jitter: false,
    maxDelay,
    strategy,
  });

  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (signal?.aborted) {
      throw signal.reason;
    }

    try {
      return await raceAbort(Promise.resolve(callback(attempt, signal)), signal);
    } catch (error) {
      if (signal?.aborted) {
        throw signal.reason;
      }

      if (attempt >= attempts) {
        throw error;
      }

      if (shouldRetry && !shouldRetry(error, attempt)) {
        throw error;
      }

      const waitTime = backoff(attempt, {
        delay,
        factor,
        jitter,
        maxDelay,
        strategy,
      });

      await sleep(waitTime, { signal });
    }
  }

  throw new Error("Retry execution failed unexpectedly");
}
