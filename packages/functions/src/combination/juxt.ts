import { map } from "@pievy/collections";
import type { AnyFunction } from "@pievy/types";

type JuxtResult<Fns extends readonly AnyFunction[]> = {
  -readonly [K in keyof Fns]: ReturnType<Fns[K]>;
};

type Args<Fns extends readonly AnyFunction[]> = Parameters<Fns[0]>;

/**
 * Creates a function that applies multiple functions to the same arguments and
 * returns their results as a tuple.
 *
 * Each function receives the same input arguments; their return values are
 * collected in order and returned as an array.
 *
 * @param fns - Functions to apply to the same arguments.
 * @returns A function that takes the input arguments and returns an array of
 *   results, one per function in order.
 * @public
 */
export function juxt<
  const Fns extends readonly [AnyFunction<Args<Fns>>, ...AnyFunction<Args<Fns>>[]],
>(...fns: Fns): AnyFunction<Args<Fns>, JuxtResult<Fns>> {
  return (...args: Args<Fns>) => map(fns, (fn) => fn(...args)) as JuxtResult<Fns>;
}
