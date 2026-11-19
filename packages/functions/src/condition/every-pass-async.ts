import { everyAsync } from "@pievy/collections";
import type { AnyFunctionAsync } from "@pievy/types";

/**
 * Creates an async function that returns `true` only if every predicate returns `true`.
 *
 * Predicates are evaluated in order and evaluation stops at the first predicate
 * that returns `false` (short-circuit). Arguments are forwarded to each
 * predicate that is evaluated.
 *
 * Accepts predicates either as individual arguments or as a single array.
 *
 * @param predicates - Async predicate functions to test against the same
 *   arguments, either as rest arguments or a single readonly array.
 * @returns An async function that invokes each predicate with the given
 *   arguments and returns `true` when all of them return `true`; returns `true`
 *   for no predicates.
 * @public
 */
export function everyPassAsync<Args extends unknown[]>(
  predicates: readonly AnyFunctionAsync<Args, boolean>[],
): AnyFunctionAsync<Args, boolean>;

export function everyPassAsync<Args extends unknown[]>(
  ...predicates: readonly AnyFunctionAsync<Args, boolean>[]
): AnyFunctionAsync<Args, boolean>;

export function everyPassAsync<Args extends unknown[]>(
  ...args: [readonly AnyFunctionAsync<Args, boolean>[]] | readonly AnyFunctionAsync<Args, boolean>[]
): AnyFunctionAsync<Args, boolean> {
  const predicates: readonly AnyFunctionAsync<Args, boolean>[] =
    args.length === 1 && Array.isArray(args[0])
      ? args[0]
      : (args as AnyFunctionAsync<Args, boolean>[]);

  return (...nargs: Args): Promise<boolean> => {
    return everyAsync(predicates, (predicate) => predicate(...nargs));
  };
}
