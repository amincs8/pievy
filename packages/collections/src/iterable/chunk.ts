import { isIterable } from "@pievy/types";

/**
 * Splits an iterable into fixed-size chunks.
 *
 * Each chunk contains at most `size` values in the original order, and the
 * remaining trailing values are returned as the final partial chunk.
 *
 * @template T The item type contained in the iterable.
 * @param values - The values to split into chunks.
 * @param size - Maximum number of items allowed in each chunk.
 * @returns An iterable of chunk arrays.
 *
 * @example
 * ```ts
 * [...chunk([1, 2, 3, 4, 5], 2)];
 * // => [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(values: Iterable<T>, size: number): Iterable<T[]> {
  if (!isIterable(values)) {
    throw new TypeError("'values' must be iterable");
  }

  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("'size' must be positive integer value");
  }

  return {
    *[Symbol.iterator]() {
      let chk: T[] = [];

      for (const value of values) {
        chk.push(value);

        if (chk.length === size) {
          yield chk;
          chk = [];
        }
      }

      if (chk.length > 0) yield chk;
    },
  };
}
