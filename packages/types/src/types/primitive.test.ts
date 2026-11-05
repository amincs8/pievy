import { describe, expectTypeOf, it } from "vitest";

import type { Maybe, MaybePromise, Nullish, Nullable, Numberish, Primitive } from "./primitive";

describe("@pievy/types: definitions/primitive", () => {
  it("should expose primitive nullable helpers", () => {
    expectTypeOf<Primitive>().toEqualTypeOf<
      string | number | bigint | boolean | symbol | null | undefined
    >();
    expectTypeOf<Nullable<string>>().toEqualTypeOf<string | null>();
    expectTypeOf<Maybe<string>>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Nullish<string>>().toEqualTypeOf<string | null | undefined>();
    expectTypeOf<MaybePromise<string>>().toEqualTypeOf<string | Promise<string>>();
    expectTypeOf<Numberish>().toEqualTypeOf<number | `${number}`>();
  });
});
