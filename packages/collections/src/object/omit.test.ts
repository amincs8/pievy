import { describe, expect, it } from "vitest";

import { omit } from ".";

describe("@pievy/collections: object/omit", () => {
  it("returns an object without the selected own properties while preserving the remaining values", () => {
    const source = { active: true, id: 1, name: "Ada", role: "admin" };

    expect(omit(source, ["name", "role"])).toEqual({ active: true, id: 1 });
  });

  it("ignores inherited keys without mutating the source object", () => {
    const inherited = Object.create({ name: "inherited" });
    const source = { active: true, id: 42, name: "Ada" };

    expect(omit(source, ["id"])).toEqual({ active: true, name: "Ada" });
    expect(omit(inherited, ["name"] as const)).toEqual({});
    expect(source).toEqual({ active: true, id: 42, name: "Ada" });
  });

  it("throws for invalid object and key inputs", () => {
    expect(() => omit(null as any, ["name"])).toThrow(TypeError);
    expect(() => omit({ name: "Ada" }, null as any)).toThrow(TypeError);
    expect(() => omit({ name: "Ada" }, undefined as any)).toThrow(TypeError);
  });
});
