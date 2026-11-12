import { isArray, type Maybe } from "@pievy/types";

const KEY = "length";
type IndexOptionType = number | typeof KEY;
interface IndexOptions {
  initValue: IndexOptionType;
  minValue: IndexOptionType;
  maxValue: IndexOptionType;
  step: -1 | 1;
}

function _checkIndexOption(value: IndexOptionType): boolean {
  return Number.isInteger(value) ? (value as number) >= 0 : value === KEY;
}

export function _createIterable<T>(
  values: T[],
  { initValue, minValue, maxValue, step }: IndexOptions,
): Iterable<T> {
  if (!isArray(values)) throw new TypeError("'values' must be a array");
  if (
    !(
      _checkIndexOption(initValue) &&
      _checkIndexOption(minValue) &&
      _checkIndexOption(maxValue) &&
      (step === -1 || step === 1)
    )
  ) {
    throw new TypeError(`index values must be a integer or '${KEY}'`);
  }

  return {
    [Symbol.iterator]() {
      let index: Maybe<number>;
      const initValueFn = initValue === KEY ? () => values.length : () => initValue;
      const minValueFn = minValue === KEY ? () => values.length : () => minValue;
      const maxValueFn = maxValue === KEY ? () => values.length : () => maxValue;

      return {
        next() {
          index = (index === undefined ? initValueFn() : index) + step;

          if (index >= minValueFn() && index < maxValueFn()) {
            return { done: false, value: values[index] };
          }
          return { done: true, value: undefined };
        },
      } as Iterator<T>;
    },
  };
}
