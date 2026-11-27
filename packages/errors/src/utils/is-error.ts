/**
 * Type guard that checks if a value is an `Error` instance.
 *
 * @param value - The value to check.
 * @returns `true` if the value is an `Error`, `false` otherwise.
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}
