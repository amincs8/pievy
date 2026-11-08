import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  type PlainObject,
} from "@pievy/types";

import { forEachAsync } from "./for-each-async";

type AsyncIterableCallback<T, U> = (value: T, index: number, loopCount: number) => Promise<U>;
type AsyncObjectCallback<T, U> = (value: T, key: string, loopCount: number) => Promise<U>;
type ObjectValue<T> = [T[keyof T]] extends [never] ? unknown : T[keyof T];
type MappedObject<T, U> = {
  [K in keyof T as K extends string | number ? `${K}` : never]: U;
};

export function mapAsync<T, U>(
  values: AsyncIterable<T>,
  callbackfn: AsyncIterableCallback<T, U>,
): Promise<U[]>;
export function mapAsync<T, U>(
  values: Iterable<T>,
  callbackfn: AsyncIterableCallback<T, U>,
): Promise<U[]>;
export function mapAsync<U, T extends PlainObject>(
  values: T,
  callbackfn: AsyncObjectCallback<ObjectValue<T>, U>,
): Promise<MappedObject<T, U>>;

export async function mapAsync(
  values: unknown,
  callbackfn: Function,
): Promise<unknown[] | Record<string, unknown>> {
  if (!isFunction(callbackfn)) return [];

  if (isAsyncIterable(values)) {
    const mappedValues: unknown[] = [];
    await forEachAsync(values, async (value, index, loopCount) => {
      mappedValues.push(await callbackfn(value, index, loopCount));
    });
    return mappedValues;
  }

  if (isIterable(values)) {
    const mappedValues: unknown[] = [];
    await forEachAsync(values, async (value, index, loopCount) => {
      mappedValues.push(await callbackfn(value, index, loopCount));
    });
    return mappedValues;
  }

  if (isPlainObject(values)) {
    const mappedValues: Record<string, unknown> = {};
    await forEachAsync(values, async (value, key, loopCount) => {
      const mappedValue = await callbackfn(value, key, loopCount);
      if (key === "__proto__") {
        Object.defineProperty(mappedValues, key, {
          configurable: true,
          enumerable: true,
          value: mappedValue,
          writable: true,
        });
      } else {
        mappedValues[key] = mappedValue;
      }
    });
    return mappedValues;
  }

  return [];
}
