type ReverseResult<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? [...ReverseResult<Rest>, First]
  : [];

/**
 * Creates a function that invokes `fn` with its arguments reversed.
 *
 * @param fn - The function whose arguments should be reversed.
 * @returns A function that accepts the arguments in reverse order and calls `fn` with them in their original order.
 * @public
 */
export function reverseArgs<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): (...args: ReverseResult<Args>) => Return {
  return (...args) => fn(...(args.reverse() as unknown as Args));
}
