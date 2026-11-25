import { describe, expect, it } from "vitest";

import { waitFor } from "./wait-for";

describe("@pievy/async: scheduling/waitFor", () => {
  it("resolves immediately when predicate true", async () => {
    expect(await waitFor(() => true)).toBeUndefined();
  });

  it("polls until predicate becomes true", async () => {
    let count = 0;
    const promise = waitFor(
      () => {
        count++;
        return count >= 3;
      },
      { interval: 10 },
    );

    await promise;
    expect(count).toBeGreaterThanOrEqual(3);
  });

  it("throws on invalid interval", async () => {
    await expect(waitFor(() => false, { interval: -1 })).rejects.toThrow(TypeError);
  });

  it("throws on invalid timeout", async () => {
    await expect(waitFor(() => false, { timeout: -1 })).rejects.toThrow(TypeError);
  });

  it("throws TimeoutError when timeout elapses", async () => {
    const promise = waitFor(() => false, { interval: 10, timeout: 20 });
    const expectation = await expect(promise).rejects.toMatchObject({ name: "TimeoutError" });
    await expectation;
  });

  it("throws if signal already aborted", async () => {
    const controller = new AbortController();
    controller.abort(new Error("aborted"));
    await expect(waitFor(() => false, { signal: controller.signal })).rejects.toEqual(
      new Error("aborted"),
    );
  });

  it("supports async predicate", async () => {
    let count = 0;
    await waitFor(
      async () => {
        count++;
        return count >= 2;
      },
      { interval: 1 },
    );
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
