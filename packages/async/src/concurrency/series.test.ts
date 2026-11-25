import { describe, expect, it } from "vitest";

import { series } from "./series";

describe("@pievy/async: series", () => {
  it("runs tasks in order", async () => {
    const result = await series([() => 1, () => 2, () => 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("awaits async tasks", async () => {
    const result = await series([
      () => Promise.resolve(1),
      async () => {
        await new Promise((r) => setTimeout(r, 5));
        return 2;
      },
    ]);
    expect(result).toEqual([1, 2]);
  });

  it("executes sequentially", async () => {
    const order: number[] = [];
    await series([
      async () => {
        await new Promise((r) => setTimeout(r, 10));
        order.push(1);
      },
      async () => {
        order.push(2);
      },
    ]);
    expect(order).toEqual([1, 2]);
  });

  it("propagates rejection", async () => {
    await expect(series([() => Promise.reject(new Error("boom"))])).rejects.toEqual(
      new Error("boom"),
    );
  });

  it("handles empty input", async () => {
    const result = await series([]);
    expect(result).toEqual([]);
  });
});
