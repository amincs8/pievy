import { isArray, isObject, isString } from "@pievy/types";

import type { DotPath } from "../types";
import { _pathToArray } from "./_internal";

/**
 * Sets a nested property on an object using a dot path or an array of keys.
 *
 * Intermediate object segments are created automatically when they are missing,
 * and the resolved value is returned after assignment. Invalid inputs, empty
 * paths, or non-object targets leave the object untouched and return
 * `undefined`.
 *
 * @param obj - Target object to mutate.
 * @param path - Dot path like `.user.profile.name` or a key array like
 * `["user", "profile", "name"]`.
 * @param value - Value to assign at the resolved path.
 * @returns The assigned value, or `undefined` when nothing is written.
 *
 * @example
 * ```ts
 * const source = {};
 *
 * setValue(source, ".user.profile.name", "Ada");
 * // source.user.profile.name === "Ada"
 * ```
 */
export function setValue(
  obj: object,
  path: string | DotPath | PropertyKey[],
  value: unknown,
): unknown {
  let result: unknown = undefined;

  if (isObject(obj)) {
    const arrPath: PropertyKey[] = isString(path)
      ? _pathToArray(path)
      : isArray(path as PropertyKey[])
        ? path
        : [];

    if (arrPath.length > 0) {
      const lastKey = arrPath[arrPath.length - 1];
      let currentObj: object = obj;

      for (let index = 0; index < arrPath.length - 1; index++) {
        const key = arrPath[index]!;
        const nextKey = arrPath[index + 1];

        if (!isObject(currentObj[key as keyof typeof currentObj])) {
          const nextIsArrayIndex =
            typeof nextKey === "number" || (typeof nextKey === "string" && /^\d+$/.test(nextKey));

          (currentObj as Record<PropertyKey, unknown>)[key] = nextIsArrayIndex ? [] : {};
        }

        currentObj = (currentObj as Record<PropertyKey, unknown>)[key] as object;
      }

      if (isObject(currentObj)) {
        result = (currentObj[lastKey as keyof typeof currentObj] as unknown) = value;
      }
    }
  }

  return result;
}
