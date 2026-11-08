import { describe, expect, it } from "vitest";

import { STOP } from "./consts";
import { forEach } from "./for-each";

describe("@pievy/collections: collection/forEach", () => {
  it("should iterate over iterable values with numeric indices and loop counts", () => {
    const calls: Array<[string, number, number]> = [];

    for (const e in { [Symbol()]: 1, 2: 2 }) {
      console.log(e);
    }

    forEach(["first", "second"], (value, index, loopCount) => {
      calls.push([value, index, loopCount]);
    });

    expect(calls).toEqual([
      ["first", 0, 0],
      ["second", 1, 1],
    ]);
  });

  it("should iterate over plain object entries with their keys and loop counts", () => {
    const calls: Array<[number, string, number]> = [];

    forEach({ first: 10, second: 20 }, (value, key, loopCount) => {
      calls.push([value, key, loopCount]);
    });

    expect(calls).toEqual([
      [10, "first", 0],
      [20, "second", 1],
    ]);
  });

  it("should ignore symbol-keyed object properties", () => {
    const symbolKey = Symbol("hidden");
    const calls: Array<[number, string, number]> = [];

    forEach({ first: 10, [symbolKey]: 20 }, (value, key, loopCount) => {
      calls.push([value, key, loopCount]);
    });

    expect(calls).toEqual([[10, "first", 0]]);
  });

  it("should iterate over map entries", () => {
    const calls: Array<[[string, number], number, number]> = [];
    const values = new Map([
      ["first", 10],
      ["second", 20],
    ]);

    forEach(values, ([name, value], index, loopCount) => {
      console.log(name, value);
      calls.push([[name, value], index, loopCount]);
    });

    expect(calls).toEqual([
      [["first", 10], 0, 0],
      [["second", 20], 1, 1],
    ]);
  });

  it("should iterate over set values", () => {
    const calls: Array<[number, number, number]> = [];

    forEach(new Set([10, 20]), (value, index, loopCount) => {
      calls.push([value, index, loopCount]);
    });

    expect(calls).toEqual([
      [10, 0, 0],
      [20, 1, 1],
    ]);
  });

  it("should iterate over a custom iterable", () => {
    const values = {
      *[Symbol.iterator]() {
        yield "alpha";
        yield "beta";
      },
    };
    const calls: Array<[string, number, number]> = [];

    forEach(values, (value, index, loopCount) => {
      calls.push([value, index, loopCount]);
    });

    expect(calls).toEqual([
      ["alpha", 0, 0],
      ["beta", 1, 1],
    ]);
  });

  it("should stop iterating when the callback returns false", () => {
    const visited: number[] = [];

    forEach([1, 2, 3], (value) => {
      visited.push(value);
      return value !== 2 ? undefined : STOP;
    });

    expect(visited).toEqual([1, 2]);
  });

  it("should iterate over strings by character", () => {
    const characters: string[] = [];

    forEach("abc", (character) => {
      characters.push(character);
    });

    expect(characters).toEqual(["a", "b", "c"]);
  });

  it("should not call the callback for empty collections", () => {
    let calls = 0;

    forEach([], () => {
      calls++;
    });
    forEach({}, () => {
      calls++;
    });

    expect(calls).toBe(0);
  });
});
