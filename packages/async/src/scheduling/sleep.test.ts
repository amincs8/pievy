import { describe, expect, it } from "vitest";

import { sleep } from "./sleep";

describe("@pievy/async: sleep", () => {
  it("should resolve after the given delay", async () => {
    const start = Date.now();
    await sleep(50);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(40);
  });

  it("should resolve with undefined", async () => {
    await expect(sleep(10)).resolves.toBeUndefined();
  });

  it("should reject when delay is negative", async () => {
    await expect(sleep(-1)).rejects.toBeInstanceOf(TypeError);
  });

  it("should reject when delay is zero", async () => {
    await expect(sleep(0)).rejects.toBeInstanceOf(TypeError);
  });

  it("should reject when delay is not a number", async () => {
    await expect(sleep("100" as any)).rejects.toBeInstanceOf(TypeError);
  });

  it("should reject when aborted before resolve", async () => {
    const controller = new AbortController();

    const promise = sleep(5000, { signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.not.toBeUndefined();
  });

  it("should reject with signal reason when aborted", async () => {
    const controller = new AbortController();
    const e = new Error("cancelled");

    controller.abort(e);

    await expect(sleep(5000, { signal: controller.signal })).rejects.toBe(e);
  });

  it("should not reject when aborted after resolve", async () => {
    const controller = new AbortController();

    const promise = sleep(10, { signal: controller.signal });
    await promise;
    controller.abort();

    expect(controller.signal.aborted).toBe(true);
  });

  it("should reject immediately when signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(sleep(100, { signal: controller.signal })).rejects.toBeUndefined();
  });
});
