/**
 * Creates an `AbortError` from an optional reason.
 */
export function _createAbortError(reason?: unknown): Error {
  if (reason instanceof Error) {
    return reason;
  }

  const error = new Error(reason === undefined ? "The operation was aborted" : String(reason));

  error.name = "AbortError";

  return error;
}
