import { _createIterable } from "./_internal";

/**
 * Creates an iterable that yields a slice of an array from `start` to `end`.
 *
 * @template T The element type stored in the array.
 * @param values The array to slice.
 * @param start The zero-based start index, inclusive.
 * @param end The zero-based end index, exclusive. Defaults to the array length.
 * @returns An iterable containing the values from `start` up to, but not including, `end`.
 * @throws {TypeError} If `values` is not an array or the indexes are invalid.
 *
 * @example
 * ```ts
 * const values = [1, 2, 3, 4, 5];
 *
 * [...slice(values, 1, 4)]; // [2, 3, 4]
 * [...slice(values, 1, -2)]; // [2, 3]
 * ```
 */
export function slice<T>(values: T[], start: number, end?: number): Iterable<T> {
  return _createIterable(values, {
    initValue: start,
    maxValue: end ?? -1,
    minValue: start,
    step: 1,
  });
}
