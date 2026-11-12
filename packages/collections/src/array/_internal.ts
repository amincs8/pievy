import { isArray, type Maybe } from "@pievy/types";

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
): Iterable<T> {
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

  return {
    [Symbol.iterator]() {
      let index: Maybe<number>;
      const initValueFn = initValue < 0 ? () => values.length + initValue : () => initValue;
      const minValueFn =
        minValue < 0 ? () => Math.max(0, values.length + minValue) : () => minValue;
      const maxValueFn =
        maxValue < 0
          ? maxValue === -1 || includeMax
            ? () => Math.max(0, values.length + maxValue)
            : () => Math.max(0, values.length + maxValue - 1)
          : () => maxValue + (includeMax ? 0 : -1);

      return {
        next() {
          index = index === undefined ? initValueFn() : index + step;

          if (index >= minValueFn() && index <= maxValueFn()) {
            return { done: false, value: values[index] };
          }
          return { done: true, value: undefined };
        },
      } as Iterator<T>;
    },
  };
}
