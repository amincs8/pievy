import { describe, expect, it } from "vitest";

import { truncate } from "./truncate";

describe("@pievy/strings: truncate", () => {
  it("should return value when within length", () => {
    expect(truncate("hello", 5)).toBe("he...");
    expect(truncate("hi", 5)).toBe("hi");
  });

  it("should truncate with default omission", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });

  it("should truncate with custom omission string", () => {
    expect(truncate("hello world", 8, "…")).toBe("hello w…");
  });

  it("should accept options object for omission and granularity", () => {
    expect(truncate("hello world", 8, { omission: "…" })).toBe("hello w…");
    expect(truncate("one two three", 4, { granularity: "word" })).toBe("one ...");
  });

  it("should return sliced omission when length is small", () => {
    expect(truncate("hello", 2)).toBe("..");
    expect(truncate("hello", 1, "…")).toBe("…");
    expect(truncate("hello world", 1, { granularity: "word" })).toBe(".");
  });

  it("should be grapheme-aware by default", () => {
    expect(truncate("a👨‍👩‍👧‍👦bcd", 4)).toBe("a...");
  });

  it("should throw for invalid arguments", () => {
    expect(() => truncate(123 as any, 3)).toThrow(TypeError);
    expect(() => truncate("hi", -1)).toThrow(RangeError);
    expect(() => truncate("hi", 1.5)).toThrow(RangeError);
  });
});
