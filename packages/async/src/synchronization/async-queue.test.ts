import { describe, expect, it } from "vitest";

import { AsyncQueue } from "./async-queue";

describe("@pievy/async: synchronization/AsyncQueue", () => {
  it("should enqueue and dequeue items in FIFO order", async () => {
    const queue = new AsyncQueue<number>();

    queue.enqueue(1);
    queue.enqueue(2);

    await expect(queue.dequeue()).resolves.toBe(1);
    await expect(queue.dequeue()).resolves.toBe(2);
  });

  it("should wait when the queue is empty", async () => {
    const queue = new AsyncQueue<number>();

    const result = queue.dequeue();

    queue.enqueue(42);

    await expect(result).resolves.toBe(42);
  });

  it("should deliver items directly to waiting consumers", async () => {
    const queue = new AsyncQueue<number>();

    const first = queue.dequeue();
    const second = queue.dequeue();

    queue.enqueue(1);
    queue.enqueue(2);

    await expect(first).resolves.toBe(1);
    await expect(second).resolves.toBe(2);
  });

  it("should support undefined as a valid value", async () => {
    const queue = new AsyncQueue<number | undefined>();

    queue.enqueue(undefined);

    await expect(queue.dequeue()).resolves.toBeUndefined();
    expect(queue.isEmpty).toBe(true);
  });

  it("should report queue state", async () => {
    const queue = new AsyncQueue<number>();

    queue.enqueue(1);
    queue.enqueue(2);

    expect(queue.size).toBe(2);
    expect(queue.pending).toBe(0);
    expect(queue.isEmpty).toBe(false);

    await queue.dequeue();
    await queue.dequeue();

    expect(queue.isEmpty).toBe(true);
  });

  it("should support tryDequeue", () => {
    const queue = new AsyncQueue<number>();

    expect(queue.tryDequeue()).toBeUndefined();

    queue.enqueue(10);

    expect(queue.tryDequeue()).toEqual({ value: 10 });
  });

  it("should clear queued items", async () => {
    const queue = new AsyncQueue<number>();

    queue.enqueue(1);
    queue.enqueue(2);

    queue.clear();

    expect(queue.size).toBe(0);
    expect(queue.isEmpty).toBe(true);
  });
});
