import { isNil } from "./nil";

export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  return !isNil(value) && typeof (value as any)[Symbol.iterator] === "function";
}
