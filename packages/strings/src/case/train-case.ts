import { splitWordsPrepare } from "../split-words";

/**
 * Converts a string to train case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The resulting words are Pascal case and joined with dash.
 *
 * @param value - The string to convert.
 * @returns The train-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * trainCase("Hello, world!"); // "Hello-World"
 * trainCase("XMLHttpRequest"); // "Xml-Http-Request"
 * ```
 * @public
 */
export function trainCase(value: string): string {
  return splitWordsPrepare(value)
    .toLowerCase()
    .replace(/\p{Z}+(\p{L})?/gu, (_, match: string) => (match ? `-${match.toUpperCase()}` : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}
