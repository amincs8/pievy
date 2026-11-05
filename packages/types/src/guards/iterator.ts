import { isFunction } from "./function";
import { isObject } from "./object";

export function isIterator<T = unknown>(value: unknown): value is Iterator<T> {
  return (isObject(value) || isFunction(value)) && isFunction((value as Iterator<T>).next);
}
