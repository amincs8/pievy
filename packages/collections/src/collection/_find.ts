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

interface FindArgs extends PredicateArgsBase {
  firstN?: number;
}

enum StopFnType {
  none,
  all,
  first,
}

interface FindReturn {
  returnValue: unknown[];
  isInputValid: boolean;
}

interface StateReturn {
  compareFn: ReturnType<typeof _compareFn> | undefined;
  returnValue: unknown[];
  getStopSignal: undefined | (() => undefined | typeof STOP);
}

function _createState(
  args: FindArgs,
  valuesCheckers: Function[],
): XOR<StateReturn, PredicateReturnInvalidInput> {
  const result: StateReturn = {
    compareFn: undefined,
    getStopSignal: undefined,
    returnValue: [],
  };
  const { values, predicateFn } = args;

  if (!isFunction(predicateFn) || !_isTypeOf(values, valuesCheckers)) {
    return { isInputValid: false };
  }

  const { firstN, strict } = args;
  let stopFnType: StopFnType = StopFnType.none;

  if (isUndefined(firstN)) {
    stopFnType = StopFnType.all;
  } else if (Number.isInteger(firstN) && firstN > 0) {
    stopFnType = StopFnType.first;
  } else {
    return { isInputValid: false };
  }

  result.compareFn = _compareFn(strict);

  switch (stopFnType) {
    case StopFnType.all:
      result.getStopSignal = () => undefined;
      break;
    case StopFnType.first:
      result.getStopSignal = () => {
        return result.returnValue.length === firstN ? STOP : undefined;
      };
      break;
  }

  return result;
}

/**
 * Collects values from an iterable or plain object when the predicate result
 * matches `true`.
 *
 * The predicate receives each value, its index or object key, and a
 * zero-based iteration count. Results are compared strictly by default; when
 * `strict` is `false`, they are compared to `true` using loose equality.
 * When `firstN` is provided, iteration stops after that many matching values.
 *
 * @param args - Collection, predicate, comparison mode, and optional match limit.
 * @returns The matching values when the arguments are valid, or an invalid-input
 *   result when the collection, predicate, or match limit is invalid.
 */
export function _find(args: FindArgs): XOR<PredicateReturnInvalidInput, FindReturn> {
  const state = _createState(args, [isIterable, isPlainObject]);
  const { values, predicateFn } = args;

  if (isBoolean(state.isInputValid)) {
    return { isInputValid: false };
  }

  if (isFunction(state.getStopSignal)) {
    forEach(values as XOR<Iterable<unknown>, PlainObject>, (value, index, loopCount) => {
      if (state.compareFn!(predicateFn(value, index, loopCount), true)) {
        state.returnValue!.push(value);
        return state.getStopSignal!();
      }
    });
  }

  return { isInputValid: true, returnValue: state.returnValue! };
}

/**
 * Asynchronously collects values from an async iterable, iterable, or plain
 * object when the predicate result matches `true`.
 *
 * The predicate is awaited sequentially and receives each value, its index or
 * object key, and a zero-based iteration count. Results are compared strictly
 * by default; when `strict` is `false`, they are compared to `true` using loose
 * equality. When `firstN` is provided, iteration stops after that many matching
 * values.
 *
 * @param args - Collection, predicate, comparison mode, and optional match limit.
 * @returns A promise resolving to the matching values when the arguments are
 *   valid, or an invalid-input result when the collection, predicate, or match
 *   limit is invalid.
 */
export async function _findAsync(
  args: FindArgs,
): Promise<XOR<PredicateReturnInvalidInput, FindReturn>> {
  const state = _createState(args, [isIterable, isPlainObject, isAsyncIterable]);

  if (isBoolean(state.isInputValid)) {
    return { isInputValid: false };
  }

  if (isFunction(state.getStopSignal)) {
    const { values, predicateFn } = args;

    await forEachAsync(
      values as XOR<Iterable<unknown>, PlainObject>,
      async (value, index, loopCount) => {
        if (state.compareFn!(await predicateFn(value, index, loopCount), true)) {
          state.returnValue!.push(value);
          return state.getStopSignal!();
        }
      },
    );
  }

  return { isInputValid: true, returnValue: state.returnValue! };
}
