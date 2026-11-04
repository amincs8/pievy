export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isTrue(value: unknown): value is true {
  return isBoolean(value) && value;
}

export function isFalse(value: unknown): value is false {
  return isBoolean(value) && !value;
}
