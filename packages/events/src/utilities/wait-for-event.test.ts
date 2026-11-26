import { describe, expect, it, vi } from "vitest";

import { createEmitter } from "../core";
import { waitForEvent } from "./wait-for-event";

describe("@pievy/events: utilities/waitForEvent", () => {
  it("resolves with payload when event emitted", async () => {
    const emitter = createEmitter<{ hello: string }>();
    const promise = waitForEvent(emitter, "hello");
    await emitter.emit("hello", "world");
    expect(await promise).toBe("world");
  });

  it("resolves with undefined for void events", async () => {
    const emitter = createEmitter<{ ready: void }>();
    const promise = waitForEvent(emitter, "ready");
    await emitter.emit("ready");
    expect(await promise).toBeUndefined();
  });

  it("rejects on timeout", async () => {
    const emitter = createEmitter<{ ping: void }>();
    const promise = waitForEvent(emitter, "ping", { timeout: 50 });
    await expect(promise).rejects.toThrow('Event "ping" timed out');
  });

  it("rejects if signal already aborted", async () => {
    const emitter = createEmitter<{ ping: void }>();
    const controller = new AbortController();
    controller.abort(new Error("aborted"));
    const promise = waitForEvent(emitter, "ping", { signal: controller.signal });
    await expect(promise).rejects.toEqual(new Error("aborted"));
  });

  it("rejects when signal aborts during wait", async () => {
    const emitter = createEmitter<{ ping: void }>();
    const controller = new AbortController();
    const promise = waitForEvent(emitter, "ping", { signal: controller.signal });
    controller.abort(new Error("cancelled"));
    await expect(promise).rejects.toEqual(new Error("cancelled"));
  });

  it("throws TypeError for invalid timeout", async () => {
    const emitter = createEmitter<{ ping: void }>();
    await expect(waitForEvent(emitter, "ping", { timeout: -1 })).rejects.toThrow(TypeError);
    await expect(waitForEvent(emitter, "ping", { timeout: 0 })).rejects.toThrow(TypeError);
  });

  it("cleans up listener on timeout", async () => {
    const emitter = createEmitter<{ ping: void }>();
    const spy = vi.fn<() => void>();
    emitter.on("ping", spy);
    await expect(waitForEvent(emitter, "ping", { timeout: 10 })).rejects.toThrow(Error);
    await emitter.emit("ping");
    expect(spy).toHaveBeenCalled();
  });

  it("cleans up listener on abort", async () => {
    const emitter = createEmitter<{ ping: void }>();
    const controller = new AbortController();
    const spy = vi.fn<() => void>();
    emitter.on("ping", spy);
    const promise = waitForEvent(emitter, "ping", { signal: controller.signal });
    controller.abort();
    await expect(promise).rejects.toThrow(Error);
    await emitter.emit("ping");
    expect(spy).toHaveBeenCalled();
  });
});
