/**
 * Reverses a string by Unicode grapheme clusters.
 *
 * @param value - The string to reverse.
 * @returns The reversed string.
 * @public
 */
export function reverse(value: string): string {
  return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value)]
    .reverse()
    .map(({ segment }) => segment)
    .join("");
}

