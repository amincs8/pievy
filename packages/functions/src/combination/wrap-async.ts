import type { AnyFunctionAsync } from "@pievy/types";

/**
 * Creates an async function that wraps `fn` with `wrapper`.
 *
 * `wrapper` receives `fn` as its first argument followed by the original
 * arguments, allowing it to await (or skip) `fn` and transform its result.
 *
 * @param fn - The async function to wrap.
 * @param wrapper - Async wrapper function invoked as `wrapper(fn, ...args)`.
 * @returns An async function that calls `wrapper(fn, ...args)` with the original arguments.
 * @public
 */
export function wrapAsync<Fn extends AnyFunctionAsync>(
  fn: Fn,
  wrapper: AnyFunctionAsync<[Fn, ...Parameters<Fn>], Awaited<ReturnType<Fn>>>,
): AnyFunctionAsync<[...Parameters<Fn>], Awaited<ReturnType<Fn>>> {
  return async (...args: Parameters<Fn>) => wrapper(fn, ...args);
}
