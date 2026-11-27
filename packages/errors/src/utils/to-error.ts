import { isError, isErrorLike } from "./";

/**
 * Converts any value to an `Error` instance.
 *
 * - If the value is already an `Error`, returns it unchanged.
 * - If the value is a string, creates an `Error` with that message.
 * - If the value is an object with a `message` property, uses that message and sets the value as the cause.
 * - Otherwise, creates a generic error with the original value as cause.
 *
 * @param value - The value to convert to an error.
 * @returns An `Error` instance.
 */
export function toError<T>(value: T): T extends Error ? T : Error {
  if (isError(value)) {
    return value as T extends Error ? T : Error;
  }

  const message =
    typeof value === "string"
      ? value
      : isErrorLike(value)
        ? value.message
        : "An unknown error occurred";

  return new Error(message, {
    cause: value,
  }) as T extends Error ? T : Error;
}
