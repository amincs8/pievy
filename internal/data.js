import { parseFile } from "./parse.js";

const _info = {
  packageJson: {
    filename: "package.json",
    parseOp: (filePath) => parseFile(filePath, { type: "json" }),
  },
  workspace: {
    filename: "pnpm-workspace.yaml",
    parseOp: (filePath) => parseFile(filePath, { type: "yaml" }),
  },
};
const _data = {};

let _rootPath = null;

/**
 * Sets the repository root used to resolve workspace metadata files.
 * @param {string} rootPath - Absolute or relative path to the repository root.
 * @throws {Error} If `rootPath` is not a string.
 */
export function setRootPath(rootPath) {
  if (typeof rootPath !== "string") {
    throw new Error("rootPath must be a string");
  }
  _rootPath = rootPath;
}

/**
 * Returns the repository root configured with {@link setRootPath}.
 * @returns {string} The configured repository root.
 * @throws {Error} If the root path has not been set.
 */
export function getRootPath() {
  if (_rootPath === null) {
    throw new Error("Root path has not been set. Please set it first.");
  }
  return _rootPath;
}

/**
 * Loads and caches the root `package.json` and `pnpm-workspace.yaml` data.
 * Parsed values are shallow-frozen before being stored.
 * @throws {Error} If the root path is unset or either file cannot be read or parsed.
 */
export function loadData() {
  const rootPath = getRootPath();

  for (const key in _info) {
    const { filename, parseOp } = _info[key];
    const filePath = `${rootPath}/${filename}`;
    _data[key] = Object.freeze(parseOp(filePath));
  }
}

/**
 * Returns a previously loaded metadata value by key (`packageJson` or `workspace`).
 * @param {string} key - Metadata key to retrieve.
 * @returns {object} The parsed metadata value.
 * @throws {Error} If `key` is not a string or its data has not been loaded.
 */
export function getData(key) {
  if (typeof key !== "string") {
    throw new Error("key must be a string");
  }

  if (!_data.hasOwnProperty(key)) {
    throw new Error(`Data for key "${key}" not found. Please load it first.`);
  }

  return _data[key];
}
