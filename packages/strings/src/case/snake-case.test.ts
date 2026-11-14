import { describe, expect, it } from "vitest";

import { snakeCase } from "./snake-case";

describe("@pievy/strings: snakeCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(snakeCase("Hello, world!")).toBe("hello_world");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(snakeCase("helloWorld")).toBe("hello_world");
    expect(snakeCase("HelloWorld")).toBe("hello_world");
    expect(snakeCase("XMLHttpRequest")).toBe("xml_http_request");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(snakeCase("Hello123World")).toBe("hello123_world");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(snakeCase("")).toBe("");
    expect(snakeCase(" -- ")).toBe("");
    expect(snakeCase(undefined as any)).toBe("");
    expect(snakeCase(null as any)).toBe("");
  });
});
