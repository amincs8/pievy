export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isZero(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value) && value === 0;
}