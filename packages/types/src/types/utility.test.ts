import { describe, expectTypeOf, it } from "vitest";

import type {
  DeepPartial,
  DeepReadonly,
  OptionalKeysOf,
  Prettify,
  UnionToIntersection,
  XOR,
} from "./utility";

describe("@pievy/types: definitions/utility", () => {
  it("should expose deep utility types", () => {
    type Input = {
      user: {
        name: string;
        tags?: string[];
        meta: {
          active: boolean;
        };
      };
    };

    expectTypeOf<DeepReadonly<Input>>().toMatchTypeOf<{
      readonly user: {
        readonly name: string;
        readonly tags?: readonly string[] | undefined;
        readonly meta: {
          readonly active: boolean;
        };
      };
    }>();

    expectTypeOf<DeepPartial<Input>>().toMatchTypeOf<{
      user?: {
        name?: string;
        tags?: string[] | undefined;
        meta?: {
          active?: boolean;
        };
      };
    }>();
  });

  it("should expose pretty and intersection helpers", () => {
    type Combined = { first: string } | { second: number };

    expectTypeOf<Prettify<{ a: string; b: number }>>().toEqualTypeOf<{ a: string; b: number }>();
    expectTypeOf<UnionToIntersection<Combined>>().toEqualTypeOf<
      {
        first: string;
      } & { second: number }
    >();
  });

  it("should expose xor and optional-key helpers", () => {
    type SampleXor = XOR<{ a: string }, { b: number }>;
    type SampleOptional = { a?: string; b: number; c?: boolean };

    expectTypeOf<SampleXor>().toEqualTypeOf<
      | ({ a: string } & { [K in Exclude<keyof { b: number }, keyof { a: string }>]?: never })
      | ({ b: number } & { [K in Exclude<keyof { a: string }, keyof { b: number }>]?: never })
    >();

    expectTypeOf<OptionalKeysOf<SampleOptional>>().toEqualTypeOf<"a" | "c">();
  });
});
