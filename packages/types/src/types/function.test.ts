import { describe, expectTypeOf, it } from "vitest";

import type {
  AbstractConstructor,
  AnyFunction,
  AnyFunctionAsync,
  Comparator,
  Constructor,
  Factory,
  Mapper,
  Predicate,
  Reducer,
} from "./function";

describe("@pievy/types: definitions/function", () => {
  it("should expose function helpers", () => {
    type SampleFunction = AnyFunction<[string, number], boolean>;
    type SampleAsyncFunction = AnyFunctionAsync<[string], number>;
    type SamplePredicate = Predicate<string>;
    type SampleComparator = Comparator<number>;
    type SampleMapper = Mapper<string, number>;
    type SampleReducer = Reducer<number, number>;
    type SampleFactory = Factory<string>;

    expectTypeOf<SampleFunction>().toEqualTypeOf<(arg0: string, arg1: number) => boolean>();
    expectTypeOf<SampleAsyncFunction>().toEqualTypeOf<(arg0: string) => Promise<number>>();
    expectTypeOf<SamplePredicate>().toEqualTypeOf<(value: string) => boolean>();
    expectTypeOf<SampleComparator>().toEqualTypeOf<(a: number, b: number) => number>();
    expectTypeOf<SampleMapper>().toEqualTypeOf<(value: string, index: number) => number>();
    expectTypeOf<SampleReducer>().toEqualTypeOf<
      (accumulator: number, currentValue: number, index: number, array: readonly number[]) => number
    >();
    expectTypeOf<SampleFactory>().toEqualTypeOf<() => string>();
  });

  it("should expose constructor helpers", () => {
    type SampleConstructor = Constructor<{ value: string }, [string]>;
    type SampleAbstractConstructor = AbstractConstructor<{ value: string }, [string]>;

    expectTypeOf<SampleConstructor>().toEqualTypeOf<new (arg0: string) => { value: string }>();
    expectTypeOf<SampleAbstractConstructor>().toEqualTypeOf<
      abstract new (arg0: string) => { value: string }
    >();
  });
});
