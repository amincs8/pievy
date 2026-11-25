/**
 * A function that releases a previously acquired semaphore permit.
 */
export type SemaphoreRelease = () => void;

/**
 * A counting semaphore limiting concurrent access.
 */
export class Semaphore {
  private available: number;
  private waiters: Array<(release: SemaphoreRelease) => void> = [];

  /**
   * Creates a semaphore with the given capacity.
   * @param capacity - Maximum number of concurrent permits.
   * @throws {TypeError} If capacity is not a positive integer.
   */
  constructor(readonly capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new TypeError("'capacity' must be a positive integer");
    }

    this.available = capacity;
  }

  /**
   * Number of waiters queued for a permit.
   */
  get pending(): number {
    return this.waiters.length;
  }

  /**
   * Number of permits currently held.
   */
  get active(): number {
    return this.capacity - this.available;
  }

  /**
   * Acquires a permit, resolving with a release function.
   */
  acquire(): Promise<SemaphoreRelease> {
    return new Promise((resolve) => {
      if (this.available > 0) {
        this.available--;
        resolve(this.createRelease());
      } else {
        this.waiters.push(resolve);
      }
    });
  }

  private createRelease(): SemaphoreRelease {
    let released = false;

    return () => {
      if (released) return;
      released = true;

      const next = this.waiters.shift();

      if (next) {
        next(this.createRelease());
      } else {
        this.available++;
      }
    };
  }

  /**
   * Runs `callback` while holding a permit, releasing on completion.
   */
  async runExclusive<T>(callback: () => T | PromiseLike<T>): Promise<Awaited<T>> {
    const release = await this.acquire();

    try {
      return await callback();
    } finally {
      release();
    }
  }
}
