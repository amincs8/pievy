import { describe, expect, it } from "vitest";

import { createEmitter } from "./create-emitter";

describe("@pievy/events: core/createEmitter", () => {
  it("creates an EventEmitter instance", () => {
    const emitter = createEmitter<{ ready: void }>();
    expect(emitter).toBeDefined();
  });

  it("emitter can emit and listen to events", async () => {
    const emitter = createEmitter<{ hello: string }>();
    let received: string | undefined;
    emitter.on("hello", (payload) => {
      received = payload;
    });
    await emitter.emit("hello", "world");
    expect(received).toBe("world");
  });

  it("emitter supports once", async () => {
    const emitter = createEmitter<{ ping: void }>();
    let count = 0;
    emitter.once("ping", () => {
      count++;
    });
    await emitter.emit("ping");
    await emitter.emit("ping");
    expect(count).toBe(1);
  });

  it("emitter supports clear and clearAll", async () => {
    const emitter = createEmitter<{ a: void; b: void }>();
    let a = 0;
    let b = 0;
    emitter.on("a", () => a++);
    emitter.on("b", () => b++);
    emitter.clear("a");
    await emitter.emit("a");
    await emitter.emit("b");
    expect(a).toBe(0);
    expect(b).toBe(1);
    emitter.clearAll();
    await emitter.emit("b");
    expect(b).toBe(1);
  });
});