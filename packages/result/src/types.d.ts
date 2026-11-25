import type { XOR } from "@pievy/types";

/**
 * A successful result wrapping a value.
 */
export type ResultOk<T> = {
  readonly isOk: true;
  readonly value: T;
};

/**
 * A failed result wrapping an error.
 */
export type ResultError<E extends Error> = {
  readonly isOk: false;
  readonly error: E;
};

/**
 * A Result is either Ok or Err.
 */
export type Result<T, E extends Error = Error> = XOR<ResultOk<T>, ResultError<E>>;
