import { _separatorCase } from "./_internal";

/**
 * Converts a string to CONSTANT case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The resulting words are UPPERCAEDS and joined with underscores.
 *
 * @param value - The string to convert.
 * @returns The constant-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * constantCase("Hello, world!"); // "HELLO_WORLD"
 * constantCase("XMLHttpRequest"); // "XML_HTTP_REQUEST"
 * ```
 * @public
 */
export function constantCase(value: string): string {
  return _separatorCase(value, "_", String.prototype.toUpperCase);
}
