import { isFunction, isIterable, isPlainObject, type Primitive } from "@pievy/types";

import { getValue } from "../object";
import { _isDotPath } from "../object/_internal";
import type { DotPath } from "../types";

export type RecordEntry<V = unknown> = {
  key: DotPath;
  value: V;
};
export type RecordIteratee<T = unknown, V = unknown> = (value: T) => [PropertyKey, V];

export function toRecord<T>(values: Iterable<T>): Record<PropertyKey, true>;
export function toRecord<T, V extends Primitive>(
  values: Iterable<T>,
  iteratee: V,
): Record<PropertyKey, V>;
export function toRecord<T>(values: Iterable<T>, iteratee: DotPath): Record<PropertyKey, T>;
export function toRecord<T, V>(
  values: Iterable<T>,
  iteratee: RecordEntry<V>,
): Record<PropertyKey, V>;
export function toRecord<T, V>(
  values: Iterable<T>,
  iteratee: RecordIteratee<T, V>,
): Record<PropertyKey, V>;

export function toRecord<T = unknown>(values: Iterable<T>, iteratee?: unknown): unknown {
  if (!isIterable(values)) {
    throw new TypeError("'values' must be an iterable");
  }

  const result: Record<PropertyKey, unknown> = {};
  let itFunc: RecordIteratee<T, unknown>;

  if (isFunction(iteratee)) {
    itFunc = iteratee as RecordIteratee<T, unknown>;
  } else if (_isDotPath(iteratee)) {
    itFunc = (value: T) => [getValue(value as object, iteratee) as PropertyKey, value];
  } else if (isPlainObject(iteratee)) {
    const entry = iteratee as RecordEntry<V>;
    const keyPath = entry.key;
    const mappedValue = entry.value;

    if (!_isDotPath(keyPath)) {
      throw new TypeError(
        "'iteratee.key' must be a valid property path when using an object entry",
      );
    }

    if (isFunction(mappedValue)) {
      itFunc = (value: T) => [
        getValue(value as object, keyPath) as PropertyKey,
        mappedValue(value),
      ];
    } else if (_isDotPath(mappedValue)) {
      itFunc = (value: T) => [
        getValue(value as object, keyPath) as PropertyKey,
        getValue(value as object, mappedValue),
      ];
    } else {
      itFunc = (value: T) => [getValue(value as object, keyPath) as PropertyKey, mappedValue as V];
    }
  } else {
    itFunc = (value: T) => [value as PropertyKey, iteratee];
  }

  for (const value of values) {
    const [key, mappedValue] = itFunc(value);
    result[key] = mappedValue;
  }

  return result;
}
