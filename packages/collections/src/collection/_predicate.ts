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
import {
  _compareFn,
  _isTypeOf,
  type PredicateArgsBase,
  type PredicateReturnInvalidInput,
} from "./_internal";
import { forEach } from "./for-each";
import { forEachAsync } from "./for-each-async";

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

interface PredicateReturnStopValue {
  returnValue: boolean;
  isInputValid: true;
}

interface PredicateReturnStop {
  matchedCount: number;
  returnValue: boolean;
  isInputValid: true;
}

interface StateReturn {
  matchedCount: number | undefined;
  returnValue: boolean;
  compareStopValue: unknown;
  compareFn: ReturnType<typeof _compareFn> | undefined;
  getStopSignal: (() => void | typeof STOP) | undefined;
  result: () => XOR<PredicateReturnStopValue, PredicateReturnStop>;
}

function _createState(
  args: XOR<PredicateArgsStopValue, PredicateArgsStop>,
  valuesCheckers: Function[],
): XOR<StateReturn, PredicateReturnInvalidInput> {
  const result: StateReturn = {
    compareFn: undefined,
    compareStopValue: undefined,
    getStopSignal: undefined,
    matchedCount: undefined,
    result: function () {
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
    returnValue: false,
  };
  const { values, predicateFn } = args;

  if (!isFunction(predicateFn) || !_isTypeOf(values, valuesCheckers)) {
    return { isInputValid: false };
  }

  const { retuenValueInit = false, stopValue, stop, strict } = args;

  result.returnValue = false;
  result.matchedCount = undefined;

  if (!isUndefined(stopValue)) {
    result.returnValue = retuenValueInit;
    result.compareStopValue = stopValue;

    result.getStopSignal = () => {
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
      result.getStopSignal = () => {
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

  result.compareFn = _compareFn(strict);

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
  const state = _createState(args, [isIterable, isPlainObject]);

  if (isBoolean(state.isInputValid)) {
    return { isInputValid: false };
  }

  if (isFunction(state.getStopSignal)) {
    const { values, predicateFn } = args;
    forEach(values as XOR<Iterable<unknown>, PlainObject>, (value, index, loopCount) => {
      if (state.compareFn!(predicateFn(value, index, loopCount), state.compareStopValue)) {
        return state.getStopSignal!();
      }
    });
  }

  return state.result!();
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
  const state = _createState(args, [isIterable, isPlainObject, isAsyncIterable]);

  if (isBoolean(state.isInputValid)) {
    return { isInputValid: false };
  }

  if (isFunction(state.getStopSignal)) {
    const { values, predicateFn } = args;

    await forEachAsync(
      values as XOR<Iterable<unknown>, PlainObject>,
      async (value, index, loopCount) => {
        if (state.compareFn!(await predicateFn(value, index, loopCount), state.compareStopValue)) {
          return state.getStopSignal!();
        }
      },
    );
  }

  return state.result!();
}
