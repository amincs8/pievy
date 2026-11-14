import { splitWordsPrepare } from "../split-words";

/**
 * Converts a string to camel case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The first word is lowercased, and the first letter of each
 * subsequent word is capitalized.
 *
 * @param value - The string to convert.
 * @returns The camel-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * camelCase("Hello, world!"); // "helloWorld"
 * camelCase("XMLHttpRequest"); // "xmlHttpRequest"
 * ```
 * @public
 */
export function camelCase(value: string): string {
  return splitWordsPrepare(value)
    .toLowerCase()
    .replace(/\p{Z}+(\p{L})?/gu, (_, match: string) => (match ? match.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toLowerCase());
}
