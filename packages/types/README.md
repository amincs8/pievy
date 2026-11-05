# @pievy/types

Lightweight runtime type guards and TypeScript utility types for JavaScript.

## Why use it?

@pievy/types is a compact, dependency-free toolkit for validating runtime values and refining TypeScript types with confidence.

It is useful when you want to:

- narrow `unknown` values safely
- validate user input and API payloads
- work with optional and nullable values cleanly
- keep utility code small and composable

## What is included?

This package includes two main groups of utilities:

1. Runtime type guards
2. Reusable TypeScript helper types

## Installation

```bash
pnpm add @pievy/types
```

## Quick start

```ts
import {
  isArray,
  isNumber,
  isObject,
  isString,
  isUndefined,
  type Nullable,
  type Maybe,
  type Predicate,
} from "@pievy/types";

function formatValue(value: unknown): string {
  if (isUndefined(value)) {
    return "missing";
  }

  if (isString(value)) {
    return value.toUpperCase();
  }

  if (isNumber(value)) {
    return value.toFixed(2);
  }

  if (isArray(value)) {
    return String(value.length);
  }

  if (isObject(value)) {
    return "object";
  }

  return "other";
}

const maybeName: Maybe<string> = "pievy";
const nullableCount: Nullable<number> = null;
const isEven: Predicate<number> = (value) => value % 2 === 0;
```

## Runtime guards

### Null and undefined

```ts
import { isNull, isNil, isUndefined } from "@pievy/types";

isNull(null); // true
isUndefined(undefined); // true
isNil("value"); // false
```

### Strings and numbers

```ts
import { isString, isNumber, isZero, isPositive } from "@pievy/types";

isString("hello"); // true
isNumber(42); // true
isZero(0); // true
isPositive(3); // true
```

### Arrays, objects, and collections

```ts
import { isArray, isArrayEmpty, isPlainObject, isIterable, isIterator } from "@pievy/types";

isArray([]); // true
isArrayEmpty([]); // true
isPlainObject({ hello: "world" }); // true
isIterable([1, 2, 3]); // true
isIterator([1, 2, 3][Symbol.iterator]()); // true
```

### Functions and async helpers

```ts
import { isFunction, isFunctionAsync } from "@pievy/types";

isFunction(() => "ok"); // true
isFunctionAsync(async () => "done"); // true
```

## Type helper overview

The package also exports useful helper types for common TypeScript patterns:

- `Primitive`
- `Nullable`
- `Maybe`
- `Nullish`
- `MaybePromise`
- `Numberish`
- `ValueOf`
- `ElementOf`
- `NonEmptyArray`
- `Dictionary`
- `AnyFunction`
- `Predicate`
- `Comparator`
- `Mapper`
- `Reducer`
- `Factory`
- `Constructor`
- `AbstractConstructor`
- `XOR`

## Guard overview

The runtime guards include:

- `isUndefined`
- `isNull`
- `isNil`
- `isString`
- `isEmptyString`
- `isNonEmptyString`
- `isNumber`
- `isZero`
- `isPositive`
- `isNegative`
- `isBigint`
- `isBoolean`
- `isTrue`
- `isFalse`
- `isSymbol`
- `isObject`
- `isPlainObject`
- `isArray`
- `isArrayEmpty`
- `isArrayNonEmpty`
- `isFunction`
- `isFunctionAsync`
- `isIterable`
- `isAsyncIterable`
- `isIterator`

## License

MIT
