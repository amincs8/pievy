import type { AnyFunction } from "@pievy/types";

/**
 * Schedules `callback` to run after `delay` ms, preferring
 * `requestAnimationFrame` when available and falling back to `setTimeout`.
 *
 * @param callback - Function to invoke after the delay.
 * @param delay - Delay in milliseconds. Defaults to `0`.
 * @param args - Arguments forwarded to `callback`.
 * @returns A cancel function that prevents the scheduled invocation.
 * @public
 */
export function scheduleTimeout<Fn extends AnyFunction>(
  callback: Fn,
  delay = 0,
  ...args: Parameters<Fn>
): () => void {
  let stopped = false;
  let animationId: number | undefined;

  const raf = globalThis.requestAnimationFrame;
  const cancelRaf = globalThis.cancelAnimationFrame;

  const stop = () => {
    if (stopped) return;

    stopped = true;
  };

  if (typeof raf === "function" && typeof cancelRaf === "function") {
    const startTime = performance.now();

    const loop = (now: number) => {
      if (stopped) return;

      if (now - startTime >= delay) {
        stopped = true;
        callback(...args);
      } else {
        animationId = raf(loop);
      }
    };

    animationId = raf(loop);

    return () => {
      stop();
      if (animationId !== undefined) {
        cancelRaf(animationId);
      }
    };
  }

  const timeout = setTimeout(callback, delay, ...args);

  return () => {
    stop();
    clearTimeout(timeout);
  };
}
