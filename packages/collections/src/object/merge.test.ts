import { describe, expect, it } from "vitest";

import { merge } from ".";

describe("@pievy/collections: object/merge", () => {
  it("deep-merges plain objects and keeps defaults when overrides are undefined", () => {
    const defaults = {
      locale: "en",
      theme: "light",
      user: {
        name: "Ada",
        role: "guest",
      },
    };

    const overrides = {
      theme: undefined,
      timezone: "UTC",
      user: {
        role: "admin",
      },
    };

    expect(merge(defaults, overrides)).toEqual({
      locale: "en",
      theme: "light",
      timezone: "UTC",
      user: { name: "Ada", role: "admin" },
    });
  });

  it("keeps override-only keys and leaves invalid inputs as empty objects", () => {
    expect(
      merge(
        { user: { profile: { name: "Ada" } } },
        { settings: { dark: true }, user: { profile: { age: 36 } } },
      ),
    ).toEqual({
      settings: { dark: true },
      user: {
        profile: {
          age: 36,
          name: "Ada",
        },
      },
    });

    expect(merge({} as never, null as never)).toEqual({});
    expect(merge(null as never, {} as never)).toEqual({});
  });

  it("merges nested objects without mutating the inputs", () => {
    const defaults = { user: { profile: { name: "Ada" } } };
    const overrides = { user: { profile: { age: 36 } } };

    const result = merge(defaults, overrides);

    expect(result).toEqual({ user: { profile: { age: 36, name: "Ada" } } });
    expect(defaults).toEqual({ user: { profile: { name: "Ada" } } });
    expect(overrides).toEqual({ user: { profile: { age: 36 } } });
  });
});
