import { isPositive } from "@pievy/types";

import { scheduleTimeout } from "../scheduling";

const MAX_TIMEOUT = 2_147_483_647;

/**
 * Options for {@link timeoutSignal}.
 */
export interface TimeoutSignalOptions {
  /**
   * The reason to abort with when the timeout elapses.
   * Defaults to a `TimeoutError`.
   */
  reason?: unknown;
  /**
   * An optional parent `AbortSignal` to compose with.
   * If it is already aborted, the returned signal aborts immediately
   * with the parent's reason.
   */
  signal?: AbortSignal;
}

function ـcreateTimeoutError(): Error {
  const error = new Error("The operation timed out");
  error.name = "TimeoutError";
  return error;
}

/**
 * Creates an `AbortSignal` that aborts after the given `timeout` (in ms).
 *
 * The timeout is split into chunks to avoid `setTimeout`'s 32-bit limit,
 * so very large timeouts are supported. An optional parent `signal` can be
 * composed: if it aborts, the returned signal aborts with the parent's reason.
 *
 * @param timeout - Timeout in milliseconds. Must be a positive finite number.
 * @param options - Optional reason and parent signal.
 * @returns An `AbortSignal` that aborts after `timeout` ms (or sooner).
 * @throws {TypeError} If `timeout` is not a positive finite number.
 */
export function timeoutSignal(timeout: number, options: TimeoutSignalOptions = {}): AbortSignal {
  if (!isPositive(timeout)) {
    throw new TypeError("'timeout' must be a positive finite number");
  }

  const controller = new AbortController();
  const { reason = ـcreateTimeoutError(), signal } = options;

  if (signal?.aborted) {
    controller.abort(signal.reason);
    return controller.signal;
  }

  let stopTimer: ReturnType<typeof scheduleTimeout> | undefined;
  let remaining = timeout;
  let startedAt = 0;

  const cleanup = () => {
    if (stopTimer !== undefined) {
      stopTimer();
      stopTimer = undefined;
    }

    // oxlint-disable-next-line no-use-before-define
    signal?.removeEventListener("abort", onAbort);
  };

  const abort = (abortReason: unknown) => {
    if (controller.signal.aborted) return;

    cleanup();
    controller.abort(abortReason);
  };

  const onAbort = () => abort(signal!.reason);

  const schedule = () => {
    startedAt = Date.now();

    stopTimer = scheduleTimeout(
      () => {
        remaining -= Date.now() - startedAt;

        if (remaining <= 0) {
          abort(reason);
        } else {
          schedule();
        }
      },
      Math.min(remaining, MAX_TIMEOUT),
    );
  };

  signal?.addEventListener("abort", onAbort, { once: true });
  schedule();

  return controller.signal;
}
