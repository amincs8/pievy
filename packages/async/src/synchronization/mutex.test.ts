import { describe, expect, it } from "vitest";

import { Mutex } from "./mutex";

describe("@pievy/async: synchronization/Mutex", () => {
  it("should acquire and release the lock", async () => {
    const mutex = new Mutex();
    const release = await mutex.acquire();

    expect(mutex.isLocked).toBe(true);
    release();
    expect(mutex.isLocked).toBe(false);
  });

  it("should prevent concurrent access", async () => {
    const mutex = new Mutex();
    const order: number[] = [];

    await Promise.all([
      mutex.runExclusive(async () => {
        order.push(1);
        await Promise.resolve();
        order.push(2);
      }),
      mutex.runExclusive(() => {
        order.push(3);
      }),
    ]);

    expect(order).toEqual([1, 2, 3]);
  });

  it("should preserve FIFO order", async () => {
    const mutex = new Mutex();
    const order: number[] = [];

    const release = await mutex.acquire();

    const first = mutex.runExclusive(() => order.push(1));
    const second = mutex.runExclusive(() => order.push(2));

    expect(mutex.pending).toBe(2);

    release();

    await Promise.all([first, second]);

    expect(order).toEqual([1, 2]);
  });

  it("should release the lock when callback throws", async () => {
    const mutex = new Mutex();

    await expect(
      mutex.runExclusive(() => {
        throw new Error("Failed");
      }),
    ).rejects.toThrow("Failed");

    expect(mutex.isLocked).toBe(false);
  });

  it("should ignore duplicate release calls", async () => {
    const mutex = new Mutex();

    const release = await mutex.acquire();

    release();
    release();

    expect(mutex.isLocked).toBe(false);
  });

  it("should release the next waiter without unlocking", async () => {
    const mutex = new Mutex();

    const release = await mutex.acquire();
    const next = mutex.acquire();

    release();

    const nextRelease = await next;

    expect(mutex.isLocked).toBe(true);

    nextRelease();

    expect(mutex.isLocked).toBe(false);
  });

  it("should return the callback result", async () => {
    const mutex = new Mutex();

    await expect(mutex.runExclusive(() => 42)).resolves.toBe(42);
  });
});
