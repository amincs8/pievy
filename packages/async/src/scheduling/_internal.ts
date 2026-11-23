import type { AnyFunction } from "@pievy/types";

export function _setTimeout<Fn extends AnyFunction>(
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
