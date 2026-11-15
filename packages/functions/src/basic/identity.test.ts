import { describe, expect, it } from "vitest";

import { identity, identityAsync } from "./identity";

describe("@pievy/functions: identity", () => {
  it("should return the given value", () => {
    expect(identity(1)).toBe(1);
    expect(identity("a")).toBe("a");
  });

  it("should return the same reference", () => {
    const obj = { x: 1 };
    expect(identity(obj)).toBe(obj);
  });
});

describe("@pievy/functions: identityAsync", () => {
  it("should resolve to the given value", async () => {
    await expect(identityAsync(1)).resolves.toBe(1);
    await expect(identityAsync("a")).resolves.toBe("a");
  });

  it("should resolve to the same reference", async () => {
    const obj = { x: 1 };
    await expect(identityAsync(obj)).resolves.toBe(obj);
  });
});
