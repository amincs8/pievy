/**
 * Represents the standard JavaScript primitive values.
 */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined;

/**
 * Makes a value nullable by allowing `null` in addition to the original type.
 */
export type Nullable<T> = T | null;

/**
 * Makes a value optionally undefined.
 */
export type Maybe<T> = T | undefined;

/**
 * Makes a value nullable or undefined.
 */
export type Nullish<T> = T | null | undefined;

/**
 * Represents a value or a promise that resolves to that value.
 */
export type MaybePromise<T> = T | Promise<T>;

/**
 * Represents a number or a numeric string literal such as `"42"`.
 */
export type Numberish = number | `${number}`;

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
 * ensure object is a plain object.
 */
export type PlainObject<T = unknown> = Record<PropertyKey, T>;

/**
 * A general function signature used for runtime callbacks.
 */
export type AnyFunction<Args extends unknown[] = any[], Return = unknown> = (
  ...args: Args
) => Return;
/**
 * A general async function signature used for runtime callbacks.
 */
export type AnyFunctionAsync<Args extends unknown[] = any[], Return = unknown> = (
  ...args: Args
) => Promise<Return>;

/**
 * A function that returns a boolean for a given value.
 */
export type Predicate<T> = (value: T) => boolean;

/**
 * Comparison function used for sorting or ordering values.
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * Maps one value to another while preserving an index for array-like contexts.
 */
export type Mapper<T, R> = (value: T, index: number) => R;

/**
 * Reduces a collection to a single accumulator value.
 */
export type Reducer<T, R> = (
  accumulator: R,
  currentValue: T,
  index: number,
  array: readonly T[],
) => R;

/**
 * Creates a new value without receiving any input.
 */
export type Factory<T> = () => T;

/**
 * Constructor signature for class instances.
 */
export type Constructor<T = object, Args extends unknown[] = any[]> = new (...args: Args) => T;

/**
 * Abstract constructor signature for abstract classes.
 */
export type AbstractConstructor<T = object, Args extends unknown[] = any[]> = abstract new (
  ...args: Args
) => T;

/**
 * Strictly exclusive union helper for mutually exclusive object shapes.
 */
export type XOR<T, U> =
  | (T & { [K in Exclude<keyof U, keyof T>]?: never })
  | (U & { [K in Exclude<keyof T, keyof U>]?: never });

/**
 * Recursively makes all properties of a value readonly.
 *
 * This is useful for immutable config objects and state snapshots.
 */
export type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

/**
 * Recursively makes all properties of a value optional.
 *
 * This is especially helpful for partial update payloads and patch objects.
 */
export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/**
 * Converts an object type into a tuple array of `[key, value]` pairs.
 *
 * Useful when you want to iterate over object entries in a type-safe way.
 */
export type Entries<T extends object> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

/**
 * Flattens a complex type into a more readable representation for IDEs.
 *
 * This is useful for debugging or presenting inferred types more cleanly.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Converts a union type into the intersection of all its members.
 *
 * Commonly used with utility types that depend on distributive behavior.
 */
export type UnionToIntersection<T> = (T extends unknown ? (value: T) => void : never) extends (
  value: infer I,
) => void
  ? I
  : never;

/**
 * Extracts the keys of an object whose values are optional.
 */
export type OptionalKeysOf<T extends object> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
