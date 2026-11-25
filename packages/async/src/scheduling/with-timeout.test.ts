import { describe, expect, it } from "vitest";

import { sleep } from "./sleep";
import { withTimeout } from "./with-timeout";

describe("@pievy/async: withTimeout", () => {
  it("should resolve with callback result when it settles before timeout", async () => {
    const result = await withTimeout(() => 42, { timeout: 1000 });

    expect(result).toBe(42);
  });

  it("should resolve async callback before timeout", async () => {
    const result = await withTimeout(
      async () => {
        return "done";
      },
      { timeout: 1000 },
    );

    expect(result).toBe("done");
  });

  it("should reject when timeout elapses before callback settles", async () => {
    await expect(withTimeout(() => new Promise(() => {}), { timeout: 20 })).rejects.toThrow(
      "The operation timed out",
    );
  });

  it("should reject with custom timeout message", async () => {
    await expect(
      withTimeout(() => new Promise(() => {}), { message: "too slow", timeout: 20 }),
    ).rejects.toThrow("too slow");
  });

  it("should reject when signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      withTimeout(() => 42, { signal: controller.signal, timeout: 1000 }),
    ).rejects.not.toBeUndefined();
  });

  it("should reject when external signal aborts", async () => {
    const controller = new AbortController();
    const e = new Error("cancelled");
    const promise = withTimeout(() => new Promise(() => {}), {
      signal: controller.signal,
      timeout: 5000,
    });

    controller.abort(e);

    await expect(promise).rejects.toBe(e);
  });

  it("should cancel the callback when timeout expires", async () => {
    let resolved = false;

    const promise = withTimeout(
      async (signal) => {
        await sleep(100, { signal });

        resolved = true;
        return 1;
      },
      { timeout: 20 },
    );

    await expect(promise).rejects.toThrow("The operation timed out");
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(resolved).toBe(false);
  });

  it("should reject when callback throws", async () => {
    await expect(
      withTimeout(
        () => {
          throw new Error("boom");
        },
        { timeout: 1000 },
      ),
    ).rejects.toThrow("boom");
  });

  it("should reject when async callback rejects", async () => {
    await expect(
      withTimeout(
        async () => {
          throw new Error("async boom");
        },
        { timeout: 1000 },
      ),
    ).rejects.toThrow("async boom");
  });

  it("should reject when delay is not positive finite number", async () => {
    await expect(sleep(0)).rejects.toBeInstanceOf(TypeError);
    await expect(sleep(-1)).rejects.toBeInstanceOf(TypeError);
    await expect(sleep(NaN)).rejects.toBeInstanceOf(TypeError);
    await expect(sleep("" as unknown as number)).rejects.toBeInstanceOf(TypeError);
  });
});
