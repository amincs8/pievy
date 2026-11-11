export interface PredicateArgsBase {
  values: unknown;
  predicateFn: Function;
  strict: boolean;
}

export interface PredicateReturnInvalidInput {
  isInputValid: false;
}

export function _isTypeOf(values: unknown, fns: Function[]) {
  for (const fn of fns) {
    if (fn(values)) return true;
  }

  return false;
}

export function _compareFn(strict: boolean): (a: unknown, b: unknown) => boolean {
  return strict === true ? (a, b) => a === b : (a, b) => a == b;
}
