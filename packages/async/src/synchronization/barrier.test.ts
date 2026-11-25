import { describe, expect, it } from "vitest";

import { Barrier } from "./barrier";

describe("@pievy/async: synchronization/Barrier", () => {
  it("should wait until all parties arrive", async () => {
    const barrier = new Barrier(3);

    let released = 0;

    const first = barrier.wait().then(() => released++);
    const second = barrier.wait().then(() => released++);

    await Promise.resolve();

    expect(released).toBe(0);
    expect(barrier.waiting).toBe(2);

    const third = barrier.wait().then(() => released++);

    await Promise.all([first, second, third]);

    expect(released).toBe(3);
  });

  it("should release immediately for a single party", async () => {
    const barrier = new Barrier(1);

    await expect(barrier.wait()).resolves.toBeUndefined();
  });

  it("should support multiple generations", async () => {
    const barrier = new Barrier(2);

    await Promise.all([barrier.wait(), barrier.wait()]);

    await Promise.all([barrier.wait(), barrier.wait()]);

    expect(barrier.waiting).toBe(0);
  });

  it("should release all waiting parties together", async () => {
    const barrier = new Barrier(3);
    const order: number[] = [];

    const workers = [1, 2, 3].map(async (id) => {
      await barrier.wait();
      order.push(id);
    });

    await Promise.all(workers);

    expect(order).toHaveLength(3);
    expect(order.sort()).toEqual([1, 2, 3]);
  });

  it("should validate parties", () => {
    expect(() => new Barrier(0)).toThrow(TypeError);
    expect(() => new Barrier(-1)).toThrow(TypeError);
    expect(() => new Barrier(1.5)).toThrow(TypeError);
  });
});
