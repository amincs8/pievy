export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isZero(value: unknown): value is 0 {
  return isNumber(value) && Number.isFinite(value) && value === 0;
}

export function isPositive(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value) && value > 0;
}

export function isNegative(value: unknown): value is number {
  return isNumber(value) && Number.isFinite(value) && value < 0;
}