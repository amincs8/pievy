export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isArrayEmpty(value: unknown): value is [] {
  return Array.isArray(value) && value.length === 0;
}

export function isArrayNonEmpty<T = unknown>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}
