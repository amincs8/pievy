import { readFileSync } from "node:fs";

import { parse } from "yaml";

/**
 * Reads and parses a JSON or YAML file synchronously.
 *
 * Defaults to JSON parsing when `options.type` is omitted or unrecognized.
 *
 * @param {string} filePath - Path to the file to read.
 * @param {{ type?: "json"|"yaml" }} [options] - Parser selection.
 * @returns {*} The parsed file contents.
 * @throws {Error} If arguments are invalid, the file cannot be read, or parsing fails.
 */
export function parseFile(filePath, options = {}) {
  if (typeof filePath !== "string") {
    throw new Error("filePath must be a string");
  }

  if (typeof options !== "object" || options === null) {
    throw new Error("options must be an object");
  }

  try {
    const fileContent = readFileSync(filePath, "utf8");

    switch (options.type) {
      case "yaml":
        return parse(fileContent);
      case "json":
      default:
        return JSON.parse(fileContent);
    }
  } catch (error) {
    throw new Error(`Error reading or parsing file at ${filePath}: ${error.message}`);
  }
}
