import { describe, expect, it } from "vitest";

import { hasOwn } from ".";

describe("@pievy/collections: object/has-own", () => {
  it("returns true for own properties and false for inherited ones", () => {
    const source = { user: { name: "Ada" } };
    const inherited = Object.create({ inherited: true });

    expect(hasOwn(source, "user")).toBe(true);
    expect(hasOwn(source, "name" as unknown as any)).toBe(false);
    expect(hasOwn(inherited, "inherited")).toBe(false);
  });

  it("narrows the property key inside type guards", () => {
    const source = { age: 36, name: "Ada" } as const;
    const values = {
      age: hasOwn(source, "age") ? source.age : false,
      name: hasOwn(source, "name") ? source.name : false,
    };
    expect(source.name).toBe(values.name);
    expect(source.age).toBe(values.age);
  });

  it("throws for invalid object input", () => {
    expect(() => hasOwn(null as any, "value")).toThrow(TypeError);
    expect(() => hasOwn(undefined as any, "value")).toThrow(TypeError);
  });
});
