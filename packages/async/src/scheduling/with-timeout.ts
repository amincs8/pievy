import { anySignal, timeoutSignal } from "../cancellation";

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

function _createTimeoutError(message?: string): Error {
  const error = new Error(message ?? "The operation timed out");
  error.name = "TimeoutError";

  return error;
}

export async function withTimeout<T>(
  callback: (signal: AbortSignal) => T | PromiseLike<T>,
  options: WithTimeoutOptions,
): Promise<Awaited<T>> {
  const { timeout, message, signal: parentSignal } = options;

  const lifecycle = new AbortController();

  const timeoutAbortSignal = timeoutSignal(timeout, {
    reason: _createTimeoutError(message),
    signal: lifecycle.signal,
  });

  const operationSignal = parentSignal
    ? anySignal([timeoutAbortSignal, parentSignal])
    : timeoutAbortSignal;

  try {
    if (operationSignal.aborted) {
      throw operationSignal.reason;
    }

    return await new Promise<Awaited<T>>((resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        // oxlint-disable-next-line no-use-before-define
        operationSignal.removeEventListener("abort", onAbort);
      };

      const settle = (cb: () => void) => {
        if (settled) return;

        settled = true;
        cleanup();
        cb();
      };

      const onAbort = () => {
        settle(() => reject(operationSignal.reason));
      };

      operationSignal.addEventListener("abort", onAbort, {
        once: true,
      });

      if (operationSignal.aborted) {
        onAbort();
        return;
      }

      try {
        Promise.resolve(callback(operationSignal)).then(
          (value) => settle(() => resolve(value)),
          (error) => settle(() => reject(error)),
        );
      } catch (error) {
        settle(() => reject(error));
      }
    });
  } finally {
    // Clears the timeout timer when the operation settles.
    lifecycle.abort();
  }
}
