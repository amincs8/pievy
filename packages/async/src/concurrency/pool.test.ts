import { describe, expect, it } from "vitest";

import { pool } from "./pool";

describe("@pievy/async: concurrency/pool", () => {
  it("throws on invalid concurrency", () => {
    expect(() => pool({ concurrency: 0 })).toThrow(TypeError);
    expect(() => pool({ concurrency: 1.5 })).toThrow(TypeError);
  });

  it("runs tasks with concurrency limit", async () => {
    const p = pool({ concurrency: 2 });
    let running = 0;
    let maxRunning = 0;

    const task = async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((r) => setTimeout(r, 10));
      running--;
      return running;
    };

    const results = await Promise.all([p.add(task), p.add(task), p.add(task)]);
    expect(maxRunning).toBeLessThanOrEqual(2);
    expect(results).toHaveLength(3);
  });

  it("add rejects non-function", async () => {
    const p = pool({ concurrency: 1 });
    await expect(p.add(123 as any)).rejects.toThrow(TypeError);
  });

  it("clear rejects queued tasks", async () => {
    const p = pool({ concurrency: 1 });
    const first = p.add(() => new Promise((r) => setTimeout(r, 50)));
    const second = p.add(() => 2);
    const cleared = p.clear(new Error("cleared"));
    expect(cleared).toBe(1);
    await expect(second).rejects.toThrow("cleared");
    await first;
  });

  it("pause and resume", async () => {
    const p = pool({ concurrency: 1 });
    p.pause();
    const task = p.add(() => 1);
    expect(p.isPaused).toBe(true);
    expect(p.pending).toBe(1);
    p.resume();
    expect(await task).toBe(1);
  });

  it("onEmpty resolves when queue empty", async () => {
    const p = pool({ concurrency: 1 });
    const task = p.add(() => 1);
    await p.onEmpty();
    expect(await task).toBe(1);
  });

  it("onIdle resolves when idle", async () => {
    const p = pool({ concurrency: 1 });
    const task = p.add(() => 1);
    await task;
    await p.onIdle();
    expect(p.running).toBe(0);
    expect(p.pending).toBe(0);
  });

  it("size tracks queue + running", async () => {
    const p = pool({ concurrency: 1 });
    const task = p.add(() => new Promise((r) => setTimeout(r, 50)));
    expect(p.size).toBeGreaterThanOrEqual(1);
    await task;
  });
});
