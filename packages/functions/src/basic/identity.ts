/**
 * Returns the value passed to it.
 *
 * @param value - The value to return.
 * @returns `value`.
 * @public
 */
export function identity<T>(value: T): T {
  return value;
}

/**
 * Asynchronously returns the value passed to it.
 *
 * @param value - The value to resolve with.
 * @returns A promise that resolves to `value`.
 * @public
 */
export function identityAsync<T>(value: T): Promise<T> {
  return Promise.resolve(value);
}
