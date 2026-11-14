import { isArray, type Maybe } from "@pievy/types";

import type { IterableWithLength } from "../types/iterable";

interface IndexOptions {
  initValue: number;
  minValue: number;
  maxValue: number;
  step: -1 | 1;
  includeMax?: boolean;
}

export function _createIterable<T>(
  values: T[],
  { initValue, minValue, maxValue, step, includeMax = true }: IndexOptions,
): IterableWithLength<T> {
  if (!isArray(values)) throw new TypeError("'values' must be a array");
  if (
    !(
      Number.isInteger(initValue) &&
      Number.isInteger(minValue) &&
      Number.isInteger(maxValue) &&
      (step === -1 || step === 1)
    )
  ) {
    throw new TypeError(`index values must be a integer`);
  }

  const initindexFn = initValue < 0 ? () => values.length + initValue : () => initValue;
  const minIndexFn = minValue < 0 ? () => Math.max(0, values.length + minValue) : () => minValue;
  const maxIndexFn =
    maxValue < 0
      ? maxValue === -1 || includeMax
        ? () => Math.max(0, values.length + maxValue)
        : () => Math.max(0, values.length + maxValue - 1)
      : () => maxValue + (includeMax ? 0 : -1);

  return {
    get length() {
      const startIndex = initindexFn();
      const minIndex = minIndexFn();
      const maxIndex = maxIndexFn();

      if (step === 1) {
        return Math.max(0, maxIndex - Math.max(startIndex, minIndex) + 1);
      }

      return Math.max(0, Math.min(startIndex, maxIndex) - minIndex + 1);
    },
    [Symbol.iterator]() {
      let index: Maybe<number>;

      return {
        next() {
          index = index === undefined ? initindexFn() : index + step;

          if (index >= minIndexFn() && index <= maxIndexFn()) {
            return { done: false, value: values[index] };
          }
          return { done: true, value: undefined };
        },
      } as Iterator<T>;
    },
  };
}
