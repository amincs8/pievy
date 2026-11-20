import type { AnyFunction } from "@pievy/types";

/**
 * Creates a function that invokes `fn` with at most `argCount` arguments.
 *
 * Any arguments beyond `argCount` are discarded before calling `fn`.
 *
 * @param fn - The function to wrap.
 * @param argCount - Maximum number of arguments to pass to `fn`.
 * @returns A wrapped function that calls `fn` with at most `argCount` arguments.
 * @public
 */
export function ary<Fn extends AnyFunction>(
  fn: Fn,
  argCount: number,
): AnyFunction<Array<Parameters<Fn>[number]>, ReturnType<Fn>> {
  return function (
    this: ThisParameterType<Fn>,
    ...args: Array<Parameters<Fn>[number]>
  ): ReturnType<Fn> {
    return fn.apply(this, args.slice(0, argCount > 0 ? argCount : 0)) as ReturnType<Fn>;
  };
}
