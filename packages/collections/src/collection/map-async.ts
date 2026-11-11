import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  type PlainObject,
} from "@pievy/types";

import type { AsyncIterableCallback, AsyncObjectCallback } from "../types";
import { forEachAsync } from "./for-each-async";

type ObjectValue<T> = [T[keyof T]] extends [never] ? unknown : T[keyof T];
type MappedObject<T, U> = {
  [K in keyof T as K extends string | number ? `${K}` : never]: U;
};

/**
 * Asynchronously maps an async iterable, iterable, or plain object.
 *
 * Mapping callbacks are awaited sequentially. Iterable inputs produce an array;
 * plain object inputs produce a new object with the original keys. A callback
 * result equal to {@link STOP} is included as a value and does not stop mapping.
 *
 * @param values - Async iterable, iterable, or plain object to map.
 * @param mapper - Asynchronous function that transforms each value.
 * @returns A promise for the mapped array or object.
 *
 * @example
 * ```ts
 * const doubled = await mapAsync([1, 2], async (value) => value * 2);
 * ```
 */
export function mapAsync<T, U>(
  values: AsyncIterable<T>,
  mapper: AsyncIterableCallback<T, U>,
): Promise<U[]>;
export function mapAsync<T, U>(
  values: Iterable<T>,
  mapper: AsyncIterableCallback<T, U>,
): Promise<U[]>;
export function mapAsync<U, T extends PlainObject>(
  values: T,
  mapper: AsyncObjectCallback<ObjectValue<T>, U>,
): Promise<MappedObject<T, U>>;

export async function mapAsync(
  values: unknown,
  mapper: Function,
): Promise<unknown[] | Record<string, unknown>> {
  if (!isFunction(mapper)) return [];

  if (isAsyncIterable(values)) {
    const mappedValues: unknown[] = [];
    await forEachAsync(values, async (value, index, loopCount) => {
      mappedValues.push(await mapper(value, index, loopCount));
    });
    return mappedValues;
  }

  if (isIterable(values)) {
    const mappedValues: unknown[] = [];
    await forEachAsync(values, async (value, index, loopCount) => {
      mappedValues.push(await mapper(value, index, loopCount));
    });
    return mappedValues;
  }

  if (isPlainObject(values)) {
    const mappedValues: Record<string, unknown> = {};
    await forEachAsync(values, async (value, key, loopCount) => {
      const mappedValue = await mapper(value, key, loopCount);
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
