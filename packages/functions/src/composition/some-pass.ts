import { some } from "@pievy/collections";
import type { AnyFunction } from "@pievy/types";

/**
 * Creates a function that returns `true` if any predicate returns `true`.
 *
 * Predicates are evaluated in order and evaluation stops at the first predicate
 * that returns `true` (short-circuit). Arguments are forwarded to each
 * predicate that is evaluated.
 *
 * Accepts predicates either as individual arguments or as a single array.
 *
 * @param predicates - Predicate functions to test against the same arguments,
 *   either as rest arguments or a single readonly array.
 * @returns A function that invokes each predicate with the given arguments and
 *   returns `true` when any of them returns `true`; returns `false` for no
 *   predicates.
 * @public
 */
export function somePass<Args extends unknown[]>(
  predicates: readonly AnyFunction<Args, boolean>[],
): AnyFunction<Args, boolean>;

export function somePass<Args extends unknown[]>(
  ...predicates: readonly AnyFunction<Args, boolean>[]
): AnyFunction<Args, boolean>;

export function somePass<Args extends unknown[]>(
  ...args: [readonly AnyFunction<Args, boolean>[]] | readonly AnyFunction<Args, boolean>[]
): AnyFunction<Args, boolean> {
  const predicates: readonly AnyFunction<Args, boolean>[] =
    args.length === 1 && Array.isArray(args[0]) ? args[0] : (args as AnyFunction<Args, boolean>[]);

  return (...nargs: Args): boolean => {
    return some(predicates, (predicate) => predicate(...nargs));
  };
}
