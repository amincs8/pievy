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
