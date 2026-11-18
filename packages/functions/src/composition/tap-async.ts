import type { AnyFunctionAsync } from "@pievy/types";

/**
 * Creates an asynchronous function that invokes `fn` with `value` and returns
 * the original `value` after `fn` completes.
 *
 * Use `tapAsync` to perform asynchronous side effects (such as logging,
 * telemetry, or persistence) in a pipeline without replacing the current value.
 * The return value of `fn` is ignored, but mutations to `value` are preserved.
 *
 * @param fn - Asynchronous side-effect function invoked with `value`.
 * @returns An asynchronous function that awaits `fn` and returns the original `value`.
 *
 * @public
 */
export function tapAsync<T>(fn: AnyFunctionAsync<[T], unknown>): AnyFunctionAsync<[T], T> {
  return async (value: T): Promise<T> => {
    await fn(value);

    return value;
  };
}
