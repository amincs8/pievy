import { isPositive, type AnyFunction } from "@pievy/types";

export interface DebounceOptions {
  delay: number;
  maxWait?: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface DebouncedFunction<Fn extends AnyFunction> {
  (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): ReturnType<Fn> | undefined;
  cancel(): void;
  flush(): ReturnType<Fn> | undefined;
}

/**
 * Creates a debounced function that delays invoking `callback` until after
 * `delay` milliseconds have elapsed since the last call.
 *
 * @param callback - The function to debounce.
 * @param options - Debounce options (`delay`, optional `maxWait`, `leading`, `trailing`).
 * @returns A debounced function with `cancel` and `flush` methods.
 * @public
 */
export function debounce<Fn extends AnyFunction>(
  callback: Fn,
  options: DebounceOptions,
): DebouncedFunction<Fn> {
  const { delay, maxWait, leading = false, trailing = true } = options;

  if (!isPositive(delay)) {
    throw new TypeError("'delay' must be a positive finite number");
  }

  if (maxWait !== undefined && (!Number.isFinite(maxWait) || maxWait < delay)) {
    throw new TypeError("'maxWait' must be a finite number greater than or equal to 'delay'");
  }

  if (!leading && !trailing) {
    throw new TypeError("At least one of 'leading' or 'trailing' must be true");
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  let maxTimer: ReturnType<typeof setTimeout> | undefined;

  let lastArgs: Parameters<Fn> | undefined;
  let lastThis!: ThisParameterType<Fn>;
  let lastResult: ReturnType<Fn> | undefined;

  const invoke = (): ReturnType<Fn> | undefined => {
    if (!lastArgs) return undefined;

    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined;

    lastResult = callback.apply(thisArg, args) as ReturnType<Fn>;

    return lastResult;
  };

  const clearMaxTimer = () => {
    if (maxTimer !== undefined) {
      clearTimeout(maxTimer);
      maxTimer = undefined;
    }
  };

  const startMaxTimer = () => {
    if (maxWait === undefined || !trailing) return;

    maxTimer = setTimeout(() => {
      maxTimer = undefined;

      // Start the next maxWait window if the debounce window is still active.
      if (timer !== undefined) {
        startMaxTimer();
      }

      if (lastArgs) {
        invoke();
      }
    }, maxWait);
  };

  const expire = () => {
    timer = undefined;
    clearMaxTimer();

    if (trailing && lastArgs) {
      invoke();
    } else {
      lastArgs = undefined;
    }
  };

  const debounced = function (
    this: ThisParameterType<Fn>,
    ...args: Parameters<Fn>
  ): ReturnType<Fn> | undefined {
    const isFirstCall = timer === undefined;

    lastArgs = args;
    lastThis = this as ThisParameterType<Fn>;

    if (timer !== undefined) {
      clearTimeout(timer);
    }

    if (isFirstCall) {
      if (leading) {
        invoke();
      }

      startMaxTimer();
    }

    timer = setTimeout(expire, delay);

    return lastResult;
  } as DebouncedFunction<Fn>;

  debounced.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }

    clearMaxTimer();
    lastArgs = undefined;
  };

  debounced.flush = () => {
    if (timer === undefined) {
      return lastResult;
    }

    clearTimeout(timer);
    timer = undefined;
    clearMaxTimer();

    if (trailing && lastArgs) {
      return invoke();
    }

    lastArgs = undefined;

    return lastResult;
  };

  return debounced;
}
