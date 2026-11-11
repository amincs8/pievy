import {
  isAsyncIterable,
  isBoolean,
  isFunction,
  isIterable,
  isPlainObject,
  isUndefined,
  type PlainObject,
  type XOR,
} from "@pievy/types";

import { STOP } from "../consts";
import { forEach } from "./for-each";
import { forEachAsync } from "./for-each-async";

interface PredicateArgsBase {
  values: unknown;
  predicateFn: Function;
  strict: boolean;
}

interface PredicateArgsStopValue extends PredicateArgsBase {
  retuenValueInit: boolean;
  stopValue: unknown;
}

interface PredicateArgsStop extends PredicateArgsBase {
  stop: {
    value: unknown;
    minMatches: number;
  };
}

interface PredicateReturnInvalidInput {
  isInputValid: false;
}
interface PredicateReturnStopValue {
  returnValue: boolean;
  isInputValid: true;
}

interface PredicateReturnStop {
  matchedCount: number;
  returnValue: boolean;
  isInputValid: true;
}

interface PredicateOnStopReturn {
  matchedCount: number | undefined;
  returnValue: boolean;
  compareStopValue: unknown;
  compareFn: ((a: unknown, b: unknown) => boolean) | undefined;
  onStopFn: (() => void | typeof STOP) | undefined;
  generateResult: () => XOR<PredicateReturnStopValue, PredicateReturnStop>;
}

function _isType(values: unknown, fns: Function[]) {
  for (const fn of fns) {
    if (fn(values)) return true;
  }

  return false;
}

function _createOnStop(
  args: XOR<PredicateArgsStopValue, PredicateArgsStop>,
  valuesCheckers: Function[],
): XOR<PredicateOnStopReturn, PredicateReturnInvalidInput> {
  const result: PredicateOnStopReturn = {
    compareFn: undefined,
    compareStopValue: undefined,
    generateResult: function () {
      return (
        isUndefined(this.matchedCount)
          ? { isInputValid: true, returnValue: this.returnValue }
          : {
              isInputValid: true,
              matchedCount: this.matchedCount,
              returnValue: this.returnValue,
            }
      ) as typeof args extends PredicateArgsStopValue
        ? PredicateReturnStopValue
        : PredicateReturnStop;
    },
    matchedCount: undefined,
    onStopFn: undefined,
    returnValue: false,
  };
  const { values, predicateFn } = args;

  if (!isFunction(predicateFn) || !_isType(values, valuesCheckers)) {
    return { isInputValid: false };
  }

  const { retuenValueInit = false, stopValue, stop, strict } = args;

  result.returnValue = false;
  result.matchedCount = undefined;

  if (!isUndefined(stopValue)) {
    result.returnValue = retuenValueInit;
    result.compareStopValue = stopValue;

    result.onStopFn = () => {
      result.returnValue = false;
      return STOP;
    };
  } else if (!isUndefined(stop)) {
    const { minMatches } = stop;

    if (!((Number.isInteger(minMatches) || minMatches === Infinity) && minMatches >= 0)) {
      return { isInputValid: false };
    }

    result.matchedCount = 0;
    result.compareStopValue = stop.value;

    if (minMatches > 0) {
      result.onStopFn = () => {
        result.matchedCount!++;

        if (result.matchedCount! >= minMatches) {
          result.returnValue = true;
          return STOP;
        }
      };
    } else {
      result.returnValue = true;
    }
  }

  result.compareFn = strict === true ? (a, b) => a === b : (a, b) => a == b;

  return result;
}

/**
 * Evaluates a predicate over an iterable or plain object until its configured
 * stop condition is met.
 *
 * The callback receives each value, its index or object key, and a zero-based
 * iteration count. Callback results are compared with the configured stop value
 * using strict equality when `strict` is `true`, and loose equality otherwise.
 * Iteration stops at the first matching result in stop-value mode, or when the
 * configured match-count stop condition is reached in match-count mode.
 *
 * @param args - Collection, callback, comparison mode, and either a stop value
 *   with its initial return value or a stop value with a match-count range.
 * @returns An invalid-input result when the collection, callback, or
 *   match-count range is invalid. Otherwise, returns the accumulated boolean;
 *   match-count mode also returns the number of matching callback results.
 */
export function _predicate(
  args: XOR<PredicateArgsStopValue, PredicateArgsStop>,
): XOR<
  PredicateReturnInvalidInput,
  typeof args extends PredicateArgsStopValue ? PredicateReturnStopValue : PredicateReturnStop
> {
  const onStop = _createOnStop(args, [isIterable, isPlainObject]);

  if (isBoolean(onStop.isInputValid)) {
    return { isInputValid: false };
  }

  if (isFunction(onStop.onStopFn)) {
    const { values, predicateFn } = args;
    forEach(values as XOR<Iterable<unknown>, PlainObject>, (value, index, loopCount) => {
      if (onStop.compareFn!(predicateFn(value, index, loopCount), onStop.compareStopValue)) {
        return onStop.onStopFn!();
      }
    });
  }

  return onStop.generateResult!();
}

/**
 * Asynchronously evaluates a predicate over an async iterable, iterable, or
 * plain object until its configured stop condition is met.
 *
 * The callback receives each value, its index or object key, and a zero-based
 * iteration count. Callbacks are awaited sequentially, and each result is
 * compared with the configured stop value using strict equality when `strict`
 * is `true`, and loose equality otherwise. Iteration stops at the first
 * matching result in stop-value mode, or when the requested match count is
 * configured match-count stop condition is reached in match-count mode.
 *
 * @param args - Collection, callback, comparison mode, and either a stop value
 *   with its initial return value or a stop value with a match-count range.
 * @returns A promise resolving to an invalid-input result when the collection,
 *   callback, or match-count range is invalid. Otherwise, it resolves to the
 *   accumulated boolean; match-count mode also returns the number of matching
 *   callback results.
 */
export async function _predicateAsync(
  args: XOR<PredicateArgsStopValue, PredicateArgsStop>,
): Promise<
  XOR<
    PredicateReturnInvalidInput,
    typeof args extends PredicateArgsStopValue ? PredicateReturnStopValue : PredicateReturnStop
  >
> {
  const onStop = _createOnStop(args, [isIterable, isPlainObject, isAsyncIterable]);

  if (isBoolean(onStop.isInputValid)) {
    return { isInputValid: false };
  }

  if (isFunction(onStop.onStopFn)) {
    const { values, predicateFn } = args;

    await forEachAsync(
      values as XOR<Iterable<unknown>, PlainObject>,
      async (value, index, loopCount) => {
        if (
          onStop.compareFn!(await predicateFn(value, index, loopCount), onStop.compareStopValue)
        ) {
          return onStop.onStopFn!();
        }
      },
    );
  }

  return onStop.generateResult!();
}
