import type { AnyFunction } from "@pievy/types";

type ComposeRest<
  Args extends unknown[],
  Current,
  Fns extends readonly AnyFunction[],
> = Fns extends readonly [
  ...infer Rest extends readonly AnyFunction[],
  (value: infer Input) => infer Output,
]
  ? [Current] extends [Input]
    ? Rest extends []
      ? (...args: Args) => Output
      : ComposeRest<Args, Output, Rest>
    : never
  : never;

type Compose<Fns extends readonly AnyFunction[]> = Fns extends readonly [
  ...infer Rest extends readonly AnyFunction[],
  (...args: infer Args) => infer Result,
]
  ? Rest extends []
    ? (...args: Args) => Result
    : ComposeRest<Args, Result, Rest>
  : never;

/**
 * Creates a function that composes a series of functions from right to left.
 *
 * The rightmost function is applied first to the input arguments, and each
 * subsequent (leftward) function receives the result of the previous one. This
 * is the reverse of `pipe`, which applies functions left to right.
 *
 * @param fns - Functions to compose, in left-to-right order of application
 *   (rightmost is applied first).
 * @returns A function that applies the composed functions right-to-left and
 *   returns the final result.
 * @public
 */
export function compose<const Fns extends readonly [AnyFunction, ...AnyFunction[]]>(
  ...fns: Fns & (Compose<Fns> extends never ? never : unknown)
): Compose<Fns> {
  return ((...args: unknown[]) => {
    let result = fns[fns.length - 1]!(...args);

    for (let i = fns.length - 2; i >= 0; i--) {
      result = fns[i]!(result);
    }

    return result;
  }) as Compose<Fns>;
}
