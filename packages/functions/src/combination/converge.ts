import { map } from "@pievy/collections";
import type { AnyFunction } from "@pievy/types";

type BranchesResult<Branches extends readonly AnyFunction[]> = {
  -readonly [K in keyof Branches]: ReturnType<Branches[K]>;
};

type Args<Branches extends readonly AnyFunction[]> = Parameters<Branches[0]>;

type ConvergeResult<
  Branches extends readonly [AnyFunction, ...AnyFunction[]],
  Transformer extends AnyFunction<BranchesResult<Branches>, unknown>,
> = AnyFunction<Args<Branches>, ReturnType<Transformer>>;

/**
 * Creates a function that applies multiple branches to the same arguments and combines their results with a transformer.
 *
 * Each branch receives the same input arguments; their return values are then
 * passed as arguments to `transformer`, whose result becomes the return value.
 *
 * @param transformer - Function that combines the branch results into a single value.
 * @param branches - Functions applied to the input arguments; their results are passed to `transformer`.
 * @returns A function that applies every branch to the input arguments and
 *   returns the result of `transformer` applied to the branch results.
 * @public
 */
export function converge<
  const Branches extends readonly [AnyFunction<Args<Branches>>, ...AnyFunction<Args<Branches>>[]],
  Transformer extends AnyFunction<BranchesResult<Branches>, unknown>,
>(transformer: Transformer, branches: Branches): ConvergeResult<Branches, Transformer> {
  return ((...args: Args<Branches>) => {
    return transformer(...(map(branches, (branch) => branch(...args)) as BranchesResult<Branches>));
  }) as ConvergeResult<Branches, Transformer>;
}
