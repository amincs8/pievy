/**
 * Runs tasks sequentially, collecting their results in order.
 *
 * @param tasks - Array of task functions returning values or promises.
 * @returns Array of results in input order.
 */
export async function series<T>(
  tasks: readonly (() => T | PromiseLike<T>)[],
): Promise<Awaited<T>[]> {
  const results: Awaited<T>[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}
