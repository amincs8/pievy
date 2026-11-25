import { isPositive } from "@pievy/types";

export type BackoffStrategy = "fixed" | "linear" | "exponential";

export interface BackoffOptions {
  strategy?: BackoffStrategy;
  delay?: number;
  factor?: number;
  maxDelay?: number;
  jitter?: boolean;
}

/**
 * Computes a backoff delay for a given attempt.
 *
 * Supports `fixed`, `linear`, and `exponential` strategies, capped at
 * `maxDelay`, with optional jitter.
 *
 * @param attempt - 1-based attempt number.
 * @param options - Backoff options (`strategy`, `delay`, `factor`, `maxDelay`, `jitter`).
 * @returns The computed delay in milliseconds.
 * @public
 */
export function backoff(attempt: number, options: BackoffOptions = {}): number {
  const {
    strategy = "exponential",
    delay = 1000,
    factor = 2,
    maxDelay = Infinity,
    jitter = false,
  } = options;

  if (!Number.isInteger(attempt) || attempt < 1) {
    throw new TypeError("'attempt' must be a positive integer");
  }

  if (!isPositive(delay)) {
    throw new TypeError("'delay' must be a positive finite number");
  }

  if (!isPositive(factor)) {
    throw new TypeError("'factor' must be a positive finite number");
  }

  if (maxDelay < 0 || Number.isNaN(maxDelay)) {
    throw new TypeError("'maxDelay' must be non-negative");
  }

  let result: number;

  switch (strategy) {
    case "fixed":
      result = delay;
      break;

    case "linear":
      result = delay * attempt;
      break;

    case "exponential":
      result = delay * factor ** (attempt - 1);
      break;

    default:
      throw new TypeError("Invalid backoff strategy");
  }

  result = Math.min(result, maxDelay);

  if (jitter) {
    result *= Math.random();
  }

  return result;
}
