import { scheduleTimeout } from "./schedule-timeout";

export interface WithTimeoutOptions {
  timeout: number;
  message?: string;
  signal?: AbortSignal;
}

/**
 * Runs `callback` with an `AbortSignal` and rejects if it does not settle
 * within `timeout` milliseconds.
 *
 * When the timeout elapses, an `Error` (message defaults to `"Operation timed
 * out"`) is rejected. When `signal` is aborted externally, the promise rejects
 * with `signal.reason`. Both settle only once.
 *
 * @param callback - Async or sync work to run; receives an `AbortSignal`.
 * @param options - Options with `timeout` (ms), optional `message`, optional `signal`.
 * @returns A promise that resolves with the callback's result, rejects on timeout
 *   or external abort.
 * @public
 */
export function withTimeout<T>(
  callback: (signal: AbortSignal) => T | PromiseLike<T>,
  options: WithTimeoutOptions,
): Promise<T> {
  const { timeout, message = "Operation timed out", signal } = options;

  if (!Number.isFinite(timeout) || timeout < 0) {
    return Promise.reject(new TypeError("'timeout' must be a non-negative finite number"));
  }

  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  const controller = new AbortController();
  let stop: ReturnType<typeof scheduleTimeout> | undefined;
  let settled = false;

  return new Promise<T>((resolve, reject) => {
    const settle = (fn: () => void) => {
      if (settled) return;

      settled = true;
      // oxlint-disable-next-line no-use-before-define
      cleanup();
      fn();
    };

    const onAbort = () => {
      const reason = signal?.reason;

      controller.abort(reason);
      settle(() => reject(reason));
    };

    const cleanup = () => {
      stop?.();
      signal?.removeEventListener("abort", onAbort);
    };

    signal?.addEventListener("abort", onAbort, { once: true });

    stop = scheduleTimeout(() => {
      const error = new Error(message);

      controller.abort(error);
      settle(() => reject(error));
    }, timeout);

    Promise.resolve()
      .then(() => {
        if (settled) return;

        return callback(controller.signal);
      })
      .then(
        (value) => settle(() => resolve(value as T)),
        (error: unknown) => settle(() => reject(error)),
      );
  });
}
