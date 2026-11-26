import { isPositive } from "@pievy/types";

import type { EventEmitter } from "../core";
import type { EventArgs, EventMap } from "../types";
import { _createAbortError } from "./_internal";

/**
 * Options for {@link waitForEvent}.
 */
export interface WaitForOptions {
  /**
   * Timeout in milliseconds.
   */
  timeout?: number;
  /**
   * Optional `AbortSignal` to cancel waiting.
   */
  signal?: AbortSignal;
}

/**
 * Waits for an event to be emitted, with optional timeout and abort signal.
 *
 * @param emitter - The event emitter to listen on.
 * @param event - The event name to wait for.
 * @param options - Timeout and/or abort signal.
 * @returns A promise resolving with the event payload.
 * @throws {TypeError} If timeout is not positive.
 * @throws If timeout elapses or signal aborts.
 */
export function waitForEvent<Events extends EventMap, K extends keyof Events>(
  emitter: EventEmitter<Events>,
  event: K,
  options: WaitForOptions = {},
): Promise<Events[K]> {
  const { timeout, signal } = options;

  if (timeout !== undefined && !isPositive(timeout)) {
    return Promise.reject(new TypeError("'timeout' must be a positive finite number"));
  }

  if (signal?.aborted) {
    return Promise.reject(_createAbortError(signal.reason));
  }

  return new Promise<Events[K]>((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settled = false;

    const cleanup = () => {
      // oxlint-disable-next-line no-use-before-define
      subscription.unsubscribe();

      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }

      // oxlint-disable-next-line no-use-before-define
      signal?.removeEventListener("abort", onAbort);
    };

    const settle = (callback: () => void) => {
      if (settled) return;

      settled = true;
      cleanup();
      callback();
    };

    const onAbort = () => {
      settle(() => {
        reject(_createAbortError(signal?.reason));
      });
    };

    const subscription = emitter.once(event, (...args: EventArgs<Events[K]>) => {
      settle(() => resolve(args[0] as Events[K]));
    });

    signal?.addEventListener("abort", onAbort, { once: true });

    if (timeout !== undefined) {
      timer = setTimeout(() => {
        settle(() => {
          reject(new Error(`Event "${String(event)}" timed out`));
        });
      }, timeout);
    }
  });
}
