/**
 * An object that resembles an error with a required message property.
 */
export interface ErrorLike {
  /** The error name (e.g., "Error", "TypeError"). */
  name?: string;
  /** The error message. */
  message: string;
  /** The stack trace, if available. */
  stack?: string;
  /** The cause of the error. */
  cause?: unknown;
}

/**
 * Type guard that checks if a value is an error-like object.
 *
 * An error-like object must have a `message` property of type `string`.
 *
 * @param value - The value to check.
 * @returns `true` if the value has a string `message` property, `false` otherwise.
 */
export function isErrorLike(value: unknown): value is ErrorLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}
