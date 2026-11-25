/**
 * Runs an array of task functions with a concurrency `limit`.
 *
 * Fails fast: if any task rejects, the first error is thrown and remaining
 * workers stop picking up new tasks.
 *
 * @param tasks - Array of task functions returning values or promises.
 * @param limit - Maximum number of concurrent tasks.
 * @returns Array of results in input order.
 * @throws {TypeError} If `limit` is not a positive integer.
 * @throws The first task error, if any task rejects.
 */
export async function parallelLimit<T>(
  tasks: readonly (() => T | PromiseLike<T>)[],
  limit: number,
): Promise<Awaited<T>[]> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new TypeError("'limit' must be a positive integer");
  }

  const results = Array.from<Awaited<T>>({ length: tasks.length });
  let nextIndex = 0;
  let failed = false;
  let firstError: unknown;

  async function worker(): Promise<void> {
    while (!failed) {
      const index = nextIndex++;

      if (index >= tasks.length) return;

      try {
        results[index] = await tasks[index]!();
      } catch (error) {
        if (!failed) {
          failed = true;
          firstError = error;
        }
        return;
      }
    }
  }

  const workerCount = Math.min(limit, tasks.length);

  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  if (failed) throw firstError;

  return results;
}
