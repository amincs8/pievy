import { describe, expect, it, vi } from "vitest";

import { createEmitter } from "../core";
import { subscribe } from "./subscribe";

describe("@pievy/events: utilities/subscribe", () => {
  it("subscribes multiple events at once", async () => {
    const emitter = createEmitter<{ a: string; b: number }>();
    const aListener = vi.fn<() => void>();
    const bListener = vi.fn<() => void>();

    const subscription = subscribe(emitter, {
      a: aListener,
      b: bListener,
    });

    await emitter.emit("a", "hello");
    await emitter.emit("b", 42);

    expect(aListener).toHaveBeenCalledWith("hello");
    expect(bListener).toHaveBeenCalledWith(42);
    expect(subscription.closed).toBe(false);
  });

  it("subscribes multiple listeners per event", async () => {
    const emitter = createEmitter<{ a: string }>();
    const listener1 = vi.fn<() => void>();
    const listener2 = vi.fn<() => void>();

    subscribe(emitter, { a: [listener1, listener2] });
    await emitter.emit("a", "test");

    expect(listener1).toHaveBeenCalledWith("test");
    expect(listener2).toHaveBeenCalledWith("test");
  });

  it("unsubscribes all with unsubscribeAll", async () => {
    const emitter = createEmitter<{ a: string; b: string }>();
    const aListener = vi.fn<() => void>();
    const bListener = vi.fn<() => void>();

    const subscription = subscribe(emitter, {
      a: aListener,
      b: bListener,
    });

    subscription.unsubscribeAll();
    await emitter.emit("a", "hello");
    await emitter.emit("b", "world");

    expect(aListener).not.toHaveBeenCalled();
    expect(bListener).not.toHaveBeenCalled();
    expect(subscription.closed).toBe(true);
  });

  it("unsubscribes single event with unsubscribe(event)", async () => {
    const emitter = createEmitter<{ a: string; b: string }>();
    const aListener = vi.fn<() => void>();
    const bListener = vi.fn<() => void>();

    const subscription = subscribe(emitter, {
      a: aListener,
      b: bListener,
    });

    subscription.unsubscribe("a");
    await emitter.emit("a", "hello");
    await emitter.emit("b", "world");

    expect(aListener).not.toHaveBeenCalled();
    expect(bListener).toHaveBeenCalledWith("world");
    expect(subscription.closed).toBe(false);
  });

  it("abort signal unsubscribes all", async () => {
    const emitter = createEmitter<{ a: string }>();
    const listener = vi.fn<() => void>();
    const controller = new AbortController();

    subscribe(emitter, { a: listener }, { signal: controller.signal });
    controller.abort();
    await emitter.emit("a", "test");

    expect(listener).not.toHaveBeenCalled();
  });

  it("returns closed subscription if signal already aborted", () => {
    const emitter = createEmitter<{ a: string }>();
    const controller = new AbortController();
    controller.abort();

    const subscription = subscribe(
      emitter,
      { a: vi.fn<() => void>() },
      { signal: controller.signal },
    );
    expect(subscription.closed).toBe(true);
  });

  it("handles empty events object", () => {
    const emitter = createEmitter<{ a: string }>();
    const subscription = subscribe(emitter, {});
    expect(subscription.closed).toBe(false);
    subscription.unsubscribeAll();
    expect(subscription.closed).toBe(true);
  });

  it("unsubscribeAll is idempotent", () => {
    const emitter = createEmitter<{ a: string }>();
    const subscription = subscribe(emitter, { a: vi.fn<() => void>() });
    subscription.unsubscribeAll();
    subscription.unsubscribeAll();
    expect(subscription.closed).toBe(true);
  });
});
