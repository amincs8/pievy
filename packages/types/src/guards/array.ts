export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isArrayEmpty(value: unknown): value is [] {
  return Array.isArray(value) && value.length === 0;
}
