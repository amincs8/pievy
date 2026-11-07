const DOT_PATH_REGEX = /^(?:\.[\p{L}\p{N}_$]+|\[\d+\])+$/u;

/**
 * Checks whether a path uses the supported dot/index notation.
 * @param {string} path - Path such as `.name` or `.dependencies[0]`.
 * @returns {boolean} Whether the whole path matches the supported syntax.
 */
export function isDotPath(path) {
  return DOT_PATH_REGEX.test(path);
}

/**
 * Converts a supported dot/index path into property keys.
 * @param {string} path - Path such as `.name` or `.dependencies[0]`.
 * @returns {string[]} Path segments, or an empty array when the path is invalid.
 */
export function pathToArray(path) {
  const result = [];

  if (isDotPath(path)) {
    const splited = path.replace(/\[0*(\d+)\]/g, ".$1").split(".");
    for (const value of splited) {
      if (value) {
        result.push(value);
      }
    }
  }

  return result;
}

/**
 * Reads a nested value using a dot/index path or an array of property keys.
 * @param {*} obj - Value to read from.
 * @param {string|string[]} path - Supported path string or explicit path segments.
 * @returns {*} The value at the path, or `undefined` if a segment is missing.
 */
export function getValue(obj, path) {
  let result = undefined;
  const arrPath = typeof path === "string" ? pathToArray(path) : Array.isArray(path) ? path : [];

  let currentObj = obj;

  for (const key of arrPath) {
    if (!(currentObj !== null && currentObj !== undefined) || !(key in Object(currentObj))) {
      result = undefined;
      break;
    }

    result = currentObj = currentObj[key];
  }

  return result;
}

/**
 * Filters records by one or more property comparisons.
 *
 * Supported operators are `=`, `!=`, `~`, `>`, `<`, `>=`, and `<=`.
 * Multiple filters are combined with AND. Escape an operator with a preceding
 * backslash to prevent it from being interpreted as the filter operator.
 *
 * @param {object[]} data - Records to filter.
 * @param {string|string[]} filters - Comparison expression(s), such as `.name~types`.
 * @returns {object[]} Records matching every filter.
 * @throws {Error} If `data` is not an array or a filter does not contain exactly one operator.
 *
 * @example
 * ```js
 * filterData([{ name: "@pievy/types" }], ".name~types");
 * ```
 */
export function filterData(data, filters) {
  const result = [];

  if (!(Array.isArray(data) || typeof data === "string")) {
    throw new Error("data must be a string or an array`");
  }

  if (!Array.isArray(data)) {
    throw new Error("data must be an array");
  }

  const arrayFilters = Array.isArray(filters) ? filters : filters.length > 0 ? [filters] : [];

  if (arrayFilters.length === 0) {
    result.push(...data);
  } else {
    const normilizedFilter = [];
    for (const filter of arrayFilters) {
      const opRegex = /(?<!\\)(?:>=|<=|!=|~|>|<|(?<![!<>])=)/;
      const matches = filter.match(new RegExp(opRegex, "g"));

      if (Array.isArray(matches) && matches.length === 1) {
        const [key, value] = filter.split(opRegex);
        const op = matches[0];

        normilizedFilter.push({
          key,
          op,
          value,
        });
      } else {
        throw new Error("filter must include only one operator");
      }
    }

    for (const item of data) {
      let check = false;
      for (const { value, key, op } of normilizedFilter) {
        const itemValue = getValue(item, key);

        switch (op) {
          case "=":
            check = itemValue === value;
            break;
          case ">=":
            check = itemValue >= value;
            break;
          case "<=":
            check = itemValue <= value;
            break;
          case ">":
            check = itemValue > value;
            break;
          case "<":
            check = itemValue < value;
            break;
          case "!=":
            check = itemValue != value;
            break;
          case "~":
            check = new RegExp(`${value}`).test(String(itemValue));
            break;
        }

        if (!check) break;
      }

      if (check) {
        result.push(item);
      }
    }
  }

  return result;
}

/**
 * Selects fields from each record and optionally renames output columns.
 *
 * Use `->` to provide an output name, for example `.name->Package`.
 * Missing or nullish values are represented by `-`.
 *
 * @param {object[]} data - Records to project.
 * @param {string|string[]} keys - Dot/index paths, optionally followed by `->alias`.
 * @returns {object[]} New records containing only the selected fields.
 * @throws {Error} If `data` or `keys` has an unsupported type.
 *
 * @example
 * ```js
 * filterKeys([{ name: "@pievy/types" }], ".name->Package");
 * ```
 */
export function filterKeys(data, keys) {
  const result = [];

  if (!Array.isArray(data)) {
    throw new Error("data must be an array");
  }

  if (!(Array.isArray(keys) || typeof keys === "string")) {
    throw new Error("keys must be a string or an array`");
  }

  const arrayKeys = Array.isArray(keys) ? keys : keys.length > 0 ? [keys] : [];

  for (const item of data) {
    if (typeof item !== "object" || item === null) {
      throw new Error("item of data must be an object");
    }
    const newItem = {};

    for (const key of arrayKeys) {
      const [path, name] = key.split(/(?<!\\)->/).filter((value) => value.length > 0);
      const newKey = name ? name : path.replace(/^\./, "").replace(/\\->/, "->");

      newItem[newKey] = getValue(item, path) ?? "-";
    }

    result.push(newItem);
  }

  return result;
}
