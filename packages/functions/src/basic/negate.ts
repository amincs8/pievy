/**
 * Creates a function that negates the result of `fn`.
 *
 * @param fn - The function to negate.
 * @returns A function that returns `true` when `fn` returns a falsy value, otherwise `false`.
 * @public
 */
export function negate<T extends (...args: any[]) => unknown>(
  fn: T,
): (...args: Parameters<T>) => boolean {
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): boolean {
    return !fn.apply(this, args);
  };
}

/**
 * Creates an async function that negates the result of `fn`.
 *
 * @param fn - The async function to negate.
 * @returns An async function that returns `true` when `fn` resolves to a falsy value, otherwise `false`.
 * @public
 */
export function negateAsync<T extends (...args: any[]) => unknown>(
  fn: T,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => Promise<boolean> {
  return async function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<boolean> {
    return !(await fn.apply(this, args));
  };
}
