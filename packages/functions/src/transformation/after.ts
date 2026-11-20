import type { AnyFunction } from "@pievy/types";

/**
 * Creates a function that invokes `fn` only after it has been called `count` times.
 *
 * Until `count` calls have occurred, the returned function does nothing and
 * returns `undefined`. Once the threshold is reached, `fn` is invoked with the
 * arguments of that (and subsequent) calls.
 *
 * @param count - Number of calls before `fn` is invoked.
 * @param fn - The function to wrap.
 * @returns A wrapped function that invokes `fn` after `count` calls.
 * @public
 */
export function after<Fn extends AnyFunction>(count: number, fn: Fn): Fn {
  let remaining = count - 1;

  return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
    if (--remaining < 0) {
      return fn.apply(this, args);
    }
  } as Fn;
}
