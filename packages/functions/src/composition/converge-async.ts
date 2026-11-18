import type { AnyFunctionAsync } from "@pievy/types";

type BranchesResultAsync<Branches extends readonly AnyFunctionAsync[]> = {
  -readonly [K in keyof Branches]: Awaited<ReturnType<Branches[K]>>;
};

type Args<Branches extends readonly AnyFunctionAsync[]> = Parameters<Branches[0]>;

type ConvergeResultAsync<
  Branches extends readonly [AnyFunctionAsync, ...AnyFunctionAsync[]],
  Transformer extends AnyFunctionAsync<BranchesResultAsync<Branches>, unknown>,
> = AnyFunctionAsync<Args<Branches>, ReturnType<Transformer>>;

/**
 * Creates an async function that applies multiple branches to the same arguments and combines their results with a transformer.
 *
 * Each branch receives the same input arguments; their resolved return values are then
 * passed as arguments to `transformer`, whose result becomes the return value.
 *
 * @param transformer - Function that combines the branch results into a single value.
 * @param branches - Async functions applied to the input arguments; their results are passed to `transformer`.
 * @returns An async function that applies every branch to the input arguments and
 *   returns the result of `transformer` applied to the branch results.
 * @public
 */
export function convergeAsync<
  const Branches extends readonly [
    AnyFunctionAsync<Args<Branches>>,
    ...AnyFunctionAsync<Args<Branches>>[],
  ],
  Transformer extends AnyFunctionAsync<BranchesResultAsync<Branches>, unknown>,
>(transformer: Transformer, branches: Branches): ConvergeResultAsync<Branches, Transformer> {
  return (async (...args: Args<Branches>) => {
    const promises = [];

    for (const branch of branches) {
      promises.push(branch(...args));
    }

    return transformer(...((await Promise.all(promises)) as BranchesResultAsync<Branches>));
  }) as ConvergeResultAsync<Branches, Transformer>;
}
