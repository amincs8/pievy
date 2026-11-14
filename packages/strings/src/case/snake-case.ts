import { splitWordsPrepare } from "../split-words";

/**
 * Converts a string to snake case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The resulting words are lowercased and joined with underscores.
 *
 * @param value - The string to convert.
 * @returns The snake-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * snakeCase("Hello, world!"); // "hello_world"
 * snakeCase("XMLHttpRequest"); // "xml_http_request"
 * ```
 * @public
 */
export function snakeCase(value: string): string {
  return splitWordsPrepare(value)
    .toLowerCase()
    .replace(/\p{Z}+/gu, "_");
}
