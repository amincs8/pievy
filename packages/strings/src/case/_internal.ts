import { splitWordsPrepare } from "../split-words";

/**
 * A string case-conversion method, invoked with a string as its receiver.
 */
type LetterCase = (this: string) => string;

/**
 * Prepares a string, applies the requested letter case, and joins its words
 * with the given separator.
 *
 * @param value - The string to convert.
 * @param separator - The string inserted between words.
 * @param letterCase - The case-conversion method applied to the prepared input.
 * @returns The converted string.
 * @internal
 */
export function _separatorCase(value: string, separator: string, letterCase: LetterCase): string {
  return letterCase.call(splitWordsPrepare(value)).replace(/\p{Z}+/gu, separator);
}

/**
 * Prepares a string and joins its words while applying custom casing to word
 * initials and the first character.
 *
 * @param value - The string to convert.
 * @param letterCase - The case-conversion method applied to the prepared input.
 * @param matchReplacer - Converts each subsequent word's initial character.
 * @param firstReplacer - Converts the first character of the result.
 * @param separator - The string inserted before subsequent word initials.
 * @returns The converted string.
 * @internal
 */
export function _joinedCaase(
  value: string,
  letterCase: LetterCase,
  matchReplacer: (m: string) => string,
  firstReplacer: (m: string) => string,
  separator: string = "",
): string {
  return letterCase
    .call(splitWordsPrepare(value))
    .replace(/\p{Z}+(\p{L})?/gu, (_, match: string) =>
      match ? `${separator}${matchReplacer(match)}` : "",
    )
    .replace(/^(.)/, firstReplacer);
}
