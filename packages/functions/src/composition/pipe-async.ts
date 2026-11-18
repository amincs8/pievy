import { reduceAsync, slice } from "@pievy/collections";
import type { AnyFunctionAsync } from "@pievy/types";

type PipeAsyncRest<
  Args extends unknown[],
  Current,
  Fns extends readonly AnyFunctionAsync[],
> = Fns extends readonly [
  (value: infer Input) => infer Output,
  ...infer Rest extends readonly AnyFunctionAsync[],
]
  ? [Current] extends [Input]
    ? Rest extends []
      ? (...args: Args) => Promise<Awaited<Output>>
      : PipeAsyncRest<Args, Awaited<Output>, Rest>
    : never
  : never;

type PipeAsync<Fns extends readonly AnyFunctionAsync[]> = Fns extends readonly [
  (...args: infer Args) => infer First,
  ...infer Rest extends readonly AnyFunctionAsync[],
]
  ? Rest extends []
    ? (...args: Args) => Promise<Awaited<First>>
    : PipeAsyncRest<Args, Awaited<First>, Rest>
  : never;

/**
 * Creates an async function that pipelines an input value through a series of async functions.
 *
 * Each function receives the resolved value of the previous function as its
 * argument. The final return value is the resolved result of the last function.
 * If the composed type chain is invalid, the function is not callable at the type level.
 *
 * @param fns - Async functions to pipe the value through, in order.
 * @returns An async function that takes an initial value and passes it through
 *   each function in sequence, returning the final resolved result.
 * @public
 */
export function pipeAsync<const Fns extends readonly [AnyFunctionAsync, ...AnyFunctionAsync[]]>(
  ...fns: Fns & (PipeAsync<Fns> extends never ? never : unknown)
): PipeAsync<Fns> {
  return (async (...args: unknown[]) => {
    return reduceAsync(
      slice(fns as AnyFunctionAsync[], 1),
      (result, fn) => fn(result),
      await fns[0](...args),
    );
  }) as PipeAsync<Fns>;
}
