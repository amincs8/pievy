import { _separatorCase } from "./_internal";

/**
 * Converts a string to path case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The resulting words are lowercased and joined with slash.
 *
 * @param value - The string to convert.
 * @returns The path-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * pathCase("Hello, world!"); // "hello_world"
 * pathCase("XMLHttpRequest"); // "xml_http_request"
 * ```
 * @public
 */
export function pathCase(value: string): string {
  return _separatorCase(value, "/", String.prototype.toLowerCase);
}
