import { _joinedCaase } from "./_internal";

/**
 * Converts a string to title case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The each word is capitalized.
 *
 * @param value - The string to convert.
 * @returns The title-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * titleCase("Hello, world!"); // "helloWorld"
 * titleCase("XMLHttpRequest"); // "xmlHttpRequest"
 * ```
 * @public
 */
export function titleCase(value: string): string {
  return _joinedCaase(
    value,
    String.prototype.toLowerCase,
    (str) => str.toUpperCase(),
    (str) => str.toUpperCase(),
    " ",
  );
}
