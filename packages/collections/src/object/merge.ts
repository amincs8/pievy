import { isPlainObject, isUndefined, type PlainObject } from "@pievy/types";

/**
 * Merges default values with override values using a deep plain-object merge.
 *
 * Keys present in the overrides replace their default counterparts, unless the
 * override value is `undefined`, in which case the default remains in place.
 * Nested plain objects are merged recursively; other values are replaced as-is.
 *
 * @typeParam D - Shape of the default object.
 * @typeParam O - Shape of the override object.
 * @param defaults - Base values to start from.
 * @param overrides - Values that should be applied on top of the defaults.
 * @returns A merged plain object.
 *
 * @example
 * ```ts
 * const merged = merge(
 *   { user: { name: "Ada", role: "guest" }, theme: "light" },
 *   { user: { role: "admin" }, locale: "en" },
 * );
 *
 * // { user: { name: "Ada", role: "admin" }, theme: "light", locale: "en" }
 * ```
 */
export function merge<D extends PlainObject, O extends PlainObject>(
  defaults: D,
  overrides: O,
): PlainObject {
  const result: PlainObject = {};

  if (!isPlainObject(defaults) || !isPlainObject(overrides)) {
    return result;
  }

  for (const key in defaults) {
    const defaultValue = defaults[key];
    const overrideValue = overrides[key];

    if (isUndefined(overrideValue)) {
      result[key] = defaultValue;
    } else if (isPlainObject(defaultValue) && isPlainObject(overrideValue)) {
      result[key] = merge(defaultValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  }

  for (const key in overrides) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = overrides[key];
    }
  }

  return result;
}
