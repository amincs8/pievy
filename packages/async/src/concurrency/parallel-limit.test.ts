import { describe, expect, it } from "vitest";

import { parallelLimit } from "./parallel-limit";

describe("@pievy/async: parallelLimit", () => {
  it("runs tasks in order", async () => {
    const result = await parallelLimit([() => 1, () => 2, () => 3], 2);
    expect(result).toEqual([1, 2, 3]);
  });

  it("supports async tasks", async () => {
    const result = await parallelLimit(
      [() => Promise.resolve(1), () => Promise.resolve(2)],
      1,
    );
    expect(result).toEqual([1, 2]);
  });

  it("respects concurrency limit", async () => {
    let running = 0;
    let maxRunning = 0;
    await parallelLimit(
      Array.from({ length: 4 }, () => async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await new Promise((r) => setTimeout(r, 10));
        running--;
      }),
      2,
    );
    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it("throws on invalid limit", async () => {
    await expect(parallelLimit([() => 1], 0)).rejects.toThrow(TypeError);
    await expect(parallelLimit([() => 1], 1.5)).rejects.toThrow(TypeError);
  });

  it("fails fast on first error", async () => {
    await expect(
      parallelLimit([() => 1, () => Promise.reject(new Error("boom")), () => 3], 2),
    ).rejects.toEqual(new Error("boom"));
  });

  it("handles empty input", async () => {
    const result = await parallelLimit([], 2);
    expect(result).toEqual([]);
  });
});
