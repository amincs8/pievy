import { describe, expect, it } from "vitest";

import { pick } from ".";

describe("@pievy/collections: object/pick", () => {
  it("returns only the selected own properties and preserves the requested key order", () => {
    const source = { active: true, id: 1, name: "Ada", role: "admin" };

    expect(pick(source, ["name", "id"])).toEqual({ id: 1, name: "Ada" });
  });

  it("ignores missing inherited keys without mutating the source object", () => {
    const inherited = Object.create({ name: "inherited" });
    const source = { id: 42, user: { name: "Ada" } };

    expect(pick(source, ["id", "missing", "user"] as (keyof typeof source)[])).toEqual({
      id: 42,
      user: { name: "Ada" },
    });
    expect(pick(inherited, ["name"] as const)).toEqual({});
    expect(source).toEqual({ id: 42, user: { name: "Ada" } });
  });

  it("throws for invalid object and key inputs", () => {
    expect(() => pick(null as any, ["name"])).toThrow(TypeError);
    expect(() => pick({ name: "Ada" }, null as any)).toThrow(TypeError);
    expect(() => pick({ name: "Ada" }, undefined as any)).toThrow(TypeError);
  });
});
