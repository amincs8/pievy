export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isTrue(value: unknown): value is true {
  return isBoolean(value) && value;
}
