import { describe, expect, it } from "vitest";

import { pathCase } from "./path-case";

describe("@pievy/strings: pathCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(pathCase("Hello, world!")).toBe("hello/world");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(pathCase("helloWorld")).toBe("hello/world");
    expect(pathCase("HelloWorld")).toBe("hello/world");
    expect(pathCase("XMLHttpRequest")).toBe("xml/http/request");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(pathCase("Hello123World")).toBe("hello123/world");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(pathCase("")).toBe("");
    expect(pathCase(" -- ")).toBe("");
    expect(pathCase(undefined as any)).toBe("");
    expect(pathCase(null as any)).toBe("");
  });
});
