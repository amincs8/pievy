import { isNil } from "./nil";

export function isIterable<T = unknown>(value: unknown): value is Iterable<T> {
  return !isNil(value) && typeof (value as any)[Symbol.iterator] === "function";
}

export function isAsyncIterable<T = unknown>(value: unknown): value is AsyncIterable<T> {
  return !isNil(value) && typeof (value as any)[Symbol.asyncIterator] === "function";
}
