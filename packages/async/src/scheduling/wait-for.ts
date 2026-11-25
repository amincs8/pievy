import { isPositive, type AnyFunction } from "@pievy/types";

import { sleep } from "./sleep";

export interface WaitForOptions {
  /**
   * Polling interval in milliseconds. Defaults to 100.
   */
  interval?: number;
  /**
   * Maximum time to wait in milliseconds. Defaults to `Infinity`.
   */
  timeout?: number;
  /**
   * Optional `AbortSignal` to cancel waiting.
   */
  signal?: AbortSignal;
}

/**
 * Repeatedly evaluates `predicate` until it returns a truthy value,
 * sleeping `interval` ms between attempts.
 *
 * @param predicate - Function returning a truthy value when done.
 * @param options - Polling options.
 * @throws {TypeError} If `interval` or `timeout` is invalid.
 * @throws {TimeoutError} If `timeout` elapses.
 */
export async function waitFor(
  predicate: AnyFunction<[], unknown | PromiseLike<unknown>>,
  options: WaitForOptions = {},
): Promise<void> {
  const { interval = 100, timeout = Infinity, signal } = options;

  if (!isPositive(interval)) {
    throw new TypeError("'interval' must be a positive finite number");
  }

  if (timeout !== Infinity && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new TypeError("'timeout' must be a non-negative finite number");
  }

  if (signal?.aborted) {
    throw signal.reason;
  }

  const startedAt = performance.now();

  while (true) {
    if (signal?.aborted) {
      throw signal.reason;
    }

    if (await predicate()) {
      return;
    }

    const remaining = timeout - (performance.now() - startedAt);

    if (remaining <= 0) {
      throw Object.assign(new Error("The operation timed out"), { name: "TimeoutError" });
    }

    await sleep(Math.min(interval, remaining), { signal });
  }
}
