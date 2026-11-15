import { describe, expect, it } from "vitest";

import { swapCase } from "./swap-case";

describe("@pievy/strings: swapCase", () => {
  it("should swap the case of letters in a sentence", () => {
    expect(swapCase("Hello, world!")).toBe("hELLO WORLD");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(swapCase("helloWorld")).toBe("HELLO wORLD");
    expect(swapCase("HelloWorld")).toBe("hELLO wORLD");
    expect(swapCase("XMLHttpRequest")).toBe("xml hTTP rEQUEST");
  });

  it("should preserve numbers while swapping letter case", () => {
    expect(swapCase("Hello123World")).toBe("hELLO123 wORLD");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(swapCase("")).toBe("");
    expect(swapCase(" -- ")).toBe("");
    expect(swapCase(undefined as any)).toBe("");
    expect(swapCase(null as any)).toBe("");
  });
});
