import type { AnyFunctionAsync } from "@pievy/types";

type JuxtResultAsync<Fns extends readonly AnyFunctionAsync[]> = {
  -readonly [K in keyof Fns]: Awaited<ReturnType<Fns[K]>>;
};

type Args<Fns extends readonly AnyFunctionAsync[]> = Parameters<Fns[0]>;

/**
 * Creates an async function that applies multiple async functions to the same arguments and
 * returns their resolved results as a tuple.
 *
 * Each function receives the same input arguments; their resolved return values are
 * collected in order and returned as an array.
 *
 * @param fns - Async functions to apply to the same arguments.
 * @returns An async function that takes the input arguments and returns a promise
 *   resolving to an array of results, one per function in order.
 * @public
 */
export function juxtAsync<
  const Fns extends readonly [AnyFunctionAsync<Args<Fns>>, ...AnyFunctionAsync<Args<Fns>>[]],
>(...fns: Fns): AnyFunctionAsync<Args<Fns>, JuxtResultAsync<Fns>> {
  return (async (...args: Args<Fns>) => {
    const promises = [];

    for (const fn of fns) {
      promises.push(fn(...args));
    }

    return (await Promise.all(promises));
  }) as AnyFunctionAsync<Args<Fns>, JuxtResultAsync<Fns>>;
}
