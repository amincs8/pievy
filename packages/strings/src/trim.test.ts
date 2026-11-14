import { describe, expect, it } from "vitest";

import { trim, trimEnd, trimStart } from "./trim";

describe("@pievy/strings: trim", () => {
  it("should trim default whitespace from both ends", () => {
    expect(trim("  hello world\n\t")).toBe("hello world");
  });

  it("should trim custom characters from both ends", () => {
    expect(trim("***hello***", "*")).toBe("hello");
  });

  it("should trim custom characters from the start only", () => {
    expect(trimStart("---hello---", "-")).toBe("hello---");
  });

  it("should trim custom characters from the end only", () => {
    expect(trimEnd("---hello---", "-")).toBe("---hello");
  });

  it("should leave a value unchanged when custom trim characters are empty", () => {
    expect(trim("  hello  ", "")).toBe("  hello  ");
  });

  it("should return an empty string for non-string values", () => {
    expect(trim(undefined as any)).toBe("");
    expect(trimStart(null as any)).toBe("");
    expect(trimEnd(0 as any)).toBe("");
  });
});
