import type { AnyFunction } from "@pievy/types";

// type Curry<Args extends unknown[], Return> = Args extends [infer First, ...infer Rest]
//   ? {
//       <Given extends [First, ...Rest[]]>(
//         ...args: Given
//       ): Given extends Args ? Return : Curry<Drop<Args, Given["length"]>, Return>;
//     }
//   : Args extends []
//     ? () => Return
//     : never;

// type Drop<
//   T extends unknown[],
//   N extends number,
//   Count extends unknown[] = [],
// > = Count["length"] extends N
//   ? T
//   : T extends [unknown, ...infer Rest]
//     ? Drop<Rest, N, [...Count, unknown]>
//     : [];

type Prefixes<T extends unknown[], Acc extends unknown[] = []> = T extends [
  infer First,
  ...infer Rest,
]
  ? [...Acc, First] | Prefixes<Rest, [...Acc, First]>
  : never;

type Drop<
  T extends unknown[],
  N extends number,
  Count extends unknown[] = [],
> = Count["length"] extends N
  ? T
  : T extends [unknown, ...infer Rest]
    ? Drop<Rest, N, [...Count, unknown]>
    : [];

type CurryResult<Args extends unknown[], Return> = Args extends [unknown, ...unknown[]]
  ? <const Given extends Prefixes<Args>>(
      ...args: Given
    ) => Given["length"] extends Args["length"]
      ? Return
      : CurryResult<Drop<Args, Given["length"]>, Return>
  : () => Return;

/**
 * Creates a curried version of `fn`.
 *
 * Arguments can be supplied incrementally; once enough arguments have been
 * collected (based on `arity`), `fn` is invoked with them.
 *
 * @param fn - The function to curry.
 * @param arity - The number of arguments required before invoking `fn`. Defaults to `fn.length`.
 * @returns A curried function.
 * @public
 */
export function curry<Fn extends AnyFunction>(
  fn: Fn,
  arity: number = fn.length,
): CurryResult<Parameters<Fn>, ReturnType<Fn>> {
  function createCurried(collected: unknown[]): unknown {
    if (collected.length >= arity) {
      return fn(...collected);
    }

    return (...args: unknown[]) => createCurried([...collected, ...args]);
  }

  if (arity <= 0) {
    return (() => fn()) as CurryResult<Parameters<Fn>, ReturnType<Fn>>;
  }

  return createCurried([]) as CurryResult<Parameters<Fn>, ReturnType<Fn>>;
}
