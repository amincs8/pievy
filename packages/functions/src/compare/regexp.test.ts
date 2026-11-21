import { describe, expect, it } from "vitest";

import { isEqualRegExp } from "./regexp";

describe("@pievy/functions: isEqualRegExp", () => {
  it("should return true for equal regexps", () => {
    expect(isEqualRegExp(/abc/gi, /abc/gi)).toBe(true);
    expect(isEqualRegExp(/abc/, /abc/)).toBe(true);
    expect(isEqualRegExp(/a.b/, /a.b/)).toBe(true);
  });

  it("should return false for regexps with different source", () => {
    expect(isEqualRegExp(/abc/, /def/)).toBe(false);
  });

  it("should return false for regexps with different flags", () => {
    expect(isEqualRegExp(/abc/g, /abc/i)).toBe(false);
    expect(isEqualRegExp(/abc/, /abc/g)).toBe(false);
  });

  it("should consider lastIndex", () => {
    const r1 = /abc/g;
    const r2 = /abc/g;
    r1.lastIndex = 5;
    r2.lastIndex = 5;
    expect(isEqualRegExp(r1, r2)).toBe(true);

    const r3 = /abc/g;
    r3.lastIndex = 3;
    expect(isEqualRegExp(r1, r3)).toBe(false);
  });

  it("should return false when either value is not a RegExp", () => {
    expect(isEqualRegExp("abc" as any, /abc/)).toBe(false);
    expect(isEqualRegExp(/abc/, "abc" as any)).toBe(false);
    expect(isEqualRegExp(123 as any, 123 as any)).toBe(false);
  });
});
