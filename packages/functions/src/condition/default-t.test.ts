import { describe, expect, it } from "vitest";

import { defaultTo } from "./default-t";

describe("@pievy/functions: defaultTo", () => {
  it("should return value when it is not nil", () => {
    expect(defaultTo(1, 0)).toBe(1);
    expect(defaultTo("hi", "default")).toBe("hi");
    expect(defaultTo(false, true)).toBe(false);
    expect(defaultTo(0, 99)).toBe(0);
  });

  it("should return default value when value is null", () => {
    expect(defaultTo(null, "default")).toBe("default");
  });

  it("should return default value when value is undefined", () => {
    expect(defaultTo(undefined, "default")).toBe("default");
  });

  it("should preserve object reference when value is provided", () => {
    const obj = { a: 1 };
    expect(defaultTo(obj, { a: 2 })).toBe(obj);
  });

  it("should return default when value is null even if default is falsy", () => {
    expect(defaultTo(null, 0)).toBe(0);
    expect(defaultTo(undefined, false)).toBe(false);
  });
});
