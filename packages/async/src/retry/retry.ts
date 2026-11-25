import { sleep } from "../scheduling";
import { backoff, type BackoffOptions } from "./backoff";

export interface RetryOptions extends BackoffOptions {
  attempts?: number;
  signal?: AbortSignal;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export type RetryCallback<T> = (attempt: number, signal?: AbortSignal) => T | PromiseLike<T>;

function getAbortReason(signal: AbortSignal): unknown {
  return signal.reason ?? new Error("Operation aborted");
}

function raceWithSignal<T>(promise: PromiseLike<T>, signal?: AbortSignal): Promise<T> {
  if (!signal) {
    return Promise.resolve(promise);
  }

  if (signal.aborted) {
    return Promise.reject(getAbortReason(signal));
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      // oxlint-disable-next-line no-use-before-define
      signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      if (settled) return;

      settled = true;
      cleanup();
      reject(getAbortReason(signal));
    };

    signal.addEventListener("abort", onAbort, { once: true });

    Promise.resolve(promise).then(
      (value) => {
        if (settled) return;

        settled = true;
        cleanup();
        resolve(value);
      },
      (error) => {
        if (settled) return;

        settled = true;
        cleanup();
        reject(error);
      },
    );

    // Handle an abort that happened while the listener was being attached.
    if (signal.aborted) {
      onAbort();
    }
  });
}

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
    delay = 1000,
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

  // Validate backoff configuration before executing the callback.
  backoff(1, {
    delay,
    factor,
    jitter: false,
    maxDelay,
    strategy,
  });

  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (signal?.aborted) {
      throw getAbortReason(signal);
    }

    try {
      const result = callback(attempt, signal);

      return (await raceWithSignal(result as PromiseLike<T>, signal)) as Awaited<T>;
    } catch (error) {
      if (signal?.aborted) {
        throw getAbortReason(signal);
      }

      if (attempt === attempts) {
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

      await sleep(waitTime, { signal: signal as AbortSignal });
    }
  }

  throw new Error("Retry execution failed unexpectedly");
}
