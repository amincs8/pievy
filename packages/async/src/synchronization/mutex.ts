import type { AnyFunction } from "@pievy/types";

/**
 * A function that releases a previously acquired mutex lock.
 */
export type MutexRelease = () => void;

/**
 * A mutual-exclusion lock.
 */
export class Mutex {
  private locked = false;
  private waiters: Array<(release: MutexRelease) => void> = [];

  /**
   * Whether the mutex is currently locked.
   */
  get isLocked(): boolean {
    return this.locked;
  }

  /**
   * Number of waiters queued for the lock.
   */
  get pending(): number {
    return this.waiters.length;
  }

  /**
   * Acquires the lock, resolving with a release function.
   */
  acquire(): Promise<MutexRelease> {
    return new Promise((resolve) => {
      const grant = () => {
        this.locked = true;

        let released = false;

        resolve(() => {
          if (released) return;
          released = true;

          const next = this.waiters.shift();

          if (next) {
            next(this.createRelease());
          } else {
            this.locked = false;
          }
        });
      };

      if (this.locked) {
        this.waiters.push(resolve);
      } else {
        grant();
      }
    });
  }

  private createRelease(): MutexRelease {
    let released = false;

    return () => {
      if (released) return;
      released = true;

      const next = this.waiters.shift();

      if (next) {
        next(this.createRelease());
      } else {
        this.locked = false;
      }
    };
  }

  /**
   * Runs `callback` while holding the lock, releasing on completion.
   */
  async runExclusive<T>(callback: AnyFunction<[], T | PromiseLike<T>>): Promise<Awaited<T>> {
    const release = await this.acquire();

    try {
      return await callback();
    } finally {
      release();
    }
  }
}
