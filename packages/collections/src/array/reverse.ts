import { _createIterable } from "./_internal";

/**
 * Creates an iterable that yields the elements of an array in reverse order.
 *
 * @template T The element type stored in the array.
 * @param values The array to iterate in reverse.
 * @returns An iterable that emits each value from the end of the array to the beginning.
 * @throws {TypeError} If `arr` is not an array.
 *
 * @example
 * ```ts
 * const values = reverse([1, 2, 3]);
 *
 * [...values]; // [3, 2, 1]
 * ```
 */
export function reverse<T>(values: T[]): Iterable<T> {
  return _createIterable(values, {
    initValue: -1,
    maxValue: -1,
    minValue: 0,
    step: -1,
  });
}
