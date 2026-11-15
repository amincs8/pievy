import { describe, expect, it } from "vitest";

import { sentenceCase } from "./sentence-case";

describe("@pievy/strings: sentenceCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(sentenceCase("Hello, world!")).toBe("Hello world");
  });

  it("should handle sentence-case, PascalCase, and acronym boundaries", () => {
    expect(sentenceCase("helloWorld")).toBe("Hello world");
    expect(sentenceCase("HelloWorld")).toBe("Hello world");
    expect(sentenceCase("XMLHttpRequest")).toBe("Xml http request");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(sentenceCase("Hello123World")).toBe("Hello123 world");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(sentenceCase("")).toBe("");
    expect(sentenceCase(" -- ")).toBe("");
    expect(sentenceCase(undefined as any)).toBe("");
    expect(sentenceCase(null as any)).toBe("");
  });
});
