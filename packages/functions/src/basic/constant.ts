/**
 * Creates a function that always returns `value`.
 *
 * @param value - The value to return.
 * @returns A function that returns `value` on every call.
 * @public
 */
export function constant<T>(value: T): () => T {
  return () => value;
}
