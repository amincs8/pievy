import type { AnyFunction } from "@pievy/types";

/**
 * Maps over `items` with a concurrency `limit`, preserving order.
 *
 * @param items - Iterable of input items.
 * @param limit - Maximum number of concurrent mappers.
 * @param mapper - Function mapping each item (and its index) to a value or promise.
 * @returns Array of mapped results in input order.
 * @throws {TypeError} If `limit` is not a positive integer.
 */
export async function mapLimit<T, R>(
  items: Iterable<T>,
  limit: number,
  mapper: AnyFunction<[T, number], R | PromiseLike<R>>,
): Promise<Awaited<R>[]> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new TypeError("'limit' must be a positive integer");
  }

  const values = Array.from(items);
  const results = Array.from<Awaited<R>>({ length: values.length });

  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = nextIndex++;

      if (index >= values.length) return;

      results[index] = await mapper(values[index]!, index);
    }
  }

  const workers = Math.min(limit, values.length);

  await Promise.all(Array.from({ length: workers }, () => worker()));

  return results;
}
