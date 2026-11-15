/**
 * A no-operation function.
 *
 * @public
 */
export function noop(): void {}

/**
 * An asynchronous no-operation function.
 *
 * @returns A promise that resolves to `undefined`.
 * @public
 */
export async function noopAsync(): Promise<void> {
  return Promise.resolve();
}
