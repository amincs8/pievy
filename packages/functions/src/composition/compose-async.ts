import type { AnyFunctionAsync } from "@pievy/types";

type ComposeRestAsync<
  Args extends unknown[],
  Current,
  Fns extends readonly AnyFunctionAsync[],
> = Fns extends readonly [
  ...infer Rest extends readonly AnyFunctionAsync[],
  (value: infer Input) => infer Output,
]
  ? [Current] extends [Input]
    ? Rest extends []
      ? (...args: Args) => Promise<Awaited<Output>>
      : ComposeRestAsync<Args, Awaited<Output>, Rest>
    : never
  : never;

type ComposeAsync<Fns extends readonly AnyFunctionAsync[]> = Fns extends readonly [
  ...infer Rest extends readonly AnyFunctionAsync[],
  (...args: infer Args) => infer Result,
]
  ? Rest extends []
    ? (...args: Args) => Promise<Awaited<Result>>
    : ComposeRestAsync<Args, Awaited<Result>, Rest>
  : never;

/**
 * Creates an async function that composes a series of async functions from right to left.
 *
 * The rightmost function is applied first to the input arguments, and each
 * subsequent (leftward) function receives the resolved result of the previous one.
 * This is the reverse of `pipeAsync`, which applies functions left to right.
 *
 * @param fns - Async functions to compose, in left-to-right order of application
 *   (rightmost is applied first).
 * @returns An async function that applies the composed functions right-to-left
 *   and returns the final resolved result.
 * @public
 */
export function composeAsync<const Fns extends readonly [AnyFunctionAsync, ...AnyFunctionAsync[]]>(
  ...fns: Fns & (ComposeAsync<Fns> extends never ? never : unknown)
): ComposeAsync<Fns> {
  return (async (...args: unknown[]) => {
    let result = await fns[fns.length - 1]!(...args);

    for (let i = fns.length - 2; i >= 0; i--) {
      result = await fns[i]!(result);
    }

    return result;
  }) as ComposeAsync<Fns>;
}
