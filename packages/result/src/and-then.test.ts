import { describe, expect, it, vi } from "vitest";

import { andThen } from "./and-then";
import { resultError, resultOk } from "./result";
import type { ResultOk } from "./types";

describe("@pievy/result: andThen", () => {
  it("should chain successful results", () => {
    const result = andThen(resultOk(2), (value) => resultOk(value * 2));

    expect(result).toEqual(resultOk(4));
  });

  it("should return the first error", () => {
    const result = resultError("first error");

    expect(andThen(result, (value: number) => resultOk(value * 2))).toBe(result);
  });

  it("should return an error from the mapper", () => {
    const result = andThen(resultOk(2), () => resultError("second error"));

    expect(result).toEqual(resultError("second error"));
  });

  it("should not call the mapper for Err", () => {
    const mapper = vi.fn<(n: number) => ResultOk<number>>((value: number) => resultOk(value * 2));

    andThen(resultError("failed"), mapper);

    expect(mapper).not.toHaveBeenCalled();
  });

  it("should support different error types", () => {
    const result = andThen(resultOk(10), (value) =>
      value > 0 ? resultOk(value.toString()) : resultError("invalid"),
    );

    expect(result).toEqual(resultOk("10"));
  });
});
