import { describe, expect, it } from "vitest";

import { titleCase } from "./title-case";

describe("@pievy/strings: titleCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(titleCase("Hello, world!")).toBe("Hello World");
  });

  it("should handle title-case, PascalCase, and acronym boundaries", () => {
    expect(titleCase("helloWorld")).toBe("Hello World");
    expect(titleCase("HelloWorld")).toBe("Hello World");
    expect(titleCase("XMLHttpRequest")).toBe("Xml Http Request");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(titleCase("Hello123World")).toBe("Hello123 World");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(titleCase("")).toBe("");
    expect(titleCase(" -- ")).toBe("");
    expect(titleCase(undefined as any)).toBe("");
    expect(titleCase(null as any)).toBe("");
  });
});
