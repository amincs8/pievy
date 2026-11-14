import { isArray, isObject } from "@pievy/types";

import { hasOwn } from "./has-own";

/**
 * Creates a new object containing only the selected own properties from the source.
 *
 * The returned object preserves the key order from `keys` while omitting any
 * property that is missing from the original object. Non-object inputs throw a
 * `TypeError` to match the rest of the collection helpers.
 *
 * @template T The source object type.
 * @template K The keys to copy from `T`.
 * @param object - Source object to copy values from.
 * @param keys - Key list to include in the return value.
 * @returns A new object containing only the selected keys that exist on `object`.
 *
 * @example
 * ```ts
 * const source = { id: 1, name: "Ada", role: "admin" };
 *
 * pick(source, ["id", "name"]); // { id: 1, name: "Ada" }
 * ```
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Pick<T, K> {
  if (!isObject(object)) {
    throw new TypeError("'object' must be an object");
  }

  if (!isArray(keys)) {
    throw new TypeError("'keys' must be an array");
  }

  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (hasOwn(object, key)) {
      result[key] = object[key];
    }
  }

  return result;
}