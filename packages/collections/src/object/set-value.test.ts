import { describe, expect, it } from "vitest";

import { setValue } from ".";

describe("@pievy/collections: object/set-value", () => {
  it("sets nested values with dot paths and key arrays", () => {
    const source: Record<string, unknown> = {};

    expect(setValue(source, ".user.profile.name", "Ada")).toBe("Ada");
    expect(source).toEqual({
      user: {
        profile: {
          name: "Ada",
        },
      },
    });

    expect(setValue(source, ["user", "tags", 1], "beta")).toBe("beta");
    expect(source.user).toEqual({
      profile: { name: "Ada" },
      tags: [undefined, "beta"],
    });
  });

  it("creates missing intermediate objects and returns undefined for empty paths", () => {
    const source: Record<string, unknown> = {};

    expect(setValue(source, ".library.books[0].title", "Dune")).toBe("Dune");
    expect(source).toEqual({
      library: {
        books: [{ title: "Dune" }],
      },
    });

    expect(setValue(source, [], "ignored")).toBeUndefined();
    expect(setValue({}, "", "ignored")).toBeUndefined();
  });

  it("does nothing for non-object targets and invalid paths", () => {
    const source = { user: { profile: { name: "Ada" } } };

    expect(setValue(source, ".user.profile.name", "Grace")).toBe("Grace");
    expect(source.user.profile.name).toBe("Grace");

    expect(setValue(null as unknown as object, ".user.name", "nope")).toBeUndefined();
    expect(setValue(source, "not-a-dot-path", "nope")).toBeUndefined();
  });
});
