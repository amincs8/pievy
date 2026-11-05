export type AnyFunction<T = unknown> = (...args: any[]) => T;

export function isFunction<T extends AnyFunction = AnyFunction>(value: unknown): value is T {
  return typeof value === "function";
}
