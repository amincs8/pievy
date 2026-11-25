import { isPositive, type AnyFunction } from "@pievy/types";

export interface ThrottleOptions {
  wait: number;
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottledFunction<Fn extends AnyFunction> {
  (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): ReturnType<Fn> | undefined;
  cancel(): void;
  flush(): ReturnType<Fn> | undefined;
}

/**
 * Creates a throttled function that invokes `callback` at most once per `wait`
 * milliseconds.
 *
 * @param callback - The function to throttle.
 * @param options - Throttle options (`wait`, optional `leading`, `trailing`).
 * @returns A throttled function with `cancel` and `flush` methods.
 * @public
 */
export function throttle<Fn extends AnyFunction>(
  callback: Fn,
  options: ThrottleOptions,
): ThrottledFunction<Fn> {
  const { wait, leading = true, trailing = true } = options;

  if (!isPositive(wait)) {
    throw new TypeError("'wait' must be a non-negative finite number");
  }

  if (!leading && !trailing) {
    throw new TypeError("At least one of 'leading' or 'trailing' must be true");
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
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

  const expire = () => {
    timer = undefined;

    if (trailing && lastArgs) {
      invoke();
    } else {
      lastArgs = undefined;
    }
  };

  const throttled = function (
    this: ThisParameterType<Fn>,
    ...args: Parameters<Fn>
  ): ReturnType<Fn> | undefined {
    const isFirstCall = timer === undefined;

    lastArgs = args;
    lastThis = this as ThisParameterType<Fn>;

    if (isFirstCall) {
      if (leading) {
        invoke();
      }

      timer = setTimeout(expire, wait);
    }

    return lastResult;
  } as ThrottledFunction<Fn>;

  throttled.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }

    lastArgs = undefined;
  };

  throttled.flush = () => {
    if (timer === undefined) {
      return lastResult;
    }

    clearTimeout(timer);
    timer = undefined;

    if (trailing && lastArgs) {
      return invoke();
    }

    lastArgs = undefined;

    return lastResult;
  };

  return throttled;
}
