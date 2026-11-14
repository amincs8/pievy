import { isArray, isObject } from "@pievy/types";

import { toRecord } from "../iterable";
import { hasOwn } from "./has-own";

/**
 * Creates a new object without the selected own properties from the source.
 *
 * The returned object preserves the remaining property order and only copies
 * enumerable own properties from `object`. Non-object inputs throw a `TypeError`
 * to match the collection helpers in this package.
 *
 * @template T The source object type.
 * @template K The keys to omit from `T`.
 * @param object - Source object to clone without the excluded keys.
 * @param keys - Key list to remove from the return value.
 * @returns A new object that excludes the listed keys from `object`.
 *
 * @example
 * ```ts
 * const source = { id: 1, name: "Ada", role: "admin" };
 *
 * omit(source, ["name", "role"]); // { id: 1 }
 * ```
 */
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Omit<T, K> {
  if (!isObject(object)) {
    throw new TypeError("'object' must be an object");
  }

  if (!isArray(keys)) {
    throw new TypeError("'keys' must be an array");
  }

  const result = {} as Record<PropertyKey, T[keyof T]>;
  const recordedKeys = toRecord(keys);

  for (const key in object) {
    if (hasOwn(object, key) && !recordedKeys[key]) {
      result[key] = object[key];
    }
  }

  return result as Omit<T, K>;
}
