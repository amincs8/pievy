/**
 * Creates a function that invokes `fn` at most once.
 *
 * The first call's result is cached and returned for all subsequent calls.
 *
 * @param fn - The function to invoke once.
 * @returns A function that calls `fn` on its first invocation and returns the cached result thereafter.
 * @public
 */

export function once<T extends (...args: any[]) => any>(
  fn: T,
): (...args: Parameters<T>) => ReturnType<T> {
  let called = false;
  let result: ReturnType<T>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    if (called) {
      return result;
    }

    const value = fn.apply(this, args);

    if (value instanceof Promise) {
      return value.then((resolved) => {
        result = resolved;
        called = true;

        return resolved;
      }) as ReturnType<T>;
    }

    result = value;
    called = true;

    return result;
  };
}
