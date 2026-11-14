import { describe, expect, it } from "vitest";

import { kebabCase } from "./kebab-case";

describe("@pievy/strings: kebabCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(kebabCase("Hello, world!")).toBe("hello-world");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(kebabCase("helloWorld")).toBe("hello-world");
    expect(kebabCase("HelloWorld")).toBe("hello-world");
    expect(kebabCase("XMLHttpRequest")).toBe("xml-http-request");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(kebabCase("Hello123World")).toBe("hello123-world");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(kebabCase("")).toBe("");
    expect(kebabCase(" -- ")).toBe("");
    expect(kebabCase(undefined as any)).toBe("");
    expect(kebabCase(null as any)).toBe("");
  });
});
