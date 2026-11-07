import { getBorderCharacters, table } from "table";

/**
 * Converts records into a header-first matrix suitable for the `table` package.
 * @param {object[]} data - Records with matching column keys.
 * @returns {Array<Array<*>>} Header row followed by numbered record rows.
 * @throws {Error} If `data` is not an array.
 */
export function toTableData(data) {
  const result = [];

  if (!Array.isArray(data)) {
    throw new Error("data must be a array");
  }

  let index = 1;
  result.push([]);
  for (const key in data[0]) {
    result[0].push(key);
  }
  for (const item of data) {
    result.push([index]);
    for (const key of result[0]) {
      result[index].push(item[key]);
    }

    index++;
  }

  result[0].unshift("#");

  return result;
}

/**
 * Prints records as a compact table, or a not-found message for an empty list.
 * @param {object[]} data - Records to display.
 * @throws {Error} If `data` is not an array.
 */
export function print(data) {
  if (!Array.isArray(data)) {
    throw new Error("data must be a array");
  }

  if (data.length === 0) {
    console.log("not found packages");
  } else {
    console.log(
      table(toTableData(data), {
        border: getBorderCharacters("void"),
        drawHorizontalLine: () => false,
      }),
    );
  }
}
