import { describe, expect, it } from "vitest";

import { pascalCase } from "./pascal-case";

describe("@pievy/strings: pascalCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(pascalCase("Hello, world!")).toBe("HelloWorld");
  });

  it("should handle pascal-case, PascalCase, and acronym boundaries", () => {
    expect(pascalCase("helloWorld")).toBe("HelloWorld");
    expect(pascalCase("HelloWorld")).toBe("HelloWorld");
    expect(pascalCase("XMLHttpRequest")).toBe("XmlHttpRequest");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(pascalCase("hello123world")).toBe("Hello123world");
    expect(pascalCase("Hello123World")).toBe("Hello123World");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(pascalCase("")).toBe("");
    expect(pascalCase(" -- ")).toBe("");
    expect(pascalCase(undefined as any)).toBe("");
    expect(pascalCase(null as any)).toBe("");
  });
});
