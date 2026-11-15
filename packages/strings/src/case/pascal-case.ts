import { _joinedCaase } from "./_internal";

/**
 * Converts a string to Pascal case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The first letter of each word is capitalized.
 *
 * @param value - The string to convert.
 * @returns The Pascal-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * pascalCase("hello, world!"); // "HelloWorld"
 * pascalCase("XMLHttpRequest"); // "XmlHttpRequest"
 * ```
 * @public
 */
export function pascalCase(value: string): string {
  return _joinedCaase(
    value,
    String.prototype.toLowerCase,
    (str) => str.toUpperCase(),
    (str) => str.toUpperCase(),
  );
}
