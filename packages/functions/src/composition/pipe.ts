import { reduce, slice } from "@pievy/collections";
import type { AnyFunction } from "@pievy/types";

type PipeRest<
  Args extends unknown[],
  Current,
  Fns extends readonly AnyFunction[],
> = Fns extends readonly [
  (value: infer Input) => infer Output,
  ...infer Rest extends readonly AnyFunction[],
]
  ? [Current] extends [Input]
    ? Rest extends []
      ? (...args: Args) => Output
      : PipeRest<Args, Output, Rest>
    : never
  : never;

type Pipe<Fns extends readonly AnyFunction[]> = Fns extends readonly [
  (...args: infer Args) => infer First,
  ...infer Rest extends readonly AnyFunction[],
]
  ? Rest extends []
    ? (...args: Args) => First
    : PipeRest<Args, First, Rest>
  : never;

/**
 * Creates a function that pipelines an input value through a series of functions.
 *
 * Each function receives the return value of the previous function as its
 * argument. The final return value is the result of the last function. If the
 * composed type chain is invalid, the function is not callable at the type level.
 *
 * @param fns - Functions to pipe the value through, in order.
 * @returns A function that takes an initial value and passes it through each
 *   function in sequence, returning the final result.
 * @public
 */
export function pipe<const Fns extends readonly [AnyFunction, ...AnyFunction[]]>(
  ...fns: Fns & (Pipe<Fns> extends never ? never : unknown)
): Pipe<Fns> {
  return ((...args: unknown[]) => {
    return reduce(slice(fns as AnyFunction[], 1), (result, fn) => fn(result), fns[0](...args));
  }) as Pipe<Fns>;
}
