import { describe, expect, it } from "vitest";

import { splitWords, splitWordsPrepare } from "./split-words";

describe("@pievy/strings: splitWordsPrepare", () => {
  it("should split camel-case and acronym boundaries", () => {
    expect(splitWordsPrepare("XMLHttpRequest")).toBe("XML Http Request");
    expect(splitWordsPrepare("helloWorld")).toBe("hello World");
  });

  it("should normalize punctuation and whitespace", () => {
    expect(splitWordsPrepare("  hello-world\tfrom_the  web! ")).toBe(
      "hello world from the web",
    );
  });

  it("should preserve Unicode letters and numbers", () => {
    expect(splitWordsPrepare("café日本語123")).toBe("café日本語123");
  });

  it("should return an empty string for non-string values", () => {
    expect(splitWordsPrepare(undefined as any)).toBe("");
    expect(splitWordsPrepare(null as any)).toBe("");
  });
});

describe("@pievy/strings: splitWords", () => {
  it("should split prepared words into an array", () => {
    expect(splitWords("XMLHttpRequest")).toEqual(["XML", "Http", "Request"]);
    expect(splitWords("hello-world from_the web")).toEqual([
      "hello",
      "world",
      "from",
      "the",
      "web",
    ]);
  });

  it("should return an empty array for empty or non-string values", () => {
    expect(splitWords("")).toEqual([]);
    expect(splitWords(" -- ")).toEqual([]);
    expect(splitWords(undefined as any)).toEqual([]);
    expect(splitWords(null as any)).toEqual([]);
  });
});
