import { isSerializedError } from "./_internal";
import type { SerializedError } from "./serialize-error";

/**
 * Reconstructs an `Error` from a {@link SerializedError} object.
 *
 * Recursively deserializes the `cause` chain if it contains a serialized error.
 * Preserves the original error name, message, stack trace, and code.
 *
 * @param data - The serialized error data.
 * @returns A new `Error` instance with the original properties.
 */
export function deserializeError(data: SerializedError): Error {
  const cause =
    data.cause && isSerializedError(data.cause) ? deserializeError(data.cause) : data.cause;

  const error = new Error(data.message, { cause });

  error.name = data.name;

  if (data.stack) {
    error.stack = data.stack;
  }

  if (data.code !== undefined) {
    Object.assign(error, { code: data.code });
  }

  return error;
}
