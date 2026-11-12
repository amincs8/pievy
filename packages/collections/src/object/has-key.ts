import { isArray, isObject, isString } from "@pievy/types";

import type { DotPath } from "../types";
import { _pathToArray } from "./_internal";

/**
 * Checks whether an object contains a nested property path.
 *
 * The lookup traverses each segment in order and returns `true` only when every
 * segment exists as an own property on the current object. Missing keys, invalid
 * paths, or non-object inputs return `false`.
 *
 * @param obj - Object to inspect.
 * @param path - Dot path like `.user.profile.name` or a keyed array such as
 * `["user", "profile", "name"]`.
 * @returns `true` if the full path exists; otherwise `false`.
 *
 * @example
 * ```ts
 * const source = { user: { profile: { name: "Ada" } } };
 *
 * hasKey(source, ".user.profile.name"); // true
 * hasKey(source, ["user", "profile", "name"]); // true
 * hasKey(source, ".user.profile.age"); // false
 * ```
 */
export function hasKey(obj: object, path: string | DotPath | PropertyKey[]): boolean {
  let result = false;

  if (isObject(obj)) {
    const arrPath: PropertyKey[] = isString(path)
      ? _pathToArray(path)
      : isArray(path as PropertyKey[])
        ? path
        : [];

    let currentObj = obj;

    for (const key of arrPath) {
      if (currentObj === null || currentObj === undefined) {
        result = false;
        break;
      }

      if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
        result = true;
        currentObj = currentObj[key as keyof typeof currentObj];
      } else {
        result = false;
        break;
      }
    }
  }

  return result;
}
