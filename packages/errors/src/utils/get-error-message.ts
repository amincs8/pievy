/**
 * Extracts a human-readable error message from any value.
 *
 * - If the value is an `Error`, returns its `message` property.
 * - If the value is a string, returns it directly.
 * - If the value is an object with a `message` string property, returns that.
 * - Otherwise, returns `String(value)`.
 *
 * @param value - The value to extract a message from.
 * @returns A string message suitable for logging or display.
 */
export function getErrorMessage(value: unknown): string {
  if (value instanceof Error) {
    return value.message;
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }

  return String(value);
}
