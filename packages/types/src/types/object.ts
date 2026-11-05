/**
 * Extracts the value type from a record-like object.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extracts the element type from a tuple or readonly array.
 */
export type ElementOf<T extends readonly unknown[]> = T[number];

/**
 * Ensures an array has at least one item.
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Generic dictionary with string keys.
 */
export type Dictionary<T = unknown> = Record<string, T>;

/**
 * Represents a plain object with string or symbol keys.
 */
export type PlainObject<T = unknown> = Record<PropertyKey, T>;

/**
 * Converts an object type into a tuple array of `[key, value]` pairs.
 */
export type Entries<T extends object> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
