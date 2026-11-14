import { isFunction, isIterable, isPlainObject, isString, type Primitive } from "@pievy/types";

import { getValue } from "../object";
import { _isDotPath } from "../object/_internal";
import type { DotPath } from "../types";

/**
 * Transforms a value into a `[key, value]` pair for the resulting record.
 */
export type RecordIteratee<T = unknown, V = unknown> = (value: T) => [PropertyKey, V];

/**
 * Describes a record entry whose key is resolved from a dot path and whose value
 * is either a constant or a mapped value derived from the input item.
 */
export type RecordEntry<T = unknown, V = unknown> = {
  key: DotPath;
  value: RecordIteratee<T, V> | DotPath | T;
};

/**
 * Creates a record using a callback that returns `[key, value]` pairs.
 */
export function toRecord<T, V>(
  values: Iterable<T>,
  iteratee: RecordIteratee<T, V>,
): Record<PropertyKey, V>;

/**
 * Creates a record using a descriptor with a value-mapping callback.
 */
export function toRecord<T, V>(
  values: Iterable<T>,
  iteratee: { key: DotPath; value: (value: T) => V },
): Record<PropertyKey, V>;

/**
 * Creates a record using a descriptor that resolves the key path and mapped value.
 */
export function toRecord<T, V>(
  values: Iterable<T>,
  iteratee: RecordEntry<T, V>,
): Record<PropertyKey, V>;

/**
 * Creates a record keyed by the resolved property path from each item.
 */
export function toRecord<T>(values: Iterable<T>, iteratee: DotPath): Record<PropertyKey, T>;

export function toRecord<T, V extends true = true>(values: Iterable<T>): Record<PropertyKey, V>;

/**
 * Creates a record using the provided primitive as the mapped value for each item.
 */
export function toRecord<T, V extends Primitive>(
  values: Iterable<T>,
  iteratee: V,
): Record<PropertyKey, V>;

/**
 * Creates a lookup object from an iterable of values.
 *
 * Without an iteratee, each value is used as the key and `true` is stored as the value.
 * When an iteratee is provided, it resolves the key and mapped value for each item.
 *
 * @template T The item type contained in the iterable.
 * @template V The mapped value type emitted by the iteratee.
 * @param values The iterable of values to convert into a record.
 * @param iteratee Optional resolution strategy for each item. It may be a property path,
 * a primitive constant, an entry descriptor, or a callback that returns `[key, value]`.
 * @returns A record keyed by the resolved property values.
 * @throws {TypeError} If `values` is not iterable or an entry descriptor contains an invalid path.
 *
 * @example
 * ```ts
 * const users = [{ id: 1, name: "Ada" }, { id: 2, name: "Lin" }];
 *
 * toRecord(users, "id");
 * // => { 1: { id: 1, name: "Ada" }, 2: { id: 2, name: "Lin" } }
 *
 * toRecord(users, (user) => [user.name, user.id]);
 * // => { Ada: 1, Lin: 2 }
 * ```
 */
export function toRecord<T = unknown, V = unknown>(
  values: Iterable<T>,
  iteratee: V = true as V,
): Record<PropertyKey, unknown> {
  if (!isIterable(values)) {
    throw new TypeError("'values' must be an iterable");
  }

  const result: Record<PropertyKey, unknown> = {};
  let itFunc: RecordIteratee<T, unknown>;

  if (isFunction(iteratee)) {
    itFunc = iteratee as RecordIteratee<T, unknown>;
  } else if (isString(iteratee) && _isDotPath(iteratee)) {
    itFunc = (value: T) => [getValue(value as object, iteratee) as PropertyKey, value];
  } else if (isPlainObject(iteratee)) {
    const keyPath = iteratee.key;
    const mappedValue = iteratee.value;

    if (!(isString(keyPath) && _isDotPath(keyPath))) {
      throw new TypeError(
        "'iteratee.key' must be a valid property path when using an object entry",
      );
    }

    if (isFunction(mappedValue)) {
      itFunc = (value: T) => [
        getValue(value as object, keyPath) as PropertyKey,
        mappedValue(value),
      ];
    } else if (isString(mappedValue) && _isDotPath(mappedValue)) {
      itFunc = (value: T) => [
        getValue(value as object, keyPath) as PropertyKey,
        getValue(value as object, mappedValue),
      ];
    } else {
      itFunc = (value: T) => [getValue(value as object, keyPath) as PropertyKey, mappedValue];
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
