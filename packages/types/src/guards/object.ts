export type PlainObject<T = unknown> = Record<PropertyKey, T>;

export function isObject<T = unknown>(value: T): value is T & object {
  return typeof value === "object" && value !== null;
}

export function isPlainObject(value: unknown): value is PlainObject {
  return (
    value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype
  );
}
