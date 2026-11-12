import { describe, expect, it } from "vitest";

import { hasKey } from ".";

describe("@pievy/collections: object/has-key", () => {
  it("returns true for valid nested dot paths and keyed arrays", () => {
    const source = {
      user: {
        profile: {
          name: "Ada",
        },
        tags: ["admin", { name: "beta" }],
      },
    };

    expect(hasKey(source, ".user.profile.name")).toBe(true);
    expect(hasKey(source, ["user", "profile", "name"])).toBe(true);
    expect(hasKey(source, ".user.tags[1].name")).toBe(true);
  });

  it("returns false when a segment is missing or a path is invalid", () => {
    const source = { user: { profile: { name: "Ada" } } };

    expect(hasKey(source, ".user.profile.age")).toBe(false);
    expect(hasKey(source, ".user[0].name")).toBe(false);
    expect(hasKey(source, ".user.profile.name.first")).toBe(false);
    expect(hasKey(source, "not-a-dot-path")).toBe(false);
    expect(hasKey(null as unknown as object, ".user.name")).toBe(false);
    expect(hasKey({ user: null }, ".user.name")).toBe(false);
  });

  it("accepts string paths as well as arrays and preserves own-property checks", () => {
    const source = {
      library: {
        books: [{ title: "Dune" }, { title: "Neuromancer" }],
      },
    };

    expect(hasKey(source, ".library.books[0].title")).toBe(true);
    expect(hasKey(source, ["library", "books", 1, "title"])).toBe(true);
    expect(hasKey(source, ".library.books[99].title")).toBe(false);
  });
});
