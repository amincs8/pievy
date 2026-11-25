import { describe, expect, it, vi } from "vitest";

import { match } from "./match";
import { resultError, resultOk } from "./result";

describe("@pievy/result: match", () => {
  it("should call the ok handler for Ok", () => {
    const onOk = vi.fn<(value: number) => number>((value: number) => value * 2);
    const onErr = vi.fn<() => number>(() => 0);

    expect(match(resultOk(10), { onError: onErr, onOk: onOk })).toBe(20);
    expect(onOk).toHaveBeenCalledWith(10);
    expect(onErr).not.toHaveBeenCalled();
  });

  it("should call the err handler for Err", () => {
    const onOk = vi.fn<() => number>(() => 0);
    const onErr = vi.fn<(e: Error) => number>((error: Error) => error.message.length);

    expect(match(resultError("failed"), { onError: onErr, onOk: onOk })).toBe(6);
    expect(onErr).toHaveBeenCalledWith(new Error("failed"));
    expect(onOk).not.toHaveBeenCalled();
  });

  it("should support different return types", () => {
    const result = match(resultOk(10), {
      onError: (error: Error) => error.message.length,
      onOk: (value) => value.toString(),
    });

    expect(result).toBe("10");
  });

  it("should propagate handler errors", () => {
    const error = new Error("handler failed");

    expect(() =>
      match(resultOk(1), {
        onError: () => 0,
        onOk: () => {
          throw error;
        },
      }),
    ).toThrow(error);
  });
});
