import { sleep } from "./sleep";

export interface RetryOptions {
  /** Maximum total number of executions. Defaults to 3. */
  attempts?: number;

  /** Initial delay between attempts in milliseconds. Defaults to 0. */
  delay?: number;

  /** Delay multiplier for exponential backoff. Defaults to 2. */
  factor?: number;

  /** Maximum delay between attempts. Defaults to Infinity. */
  maxDelay?: number;

  /** Determines whether another attempt should be made. */
  shouldRetry?: (error: unknown, attempt: number) => boolean;

  /** Cancels the retry process and the current callback if supported. */
  signal?: AbortSignal;
}

/**
 * Retries `callback` up to `attempts` times until it succeeds or `shouldRetry`
 * returns `false`.
 *
 * On each failed attempt, waits for `delay * factor ** (attempt - 1)` ms
 * (capped at `maxDelay`) before retrying. When `signal` is aborted, throws
 * `signal.reason`. Resolves with the first successful result.
 *
 * @param callback - Function invoked with the attempt number; may return a value or promise.
 * @param options - Retry options (`attempts`, `delay`, `factor`, `maxDelay`, `shouldRetry`, `signal`).
 * @returns A promise that resolves with the callback's result or rejects with the last error.
 * @public
 */
function raceWithSignal<T>(promise: T | PromiseLike<T>, signal?: AbortSignal): Promise<Awaited<T>> {
  if (!signal) {
    return Promise.resolve(promise);
  }

  if (signal.aborted) {
    return Promise.reject(signal.reason);
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      // oxlint-disable-next-line no-use-before-define
      signal.removeEventListener("abort", onAbort);
    };

    const onAbort = () => {
      cleanup();
      reject(signal.reason);
    };

    signal.addEventListener("abort", onAbort, { once: true });

    Promise.resolve(promise).then(
      (value) => {
        cleanup();
        resolve(value as Awaited<T>);
      },
      (error: unknown) => {
        cleanup();
        reject(error);
      },
    );
  });
}

export async function retry<T>(
  callback: (attempt: number, signal?: AbortSignal) => T | PromiseLike<T>,
  options: RetryOptions = {},
): Promise<Awaited<T>> {
  const { attempts = 3, delay = 0, factor = 2, maxDelay = Infinity, shouldRetry, signal } = options;

  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new TypeError("'attempts' must be a positive integer");
  }

  if (!Number.isFinite(delay) || delay < 0) {
    throw new TypeError("'delay' must be a non-negative finite number");
  }

  if (!Number.isFinite(factor) || factor < 1) {
    throw new TypeError("'factor' must be a finite number greater than or equal to 1");
  }

  if (maxDelay !== Infinity && (!Number.isFinite(maxDelay) || maxDelay < 0)) {
    throw new TypeError("'maxDelay' must be a non-negative finite number");
  }

  for (let attempt = 1; attempt <= attempts; attempt++) {
    if (signal?.aborted) {
      throw signal.reason;
    }

    try {
      return await raceWithSignal(
        Promise.resolve().then(() => callback(attempt, signal)),
        signal,
      );
    } catch (error) {
      // Do not retry when the operation was aborted.
      if (signal?.aborted) {
        throw signal.reason;
      }

      if (attempt === attempts || (shouldRetry && !shouldRetry(error, attempt))) {
        throw error;
      }

      const waitTime = Math.min(delay * factor ** (attempt - 1), maxDelay);

      if (waitTime > 0) {
        await sleep(waitTime, { signal: signal as AbortSignal });
      }
    }
  }

  throw new Error("Retry failed unexpectedly");
}
