import { isErrorLike } from "./is-error-like";
import type { SerializedError } from "./serialize-error";

/**
 * Type guard that checks if a value is a {@link SerializedError}.
 */

export function isSerializedError(value: unknown): value is SerializedError {
  return isErrorLike(value) && "name" in value && typeof value.name === "string";
}
