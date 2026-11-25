import { describe, expect, it } from "vitest";

import { Semaphore } from "./semaphore";

describe("@pievy/async: synchronization/Semaphore", () => {
  it("should respect the concurrency limit", async () => {
    const semaphore = new Semaphore(2);

    let active = 0;
    let maxActive = 0;

    await Promise.all(
      Array.from({ length: 10 }, () =>
        semaphore.runExclusive(async () => {
          active++;
          maxActive = Math.max(maxActive, active);

          await new Promise((resolve) => setTimeout(resolve, 10));

          active--;
        }),
      ),
    );

    expect(maxActive).toBe(2);
  });

  it("should execute waiting tasks in FIFO order", async () => {
    const semaphore = new Semaphore(1);
    const order: number[] = [];

    const release = await semaphore.acquire();

    const first = semaphore.runExclusive(() => order.push(1));
    const second = semaphore.runExclusive(() => order.push(2));

    expect(semaphore.pending).toBe(2);

    release();

    await Promise.all([first, second]);

    expect(order).toEqual([1, 2]);
  });

  it("should release automatically after callback throws", async () => {
    const semaphore = new Semaphore(1);

    await expect(
      semaphore.runExclusive(() => {
        throw new Error("Failed");
      }),
    ).rejects.toThrow("Failed");

    expect(semaphore.active).toBe(0);
  });

  it("should ignore duplicate release calls", async () => {
    const semaphore = new Semaphore(1);

    const release = await semaphore.acquire();

    release();
    release();

    expect(semaphore.active).toBe(0);
  });

  it("should transfer permits to waiting tasks", async () => {
    const semaphore = new Semaphore(1);

    const release = await semaphore.acquire();
    const next = semaphore.acquire();

    release();

    const nextRelease = await next;

    expect(semaphore.active).toBe(1);

    nextRelease();

    expect(semaphore.active).toBe(0);
  });

  it("should validate capacity", () => {
    expect(() => new Semaphore(0)).toThrow(TypeError);
    expect(() => new Semaphore(-1)).toThrow(TypeError);
    expect(() => new Semaphore(1.5)).toThrow(TypeError);
  });
});
