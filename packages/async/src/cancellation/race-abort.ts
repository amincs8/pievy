/**
 * Races a promise against an `AbortSignal`, rejecting with the signal's
 * reason if it aborts before the promise settles.
 *
 * @param promise - The promise (or thenable) to race.
 * @param signal - Optional `AbortSignal` to race against.
 * @returns A promise resolving with the input's value, or rejecting with
 *   the signal's reason / the input's rejection.
 */
export function raceAbort<T>(promise: PromiseLike<T>, signal?: AbortSignal): Promise<Awaited<T>> {
  if (!signal) {
    return Promise.resolve(promise) as Promise<Awaited<T>>;
  }

  if (signal.aborted) {
    return Promise.reject(signal.reason);
  }

  return new Promise<Awaited<T>>((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      // oxlint-disable-next-line no-use-before-define
      signal.removeEventListener("abort", onAbort);
    };

    const settle = (callback: () => void) => {
      if (settled) return;

      settled = true;
      cleanup();
      callback();
    };

    const onAbort = () => {
      settle(() => reject(signal.reason));
    };

    signal.addEventListener("abort", onAbort, { once: true });

    // Protect against an abort occurring around listener registration.
    if (signal.aborted) {
      onAbort();
      return;
    }

    Promise.resolve(promise).then(
      (value) => settle(() => resolve(value as Awaited<T>)),
      (error) => settle(() => reject(error)),
    );
  });
}
