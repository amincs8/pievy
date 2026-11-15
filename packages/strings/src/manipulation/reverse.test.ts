import { describe, expect, it } from "vitest";

import { reverse } from "./reverse";

describe("@pievy/strings: reverse", () => {
  it("should reverse a string", () => {
    expect(reverse("abc")).toBe("cba");
  });

  it("should handle empty string", () => {
    expect(reverse("")).toBe("");
  });

  it("should reverse by grapheme clusters", () => {
    expect(reverse("a👨‍👩‍👧‍👦b")).toBe("b👨‍👩‍👧‍👦a");
    expect(reverse("éa")).toBe("aé");
    expect(reverse("hello")).toBe("olleh");
    expect(reverse("Hello World")).toBe("dlroW olleH");
    expect(reverse("😀😊")).toBe("😊😀");
    expect(reverse("café")).toBe("éfac");
    expect(reverse("👨‍👩‍👧‍👦")).toBe("👨‍👩‍👧‍👦");
    expect(reverse("e\u0301")).toBe("e\u0301");
  });
});
