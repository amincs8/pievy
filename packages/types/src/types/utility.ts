/**
 * Strictly exclusive union helper for mutually exclusive object shapes.
 */
export type XOR<T, U> =
  | (T & { [K in Exclude<keyof U, keyof T>]?: never })
  | (U & { [K in Exclude<keyof T, keyof U>]?: never });

/**
 * Recursively makes all properties of a value readonly.
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
 */
export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/**
 * Flattens a complex type into a more readable representation for IDEs.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Converts a union type into the intersection of all its members.
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
