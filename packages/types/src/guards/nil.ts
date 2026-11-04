import { isNull } from "./null";
import { isUndefined } from "./undefined";

export function isNil(value: unknown): value is null | undefined {
  return isNull(value) || isUndefined(value);
}
