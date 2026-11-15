import { isPlainObject, isString } from "@pievy/types";

const GRANULARITY = {
  grapheme: {
    ignore: "",
  },
  sentence: {
    ignore: " ",
  },
  word: {
    ignore: " ",
  },
};

/**
 * Truncates a string to a maximum number of segments.
 *
 * Uses `Intl.Segmenter` with `granularity` (`"grapheme"` by default). When
 * truncation occurs, `omission` is appended and its segment length is counted
 * in `length`. If `length` is <= omission segments, a slice of `omission` is
 * returned.
 *
 * @param value - String to truncate.
 * @param length - Max result length in segments.
 * @param options - Omission string, or `{ granularity?, omission? }`.
 * @returns Original string when not truncated, otherwise a truncated string.
 * @throws {TypeError} If `value` is not a string.
 * @throws {RangeError} If `length` is not a non-negative integer.
 * @public
 */
export function truncate(value: string, length: number): string;
export function truncate(value: string, length: number, omission: string): string;
export function truncate(
  value: string,
  length: number,
  options: {
    granularity?: keyof typeof GRANULARITY;
    omission?: string;
  },
): string;

export function truncate(value: string, length: number, options?: unknown): string {
  if (!isString(value)) {
    throw new TypeError("'value' must be a string");
  }

  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError("'length' must be a non-negative integer");
  }

  let granularity: keyof typeof GRANULARITY = "grapheme";
  let omission = "...";

  if (isString(options)) {
    omission = options;
  } else if (isPlainObject(options)) {
    const opts = options as { granularity?: keyof typeof GRANULARITY; omission?: string };
    granularity = opts.granularity ?? "grapheme";
    omission = opts.omission ?? "...";
  }

  const segmenter = new Intl.Segmenter(undefined, { granularity: granularity });
  const omissionSegments = [...segmenter.segment(omission)];

  if (length <= omissionSegments.length) {
    let count = length;
    let resultEq = "";

    for (const s of segmenter.segment(omission)) {
      if (count-- <= 0) break;
      resultEq += s.segment;
    }

    return resultEq;
  }

  let resultNeq = "";
  let remaining = length - omissionSegments.length;
  let truncated = false;

  for (const s of segmenter.segment(value)) {
    if (GRANULARITY[granularity].ignore !== s.segment && remaining-- <= 0) {
      truncated = true;
      break;
    }

    resultNeq += s.segment;
  }

  if (truncated) {
    return resultNeq + omission;
  }

  return resultNeq;
}
