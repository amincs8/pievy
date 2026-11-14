import { splitWordsPrepare } from "../split-words";

/**
 * Converts a string to kebab case.
 *
 * Word boundaries are inferred from case changes and non-letter/non-number
 * characters. The resulting words are lowercased and joined with dash.
 *
 * @param value - The string to convert.
 * @returns The kebab-cased string, or an empty string when `value` is not a
 *   string or contains no words.
 *
 * @example
 * ```ts
 * kebabCase("Hello, world!"); // "hello-world"
 * kebabCase("XMLHttpRequest"); // "xml-http-request"
 * ```
 * @public
 */
export function kebabCase(value: string): string {
  return splitWordsPrepare(value)
    .toLowerCase()
    .replace(/\p{Z}+/gu, "-");
}
