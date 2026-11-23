import { isBoolean, isPositive, type AnyFunction } from "@pievy/types";

import { _setTimeout } from "./_internal";

export interface IntervalOptions<Fn extends AnyFunction> {
  timeout: number;
  immediate?: boolean;
  handlerArgs?: Parameters<Fn>;
  repeatCount?: number;
}

export interface IntervalResult<Fn extends AnyFunction> {
  start: (...args: Parameters<Fn>) => void;
  pause: () => void;
  stop: () => void;
}

export function interval<Fn extends AnyFunction>(
  handler: Fn,
  options: IntervalOptions<Fn>,
): IntervalResult<Fn>;

export function interval<Fn extends AnyFunction>(
  handler: Fn,
  timeout: number,
  ...args: Parameters<Fn>
): IntervalResult<Fn>;

export function interval<Fn extends AnyFunction>(
  handler: Fn,
  optionsOrTimeout: IntervalOptions<Fn> | number,
  ...handlerArgs: Parameters<Fn>
): IntervalResult<Fn> {
  const options: Required<IntervalOptions<Fn>> =
    typeof optionsOrTimeout === "number"
      ? {
          handlerArgs,
          immediate: true,
          repeatCount: Infinity,
          timeout: optionsOrTimeout,
        }
      : {
          handlerArgs: optionsOrTimeout.handlerArgs ?? ([] as unknown as Parameters<Fn>),
          immediate: optionsOrTimeout.immediate ?? true,
          repeatCount: optionsOrTimeout.repeatCount ?? Infinity,
          timeout: optionsOrTimeout.timeout,
        };

  if (!isPositive(options.timeout)) {
    throw new TypeError("'timeout' must be a positive finite number");
  }

  if (!isBoolean(options.immediate)) {
    throw new TypeError("'immediate' must be a boolean");
  }

  if (
    options.repeatCount !== Infinity &&
    (!Number.isInteger(options.repeatCount) || options.repeatCount <= 0)
  ) {
    throw new TypeError("'repeatCount' must be a positive integer");
  }

  let timer: (() => void) | null = null;

  let isPaused = true;
  let isStopped = false;

  let repeatCount = 0;

  let remainingTime = options.timeout;
  let scheduledAt = 0;
  let scheduledDelay = 0;
  let nextDelay = options.timeout;

  let currentArgs = options.handlerArgs;

  const now = () => globalThis.performance.now();

  const schedule = (delay: number) => {
    if (isStopped || isPaused) return;

    scheduledAt = now();
    scheduledDelay = delay;
    remainingTime = delay;

    // oxlint-disable-next-line no-use-before-define
    timer = _setTimeout(run, delay);
  };

  const pause = () => {
    if (isPaused || isStopped) return;

    isPaused = true;

    if (timer) {
      remainingTime = Math.max(0, scheduledDelay - (now() - scheduledAt));

      timer();
      timer = null;
    }
  };

  const stop = () => {
    if (isStopped) return;

    isStopped = true;
    isPaused = true;
    remainingTime = 0;

    timer?.();
    timer = null;
  };

  const run = () => {
    timer = null;
    remainingTime = 0;

    if (isStopped || isPaused) return;

    ++repeatCount;

    const result = handler(...currentArgs);

    if (result === null || repeatCount >= options.repeatCount) {
      stop();
      return;
    }

    if (isPositive(result)) {
      nextDelay = result;
    }

    if (isStopped || isPaused) return;

    schedule(nextDelay);
  };

  const start = (...args: Parameters<Fn>) => {
    if (isStopped) {
      throw new Error("Cannot start a stopped interval");
    }

    if (args.length > 0) {
      currentArgs = args;
    }

    isPaused = false;

    if (options.immediate && repeatCount === 0) {
      run();
    } else {
      schedule(remainingTime);
    }
  };

  start(...options.handlerArgs);

  return { pause, start, stop };
}
