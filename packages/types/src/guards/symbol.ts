/**
 * Checks whether a value is a symbol.
 *
 * @param value - The value to inspect.
 * @returns `true` when `value` is a symbol; otherwise `false`.
 *
 * @example
 * ```ts
 * isSymbol(Symbol("id")); // true
 * isSymbol("id"); // false
 * ```
 * @public
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === "symbol";
}
