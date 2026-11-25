import { describe, expect, it } from "vitest";

import { orElse } from "./or-error";
import { resultError, resultOk } from "./result";

describe("@pievy/result: orElse", () => {
  it("returns Ok unchanged", () => {
    const ok = resultOk(42);
    const handled = orElse(ok, () => resultOk("fallback"));
    expect(handled).toEqual(ok);
  });

  it("handles Err with fallback", () => {
    const err = resultError(new Error("fail"));
    const handled = orElse(err, () => resultOk("fallback"));
    expect(handled.isOk).toBe(true);
    expect(handled.value).toBe("fallback");
  });

  it("can map to different error type", () => {
    const err = resultError(new Error("original"));
    const handled = orElse(err, (e) => resultError(new TypeError(e.message)));
    expect(handled.isOk).toBe(false);
    expect(handled.error).toBeInstanceOf(TypeError);
  });

  it("preserves Ok value type union", () => {
    const ok = resultOk(1);
    const handled = orElse(ok, () => resultOk("two"));
    expect(handled.isOk && handled.value).toBe(1);
  });
});
