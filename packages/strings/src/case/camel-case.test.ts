import { describe, expect, it } from "vitest";

import { camelCase } from "./camel-case";

describe("@pievy/strings: camelCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(camelCase("Hello, world!")).toBe("helloWorld");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(camelCase("helloWorld")).toBe("helloWorld");
    expect(camelCase("HelloWorld")).toBe("helloWorld");
    expect(camelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(camelCase("Hello123World")).toBe("hello123World");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(camelCase("")).toBe("");
    expect(camelCase(" -- ")).toBe("");
    expect(camelCase(undefined as any)).toBe("");
    expect(camelCase(null as any)).toBe("");
  });
});
