import { describe, expect, it } from "vitest";

import { constantCase } from "./constant-case";

describe("@pievy/strings: constantCase", () => {
  it("should convert words separated by spaces and punctuation", () => {
    expect(constantCase("Hello, world!")).toBe("HELLO_WORLD");
  });

  it("should handle camel-case, PascalCase, and acronym boundaries", () => {
    expect(constantCase("helloWorld")).toBe("HELLO_WORLD");
    expect(constantCase("HelloWorld")).toBe("HELLO_WORLD");
    expect(constantCase("XMLHttpRequest")).toBe("XML_HTTP_REQUEST");
  });

  it("should preserve numbers while converting following word boundaries", () => {
    expect(constantCase("Hello123World")).toBe("HELLO123_WORLD");
  });

  it("should return an empty string for empty or non-string values", () => {
    expect(constantCase("")).toBe("");
    expect(constantCase(" -- ")).toBe("");
    expect(constantCase(undefined as any)).toBe("");
    expect(constantCase(null as any)).toBe("");
  });
});
