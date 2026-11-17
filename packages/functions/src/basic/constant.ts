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

/**
 * Creates an async function that resolves to `value`.
 *
 * @param value - The value to resolve with.
 * @returns A function that returns a promise resolving to `value` on every call.
 * @public
 */
export function constantAsync<T>(value: T): () => Promise<Awaited<T>> {
  return () => Promise.resolve(value);
}
