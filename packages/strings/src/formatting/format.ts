import { hasOwn } from "@pievy/collections";
import { isArray, isPlainObject, isString } from "@pievy/types";

/**
 * Formats a template string by replacing placeholders with provided values.
 *
 * Positional placeholders use `{n}` for a zero-based index or `{}` to consume
 * values sequentially. Named placeholders use `{name}` and are replaced from the
 * own properties of a provided object.
 *
 * @param template - The template string containing placeholders.
 * @param values - Replacement values. Pass a single array, or multiple rest
 *   arguments, to fill positional placeholders. Pass a single object to fill
 *   named placeholders from its own properties.
 * @returns The formatted string. Placeholders without a matching value are left
 *   unchanged.
 * @throws {TypeError} If `template` is not a string.
 *
 * @example
 * ```ts
 * format("Hello, {0}!", ["Ada"]); // "Hello, Ada!"
 * format("{1} + {0} = {2}", [1, 2, 3]); // "2 + 1 = 3"
 * format("Hello, {} and {}!", "Ada", "Bob"); // "Hello, Ada and Bob!"
 * format("Hello, {name}!", { name: "Ada" }); // "Hello, Ada!"
 * ```
 * @public
 */
export function format(template: string, ...values: unknown[]): string;
export function format(template: string, values: unknown[]): string;
export function format(template: string, values: Record<string, unknown>): string;

export function format(template: string, ...values: unknown[]): string {
  if (!isString(template)) {
    throw new TypeError("'template' must be a string");
  }

  const replacers =
    values.length === 1 && (isArray(values[0]) || isPlainObject(values[0])) ? values[0] : values;

  if (isArray(replacers)) {
    let nextIndex = 0;

    return template.replace(/\{(\d*)\}/g, (placeholder, index: string) => {
      const valueIndex = index === "" ? nextIndex++ : Number(index);

      return valueIndex < replacers.length ? String(replacers[valueIndex]) : placeholder;
    });
  }

  if (isPlainObject(replacers)) {
    return template.replace(/\{([\p{L}_$][\p{L}\p{N}_$]*)\}/gu, (placeholder, key: string) =>
      hasOwn(replacers, key) ? String(replacers[key]) : placeholder,
    );
  }

  return template;
}
