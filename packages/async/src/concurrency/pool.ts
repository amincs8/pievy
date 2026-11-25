import { isFunction } from "@pievy/types";

/**
 * A task executed by a {@link Pool}.
 */
export type PoolTask<T> = () => T | PromiseLike<T>;

/**
 * Options for {@link pool}.
 */
export interface PoolOptions {
  /**
   * Maximum number of concurrent tasks.
   */
  concurrency: number;
}

/**
 * A concurrency-limited task pool.
 */
export interface Pool {
  add<T>(task: PoolTask<T>): Promise<Awaited<T>>;
  pause(): void;
  resume(): void;
  clear(reason?: unknown): number;
  onEmpty(): Promise<void>;
  onIdle(): Promise<void>;
  readonly size: number;
  readonly pending: number;
  readonly running: number;
  readonly isPaused: boolean;
}

interface QueueItem<T = unknown> {
  task: PoolTask<T>;
  resolve: (value: Awaited<T>) => void;
  reject: (reason?: unknown) => void;
}

/**
 * Creates a pool that limits concurrent execution of tasks.
 *
 * @param options - Pool options, including `concurrency`.
 * @returns A {@link Pool} instance.
 * @throws {TypeError} If `concurrency` is not a positive integer.
 */
export function pool(options: PoolOptions): Pool {
  const { concurrency } = options;

  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new TypeError("'concurrency' must be a positive integer");
  }

  const queue: QueueItem[] = [];
  const emptyWaiters = new Set<() => void>();
  const idleWaiters = new Set<() => void>();

  let running = 0;
  let paused = false;

  const notify = () => {
    if (queue.length === 0) {
      for (const resolve of emptyWaiters) resolve();
      emptyWaiters.clear();

      if (running === 0) {
        for (const resolve of idleWaiters) resolve();
        idleWaiters.clear();
      }
    }
  };

  const run = async (item: QueueItem) => {
    try {
      const result = await item.task();
      item.resolve(result);
    } catch (error) {
      item.reject(error);
    } finally {
      running--;
      // oxlint-disable-next-line no-use-before-define
      pump();
    }
  };

  const pump = () => {
    if (paused) return;

    while (running < concurrency && queue.length > 0) {
      const item = queue.shift()!;

      running++;
      void run(item);
    }

    notify();
  };

  return {
    add<T>(task: PoolTask<T>): Promise<Awaited<T>> {
      if (!isFunction(task)) {
        return Promise.reject(new TypeError("'task' must be a function"));
      }

      return new Promise<Awaited<T>>((resolve, reject) => {
        queue.push({
          reject,
          resolve,
          task,
        } as QueueItem);

        pump();
      });
    },

    clear(reason = new Error("Pool queue cleared")) {
      const count = queue.length;

      while (true) {
        const item = queue.shift();

        if (item === undefined) break;

        item.reject(reason);
      }

      notify();

      return count;
    },

    get isPaused() {
      return paused;
    },

    onEmpty() {
      if (queue.length === 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        emptyWaiters.add(resolve);
      });
    },

    onIdle() {
      if (queue.length === 0 && running === 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        idleWaiters.add(resolve);
      });
    },

    pause() {
      paused = true;
    },

    get pending() {
      return queue.length;
    },

    resume() {
      if (paused) {
        paused = false;
        pump();
      }
    },

    get running() {
      return running;
    },

    get size() {
      return queue.length + running;
    },
  };
}
