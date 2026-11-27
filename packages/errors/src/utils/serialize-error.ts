/**
 * A plain object representation of an error suitable for JSON serialization.
 */
export interface SerializedError {
  /** The error's name (e.g., "Error", "TypeError"). */
  name: string;
  /** The error message. */
  message: string;
  /** The stack trace, if available. */
  stack?: string;
  /** The error code, if present. */
  code?: string;
  /** The cause of the error, recursively serialized if it's an Error. */
  cause?: unknown;
}

/**
 * Internal: recursively serializes an error, handling circular references.
 */
function _serializeError(error: Error, seen: WeakSet<object>): SerializedError {
  if (seen.has(error)) {
    return {
      message: error.message,
      name: error.name,
    };
  }

  seen.add(error);

  const serialized: SerializedError = {
    message: error.message,
    name: error.name,
  };

  if (error.stack) {
    serialized.stack = error.stack;
  }

  if ("code" in error && error.code != null) {
    serialized.code = String(error.code);
  }

  if ("cause" in error) {
    const cause = error.cause;

    serialized.cause = cause instanceof Error ? _serializeError(cause, seen) : cause;
  }

  return serialized;
}

/**
 * Serializes an `Error` into a plain object suitable for JSON serialization.
 *
 * Handles circular references in cause chains and includes stack trace,
 * error code, and cause if present.
 *
 * @param error - The error to serialize.
 * @returns A {@link SerializedError} object.
 */
export function serializeError(error: Error): SerializedError {
  return _serializeError(error, new WeakSet<object>());
}
