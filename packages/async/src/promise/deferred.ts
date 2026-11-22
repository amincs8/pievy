export interface DeferredResult<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

/**
 * Creates a deferred promise with externally accessible `resolve` and `reject`.
 *
 * @returns An object containing the `promise` and its `resolve`/`reject` functions.
 * @public
 */
export function deferred<T = void>(): DeferredResult<T> {
  let resolve!: DeferredResult<T>["resolve"];
  let reject!: DeferredResult<T>["reject"];

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, reject, resolve };
}
