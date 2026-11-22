import { describe, expect, it } from "vitest";

import { isEqualBy } from "./is-equal-by";

describe("@pievy/functions: isEqualBy", () => {
  it("should compare transformed values", () => {
    expect(isEqualBy(1, 2, (n) => n * 2)).toBe(false);
    expect(isEqualBy(1, 2, (_) => 0)).toBe(true);
  });

  it("should apply iteratee to both values", () => {
    const iteratee = (x: { a: number }) => x.a;
    expect(isEqualBy({ a: 1 }, { a: 1 }, iteratee)).toBe(true);
    expect(isEqualBy({ a: 1 }, { a: 2 }, iteratee)).toBe(false);
  });

  it("should handle string transformations", () => {
    expect(isEqualBy("abc", "ABC", (s) => String(s).toLowerCase())).toBe(true);
    expect(isEqualBy("abc", "def", (s) => String(s).toLowerCase())).toBe(false);
  });

  it("should compare deeply after transformation", () => {
    const iteratee = (x: { items: number[] }) => x.items;
    expect(isEqualBy({ items: [1, 2] }, { items: [1, 2] }, iteratee)).toBe(true);
    expect(isEqualBy({ items: [1, 2] }, { items: [1, 3] }, iteratee)).toBe(false);
    expect(
      isEqualBy(
        { age: 25, firstName: "John", lastName: "Doe" },
        { age: 30, name: "John Doe" },
        (user) => ({
          name: "firstName" in user ? `${user.firstName} ${user.lastName}` : user.name,
        }),
      ),
    ).toBe(true);
  });

  it("should handle identity iteratee", () => {
    expect(isEqualBy(1, 1, (x) => x)).toBe(true);
    expect(isEqualBy(1, 2, (x) => x)).toBe(false);
  });
});
