import { describe, expect, it } from "vitest";

import { mapLimit } from "./map-limit";

describe("@pievy/async: mapLimit", () => {
  it("maps values in order", async () => {
    const result = await mapLimit([1, 2, 3], 2, (x) => x * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it("supports async mapper", async () => {
    const result = await mapLimit([1, 2, 3], 1, async (x) => {
      await new Promise((r) => setTimeout(r, 5));
      return x + 1;
    });
    expect(result).toEqual([2, 3, 4]);
  });

  it("respects concurrency limit", async () => {
    let running = 0;
    let maxRunning = 0;
    await mapLimit([1, 2, 3, 4], 2, async () => {
      running++;
      maxRunning = Math.max(maxRunning, running);
      await new Promise((r) => setTimeout(r, 10));
      running--;
    });
    expect(maxRunning).toBeLessThanOrEqual(2);
  });

  it("passes index to mapper", async () => {
    const result = await mapLimit(["a", "b"], 1, (item, index) => `${item}${index}`);
    expect(result).toEqual(["a0", "b1"]);
  });

  it("throws on invalid limit", async () => {
    await expect(mapLimit([1], 0, (x) => x)).rejects.toThrow(TypeError);
    await expect(mapLimit([1], 1.5, (x) => x)).rejects.toThrow(TypeError);
  });

  it("handles empty input", async () => {
    const result = await mapLimit([], 2, (x) => x);
    expect(result).toEqual([]);
  });
});
