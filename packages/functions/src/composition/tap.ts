import type { AnyFunction } from "@pievy/types";

/**
 * Creates a function that invokes `fn` with `value` and returns the original `value`.
 *
 * Use `tap` to perform side effects (such as logging or telemetry) in a pipeline
 * without replacing the current value. The return value of `fn` is ignored,
 * but mutations to `value` are preserved.
 *
 * @param fn - Side-effect function invoked with `value`.
 * @returns A function that invokes `fn` and returns the original `value`.
 *
 * @public
 */
export function tap<T>(fn: AnyFunction<[T], unknown>): AnyFunction<[T], T> {
  return (value: T): T => {
    fn(value);

    return value;
  };
}
