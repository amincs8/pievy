import { isFunction } from "@pievy/types";

const _hasOwn = isFunction(Object.hasOwn)
  ? Object.hasOwn
  : (object: object, key: PropertyKey) => Object.prototype.hasOwnProperty.call(object, key);

/**
 * Checks whether an object has a specific own property.
 *
 * This guards against inherited properties and preserves the original property
 * key narrowing semantics used by `Object.hasOwn`.
 *
 * @template T The object type being inspected.
 * @template K The property key within the object.
 * @param object - Object to inspect.
 * @param key - The key to check.
 * @returns `true` when `key` exists as an own property on `object`; otherwise `false`.
 *
 * @example
 * ```ts
 * const source = { user: { name: "Ada" } };
 *
 * if (hasOwn(source, "user")) {
 *   source.user.name; // "Ada"
 * }
 * ```
 */
export function hasOwn<T extends object, K extends keyof T>(object: T, key: K): key is K & keyof T {
  return _hasOwn(object, key);
}
