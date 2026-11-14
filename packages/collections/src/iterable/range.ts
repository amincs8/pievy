import type { Maybe } from "@pievy/types";

import { _createIterable } from "../array/_internal";
import type { IterableWithLength } from "../types/iterable";

interface RangeArgs {
  end: number;
  start?: number;
  step?: number;
}
export function range(args: RangeArgs): IterableWithLength<number> {
  const { start = 0, end, step = start <= end ? 1 : -1 } = args;

  if (!(Number.isInteger(start) && Number.isInteger(end) && Number.isInteger(step))) {
    throw new TypeError(`values must be a integer`);
  }

  if (start !== end && (step === 0 || (start < end && step < 0) || (start > end && step > 0))) {
    throw new RangeError("step must move toward the range end");
  }

  const checker = start <= end ? (value: number) => value <= end : (value: number) => end <= value;

  return {
    get length() {
      return Math.abs(end - start) + 1;
    },
    [Symbol.iterator]() {
      let value: Maybe<number>;

      return {
        next() {
          value = value === undefined ? start : value + step;

          if (checker(value)) {
            return { done: false, value };
          }
          return { done: true, value: undefined };
        },
      };
    },
  };
}
