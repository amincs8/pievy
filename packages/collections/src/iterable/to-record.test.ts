import { describe, expect, it } from "vitest";

import { toRecord } from ".";

describe("@pievy/collections: iterable/to-record", () => {
  it("creates a record from a property key", () => {
    const users = [
      { id: 1, name: "Ada" },
      { id: 2, name: "Lin" },
    ];

    expect(toRecord(users, ".id")).toEqual({
      1: { id: 1, name: "Ada" },
      2: { id: 2, name: "Lin" },
    });
  });

  it("supports a custom iteratee", () => {
    const users = [
      { id: 1, name: "Ada" },
      { id: 2, name: "Lin" },
    ];

    expect(
      toRecord(users, (user) => [user.name, user.id]),
    ).toEqual({
      Ada: 1,
      Lin: 2,
    });
  });

  it("supports entry descriptors for key and value resolution", () => {
    const users = [
      { id: 1, name: "Ada" },
      { id: 2, name: "Lin" },
    ];

    expect(toRecord(users, { key: ".id", value: ".name" })).toEqual({
      1: "Ada",
      2: "Lin",
    });

    expect(toRecord(users, { key: ".id", value: (user) => user.name.toUpperCase() })).toEqual({
      1: "ADA",
      2: "LIN",
    });
  });

  it("stores the value itself when no iteratee is provided", () => {
    expect(toRecord(["apple", "banana"])).toEqual({
      apple: true,
      banana: true,
    });
  });

  it("throws when the input is not iterable", () => {
    expect(() => toRecord(null as any)).toThrow(TypeError);
  });
});
