import { _joinedCaase } from "./_internal";

/**
 * Converts a string to sentence case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The first word is capitalized, and each
 * subsequent word is lowercase.
 *
 * @param value - The string to convert.
 * @returns The sentence-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * sentenceCase("Hello, world!"); // "helloWorld"
 * sentenceCase("XMLHttpRequest"); // "xmlHttpRequest"
 * ```
 * @public
 */
export function sentenceCase(value: string): string {
  return _joinedCaase(
    value,
    String.prototype.toLowerCase,
    (str) => str,
    (str) => str.toUpperCase(),
    " ",
  );
}
