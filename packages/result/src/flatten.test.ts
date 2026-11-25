import { describe, expect, it } from "vitest";

import { flatten } from "./flatten";
import { resultError, resultOk } from "./result";

describe("@pievy/result: flatten", () => {
  it("flattens Ok(Ok(value))", () => {
    const nested = resultOk(resultOk(42));
    const flat = flatten(nested);
    expect(flat.isOk).toBe(true);
    expect(flat.value).toBe(42);
  });

  it("returns Err from nested Err", () => {
    const nested = resultOk(resultError(new Error("inner")));
    const flat = flatten(nested);
    expect(flat.isOk).toBe(false);
    expect(flat.error.message).toBe("inner");
  });

  it("passes through outer Err", () => {
    const nested = resultError(new Error("outer"));
    const flat = flatten(nested);
    expect(flat).toEqual(nested);
  });
});
