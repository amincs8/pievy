import { describe, expect, it } from "vitest";

import { getValue } from "..";

describe("@pievy/collections: object/get-value", () => {
  it("reads nested values from dot paths and keyed arrays", () => {
    const source = {
      user: {
        profile: {
          name: "Ada",
        },
        tags: ["admin", "beta"],
      },
    };

    expect(getValue(source, ".user.profile.name")).toBe("Ada");
    expect(getValue(source, ["user", "tags", 1])).toBe("beta");
    expect(getValue(source, ".user.tags[1]")).toBe("beta");
  });

  it("returns undefined when a path segment is missing or the object is invalid", () => {
    const source = { user: { profile: { name: "Ada" } } };

    expect(getValue(source, ".user.profile.age")).toBeUndefined();
    expect(getValue(source, ".user[0].name")).toBeUndefined();
    expect(getValue(source, ".user.profile.name.first")).toBeUndefined();
    expect(getValue(source, "not-a-dot-path")).toBeUndefined();
    expect(getValue(null, ".user.name")).toBeUndefined();
    expect(getValue({ user: null }, ".user.name")).toBeUndefined();
  });

  it("supports typed lookup results and property arrays on nested objects", () => {
    const source = {
      library: {
        books: [{ title: "Dune" }, { title: "Neuromancer" }],
      },
    };

    expect(getValue<{ title: string }>(source, ["library", "books", 0])).toEqual({ title: "Dune" });
    expect(getValue<string>(source, ".library.books[1].title")).toBe("Neuromancer");
    expect(getValue<string>(source, ".library.books[99].title")).toBeUndefined();
  });
});
