import { _createError } from "./_internal";
import type { ResultError, ResultOk } from "./types";

/**
 * Wraps a successful value in a {@link ResultOk}.
 */
export function resultOk<T>(value: T): ResultOk<T> {
  return {
    isOk: true,
    value,
  };
}

/**
 * Wraps an error in a {@link ResultError}.
 */
export function resultError<E = unknown>(error: E): ResultError<E extends Error ? E : Error> {
  return {
    error: _createError(error),
    isOk: false,
  };
}
