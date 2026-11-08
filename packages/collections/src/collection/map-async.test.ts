import { describe, expect, it } from "vitest";

import { STOP } from "../consts";
import { mapAsync } from "./map-async";

describe("@pievy/collections: collection/mapAsync", () => {
  it("should await iterable callbacks sequentially", async () => {
    const calls: string[] = [];
    const result = await mapAsync([1, 2], async (value) => {
      await Promise.resolve();
      calls.push(`start${value}`, `end${value}`);
      return value * 2;
    });

    expect(result).toEqual([2, 4]);
    expect(calls).toEqual(["start1", "end1", "start2", "end2"]);
  });

  it("should map async iterable values", async () => {
    const values = {
      async *[Symbol.asyncIterator]() {
        yield "first";
        yield "second";
      },
    };

    await expect(mapAsync(values, async (value, index) => `${index}:${value}`)).resolves.toEqual([
      "0:first",
      "1:second",
    ]);
  });

  it("should preserve plain object keys while awaiting mapped values", async () => {
    const result = await mapAsync(
      { first: 10, second: 20 },
      async (value, key) => `${key}:${value}`,
    );

    expect(result).toEqual({ first: "first:10", second: "second:20" });
  });

  it("should keep mapping when a callback resolves to the STOP signal", async () => {
    const result = await mapAsync([1, 2, 3], async (value) => (value === 2 ? STOP : value));

    expect(result).toEqual([1, STOP, 3]);
  });

  it("should safely preserve an own __proto__ key", async () => {
    const result = await mapAsync({ ["__proto__"]: "safe" }, async (value) => value.toUpperCase());

    expect(Object.hasOwn(result, "__proto__")).toBe(true);
    expect(result["__proto__"]).toBe("SAFE");
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
});
