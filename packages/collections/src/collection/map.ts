import { isFunction, isIterable, isPlainObject, type PlainObject } from "@pievy/types";

import { forEach } from "./for-each";

type IterableCallback<T, U> = (value: T, index: number, loopCount: number) => U;
type ObjectCallback<T, U> = (value: T, key: string, loopCount: number) => U;
type ObjectValue<T> = [T[keyof T]] extends [never] ? unknown : T[keyof T];
type MappedObject<T, U> = {
  [K in keyof T as K extends string | number ? `${K}` : never]: U;
};

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
