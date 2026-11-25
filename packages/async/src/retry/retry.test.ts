import { describe, expect, it } from "vitest";

import { retry } from "./retry";

describe("@pievy/async: retry", () => {
  it("should resolve on first successful attempt", async () => {
    const result = await retry((attempt) => attempt);

    expect(result).toBe(1);
  });

  it("should retry until success within attempts", async () => {
    let calls = 0;
    const result = await retry(() => {
      calls++;
      if (calls < 3) {
        throw new Error("not yet");
      }
      return calls;
    });

    expect(result).toBe(3);
    expect(calls).toBe(3);
  });

  it("should reject after exhausting attempts", async () => {
    let calls = 0;
    await expect(
      retry(
        () => {
          calls++;
          throw new Error("fail");
        },
        { attempts: 3 },
      ),
    ).rejects.toThrow("fail");
    expect(calls).toBe(3);
  });

  it("should respect shouldRetry", async () => {
    let calls = 0;
    await expect(
      retry(
        () => {
          calls++;
          throw new Error("fail");
        },
        { attempts: 5, shouldRetry: () => false },
      ),
    ).rejects.toThrow("fail");
    expect(calls).toBe(1);
  });

  it("should use delay between attempts", async () => {
    let calls = 0;
    const start = Date.now();

    try {
      await retry(
        () => {
          calls++;
          throw new Error("fail");
        },
        { attempts: 3, delay: 50 },
      );
    } catch (_) {
      //
    }
    const elapsed = Date.now() - start;

    expect(calls).toBe(3);
    expect(elapsed).toBeGreaterThanOrEqual(50);
  });

  it("should apply exponential backoff capped at maxDelay", async () => {
    // We cannot easily spy on the imported sleep, so verify via timing instead.
    const start = Date.now();
    try {
      await retry(
        () => {
          throw new Error("fail");
        },
        { attempts: 4, delay: 10, factor: 2, maxDelay: 100 },
      );
    } catch {
      // ignored
    }
    const elapsed = Date.now() - start;

    // 10 + 20 + 40 = 70 ms minimum
    expect(elapsed).toBeGreaterThanOrEqual(60);
  });

  it("should throw when attempts is invalid", async () => {
    await expect(retry(() => 1, { attempts: 0 })).rejects.toThrow(TypeError);
    await expect(retry(() => 1, { attempts: -1 })).rejects.toThrow(TypeError);
    await expect(retry(() => 1, { attempts: 1.5 })).rejects.toThrow(TypeError);
  });

  it("should throw when delay is invalid", async () => {
    await expect(retry(() => 1, { delay: -1 })).rejects.toThrow(TypeError);

    await expect(retry(() => 1, { delay: NaN })).rejects.toThrow(TypeError);
  });

  it("should throw when factor is invalid", async () => {
    await expect(retry(() => 1, { factor: 0 })).rejects.toThrow(TypeError);
    await expect(retry(() => 1, { factor: NaN })).rejects.toThrow(TypeError);
  });

  it("should throw when maxDelay is invalid", async () => {
    await expect(retry(() => 1, { maxDelay: -1 })).rejects.toThrow(TypeError);
    await expect(retry(() => 1, { maxDelay: NaN })).rejects.toThrow(TypeError);
  });

  it("should throw signal reason when aborted", async () => {
    const controller = new AbortController();
    const promise = retry(() => new Promise(() => {}), {
      attempts: 5,
      delay: 1000,
      signal: controller.signal,
    });

    const e = new Error("cancelled");

    controller.abort(e);

    await expect(promise).rejects.toBe(e);
  });

  it("should return async callback result", async () => {
    const result = await retry(async (attempt) => {
      await Promise.resolve();
      return attempt;
    });

    expect(result).toBe(1);
  });

  it("should pass attempt number to shouldRetry", async () => {
    const attempts: number[] = [];
    await expect(
      retry(
        () => {
          throw new Error("fail");
        },
        {
          attempts: 3,
          shouldRetry: (_err, attempt) => {
            attempts.push(attempt);
            return attempt < 2;
          },
        },
      ),
    ).rejects.toThrow("fail");
    expect(attempts).toEqual([1, 2]);
  });

  it("should support linear strategy", async () => {
    let calls = 0;
    const start = Date.now();
    try {
      await retry(
        () => {
          calls++;
          throw new Error("fail");
        },
        { attempts: 3, delay: 20, strategy: "linear" },
      );
    } catch {
      // ignored
    }
    const elapsed = Date.now() - start;
    expect(calls).toBe(3);
    expect(elapsed).toBeGreaterThanOrEqual(20 + 40);
  });

  it("should support fixed strategy", async () => {
    let calls = 0;
    try {
      await retry(
        () => {
          calls++;
          throw new Error("fail");
        },
        { attempts: 3, delay: 10, strategy: "fixed" },
      );
    } catch {
      // ignored
    }
    expect(calls).toBe(3);
  });

  it("should throw on aborted signal before first attempt", async () => {
    const controller = new AbortController();
    controller.abort(new Error("pre-aborted"));

    await expect(retry(() => 1, { signal: controller.signal })).rejects.toBe(
      new Error("pre-aborted"),
    );
  });

  it("should pass signal to callback", async () => {
    const controller = new AbortController();
    const result = await retry((_attempt, signal) => {
      expect(signal).toBe(controller.signal);
      return "ok";
    }, { signal: controller.signal });

    expect(result).toBe("ok");
  });

  it("should reject with signal reason during delay", async () => {
    const controller = new AbortController();
    const promise = retry(
      () => {
        throw new Error("fail");
      },
      { attempts: 5, delay: 1000, signal: controller.signal },
    );

    setTimeout(() => controller.abort(new Error("aborted-during-delay")), 20);

    await expect(promise).rejects.toBe(new Error("aborted-during-delay"));
  });
});
