import type { AnyFunction } from "@pievy/types";

/**
 * Creates a function that invokes `fn` at most `count - 1` times.
 *
 * After `count - 1` invocations, subsequent calls return the result of the last
 * invocation without calling `fn` again.
 *
 * @param count - Number of calls after which `fn` is no longer invoked.
 * @param fn - The function to wrap.
 * @returns A wrapped function that invokes `fn` while its call count is less
 *   than `count`.
 * @public
 */
export function before<Fn extends AnyFunction>(count: number, fn: Fn): Fn {
  let remaining = count - 1;
  let result: ReturnType<Fn>;

  return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
    if (remaining > 0) {
      --remaining;
      result = fn.apply(this, args) as ReturnType<Fn>;
    }

    return result;
  } as Fn;
}
