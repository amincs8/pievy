import { describe, expect, it } from "vitest";

import { mapError } from "./map-error";
import { resultError, resultOk } from "./result";

describe("@pievy/result: mapError", () => {
  it("returns Ok unchanged", () => {
    const ok = resultOk(42);
    const mapped = mapError(ok, (e) => new Error(String(e)));
    expect(mapped).toEqual(ok);
  });

  it("maps Err error", () => {
    const err = resultError(new Error("original"));
    const mapped = mapError(err, (e) => new Error(`mapped: ${e.message}`));
    expect(mapped.isOk).toBe(false);
    if (!mapped.isOk) {
      expect(mapped.error.message).toBe("mapped: original");
    }
  });

  it("preserves type parameter", () => {
    const err = resultError(new Error("oops"));
    const mapped = mapError(err, (e) => new TypeError(e.message));
    expect(mapped.isOk).toBe(false);
    if (!mapped.isOk) {
      expect(mapped.error).toBeInstanceOf(TypeError);
    }
  });
});