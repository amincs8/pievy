import { splitWordsPrepare } from "../split-words";

/**
 * Swaps the case of each letter in a string.
 *
 * Word boundaries are normalized before toggling casing, so separators and
 * capitalized word transitions are treated as spaces during conversion.
 *
 * @param value - The string to convert.
 * @returns The string with each letter's case flipped, or an empty string when
 *   `value` is not a string or contains no letters.
 *
 * @example
 * ```ts
 * swapCase("Hello, world!"); // "hELLO WORLD"
 * swapCase("XMLHttpRequest"); // "xml hTTP rEQUEST"
 * ```
 * @public
 */
export function swapCase(value: string): string {
  return splitWordsPrepare(value).replace(/\p{L}/gu, (char) =>
    char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase(),
  );
}
