import { describe, expect, it } from "vitest";

import { isMatch } from "./is-match";

describe("@pievy/functions: isMatch", () => {
  it("should return true when object contains all source properties", () => {
    expect(isMatch({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toBe(true);
    expect(isMatch({ a: 1 }, { a: 1 })).toBe(true);
  });

  it("should return true when object and source are the same reference", () => {
    const obj = { a: 1 };
    expect(isMatch(obj, obj)).toBe(true);
  });

  it("should return false when a source property is missing", () => {
    expect(isMatch({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("should return false when a source property value differs", () => {
    expect(isMatch({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
  });

  it("should match nested objects deeply", () => {
    expect(isMatch({ a: { b: 2, c: 3 }, d: 4 }, { a: { b: 2 } })).toBe(true);
    expect(isMatch({ a: { b: 2 } }, { a: { b: 3 } })).toBe(false);
  });

  it("should match nested arrays", () => {
    expect(isMatch({ a: [1, 2, 3] }, { a: [1, 2] })).toBe(true);
    expect(isMatch({ a: [1, 2, 3] }, { a: [1, 2, 3] })).toBe(true);
  });

  it("should return false for non-object inputs", () => {
    expect(isMatch(1, { a: 1 })).toBe(false);
    expect(isMatch({ a: 1 }, 1)).toBe(false);
    expect(isMatch(null, { a: 1 })).toBe(false);
    expect(isMatch({ a: 1 }, null)).toBe(false);
  });

  it("should return true for empty source", () => {
    expect(isMatch({ a: 1 }, {})).toBe(true);
    expect(isMatch({}, {})).toBe(true);
  });

  it("should match primitives via Object.is when same reference", () => {
    expect(isMatch("a", "a")).toBe(true);
  });
});
