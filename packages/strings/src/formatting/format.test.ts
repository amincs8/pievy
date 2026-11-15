import { describe, expect, it } from "vitest";

import { format } from "./format";

describe("@pievy/strings: format", () => {
  it("should replace indexed placeholders with array values", () => {
    expect(format("Hello, {0}!", ["Ada"])).toBe("Hello, Ada!");
    expect(format("{1} + {0} = {2}", [1, 2, 3])).toBe("2 + 1 = 3");
  });

  it("should replace sequential placeholders in order", () => {
    expect(format("Hello, {} and {}!", ["Ada", "Bob"])).toBe("Hello, Ada and Bob!");
  });

  it("should support rest arguments as positional values", () => {
    expect(format("Hello, {} and {}!", "Ada", "Bob")).toBe("Hello, Ada and Bob!");
  });

  it("should leave positional placeholders unchanged when no value exists", () => {
    expect(format("Hello, {0} and {2}!", ["Ada"])).toBe("Hello, Ada and {2}!");
    expect(format("Hi, {} and {}!", ["Ada"])).toBe("Hi, Ada and {}!");
  });

  it("should replace named placeholders from an object", () => {
    expect(format("Hello, {name}!", { name: "Ada" })).toBe("Hello, Ada!");
    expect(format("{word}, {word}!", { word: "echo" })).toBe("echo, echo!");
    expect(format("{greeting}, {name}!", { greeting: "Hi", name: "Bob" })).toBe("Hi, Bob!");
  });

  it("should use string representations of values", () => {
    expect(format("{a} + {a} = {b}", { a: 1, b: 2 })).toBe("1 + 1 = 2");
    expect(format("values: {0}, {1}", [false, null])).toBe("values: false, null");
  });

  it("should only replace own properties for named placeholders", () => {
    const values = Object.create({ inherited: "nope" }) as Record<string, unknown>;
    values.own = "yes";

    expect(format("{own}-{inherited}", values)).toBe("{own}-{inherited}");
  });

  it("should leave named placeholders unchanged when no value is provided", () => {
    expect(format("Hello, {name}!", {})).toBe("Hello, {name}!");
  });

  it("should throw when template is not a string", () => {
    expect(() => format(undefined as any, { name: "Ada" })).toThrow(TypeError);
    expect(() => format(123 as any, [1])).toThrow(TypeError);
  });
});
