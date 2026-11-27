import { describe, expect, it } from "vitest";

import { serializeError } from "./serialize-error";

describe("@pievy/errors: utils/serializeError", () => {
  it("serializes basic Error", () => {
    const err = new Error("something went wrong");
    const serialized = serializeError(err);

    expect(serialized.name).toBe("Error");
    expect(serialized.message).toBe("something went wrong");
    expect(serialized.stack).toBeDefined();
  });

  it("serializes TypeError", () => {
    const err = new TypeError("type mismatch");
    const serialized = serializeError(err);

    expect(serialized.name).toBe("TypeError");
    expect(serialized.message).toBe("type mismatch");
  });

  it("includes code if present", () => {
    const err = new Error("fail");
    (err as any).code = "ERR_CODE";
    const serialized = serializeError(err);

    expect(serialized.code).toBe("ERR_CODE");
  });

  it("includes cause as plain value", () => {
    const err = new Error("fail", { cause: "root cause" });
    const serialized = serializeError(err);

    expect(serialized.cause).toBe("root cause");
  });

  it("recursively serializes Error cause", () => {
    const cause = new Error("original");
    const err = new Error("wrapped", { cause });
    const serialized = serializeError(err);

    expect(serialized.cause).toEqual({
      message: "original",
      name: "Error",
      stack: cause.stack,
    });
  });

  it("handles circular cause reference", () => {
    const err = new Error("circular");
    (err as any).cause = err;
    const serialized = serializeError(err);

    expect(serialized.cause).toEqual({
      message: "circular",
      name: "Error",
    });
  });

  it("handles nested circular reference", () => {
    const err1 = new Error("first");
    const err2 = new Error("second", { cause: err1 });
    (err1 as any).cause = err2;

    const serialized = serializeError(err1);

    expect(serialized.cause).toEqual({
      cause: {
        message: "first",
        name: "Error",
      },
      message: "second",
      name: "Error",
      stack: err2.stack,
    });
  });

  it("omits stack if not present", () => {
    const err = new Error("no stack");
    delete (err as any).stack;
    const serialized = serializeError(err);

    expect(serialized.stack).toBeUndefined();
  });
});
