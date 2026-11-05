import { describe, expectTypeOf, it } from "vitest";

import type { Dictionary, ElementOf, Entries, NonEmptyArray, PlainObject, ValueOf } from "./object";

describe("@pievy/types: definitions/object", () => {
  it("should expose object helper types", () => {
    expectTypeOf<ValueOf<{ a: string; b: number }>>().toEqualTypeOf<string | number>();
    expectTypeOf<ElementOf<[string, number]>>().toEqualTypeOf<string | number>();
    expectTypeOf<NonEmptyArray<number>>().toEqualTypeOf<[number, ...number[]]>();
    expectTypeOf<Dictionary<number>>().toEqualTypeOf<Record<string, number>>();
    expectTypeOf<PlainObject<number>>().toEqualTypeOf<Record<PropertyKey, number>>();
    expectTypeOf<Entries<{ a: string; b: number }>>().toEqualTypeOf<
      (["a", string] | ["b", number])[]
    >();
  });
});
