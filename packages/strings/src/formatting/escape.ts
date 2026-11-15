import { isString } from "@pievy/types";

/**
 * Escapes regex-special characters in a string so it can be used safely in a
 * regular expression pattern.
 *
 * @param value - The string to escape.
 * @returns A copy of `value` with regex metacharacters escaped.
 *
 * @example
 * ```ts
 * escapeRegExp("[test]?"); // "\\[test\\]\\?"
 * ```
 * @public
 */
export function escapeRegExp(value: string): string {
  return isString(value) ? value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";
}

type EscapeType = "name" | "number";

const _HTML_ESCAPE_MAP: Record<string, { name: string; number: string }> = {
  '"': { name: "&quot;", number: "&#34;" },
  "&": { name: "&amp;", number: "&#38;" },
  "'": { name: "&apos;", number: "&#39;" },
  "<": { name: "&lt;", number: "&#60;" },
  ">": { name: "&gt;", number: "&#62;" },
};

const _HTML_ESCAPE_REGEX = /&(?!(?:#\d+|#x[\da-f]+|\w+);)|[<>"']/gi;

/**
 * Escapes HTML-special characters in a string.
 *
 * @param value - The string to escape.
 * @param type - The escaping style to use: named entities (for example `&amp;`)
 *   or numeric character references (for example `&#38;`).
 * @returns A copy of `value` with HTML-sensitive characters replaced.
 *
 * @example
 * ```ts
 * escapeHTML("<div>&</div>"); // "&lt;div&gt;&amp;&lt;/div&gt;"
 * escapeHTML("<div>&</div>", "number"); // "&#60;div&#62;&#38;&#60;/div&#62;"
 * ```
 * @public
 */
export function escapeHTML(value: string, type: EscapeType = "name"): string {
  if (!isString(value)) {
    return "";
  }

  return value.replace(_HTML_ESCAPE_REGEX, (char) => {
    const entity = _HTML_ESCAPE_MAP[char];
    return entity ? entity[type] : char;
  });
}
