import { isNonEmptyString, isString } from "@pievy/types";

/**
 * Normalizes a string for word splitting.
 *
 * Inserts spaces at camel-case and acronym boundaries, replaces runs of
 * non-letter and non-number characters with spaces, and trims the result.
 *
 * @param value - The string to prepare.
 * @returns The normalized string, or an empty string when `value` is not a
 *   string.
 *
 * @example
 * ```ts
 * splitWordsPrepare("XMLHttpRequest"); // "XML Http Request"
 * splitWordsPrepare("hello-world"); // "hello world"
 * ```
 * @public
 */
export function splitWordsPrepare(value: string): string {
  return isString(value)
    ? value
        .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2")
        .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, "$1 $2")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim()
    : "";
}

/**
 * Splits a string into words using punctuation, whitespace, and case
 * boundaries.
 *
 * @param value - The string to split.
 * @returns The resulting words, or an empty array when `value` contains no
 *   words or is not a string.
 *
 * @example
 * ```ts
 * splitWords("XMLHttpRequest"); // ["XML", "Http", "Request"]
 * splitWords("hello-world"); // ["hello", "world"]
 * ```
 * @public
 */
export function splitWords(value: string): string[] {
  const preparedValue = splitWordsPrepare(value);
  return isNonEmptyString(preparedValue) ? preparedValue.split(/\s+/) : [];
}
