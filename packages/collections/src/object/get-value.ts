import { isArray, isNil, isString, type Maybe } from "@pievy/types";

import type { DotPath } from "../types/object";
import { _pathToArray } from "./_internal";

/**
 * Reads a nested value from an object using a dot path or an array of keys.
 *
 * The lookup traverses each segment in order and returns `undefined` if any
 * segment is missing, the value is `null`/`undefined`, or the provided path is
 * not valid for the input object.
 *
 * @typeParam T - Type of the value returned from the requested path.
 * @param obj - Object or value to read from.
 * @param path - Dot path like `.user.profile.name` or an array of keys like
 * `["user", "profile", "name"]`.
 * @returns The resolved value at the path, or `undefined` if it cannot be read.
 *
 * @example
 * ```ts
 * const source = { user: { profile: { name: "Ada" } } };
 *
 * getValue(source, ".user.profile.name"); // "Ada"
 * getValue(source, ["user", "profile", "name"]); // "Ada"
 * getValue(source, ".user.profile.age"); // undefined
 * ```
 */
export function getValue<T = unknown>(
  obj: unknown,
  path: string | DotPath | PropertyKey[],
): Maybe<T> {
  let result: Maybe<T> = undefined;
  const arrPath: PropertyKey[] = isString(path)
    ? _pathToArray(path)
    : isArray(path)
      ? (path as PropertyKey[])
      : [];

  let currentObj: unknown = obj;

  for (const key of arrPath) {
    if (isNil(currentObj) || !(key in Object(currentObj))) {
      result = undefined;
      break;
    }

    result = currentObj = currentObj[key as keyof typeof currentObj];
  }

  return result as Maybe<T>;
}
