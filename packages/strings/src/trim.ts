import { isNonEmptyString } from "@pievy/types";

import { escapeRegExp } from "./formatting";

const _DEFAULT_TRIM = "[\\p{Z}\\s]";

function _buildTrimPattern(chars?: string): string {
  if (chars === undefined) {
    return _DEFAULT_TRIM;
  }

  return chars.length === 0 ? "" : `[${escapeRegExp(chars)}]`;
}

/**
 * Removes leading and trailing whitespace or a provided set of characters from a
 * string.
 *
 * @param value - The input string to trim.
 * @param chars - Optional characters to trim instead of default whitespace.
 * @returns The trimmed string, or `""` when `value` is not a non-empty string.
 *
 * @example
 * ```ts
 * trim("  hello world  "); // "hello world"
 * trim("***hello***", "*"); // "hello"
 * ```
 * @public
 */
export function trim(value: string, chars?: string): string {
  if (!isNonEmptyString(value)) {
    return "";
  }

  const pattern = _buildTrimPattern(chars);

  if (pattern.length === 0) {
    return value;
  }

  const regex = new RegExp(`^${pattern}+|${pattern}+$`, "gu");
  return value.replace(regex, "");
}

/**
 * Removes leading whitespace or a provided set of characters from a string.
 *
 * @param value - The input string to trim.
 * @param chars - Optional characters to trim instead of default whitespace.
 * @returns The trimmed string, or `""` when `value` is not a non-empty string.
 *
 * @example
 * ```ts
 * trimStart("  hello"); // "hello"
 * trimStart("***hello", "*"); // "hello"
 * ```
 * @public
 */
export function trimStart(value: string, chars?: string): string {
  if (!isNonEmptyString(value)) {
    return "";
  }

  const pattern = _buildTrimPattern(chars);

  if (pattern.length === 0) {
    return value;
  }

  const regex = new RegExp(`^${pattern}+`, "gu");
  return value.replace(regex, "");
}

/**
 * Removes trailing whitespace or a provided set of characters from a string.
 *
 * @param value - The input string to trim.
 * @param chars - Optional characters to trim instead of default whitespace.
 * @returns The trimmed string, or `""` when `value` is not a non-empty string.
 *
 * @example
 * ```ts
 * trimEnd("hello  "); // "hello"
 * trimEnd("hello***", "*"); // "hello"
 * ```
 * @public
 */
export function trimEnd(value: string, chars?: string): string {
  if (!isNonEmptyString(value)) {
    return "";
  }

  const pattern = _buildTrimPattern(chars);

  if (pattern.length === 0) {
    return value;
  }

  const regex = new RegExp(`${pattern}+$`, "gu");
  return value.replace(regex, "");
}
