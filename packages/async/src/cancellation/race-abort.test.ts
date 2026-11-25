import { describe, expect, it } from "vitest";

import { raceAbort } from "./race-abort";

describe("@pievy/async: raceAbort", () => {
  it("resolves with promise value when no signal", async () => {
    const result = await raceAbort(Promise.resolve(42));
    expect(result).toBe(42);
  });

  it("resolves with promise value", async () => {
    const result = await raceAbort(Promise.resolve("hi"));
    expect(result).toBe("hi");
  });

  it("rejects with signal reason if already aborted", async () => {
    const controller = new AbortController();
    controller.abort(new Error("aborted"));
    await expect(raceAbort(Promise.resolve(1), controller.signal)).rejects.toEqual(
      new Error("aborted"),
    );
  });

  it("rejects when signal aborts before promise resolves", async () => {
    const controller = new AbortController();
    const promise = new Promise((resolve) => setTimeout(resolve, 1000, 1));
    const p = raceAbort(promise, controller.signal);
    controller.abort(new Error("boom"));
    await expect(p).rejects.toEqual(new Error("boom"));
  });

  it("resolves if promise settles before abort", async () => {
    const controller = new AbortController();
    const result = await raceAbort(Promise.resolve(7), controller.signal);
    expect(result).toBe(7);
  });

  it("propagates promise rejection", async () => {
    await expect(raceAbort(Promise.reject(new Error("fail")))).rejects.toEqual(
      new Error("fail"),
    );
  });
});
