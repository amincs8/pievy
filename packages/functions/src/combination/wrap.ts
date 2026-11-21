import type { AnyFunction } from "@pievy/types";

/**
 * Creates a function that wraps `fn` with `wrapper`.
 *
 * `wrapper` receives `fn` as its first argument followed by the original
 * arguments, allowing it to invoke (or not invoke) `fn` and transform its
 * result.
 *
 * @param fn - The function to wrap.
 * @param wrapper - Wrapper function invoked as `wrapper(fn, ...args)`.
 * @returns A function that calls `wrapper(fn, ...args)` with the original arguments.
 * @public
 */
export function wrap<Fn extends AnyFunction>(
  fn: Fn,
  wrapper: AnyFunction<[Fn, ...Parameters<Fn>], ReturnType<Fn>>,
): AnyFunction<[...Parameters<Fn>], ReturnType<Fn>> {
  return (...args: Parameters<Fn>) => wrapper(fn, ...args);
}
