import { describe, expect, it } from "vitest";

import { trainCase } from "./train-case";

describe("@pievy/strings: trainCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(trainCase("Hello, world!")).toBe("Hello-World");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(trainCase("helloWorld")).toBe("Hello-World");
    expect(trainCase("HelloWorld")).toBe("Hello-World");
    expect(trainCase("XMLHttpRequest")).toBe("Xml-Http-Request");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(trainCase("Hello123World")).toBe("Hello123-World");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(trainCase("")).toBe("");
    expect(trainCase(" -- ")).toBe("");
    expect(trainCase(undefined as any)).toBe("");
    expect(trainCase(null as any)).toBe("");
  });
});
