import { map } from "@pievy/collections";
import type { AnyFunction } from "@pievy/types";

type ReargResult<Args extends readonly unknown[], Indexes extends readonly number[]> = {
  -readonly [K in keyof Indexes]: Indexes[K] extends keyof Args ? Args[Indexes[K]] : never;
};

/**
 * Creates a function that invokes `fn` with arguments rearranged according to `indexes`.
 *
 * `indexes[i]` specifies which argument of the new function is passed as the
 * `i`-th argument of `fn`.
 *
 * @param fn - The function whose arguments should be rearranged.
 * @param indexes - Array of indices defining the new argument order.
 * @returns A function that calls `fn` with reordered arguments.
 * @public
 */
export function rearg<Fn extends AnyFunction, const Indexes extends readonly number[]>(
  fn: Fn,
  indexes: Indexes,
): AnyFunction<ReargResult<Parameters<Fn>, Indexes>, ReturnType<Fn>> {
  return ((...args) => {
    const reordered = map(indexes, (index) => args[index]);

    return fn(...(reordered as Parameters<Fn>));
  }) as AnyFunction<ReargResult<Parameters<Fn>, Indexes>, ReturnType<Fn>>;
}
