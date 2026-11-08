import { isFunction, isIterable, isPlainObject, type PlainObject } from "@pievy/types";

import type { IterableCallback, ObjectCallback } from "../types";
import { forEach } from "./for-each";

type ObjectValue<T> = [T[keyof T]] extends [never] ? unknown : T[keyof T];
type MappedObject<T, U> = {
  [K in keyof T as K extends string | number ? `${K}` : never]: U;
};

/**
 * Maps an iterable to an array or a plain object to a new object with mapped values.
 *
 * Iterable callbacks receive the value, numeric index, and loop count. Plain
 * object callbacks receive the value, string key, and loop count. The callback's
 * return value is included in the result; returning {@link STOP} does not stop mapping.
 *
 * @param values - Iterable or plain object to map.
 * @param callbackfn - Function that transforms each value.
 * @returns An array for iterable inputs, or an object with the original keys for plain objects.
 *
 * @example
 * ```ts
 * map([1, 2], (value) => value * 2); // [2, 4]
 * map({ count: 2 }, (value) => value * 2); // { count: 4 }
 * ```
 */
export function map<T, U>(values: Iterable<T>, callbackfn: IterableCallback<T, U>): U[];
export function map<U, T extends PlainObject>(
  values: T,
  callbackfn: ObjectCallback<ObjectValue<T>, U>,
): MappedObject<T, U>;

export function map(values: unknown, callbackfn: Function): unknown[] | Record<string, unknown> {
  if (!isFunction(callbackfn)) return [];

  if (isIterable(values)) {
    const result: unknown[] = [];
    forEach(values, (value, index, loopCount) => {
      result.push(callbackfn(value, index, loopCount));
    });
    return result;
  }

  if (isPlainObject(values)) {
    const result: Record<string, unknown> = {};
    forEach(values, (value, key, loopCount) => {
      const mappedValue = callbackfn(value, key, loopCount);
      if (key === "__proto__") {
        Object.defineProperty(result, key, {
          configurable: true,
          enumerable: true,
          value: mappedValue,
          writable: true,
        });
      } else {
        result[key] = mappedValue;
      }
    });

    return result;
  }

  return [];
}
