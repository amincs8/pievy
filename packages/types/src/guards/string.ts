export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isEmptyString(value: unknown): value is string {
  return isString(value) && value.length === 0;
}
