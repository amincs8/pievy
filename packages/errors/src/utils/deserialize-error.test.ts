import { describe, expect, it } from "vitest";

import { deserializeError } from "./deserialize-error";

describe("@pievy/errors: deserializeError", () => {
  it("deserializes basic Error", () => {
    const data = {
      message: "something went wrong",
      name: "Error",
      stack: "Error: something went wrong\n    at test",
    };
    const err = deserializeError(data);

    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("Error");
    expect(err.message).toBe("something went wrong");
    expect(err.stack).toBe(data.stack);
  });

  it("deserializes TypeError", () => {
    const data = { message: "type mismatch", name: "TypeError" };
    const err = deserializeError(data);

    expect(err.name).toBe("TypeError");
    expect(err.message).toBe("type mismatch");
  });

  it("includes code if present", () => {
    const data = { code: "ERR_CODE", message: "fail", name: "Error" };
    const err = deserializeError(data);

    expect((err as any).code).toBe("ERR_CODE");
  });

  it("deserializes plain cause value", () => {
    const data = { cause: "root cause", message: "fail", name: "Error" };
    const err = deserializeError(data);

    expect(err.cause).toBe("root cause");
  });

  it("recursively deserializes Error cause", () => {
    const data = {
      cause: {
        message: "original",
        name: "Error",
        stack: "Error: original\n    at test",
      },
      message: "wrapped",
      name: "Error",
    };
    const err = deserializeError(data);

    expect(err.cause).toBeInstanceOf(Error);
    expect((err.cause as Error).name).toBe("Error");
    expect((err.cause as Error).message).toBe("original");
    expect((err.cause as Error).stack).toBe(data.cause.stack);
  });

  it("handles nested cause chain", () => {
    const data = {
      cause: {
        cause: {
          message: "level 1",
          name: "Error",
        },
        message: "level 2",
        name: "Error",
      },
      message: "level 3",
      name: "Error",
    };
    const err = deserializeError(data);

    expect(err.cause).toBeInstanceOf(Error);
    expect((err.cause as Error).cause).toBeInstanceOf(Error);
    expect(((err.cause as Error).cause as Error).message).toBe("level 1");
  });

  it("handles missing stack gracefully", () => {
    const data = { message: "no stack", name: "Error" };
    const err = deserializeError(data);

    expect(err.stack?.startsWith("Error: no stack")).toBe(true);
  });
});
