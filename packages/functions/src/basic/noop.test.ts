import { describe, expect, it } from "vitest";

import { noop, noopAsync } from "./noop";

describe("@pievy/functions: noop", () => {
  it("should return undefined", () => {
    expect(noop()).toBeUndefined();
  });
});

describe("@pievy/functions: noopAsync", () => {
  it("should resolve to undefined", async () => {
    await expect(noopAsync()).resolves.toBeUndefined();
  });
});
