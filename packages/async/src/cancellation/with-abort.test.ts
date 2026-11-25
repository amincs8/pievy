import { describe, expect, it } from "vitest";

import { withAbort } from "./with-abort";

describe("@pievy/async: withAbort", () => {
  it("returns callback result when no signal", async () => {
    const result = await withAbort((signal) => {
      expect(signal).toBeInstanceOf(AbortSignal);
      return 42;
    });
    expect(result).toBe(42);
  });

  it("returns callback result with signal", async () => {
    const controller = new AbortController();
    const result = await withAbort((signal) => {
      return signal === controller.signal ? "ok" : "bad";
    }, controller.signal);
    expect(result).toBe("ok");
  });

  it("rejects if signal already aborted", async () => {
    const controller = new AbortController();
    controller.abort(new Error("aborted"));
    await expect(withAbort(() => 1, controller.signal)).rejects.toEqual(new Error("aborted"));
  });

  it("rejects when signal aborts during callback", async () => {
    const controller = new AbortController();
    const p = withAbort(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(1), 1000);
        }),
      controller.signal,
    );
    controller.abort(new Error("boom"));
    await expect(p).rejects.toEqual(new Error("boom"));
  });

  it("propagates synchronous throw", async () => {
    await expect(
      withAbort(() => {
        throw new Error("sync");
      }),
    ).rejects.toEqual(new Error("sync"));
  });
});
