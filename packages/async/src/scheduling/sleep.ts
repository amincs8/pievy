import { _setTimeout } from "./_internal";

interface SleepOptions {
  signal?: AbortSignal;
}

/**
 * Creates a promise that resolves after `delay` milliseconds.
 *
 * Supports an optional `AbortSignal` to reject early when aborted. When `delay`
 * is not a positive finite number, the returned promise rejects with a
 * `TypeError`.
 *
 * @param delay - Delay in milliseconds before the promise resolves.
 * @param options - Optional options, currently supporting `signal`.
 * @returns A promise that resolves after `delay` ms or rejects when aborted.
 * @public
 */
export async function sleep(delay: number, options: SleepOptions = {}): Promise<void> {
  if (!Number.isFinite(delay) || delay < 0) {
    return Promise.reject(new TypeError("'delay' must be a non-negative finite number"));
  }

  const { signal } = options;

  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      // oxlint-disable-next-line no-use-before-define
      cleanup();
      reject(signal?.reason);
    };

    const stop = _setTimeout(() => {
      // oxlint-disable-next-line no-use-before-define
      cleanup();
      resolve();
    }, delay);

    const cleanup = () => {
      stop();
      signal?.removeEventListener("abort", onAbort);
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
