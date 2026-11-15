import { describe, expect, it } from "vitest";

import { dotCase } from "./dot-case";

describe("@pievy/strings: dotCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(dotCase("Hello, world!")).toBe("hello.world");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(dotCase("helloWorld")).toBe("hello.world");
    expect(dotCase("HelloWorld")).toBe("hello.world");
    expect(dotCase("XMLHttpRequest")).toBe("xml.http.request");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(dotCase("Hello123World")).toBe("hello123.world");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(dotCase("")).toBe("");
    expect(dotCase(" -- ")).toBe("");
    expect(dotCase(undefined as any)).toBe("");
    expect(dotCase(null as any)).toBe("");
  });
});
