export function isObject<T = unknown>(value: T): value is T & object {
  return typeof value === "object" && value !== null;
}
