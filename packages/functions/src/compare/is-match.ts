import { every } from "@pievy/collections";
import { isObject, type PlainObject } from "@pievy/types";

/**
 * Checks whether an object matches the properties of a source object.
 *
 * Nested objects are matched recursively.
 *
 * @param object - The object to inspect.
 * @param source - The source object containing properties to match.
 * @returns Whether the object matches the source.
 * @public
 */
export function isMatch(object: unknown, source: unknown): boolean {
  if (Object.is(object, source)) {
    return true;
  }

  if (!isObject(object) || !isObject(source)) {
    return false;
  }

  const sourceKeys = Object.keys(source);

  return every(sourceKeys, (key) => {
    if (!Object.hasOwn(object, key)) {
      return false;
    }

    const value = (object as PlainObject)[key];
    const sourceValue = (source as PlainObject)[key];

    if (isObject(value) && isObject(sourceValue)) {
      return isMatch(value, sourceValue);
    }

    return Object.is(value, sourceValue);
  });
}
