/**
 * Creates an `AbortSignal` that aborts when any of the provided signals aborts.
 *
 * @param signals - Abort signals to combine.
 * @returns A new `AbortSignal` that aborts when any input signal aborts.
 * @public
 */
export function anySignal(signals: readonly AbortSignal[] = []): AbortSignal {
  const controller = new AbortController();

  if (signals.length === 0) {
    return controller.signal;
  }

  const cleanup = () => {
    for (const signal of signals) {
      // oxlint-disable-next-line no-use-before-define
      signal.removeEventListener("abort", onAbort);
    }
  };

  const onAbort = (event: Event) => {
    const signal = event.target as AbortSignal;

    if (controller.signal.aborted) return;

    cleanup();
    controller.abort(signal.reason);
  };

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
  }

  for (const signal of signals) {
    signal.addEventListener("abort", onAbort, { once: true });
  }

  return controller.signal;
}
