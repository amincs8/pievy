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
