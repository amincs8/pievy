import { _joinedCaase } from "./_internal";

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
  return _joinedCaase(
    value,
    String.prototype.toLowerCase,
    (str) => str.toUpperCase(),
    (str) => str.toUpperCase(),
    "-",
  );
}
