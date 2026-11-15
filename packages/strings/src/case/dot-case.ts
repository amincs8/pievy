import { _separatorCase } from "./_internal";

/**
 * Converts a string to dot case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The resulting words are lowercased and joined with dot.
 *
 * @param value - The string to convert.
 * @returns The dot-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * dotCase("Hello, world!"); // "hello-world"
 * dotCase("XMLHttpRequest"); // "xml-http-request"
 * ```
 * @public
 */
export function dotCase(value: string): string {
  return _separatorCase(value, ".", String.prototype.toLowerCase);
}
