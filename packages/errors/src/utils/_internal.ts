import type { SerializedError } from "./serialize-error";

/**
 * Type guard that checks if a value is a {@link SerializedError}.
 */
export function isSerializedError(value: unknown): value is SerializedError {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string" &&
    "message" in value &&
    typeof value.message === "string"
  );
}
