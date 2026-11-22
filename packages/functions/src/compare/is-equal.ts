import { every, hasOwn } from "@pievy/collections";
import { isNil, isObject, type PlainObject } from "@pievy/types";

import { _isEqualBuffer, _isEqualDate, _isEqualRegExp, _isEqualTypedArray } from "./_internal";

function _isEqualMap(left: Map<unknown, unknown>, right: Map<unknown, unknown>): boolean {
  if (left.size !== right.size) {
    return false;
  }

  const unmatched = [...right.entries()];

  for (const [key, value] of left) {
    const index = unmatched.findIndex(
      // oxlint-disable-next-line no-use-before-define
      ([key2, value2]) => isEqual(key, key2) && isEqual(value, value2),
    );

    if (index === -1) {
      return false;
    }

    unmatched.splice(index, 1);
  }

  return true;
}

function _isEqualSet(left: Set<unknown>, right: Set<unknown>): boolean {
  if (left.size !== right.size) {
    return false;
  }
  for (const item of left) {
    if (!right.has(item)) {
      let found = false;
      for (const item2 of right) {
        // oxlint-disable-next-line no-use-before-define
        if (isEqual(item, item2)) {
          found = true;
          break;
        }
      }
      if (!found) {
        return false;
      }
    }
  }
  return true;
}

function _isEqualArray(left: unknown[], right: unknown[]): boolean {
  if (left.length !== right.length) {
    return false;
  }
  // oxlint-disable-next-line no-use-before-define
  return every(left, (item, index) => isEqual(item, right[index]));
}

function _isEqualPlainObject(left: PlainObject, right: PlainObject): boolean {
  const keysLeft = Object.keys(left);
  const keysRight = Object.keys(right);

  if (keysLeft.length !== keysRight.length) {
    return false;
  }

  return every(
    keysLeft,
    (key) =>
      // oxlint-disable-next-line no-use-before-define
      hasOwn(right, key) && isEqual(left[key], right[key]),
  );
}

function _isEqualDataView(left: DataView, right: DataView): boolean {
  if (left.byteLength !== right.byteLength) {
    return false;
  }

  const bytesLeft = new Uint8Array(left.buffer, left.byteOffset, left.byteLength);
  const bytesRight = new Uint8Array(right.buffer, right.byteOffset, right.byteLength);

  return every(bytesLeft, (byte, index) => byte === bytesRight[index]);
}

// Compares Map
const _COMPARES_MAP = new WeakMap();
_COMPARES_MAP.set(Date.prototype, _isEqualDate);
_COMPARES_MAP.set(RegExp.prototype, _isEqualRegExp);
_COMPARES_MAP.set(Map.prototype, _isEqualMap);
_COMPARES_MAP.set(Set.prototype, _isEqualSet);
_COMPARES_MAP.set(Array.prototype, _isEqualArray);
_COMPARES_MAP.set(Object.prototype, _isEqualPlainObject);
_COMPARES_MAP.set(Int8Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Uint8Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Uint8ClampedArray.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Int16Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Uint16Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Int32Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Uint32Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Float32Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(Float64Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(BigInt64Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(BigUint64Array.prototype, _isEqualTypedArray);
_COMPARES_MAP.set(ArrayBuffer.prototype, _isEqualBuffer);
_COMPARES_MAP.set(SharedArrayBuffer.prototype, _isEqualBuffer);
_COMPARES_MAP.set(DataView.prototype, _isEqualDataView);

/**
 * Checks whether two values are deeply equal.
 *
 * Handles primitives, arrays, plain objects, Date, RegExp, Map, Set,
 * ArrayBuffer, SharedArrayBuffer, DataView, and TypedArrays.
 *
 * @param left - The first value to compare.
 * @param right - The second value to compare.
 * @returns `true` when both values are deeply equal.
 * @public
 */
export function isEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (isNil(left) || isNil(right) || !(isObject(left) && isObject(right))) {
    return false;
  }

  const protoOfLeft = Object.getPrototypeOf(left);
  const protoOfRight = Object.getPrototypeOf(right);

  if (protoOfLeft !== protoOfRight) {
    return false;
  }

  return _COMPARES_MAP.has(protoOfLeft) ? _COMPARES_MAP.get(protoOfLeft)(left, right) : false;
}
