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
