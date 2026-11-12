/**
 * Callback used to process a value from a synchronous iterable.
 *
 * @typeParam T - Type of each iterated value.
 * @typeParam Return - Callback result type; defaults to `unknown`.
 * @param value - Current iterable value.
 * @param index - Zero-based position of the current value.
 * @param loopCount - Number of previously processed values.
 * @returns The callback result.
 */
export type IterableCallback<T, Return = unknown> = (
  value: T,
  index: number,
  loopCount: number,
) => Return;

/**
 * Callback used to process a value from a plain object's enumerable string keys.
 *
 * @typeParam T - Type of each property value.
 * @typeParam Return - Callback result type; defaults to `unknown`.
 * @param value - Current property value.
 * @param key - Current property's string key.
 * @param loopCount - Number of previously processed properties.
 * @returns The callback result.
 */
export type ObjectCallback<T, Return = unknown> = (
  value: T,
  key: string,
  loopCount: number,
) => Return;

/**
 * Asynchronous callback used to process a value from an async iterable.
 *
 * @typeParam T - Type of each iterated value.
 * @typeParam Return - Resolved callback result type; defaults to `unknown`.
 * @param value - Current iterable value.
 * @param index - Zero-based position of the current value.
 * @param loopCount - Number of previously processed values.
 * @returns A promise for the callback result.
 */
export type AsyncIterableCallback<T, Return = unknown> = (
  value: T,
  index: number,
  loopCount: number,
) => Promise<Return>;

/**
 * Asynchronous callback used to process a value from a plain object's enumerable string keys.
 *
 * @typeParam T - Type of each property value.
 * @typeParam Return - Resolved callback result type; defaults to `unknown`.
 * @param value - Current property value.
 * @param key - Current property's string key.
 * @param loopCount - Number of previously processed properties.
 * @returns A promise for the callback result.
 */
export type AsyncObjectCallback<T, Return = unknown> = (
  value: T,
  key: string,
  loopCount: number,
) => Promise<Return>;

/**
 * Callback used to combine an accumulated value with the next item from a synchronous iterable.
 *
 * @typeParam T - Type of each iterated value.
 * @typeParam Return - Accumulated result type.
 * @param result - Current accumulated value.
 * @param value - Current iterable value.
 * @param index - Zero-based position of the current value.
 * @param loopCount - Number of previously processed values.
 * @returns The next accumulated value.
 */
export type ReducerIterableCallback<T, Return = unknown> = (
  result: Return,
  value: T,
  index: number,
  loopCount: number,
) => Return;

/**
 * Callback used to combine an accumulated value with the next property from a plain object.
 *
 * @typeParam T - Type of each property value.
 * @typeParam Return - Accumulated result type.
 * @param result - Current accumulated value.
 * @param value - Current property value.
 * @param key - Current property's string key.
 * @param loopCount - Number of previously processed properties.
 * @returns The next accumulated value.
 */
export type ReducerObjectCallback<T, Return = unknown> = (
  result: Return,
  value: T,
  key: string,
  loopCount: number,
) => Return;

/**
 * Callback used to combine an accumulated value with the next item from an async iterable.
 *
 * @typeParam T - Type of each iterated value.
 * @typeParam Return - Resolved accumulated result type.
 * @param result - Current accumulated value.
 * @param value - Current iterable value.
 * @param index - Zero-based position of the current value.
 * @param loopCount - Number of previously processed values.
 * @returns A promise resolving to the next accumulated value.
 */
export type AsyncReducerIterableCallback<T, Return = unknown> = (
  result: Return,
  value: T,
  index: number,
  loopCount: number,
) => Promise<Return>;

/**
 * Callback used to combine an accumulated value with the next property from a plain object.
 *
 * @typeParam T - Type of each property value.
 * @typeParam Return - Resolved accumulated result type.
 * @param result - Current accumulated value.
 * @param value - Current property value.
 * @param key - Current property's string key.
 * @param loopCount - Number of previously processed properties.
 * @returns A promise resolving to the next accumulated value.
 */
export type AsyncReducerObjectCallback<T, Return = unknown> = (
  result: Return,
  value: T,
  key: string,
  loopCount: number,
) => Promise<Return>;

export type Grouped<T> = Record<PropertyKey, T[]>;