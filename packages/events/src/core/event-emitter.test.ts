import { describe, expect, it, vi } from "vitest";

import { EventEmitter } from "./event-emitter";

type Events = {
  ready: void;
  "user:created": { id: string };
  "user:deleted": { id: string };
};

describe("@pievy/events: core/EventEmitter", () => {
  it("should emit events with payload", async () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => void>();

    emitter.on("user:created", listener);
    await emitter.emit("user:created", { id: "1" });

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith({ id: "1" });
  });

  it("should emit events without payload", async () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => void>();

    emitter.on("ready", listener);
    await emitter.emit("ready");

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(undefined);
  });

  it("should support multiple listeners", async () => {
    const emitter = new EventEmitter<Events>();
    const first = vi.fn<() => void>();
    const second = vi.fn<() => void>();

    emitter.on("ready", first);
    emitter.on("ready", second);

    await emitter.emit("ready");

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it("should remove a listener with off", async () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => void>();

    emitter.on("ready", listener);
    emitter.off("ready", listener);
    await emitter.emit("ready");

    expect(listener).not.toHaveBeenCalled();
  });

  it("should remove only the most recently registered matching listener", async () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => void>();

    emitter.on("ready", listener);
    emitter.on("ready", listener);

    emitter.off("ready", listener);
    await emitter.emit("ready");

    expect(listener).toHaveBeenCalledOnce();
  });

  it("should unsubscribe using subscription", async () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => void>();

    const subscription = emitter.on("ready", listener);

    subscription.unsubscribe();
    await emitter.emit("ready");

    expect(listener).not.toHaveBeenCalled();
    expect(subscription.closed).toBe(true);
  });

  it("should make unsubscribe idempotent", () => {
    const emitter = new EventEmitter<Events>();
    const subscription = emitter.on("ready", vi.fn<() => void>());

    subscription.unsubscribe();
    subscription.unsubscribe();

    expect(subscription.closed).toBe(true);
  });

  it("should invoke once listeners only once", async () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => void>();

    emitter.once("ready", listener);

    await emitter.emit("ready");
    await emitter.emit("ready");

    expect(listener).toHaveBeenCalledOnce();
  });

  it("should remove once listener before invoking it", async () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => Promise<unknown>>(async () => await emitter.emit("ready"));

    emitter.once("ready", listener);
    await emitter.emit("ready");

    expect(listener).toHaveBeenCalledOnce();
  });

  it("should clear listeners for a specific event", async () => {
    const emitter = new EventEmitter<Events>();
    const readyListener = vi.fn<() => void>();
    const createdListener = vi.fn<() => void>();

    emitter.on("ready", readyListener);
    emitter.on("user:created", createdListener);

    emitter.clear("ready");

    await emitter.emit("ready");
    await emitter.emit("user:created", { id: "1" });

    expect(readyListener).not.toHaveBeenCalled();
    expect(createdListener).toHaveBeenCalledOnce();
  });

  it("should clear all listeners", async () => {
    const emitter = new EventEmitter<Events>();
    const readyListener = vi.fn<() => void>();
    const createdListener = vi.fn<() => void>();

    emitter.on("ready", readyListener);
    emitter.on("user:created", createdListener);

    emitter.clearAll();

    await emitter.emit("ready");
    await emitter.emit("user:created", { id: "1" });

    expect(readyListener).not.toHaveBeenCalled();
    expect(createdListener).not.toHaveBeenCalled();
  });

  it("should return the listener count", () => {
    const emitter = new EventEmitter<Events>();

    const first = emitter.on("ready", vi.fn<() => void>());
    emitter.on("ready", vi.fn<() => void>());

    expect(emitter.listenerCount("ready")).toBe(2);

    first.unsubscribe();

    expect(emitter.listenerCount("ready")).toBe(1);
  });

  it("should not invoke listeners added during emission", async () => {
    const emitter = new EventEmitter<Events>();
    const second = vi.fn<() => void>();

    emitter.on("ready", () => {
      emitter.on("ready", second);
    });

    await emitter.emit("ready");

    expect(second).not.toHaveBeenCalled();

    await emitter.emit("ready");

    expect(second).toHaveBeenCalledOnce();
  });

  it("should invoke listeners removed during emission", async () => {
    const emitter = new EventEmitter<Events>();
    const second = vi.fn<() => void>();

    emitter.on("ready", () => {
      emitter.off("ready", second);
    });

    emitter.on("ready", second);

    await emitter.emit("ready");

    expect(second).not.toHaveBeenCalled();
  });

  it("should support abort signal in on", async () => {
    const emitter = new EventEmitter<Events>();
    const controller = new AbortController();
    const listener = vi.fn<() => void>();

    emitter.on("ready", listener, { signal: controller.signal });
    controller.abort();
    await emitter.emit("ready");

    expect(listener).not.toHaveBeenCalled();
  });

  it("should support abort signal in once", async () => {
    const emitter = new EventEmitter<Events>();
    const controller = new AbortController();
    const listener = vi.fn<() => void>();

    emitter.once("ready", listener, { signal: controller.signal });
    controller.abort();
    await emitter.emit("ready");

    expect(listener).not.toHaveBeenCalled();
  });

  it("should close subscription when signal aborts", async () => {
    const emitter = new EventEmitter<Events>();
    const controller = new AbortController();
    const subscription = emitter.on("ready", vi.fn<() => void>(), { signal: controller.signal });

    expect(subscription.closed).toBe(false);
    controller.abort();
    expect(subscription.closed).toBe(true);
  });

  it("should call onAny for every event", async () => {
    const emitter = new EventEmitter<Events>();
    const anyListener = vi.fn<() => void>();

    emitter.onAny(anyListener);
    await emitter.emit("ready");
    await emitter.emit("user:created", { id: "1" });

    expect(anyListener).toHaveBeenCalledTimes(2);
    expect(anyListener).toHaveBeenNthCalledWith(1, "ready");
    expect(anyListener).toHaveBeenNthCalledWith(2, "user:created", { id: "1" });
  });

  it("should call onceAny only once for the first event", async () => {
    const emitter = new EventEmitter<Events>();
    const anyListener = vi.fn<() => void>();

    emitter.onceAny(anyListener);
    await emitter.emit("ready");
    await emitter.emit("user:created", { id: "1" });

    expect(anyListener).toHaveBeenCalledOnce();
    expect(anyListener).toHaveBeenCalledWith("ready");
  });

  it("should remove global listener with offAny", async () => {
    const emitter = new EventEmitter<Events>();
    const anyListener = vi.fn<() => void>();

    emitter.onAny(anyListener);
    emitter.offAny(anyListener);
    await emitter.emit("ready");

    expect(anyListener).not.toHaveBeenCalled();
  });

  it("should remove only the most recent matching global listener", async () => {
    const emitter = new EventEmitter<Events>();
    const anyListener = vi.fn<() => void>();

    emitter.onAny(anyListener);
    emitter.onAny(anyListener);
    emitter.offAny(anyListener);
    await emitter.emit("ready");

    expect(anyListener).toHaveBeenCalledOnce();
  });

  it("should return correct anyListenerCount", () => {
    const emitter = new EventEmitter<Events>();
    const listener = vi.fn<() => void>();
    expect(emitter.anyListenerCount()).toBe(0);

    emitter.onAny(listener);
    emitter.onAny(vi.fn<() => void>());
    expect(emitter.anyListenerCount()).toBe(2);

    emitter.offAny(vi.fn<() => void>());
    expect(emitter.anyListenerCount()).toBe(2);

    emitter.offAny(listener);
    expect(emitter.anyListenerCount()).toBe(1);
  });

  it("should clear global listeners with clearAll", async () => {
    const emitter = new EventEmitter<Events>();
    const anyListener = vi.fn<() => void>();

    emitter.onAny(anyListener);
    emitter.clearAll();
    await emitter.emit("ready");

    expect(anyListener).not.toHaveBeenCalled();
    expect(emitter.anyListenerCount()).toBe(0);
  });

  it("should execute event-specific listeners before global listeners", async () => {
    const emitter = new EventEmitter<Events>();
    const order: string[] = [];

    emitter.onAny((event) => {
      order.push(`any:${event}`);
    });
    emitter.on("ready", () => order.push("specific"));

    await emitter.emit("ready");

    expect(order).toEqual(["specific", "any:ready"]);
  });

  it("should support abort signal in onAny", async () => {
    const emitter = new EventEmitter<Events>();
    const controller = new AbortController();
    const listener = vi.fn<() => void>();

    emitter.onAny(listener, { signal: controller.signal });
    controller.abort();
    await emitter.emit("ready");

    expect(listener).not.toHaveBeenCalled();
  });

  it("should support abort signal in onceAny", async () => {
    const emitter = new EventEmitter<Events>();
    const controller = new AbortController();
    const listener = vi.fn<() => void>();

    emitter.onceAny(listener, { signal: controller.signal });
    controller.abort();
    await emitter.emit("ready");

    expect(listener).not.toHaveBeenCalled();
  });
});
