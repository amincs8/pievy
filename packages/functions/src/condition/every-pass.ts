import { every } from "@pievy/collections";
import type { AnyFunction } from "@pievy/types";

/**
 * Creates a function that returns `true` only if every predicate returns `true`.
 *
 * Predicates are evaluated in order and evaluation stops at the first predicate
 * that returns `false` (short-circuit). Arguments are forwarded to each
 * predicate that is evaluated.
 *
 * Accepts predicates either as individual arguments or as a single array.
 *
 * @param predicates - Predicate functions to test against the same arguments,
 *   either as rest arguments or a single readonly array.
 * @returns A function that invokes each predicate with the given arguments and
 *   returns `true` when all of them return `true`; returns `true` for no
 *   predicates.
 * @public
 */
export function everyPass<Args extends unknown[]>(
  predicates: readonly AnyFunction<Args, boolean>[],
): AnyFunction<Args, boolean>;

export function everyPass<Args extends unknown[]>(
  ...predicates: readonly AnyFunction<Args, boolean>[]
): AnyFunction<Args, boolean>;

export function everyPass<Args extends unknown[]>(
  ...args: [readonly AnyFunction<Args, boolean>[]] | readonly AnyFunction<Args, boolean>[]
): AnyFunction<Args, boolean> {
  const predicates: readonly AnyFunction<Args, boolean>[] =
    args.length === 1 && Array.isArray(args[0]) ? args[0] : (args as AnyFunction<Args, boolean>[]);

  return (...nargs: Args): boolean => {
    return every(predicates, (predicate) => predicate(...nargs));
  };
}
