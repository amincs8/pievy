import {
  isAsyncIterable,
  isFunction,
  isIterable,
  isPlainObject,
  isUndefined,
  type Nullish,
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
  retuenValueInit: boolean;
}

interface PredicateArgsStopValue extends PredicateArgsBase {
  stopValue: unknown;
}

interface PredicateArgsStop extends PredicateArgsBase {
  stop: {
    value: unknown;
    truthLoop: Nullish<number>;
  };
}

interface PredicateReturn {
  returnValue: boolean;
  isInputValid: boolean;
}

/**
 * Runs a predicate over each value in an iterable or plain object and tracks
 * whether iteration should halt early.
 *
 * The helper is shared by the collection predicates to centralize validation,
 * comparison logic, and early-stop handling while exposing a small result object
 * back to the public API.
 *
 * @param args - Collection input, predicate callback, and the stop condition to apply.
 * @returns The normalized validation state and the current accumulated boolean value.
 */
export function _predicate(
  args: XOR<PredicateArgsStopValue, PredicateArgsStop>,
): Partial<PredicateReturn> {
  const { values, predicateFn } = args;

  if (!isFunction(predicateFn) || !(isIterable(values) || isPlainObject(values))) {
    return { isInputValid: false };
  }

  const { retuenValueInit, stopValue, stop, strict } = args;
  let returnValue = retuenValueInit;
  let fn: (value: unknown, index: PropertyKey, loopCount: number) => void | typeof STOP;
  const compareFn: (a: unknown, b: unknown) => boolean =
    strict === true ? (a, b) => a === b : (a, b) => a == b;

  if (!isUndefined(stopValue)) {
    fn = (value, index, loopCount) => {
      if (compareFn(predicateFn(value, index, loopCount), stopValue)) {
        returnValue = false;
        return STOP;
      }
    };
  } else if (!isUndefined(stop)) {
    // TODO
  }

  // TODO: USE fn INSTEAD OF fn!
  if (isFunction(fn!)) {
    forEach(values as XOR<Iterable<unknown>, PlainObject>, fn!);
  }

  return { isInputValid: true, returnValue };
}

/**
 * Asynchronously evaluates a predicate over each value in an async iterable,
 * iterable, or plain object while supporting early termination.
 *
 * This internal helper mirrors the synchronous predicate pipeline but awaits the
 * callback result before comparing it against the configured stop value.
 *
 * @param args - Collection input, async predicate callback, and the stop condition to apply.
 * @returns A promise resolving to the validation state and current accumulated boolean value.
 */
export async function _predicateAsync(
  args: XOR<PredicateArgsStopValue, PredicateArgsStop>,
): Promise<Partial<PredicateReturn>> {
  const { values, predicateFn } = args;

  if (
    !isFunction(predicateFn) ||
    !(isAsyncIterable(values) || isIterable(values) || isPlainObject(values))
  ) {
    return { isInputValid: false };
  }

  const { retuenValueInit, stopValue, stop, strict } = args;
  let returnValue = retuenValueInit;
  let fn: (value: unknown, index: PropertyKey, loopCount: number) => Promise<void | typeof STOP>;
  const compareFn: (a: unknown, b: unknown) => boolean =
    strict === true ? (a, b) => a === b : (a, b) => a == b;

  if (!isUndefined(stopValue)) {
    fn = async (value, index, loopCount) => {
      if (compareFn(await predicateFn(value, index, loopCount), stopValue)) {
        returnValue = false;
        return STOP;
      }
    };
  } else if (!isUndefined(stop)) {
    // TODO
  }

  // TODO: USE fn INSTEAD OF fn!
  if (isFunction(fn!)) {
    await forEachAsync(values as XOR<Iterable<unknown>, PlainObject>, fn!);
  }

  return { isInputValid: true, returnValue };
}
