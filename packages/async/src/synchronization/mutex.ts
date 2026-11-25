import type { AnyFunction } from "@pievy/types";

export type MutexRelease = () => void;

export class Mutex {
  private locked = false;
  private waiters: Array<(release: MutexRelease) => void> = [];

  get isLocked(): boolean {
    return this.locked;
  }

  get pending(): number {
    return this.waiters.length;
  }

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

  async runExclusive<T>(callback: AnyFunction<[], T | PromiseLike<T>>): Promise<Awaited<T>> {
    const release = await this.acquire();

    try {
      return await callback();
    } finally {
      release();
    }
  }
}
