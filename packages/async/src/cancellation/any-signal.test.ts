import { describe, expect, it } from "vitest";

import { anySignal } from "./any-signal";

describe("@pievy/async: anySignal", () => {
  it("should return a non-aborted signal for empty input", () => {
    const signal = anySignal([]);

    expect(signal.aborted).toBe(false);
  });

  it("should abort when an input signal is already aborted", () => {
    const controller = new AbortController();
    controller.abort(new Error("already"));

    const signal = anySignal([controller.signal]);

    expect(signal.aborted).toBe(true);
    expect(signal.reason).toEqual(new Error("already"));
  });

  it("should abort when any input signal aborts", () => {
    const c1 = new AbortController();
    const c2 = new AbortController();

    const signal = anySignal([c1.signal, c2.signal]);

    c2.abort(new Error("second"));

    expect(signal.aborted).toBe(true);
    expect(signal.reason).toEqual(new Error("second"));
  });

  it("should not abort before any input aborts", () => {
    const c1 = new AbortController();
    const c2 = new AbortController();

    const signal = anySignal([c1.signal, c2.signal]);

    expect(signal.aborted).toBe(false);
  });

  it("should abort only once", () => {
    const c1 = new AbortController();
    const c2 = new AbortController();

    const signal = anySignal([c1.signal, c2.signal]);

    c1.abort(new Error("first"));
    c2.abort(new Error("second"));

    expect(signal.reason).toEqual(new Error("first"));
  });

  it("should propagate undefined reason", () => {
    const controller = new AbortController();
    const signal = anySignal([controller.signal]);

    controller.abort();

    expect(signal.aborted).toBe(true);
    expect(signal.reason).not.toBeUndefined();
  });
});
